'use client';

import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setGameId, setTicket } from '@/lib/features/users/usersSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setNewGameId } from '@/lib/features/games/gamesSlice';

export default function HostGame() {
	const router = useRouter();
	const [ticketNumber, setTicketNumber] = useState('');
	const dispatch = useAppDispatch();
	const user = useAppSelector(state => state.user);

	const validateInput = () => {
		//check if there's a value in input
		if (ticketNumber == '') {
			//if not, user must enter value
			return (
				<Button size="large" variant="contained" disabled>
					Create Game
				</Button>
			);
		} else {
			//if so, user can proceed to next page
			return (
				<Button onClick={onClick} size="large" variant="contained">
					Create Game
				</Button>
			);
		}
	};

	const onClick = () => {
		// create uuid for URL
		let gameId = uuidv4();
		dispatch(setGameId(gameId));
		dispatch(setTicket(ticketNumber));
		dispatch(setNewGameId(gameId));
		// navigate to the game page
		router.push(`/new-game/${gameId}`);
	};

	return (
		<main>
			<img id="background" src="/backgroundImage.svg" />

			<h1 id="title" className="flex justify-center">
				Host Game
			</h1>

			<div className="h-screen grid  content-center">
				<div className="ticket-input flex justify-center">
					<TextField
						id="outlined-basic"
						label="Enter ticket #"
						variant="outlined"
						onChange={event => {
							setTicketNumber(event.target.value);
						}}
						value={ticketNumber}
					/>
				</div>
				<div className="game-buttons flex justify-center py-4">
					{validateInput()}
				</div>
			</div>
		</main>
	);
}
