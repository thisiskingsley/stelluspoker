'use client';

import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Game, setNewGameId } from '@/lib/features/games/gamesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setGameId } from '@/lib/features/users/usersSlice';

export default function JoinGame(props: any) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [sessionNumber, setSessionNumber] = useState('');
	const game = useAppSelector(state => state.game);

	const validateInput = () => {
		//check if there's a value in input
		if (sessionNumber == '') {
			//if not, user must enter value
			return (
				<Button onClick={onClick} size="large" variant="contained" disabled>
					Join Game
				</Button>
			);
		} else {
			//if so, user can proceed to next page
			return (
				<Button onClick={onClick} size="large" variant="contained">
					Join Game
				</Button>
			);
		}
	};

	const onClick = () => {
		let gameId = sessionNumber;
		dispatch(setGameId(sessionNumber));
		dispatch(setNewGameId(sessionNumber));

		router.push(`/new-game/${gameId}`);
	};

	return (
		<main>
			<img id="background" src="/backgroundImage.svg" />

			<h1 id="title" className="flex justify-center">
				Join Game
			</h1>

			<div className="h-screen grid  content-center">
				<div className="ticket-input flex justify-center">
					<TextField
						id="outlined-basic"
						label="Enter session #"
						variant="outlined"
						onChange={event => {
							setSessionNumber(event.target.value);
						}}
						value={sessionNumber}
					/>
				</div>
				<div className="game-buttons flex justify-center py-4">
					{validateInput()}
				</div>
			</div>
		</main>
	);
}
