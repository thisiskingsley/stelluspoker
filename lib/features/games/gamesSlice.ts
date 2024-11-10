import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../users/usersSlice';
import { persistor } from '@/lib/store';
import { PURGE } from 'redux-persist';

export interface Game {
	gameId: string;
	ticketNumber: string;
	reveal: boolean;
	users: User[];
}

const initialState: Game = {
	gameId: '',
	ticketNumber: '',
	reveal: false,
	users: [],
};

// creating action-reducer slice
export const GameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setNewGameId: (state: Game, action: PayloadAction<string>) => {
			state.gameId = action.payload;
		},
		setReveal: (state: Game, action: PayloadAction<boolean>) => {
			state.reveal = action.payload;
		},
		setUsers: (state: Game, action: PayloadAction<User>) => {
			const isSameUser = (a: User, b: User) => a.userId === b.userId;
			if (state.users) {
				const existingUser = state.users.findIndex(user =>
					isSameUser(user, action.payload)
				);

				// add new users
				if (existingUser === -1) {
					state.users.push(action.payload);
				}
				// replace existing users
				else {
					state.users[existingUser] = action.payload;
				}
			}
		},
		setGameTicket: (state: Game, action: PayloadAction<string>) => {
			state.ticketNumber = action.payload;
		},
		removeGameUser: (state: Game, action: PayloadAction<User>) => {
			state.users = state.users?.filter(
				user => user.userId !== action.payload.userId
			);
		},
		fetchGameUsers: (state: Game, action: PayloadAction<User[]>) => {
			state.users = action.payload;
		},
		fetchCurrentGame: (state: Game, action: PayloadAction<Game>) => {
			state = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(PURGE, () => {
			return initialState;
		});
	},
});

// Action creators are generated for each case reducer function
export const {
	setNewGameId,
	setUsers,
	removeGameUser,
	setReveal,
	fetchGameUsers,
	fetchCurrentGame,
	setGameTicket,
} = GameSlice.actions;

export default GameSlice.reducer;
