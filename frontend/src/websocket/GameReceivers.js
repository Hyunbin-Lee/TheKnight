import { useDispatch } from 'react-redux';
import { fetchPlayers } from '../_slice/gameSlice'

const dispatch = useDispatch();

////////////////////////////////////////////////
//////////////////// Common ////////////////////
////////////////////////////////////////////////

// 전체 플레이어 정보
const onSubPlayersInfo = (payload) => {
  // Redux에 플레이어 정보 저장
  // {
  //   state : String : 현재 게임진행 차례
  //   maxMember : int (2 vs 2 → 4),
  //   players : [
  //     {
  //       memberId : long,
  //       nickname : String,
  //       team: String,
  //       leftCount : int,
  //       rightCount : int,
  //       order : int, (none: 0)
  //       weapons : []
  //     },
  //     {
  //     }, 
  //     …
  //   ]
  // }
  const data = JSON.parse(payload.body)
  dispatch(fetchPlayers(data))
}

// 최초 화면전환 요청
const onSubConvert = () => {
  // 화면전환을 위한 구독 준비
  // 준비완료 publish
}

// 실제 화면전환
const onSubNextPhase = () => {
  // phase 변경
}

// 제한시간 
const onSubTimer = () => {
  // Redux에 제한시간 저장
  // 1초씩 차감
}

// 게임결과
const onSubEndA = () => {

}

// 게임결과
const onSubEndB = () => {

}

////////////////////////////////////////////////
/////////////////// PREPARE ////////////////////
////////////////////////////////////////////////

// 선공 팀
const onSubAttackFirst = () => {
  // Redux에 선공 팀 저장
}

// A팀 리더
const onSubLeaderA = () => {
  // Redux에 A팀 리더 저장
}

// B팀 리더
const onSubLeaderB = () => {
  // Redux에 B팀 리더 저장
}

// A팀 남은 무기 개수
const onSubCountWeaponA = () => {

}

// B팀 남은 무기 개수
const onSubCountWeaponB = () => {

}

// A팀 현재까지 선택된 순서
const onSubOrderA = () => {

}

// B팀 현재까지 선택된 순서
const onSubOrderB = () => {

}

// A팀 무기&순서 선택완료
const onSubSelectCompleteA = () => {

}

// B팀 무기&순서 선택완료
const onSubSelectCompleteB = () => {

}

////////////////////////////////////////////////
/////////////////// ATTACK /////////////////////
////////////////////////////////////////////////

// 현재 공격자
const onSubCurrentAttackerA = () => {
  // Redux에 공격자 저장
}

// 현재 공격자
const onSubCurrentAttackerB = () => {
  // Redux에 공격자 저장
}

////////////////////////////////////////////////
/////////////////// Defense ////////////////////
////////////////////////////////////////////////


////////////////////////////////////////////////
//////////////////// Doubt /////////////////////
////////////////////////////////////////////////

// 의심정보
const onSubDoubtInfo = () => {

}

// 공격정보
const onSubAttackInfo = () => {
  // 공격정보 저장해서 doubt에서 띄워주기
  // 현재 방어자 갱신
}

// 방어정보
const onSubDefenseInfo = () => {
  // 방어정보 갱신해서 doubt에 띄우기
}

////////////////////////////////////////////////
/////////////////// Execute ////////////////////
////////////////////////////////////////////////

// 애니메이션 수행 정보
const onSubExecute = () => {

}