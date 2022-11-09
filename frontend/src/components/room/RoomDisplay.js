import React from "react";
import { useSelector } from "react-redux";

import { Grid, Box } from "@mui/material";
import RoomUser from "./RoomUser";
import RoomHeader from "./RoomHeader";

export default function RoomDisplay() {
	const size = 25;

	// 방 정보
	const roomData = useSelector((state) => state.room.roomInfo);
	// 현재 대기방의 유저들 정보
	const memberDatas = useSelector(state=>state.room.usersInfo);

  return (
		<Box sx={{display: "flex", flexDirection: "column", alignItems: "center", minWidth:size*35, height: size*23}}>
			<RoomHeader memberDatas={memberDatas} roomData={roomData} size={size}/>
			<RoomUser memberDatas={memberDatas} roomData={roomData} size={size}/>
		</Box>
  );
}
