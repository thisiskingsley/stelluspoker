import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

export interface User {
	userId: string;
	name: string;
	ticketNumber: string;
	gameId: string;
	card: string;
}

const initialState: User = {
	userId: '',
	name: '',
	ticketNumber: '',
	gameId: '',
	card: '',
};

// creating action-reducer slice
export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setGameId: (state: User, action: PayloadAction<string>) => {
			state.gameId = action.payload;
		},
		setTicket: (state: User, action: PayloadAction<string>) => {
			state.ticketNumber = action.payload;
		},
		setName: (state: User, action: PayloadAction<string>) => {
			state.name = action.payload;
		},
		setCard: (state: User, action: PayloadAction<string>) => {
			state.card = action.payload;
		},
		setUserId: (state: User, action: PayloadAction<string>) => {
			state.userId = action.payload;
		},
		setUser: (state: User, action: PayloadAction<any>) => {
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
export const { setGameId, setTicket, setName, setUser, setCard, setUserId } =
	UserSlice.actions;

export default UserSlice.reducer;
