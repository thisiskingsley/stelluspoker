'use client';

import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { persistor } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
	useDeleteGameMutation,
	useDeleteGameUserMutation,
} from '@/lib/features/api/apiSlice';
import { removeGameUser } from '@/lib/features/games/gamesSlice';

export default function Home() {
	const dispatch = useAppDispatch();
	const user = useAppSelector(state => state.user);
	const [deleteGameUser] = useDeleteGameUserMutation();

	useEffect(() => {
		const clearStorage = () => {
			deleteGameUser(user);
			dispatch(removeGameUser(user));
			persistor.purge();
		};
		clearStorage();
	}, []);

	return (
		<main>
			<div>
				<img id="background" src="/backgroundImage.svg" />

				<h1 id="title" className="flex justify-center">
					Planning Poker
				</h1>

				<div className="h-screen grid content-center">
					<div className="game-buttons flex justify-center">
						<Button size="large" variant="contained" href="/hostgame">
							Host Game
						</Button>
					</div>
					<div className="game-buttons flex justify-center py-4">
						<Button size="large" variant="contained" href="/joingame">
							Join Game
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
