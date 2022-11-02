import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Button, Box, Grid } from "@mui/material";

export default function ItemBox(props) {
	const [size, setSize] = useState(100);
	const [onClick, setOnClick] = useState(()=>{});
	useEffect(()=>{
		if(props.size){
			setSize(props.size);
		}
	}, [props.size]);
	useEffect(()=>{
		if(props.onClick){
			setOnClick(props.onClick);
		}
	}, [props.onClick]);
	return (
		<Button onClick={onClick}>
			<Box sx={{width:size, height:size}}>
				{props.text
					? <Grid container>
							<Grid item xs={12} sx={{fontSize:size/10}}>{props.text}</Grid>
							<Grid item xs={12}><img src={props.item} alt={props.item} style={{width:size*0.7, height:size*0.7}} /></Grid>
						</Grid>
					: <img src={props.item} alt={props.item} style={{width:size*0.9, height:size*0.9}} />
				}
			</Box>
		</Button>
	);
}