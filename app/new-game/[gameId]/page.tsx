'use client';

import { useAppSelector } from '@/lib/hooks';
import EnterName from './@entername/page';
import Game from './@game/page';
import {
	useGetGameUsersQuery,
	useGetUserQuery,
	useCreateGameMutation,
	useCreateUserMutation,
} from '@/lib/features/api/apiSlice';
import { useEffect } from 'react';

export default function NewGame() {
	const user = useAppSelector(state => state.user);
	const game = useAppSelector(state => state.game);
	const getUser = useGetUserQuery(user);
	const getGameUsers = useGetGameUsersQuery(user);
	const [createUser] = useCreateUserMutation();

	const [createGame] = useCreateGameMutation();

	//if no user in DB, then send user back to EnterName page
	//The problem here is that the user is not created until landing on Game page

	const validateUser = () => {
		getUser.data;
		getGameUsers.data;

		if (!user.name) {
			return <EnterName />;
		} else {
			return <Game />;
		}
	};

	return <main>{validateUser()}</main>;
}
