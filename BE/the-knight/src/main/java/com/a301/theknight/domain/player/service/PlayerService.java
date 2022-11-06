package com.a301.theknight.domain.player.service;

import com.a301.theknight.domain.game.entity.Game;
import com.a301.theknight.domain.game.entity.GameStatus;
import com.a301.theknight.domain.game.entity.redis.InGame;
import com.a301.theknight.domain.game.repository.GameRedisRepository;
import com.a301.theknight.domain.game.repository.GameRepository;
import com.a301.theknight.domain.member.entity.Member;
import com.a301.theknight.domain.member.repository.MemberRepository;
import com.a301.theknight.domain.player.dto.*;
import com.a301.theknight.domain.player.dto.request.PlayerReadyRequest;
import com.a301.theknight.domain.player.dto.request.PlayerTeamRequest;
import com.a301.theknight.domain.player.dto.response.PlayerEntryResponse;
import com.a301.theknight.domain.player.dto.response.PlayerExitResponse;
import com.a301.theknight.domain.player.dto.response.PlayerReadyResponse;
import com.a301.theknight.domain.player.dto.response.PlayerTeamResponse;
import com.a301.theknight.domain.player.entity.Player;
import com.a301.theknight.domain.player.entity.Team;
import com.a301.theknight.domain.player.repository.PlayerRepository;
import com.a301.theknight.global.error.errorcode.GameErrorCode;
import com.a301.theknight.global.error.errorcode.GameWaitingErrorCode;
import com.a301.theknight.global.error.errorcode.MemberErrorCode;
import com.a301.theknight.global.error.errorcode.PlayerErrorCode;
import com.a301.theknight.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.a301.theknight.global.error.errorcode.GameWaitingErrorCode.*;

@RequiredArgsConstructor
@Service
public class PlayerService {

    private final MemberRepository memberRepository;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final GameRedisRepository redisRepository;

    @Transactional
    public PlayerEntryResponse entry(long gameId, long memberId){
        Game entryGame = getGame(gameId);
        if(!isWaiting(entryGame)){
            throw new CustomException(GAME_IS_NOT_READY_STATUS);
        }
        if(!isEnterPossible(entryGame)){
            throw new CustomException(CAN_NOT_ACCOMMODATE);
        }

        Member entryMember = getMember(memberId);
        Member owner = entryGame.getOwner().getMember();

        if (!entryMember.getId().equals(owner.getId())) {
            playerRepository.save(Player.builder()
                    .member(entryMember)
                    .game(entryGame)
                    .build());
        }

        return PlayerEntryResponse.builder()
                .memberId(entryMember.getId())
                .nickname(entryMember.getNickname())
                .image(entryMember.getImage()).build();
    }

    @Transactional
    public PlayerExitResponse exit(long gameId, long memberId){
        Game findGame = getGame(gameId);

        if(!isWaiting(findGame)){
            throw new CustomException(GAME_IS_NOT_READY_STATUS);
        }
        Member findMember = getMember(memberId);
        Player exitPlayer = getPlayer(findGame, findMember);
        exitPlayer.exitGame();

        PlayerExitResponse exitPlayerId = new PlayerExitResponse(exitPlayer.getMember().getId());
        playerRepository.delete(exitPlayer);

        return exitPlayerId;
    }

    @Transactional
    public PlayerTeamResponse team(long gameId, long memberId, PlayerTeamRequest playerTeamMessage){
        Game findGame = getGame(gameId);
        Member findMember = getMember(memberId);

        Player findPlayer = getPlayer(findGame, findMember);
        findPlayer.selectTeam(playerTeamMessage.getTeam());

        return PlayerTeamResponse.builder()
                .memberId(findPlayer.getMember().getId())
                .team(findPlayer.getTeam().name())
                .build();
    }

    @Transactional
    public ReadyDto ready(long gameId, long memberId, PlayerReadyRequest playerReadyMessage){
        Game findGame = getGame(gameId);
        Member findMember = getMember(memberId);

        Player readyPlayer = getPlayer(findGame, findMember);
        readyPlayer.ready(playerReadyMessage.isReadyStatus());

        if(isOwner(findGame, readyPlayer)){
            if (!isEqualPlayerNum(findGame)) {
                throw new CustomException(NUMBER_OF_PLAYERS_ON_BOTH_TEAM_IS_DIFFERENT);
            }
            if (!isAllReady(findGame)) {
                throw new CustomException(NOT_All_USERS_ARE_READY);
            }
            findGame.changeStatus(GameStatus.PLAYING);
            redisRepository.saveInGame(findGame.getId(), makeInGame(findGame));
        }

        return ReadyDto.builder()
                .readyResponseDto(ReadyResponseDto.builder()
                        .memberId(readyPlayer.getMember().getId())
                        .readyStatus(readyPlayer.isReady()).build())
                .canStart(findGame.isCanStart()).build();
    }

    private Member getMember(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_IS_NOT_EXIST));
    }

    private Game getGame(long gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new CustomException(GameErrorCode.GAME_IS_NOT_EXIST));
    }

    private Player getPlayer(Game game, Member member){
        return playerRepository.findByGameAndMember(game, member)
                .orElseThrow(() -> new CustomException(PlayerErrorCode.PLAYER_IS_NOT_EXIST));
    }

    private boolean isWaiting(Game game){
        return game.getStatus() == GameStatus.WAITING;
    }
    private boolean isEnterPossible(Game game){
        return game.getCapacity() > game.getPlayers().size();
    }

    private boolean isOwner(Game game, Player player){
        return game.getOwner().getId().equals(player.getId());
    }

    private boolean isEqualPlayerNum(Game game){
        AtomicInteger teamA = new AtomicInteger();
        AtomicInteger teamB = new AtomicInteger();
        game.getPlayers().stream()
                .map(player -> Team.A.equals(player.getTeam()) ? teamA.getAndIncrement() : teamB.getAndIncrement())
                .collect(Collectors.toList());
        return teamA.intValue() == teamB.intValue();
    }

    private boolean isAllReady(Game game){
        boolean canStart = game.getPlayers().stream().filter(Player::isReady).count() == game.getCapacity();
        if(canStart) {
            game.completeReady();
        }
        return canStart;
    }

    private InGame makeInGame(Game game) {
        return redisRepository.saveInGame(game.getId(), InGame.builder()
                .gameStatus(GameStatus.PREPARE).build());
    }
}
