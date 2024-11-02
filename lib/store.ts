'use client';

import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './features/users/usersSlice';
import { combineReducers } from '@reduxjs/toolkit';

import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import { GameSlice } from './features/games/gamesSlice';
import { apiSlice } from './features/api/apiSlice';
import sessionStorage from 'redux-persist/es/storage/session';

const persistConfig = {
	key: 'root',
	storage: sessionStorage,
};

const rootReducer = combineReducers({
	user: UserSlice.reducer,
	game: GameSlice.reducer,
	[apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(apiSlice.middleware),
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];

export const persistor = persistStore(store);
