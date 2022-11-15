import { useSelector } from "react-redux";
import PlayerWithWeaponList from "./PlayerWithWeaponList";
import Box from "@mui/material/Box";

export default function DoubtResultPhase() {
  const me = useSelector((state) => state.game.me);
  const doubtInfo = useSelector((state) => state.game.doubtInfo);

  function BoxRender() {
    return (
      <Box
        sx={{
          width: "70vmin",
          height: "40vmin",
          backgroundColor: "#d9d9d9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: "4vmin", fontSize: "3.5vmin" }}>
          {doubtInfo.doubtResponse.doubtResult ? "의심 성공" : "의심 실패"}
        </Box>
        <Box sx={{ fontSize: "2.5vmin", padding: "1vmin" }}>
          {doubtInfo.doubtResponse.suspect.nickname}님의 의심이
          {doubtInfo.doubtResponse.doubtResult ? "성공" : "실패"}했습니다
        </Box>
        <Box sx={{ fontSize: "2.5vmin", padding: "1vmin" }}>
          {doubtInfo.doubtResponse.doubtResult
            ? doubtInfo.doubtResponse.suspect.nickname
            : doubtInfo.doubtResponse.suspected.nickname}
          님이 사망했습니다
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <PlayerWithWeaponList isOpp={true}></PlayerWithWeaponList>
      <BoxRender></BoxRender>
      <PlayerWithWeaponList></PlayerWithWeaponList>
    </Box>
  );
}
