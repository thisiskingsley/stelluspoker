import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	// baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://stellusrxpoker-de9a8cd9d661.herokuapp.com/api',
	}),
	tagTypes: ['Users', 'Games'],
	endpoints: builder => ({
		getUsers: builder.query({
			query: () => '/users',
			providesTags: ['Users'],
		}),
		getUser: builder.query({
			query: user => `/users/${user.userId}`,
			providesTags: ['Users'],
		}),
		createUser: builder.mutation({
			query: user => ({
				url: '/users',
				method: 'POST',
				body: user,
			}),
			invalidatesTags: ['Users'],
		}),
		updateUser: builder.mutation({
			query: user => ({
				url: `/users/${user.userId}`,
				method: 'PATCH',
				body: user,
			}),
			invalidatesTags: ['Users'],
		}),
		deleteUser: builder.mutation({
			query: user => ({
				url: `/users/${user.userId}`,
				method: 'DELETE',
				body: user,
			}),
			invalidatesTags: ['Users'],
		}),
		getGame: builder.query({
			query: game => `/games/${game.gameId}`,
			providesTags: ['Games'],
		}),
		getGameUsers: builder.query({
			query: game => `/games/${game.gameId}/users`,
			providesTags: ['Users'],
		}),
		createGame: builder.mutation({
			query: game => ({
				url: '/games',
				method: 'POST',
				body: game,
			}),
			invalidatesTags: ['Games'],
		}),
		deleteGame: builder.mutation({
			query: game => ({
				url: `/games/${game.gameId}`,
				method: 'DELETE',
				body: game,
			}),
			invalidatesTags: ['Users'],
		}),
		deleteGameUser: builder.mutation({
			query: user => ({
				url: `/games/${user.gameId}/${user.userId}`,
				method: 'DELETE',
				body: user,
			}),
			invalidatesTags: ['Users'],
		}),
		addUsers: builder.mutation({
			query: game => ({
				url: `/games/${game.gameId}`,
				method: 'PATCH',
				body: game,
			}),
			invalidatesTags: ['Games'],
		}),
		updateGame: builder.mutation({
			query: game => ({
				url: `/games/reveal/${game.gameId}`,
				method: 'PATCH',
				body: game,
			}),
			invalidatesTags: ['Games'],
		}),
		updateGameTicket: builder.mutation({
			query: game => ({
				url: `/games/ticket/${game.gameId}`,
				method: 'PATCH',
				body: game,
			}),
			invalidatesTags: ['Games'],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useGetUserQuery,
	useGetGameQuery,
	useGetGameUsersQuery,
	useDeleteGameMutation,
	useDeleteGameUserMutation,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useCreateGameMutation,
	useAddUsersMutation,
	useUpdateGameMutation,
	useUpdateGameTicketMutation,
} = apiSlice;
