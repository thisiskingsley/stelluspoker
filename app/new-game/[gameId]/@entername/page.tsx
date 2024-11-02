'use client';

import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {
	User,
	setName,
	setUser,
	setUserId,
	setGameId,
} from '@/lib/features/users/usersSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setNewGameId, setUsers } from '@/lib/features/games/gamesSlice';
import { v4 as uuidv4 } from 'uuid';
import {
	useCreateUserMutation,
	useCreateGameMutation,
} from '@/lib/features/api/apiSlice';

export default function EnterName() {
	const [username, setUsername] = useState('');
	const dispatch = useAppDispatch();

	const user: User = useAppSelector(state => state.user);
	const game = useAppSelector(state => state.game);
	const [createUser] = useCreateUserMutation();

	const currentURL = document.URL;
	const sessionNumber = currentURL.split('/')[4];

	const validateInput = () => {
		//check if there's a value in input
		if (username == '') {
			//if not, user must enter value
			return (
				<Button onClick={onClick} size="large" variant="contained" disabled>
					Continue
				</Button>
			);
		} else {
			//if so, user can proceed to next page
			return (
				<Button onClick={onClick} size="large" variant="contained">
					Continue
				</Button>
			);
		}
	};

	const onClick = async () => {
		let userId = uuidv4();
		dispatch(setName(username));
		dispatch(setGameId(sessionNumber));
		dispatch(setNewGameId(sessionNumber));
		dispatch(setUserId(userId));
		dispatch(setUser(user));
	};

	return (
		<main>
			<img id="background" src="/backgroundImage.svg" />

			<h1 id="title" className="flex justify-center">
				Who Are You?
			</h1>

			<div className="h-screen grid  content-center">
				<div className="ticket-input flex justify-center">
					<TextField
						id="outlined-basic"
						label="Enter Your Name"
						variant="outlined"
						onChange={event => setUsername(event.currentTarget.value)}
						value={username}
					/>
				</div>
				<div className="game-buttons flex justify-center py-4">
					{validateInput()}
				</div>
			</div>
		</main>
	);
}
