'use client';

import Button from '@mui/material/Button';
import { setCard } from '@/lib/features/users/usersSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPeopleGroup,
	faTrashCan,
	faHouseChimney,
	faPlus,
	faMinus,
} from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
	fetchGameUsers,
	removeGameUser,
	setReveal,
	setUsers,
} from '@/lib/features/games/gamesSlice';
import { useState, useEffect } from 'react';
import {
	useCreateUserMutation,
	useUpdateUserMutation,
	useCreateGameMutation,
	useAddUsersMutation,
	useGetGameQuery,
	useGetGameUsersQuery,
	useGetUserQuery,
	useDeleteGameUserMutation,
	useUpdateGameMutation,
} from '@/lib/features/api/apiSlice';
import { User } from '@/lib/features/users/usersSlice';
import { Fade } from '@mui/material';
import { socket } from '../../../../socket';
import { persistor } from '@/lib/store';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Game() {
	const dispatch = useAppDispatch();
	const [createUser] = useCreateUserMutation();
	const [updateUser] = useUpdateUserMutation();
	const [deleteGameUser] = useDeleteGameUserMutation();
	const [createGame] = useCreateGameMutation();
	const [addUsers] = useAddUsersMutation();
	const [updateGame] = useUpdateGameMutation();

	const user = useAppSelector(state => state.user);
	const game = useAppSelector(state => state.game);

	const getGame = useGetGameQuery(game);
	const getUser = useGetUserQuery(user);
	const getGameUsers = useGetGameUsersQuery(game);

	const [renderedNames, setRenderedNames] = useState<JSX.Element[]>([]);
	const [open, setOpen] = useState(false);
	const [revealCards, setRevealCards] = useState(getGameUsers.data?.foundGame?.reveal);
	const [revealButton, setRevealButton] = useState<JSX.Element>();
	const [fibonacci, setFibonacci] = useState(true);
	const [score, setScore] = useState<JSX.Element>();

	const router = useRouter();

	useEffect(() => {
		const createData = async () => {
			const results = await createUser(user);

			if (results.data?.newUser) {
				await createGame(results.data?.newUser);
			}
		};
		// if we have a user created (by entering name), but there's no user found in DB, add user to DB
		if (user && !getUser.data?.userId) {
			createData();
		}
	}, [getGame.data, getGameUsers.data?.foundGame]);

	useEffect(() => {
		updateUser(user);

		dispatch(setUsers(user));

		const fetchGame = () => {
			if (getGame.data) {
				addUsers(user);
			}
		};
		fetchGame();

		//Add users to Game Redux state
		getGameUsers.data?.foundGame?.users.forEach((user: User) => {
			dispatch(setUsers(user));
		});

		// Fetch users from the Game Redux state
		dispatch(fetchGameUsers(getGameUsers.data?.foundGame?.users));
		socket.emit('joinRoom', getGameUsers.data?.foundGame?.gameId);
	}, [user, getUser.data, getGame.data, getGameUsers.data?.foundGame]);

	useEffect(() => {
		dispatch(setReveal(revealCards));
		updateGame(game); //for updating the reveal card key in the DB
	}, [getGameUsers.data?.foundGame, revealCards]);

	useEffect(() => {
		socket.emit('update', getGameUsers.data?.foundGame);
		socket.emit('joinRoom', getGameUsers.data?.foundGame?.gameId);
		socket.on('dataUpdated', data => {
			const tempRenderedNames: JSX.Element[] = [];
			const tempCardCounts: any = [];

			let score = new Array();
			const average = (array: any) =>
				array.reduce((a: number, b: any) => a + b) / array.length;

			const counts = (array: any) =>
				array.reduce((count: any, num: any) => {
					count[num] = (count[num] || 0) + 1;
					return count;
				}, {});

			const showCount = () => {
				for (let [key, value] of Object.entries(counts(score))) {
					tempCardCounts.push(
						<tr key={key}>
							<td>{`${key}`}</td>
							<td> {`${value}`}</td>
						</tr>
					);
				}

				return <tbody>{tempCardCounts}</tbody>;
			};

			//Show Score
			setScore(
				<div>
					{data?.reveal ? (
						<div id="scoreBox">
							{data?.users.forEach(
								(user: {
									name: string;
									card: string;
									userId: string;
									ticketNumber: string;
									gameId: string;
								}) => {
									if (user.card !== '_' && user.card !== '') {
										let cardValue = Number(user.card);
										score.push(cardValue);
									}
								}
							)}

							<div id="statistics">
								<div className="font-bold text-xl">Statistics</div>
								<div>
									<span className="font-bold pe-1">Average:</span>{' '}
									{average(score).toFixed(2)}
								</div>
								<br />
								<div>
									<table>
										<thead>
											<tr>
												<th>Points</th>
												<th>Votes</th>
											</tr>
										</thead>
										{showCount()}
									</table>
								</div>
							</div>
						</div>
					) : (
						<div></div>
					)}
				</div>
			);

			//Switch Reveal Buttons
			setRevealButton(
				<div className="flex justify-center">
					{user && !getUser.data?.userId && getUser.status == 'fulfilled' ? (
						<Button size="large" variant="contained" disabled>
							Reveal Cards
						</Button>
					) : (
						<Button
							size="large"
							variant="contained"
							onClick={() => {
								setRevealCards(!revealCards);
							}}
						>
							{!data?.reveal ? 'Reveal Cards' : 'Revote'}
						</Button>
					)}
				</div>
			);

			//Show/Hide card values
			if (data?.reveal) {
				data?.users.forEach(
					(user: {
						name: string;
						card: string;
						userId: string;
						ticketNumber: string;
						gameId: string;
					}) => {
						tempRenderedNames.push(
							<div id="renderedNames" key={user.userId}>
								{user.userId == getUser.data?.userId ? (
									<div className="font-bold">
										{user.name}: {user.card !== '_' ? user.card : ''}
										<FontAwesomeIcon
											className="trashcan"
											icon={faTrashCan}
											color="red"
											onClick={() => {
												deleteGameUser(user);
												dispatch(removeGameUser(user));
												persistor.purge();
											}}
										/>
									</div>
								) : (
									<div>
										{user.name}: {user.card !== '_' ? user.card : ''}
										<FontAwesomeIcon
											className="trashcan"
											icon={faTrashCan}
											color="red"
											onClick={() => {
												deleteGameUser(user);
												dispatch(removeGameUser(user));
											}}
										/>
									</div>
								)}
							</div>
						);
					}
				);
			} else {
				data?.users.forEach(
					(user: {
						name: string;
						card: string;
						userId: string;
						ticketNumber: string;
						gameId: string;
					}) => {
						tempRenderedNames.push(
							<div id="renderedNames" className="flex" key={user.userId}>
								{user.userId == getUser.data?.userId ? (
									<div className="flex userValue font-bold">
										{user.name}:{' '}
										{!user.card ? (
											user.card
										) : (
											<img
												className="smallCard"
												src="/deckOfCards/backOfCard.jpg"
											/>
										)}
										<FontAwesomeIcon
											className="trashcan"
											icon={faTrashCan}
											color="red"
											onClick={() => {
												deleteGameUser(user);
												dispatch(removeGameUser(user));
												persistor.purge();
											}}
										/>
									</div>
								) : (
									<div className="flex userValue">
										{user.name}:{' '}
										{!user.card ? (
											user.card
										) : (
											<img
												className="smallCard"
												src="/deckOfCards/backOfCard.jpg"
											/>
										)}
										<FontAwesomeIcon
											className="trashcan"
											icon={faTrashCan}
											color="red"
											onClick={() => {
												deleteGameUser(user);
												dispatch(removeGameUser(user));
											}}
										/>
									</div>
								)}
							</div>
						);
					}
				);
			}

			setRenderedNames(tempRenderedNames);
		});
	}, [getGameUsers.data?.foundGame, getUser.data?.userId, revealCards]);

	// useEffect(() => {
	// 	//kick user out who's been deleted. --- I'M SO CLOSE TO FIGURING THIS OUT! ----
	// 	const redirectUser = async () => {
	// 		const findThisUser = await game.users?.findIndex(
	// 			gameUser => gameUser.name == user.name
	// 		);

	// 		const getUserId = await getUser.data?.userId;

	// 		if (
	// 			user &&
	// 			findThisUser == -1 &&
	// 			!getUserId &&
	// 			getUser.status == 'fulfilled'
	// 		) {
	// 			router.push('/');
	// 		}
	// 	};
	// 	redirectUser();
	// }, [renderedNames, getGameUsers.data?.foundGame]);

	function onClick(element: any) {
		let imgSrc = element?.target.attributes.id.value;
		dispatch(setCard(imgSrc));
	}

	const copyURLToClipboard = () => {
		// Get the current URL
		const url = window.location.href;
		// Copy the text to the clipboard
		navigator.clipboard.writeText(url);
		setOpen(true);
	};
	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const addCards = () => {
		setFibonacci(!fibonacci);
	};

	return (
		<main>
			<img id="background" src="/backgroundImage.svg" />
			<div id="title" className="flex justify-center">
				<Link id="homeButton" href={'/'}>
					<FontAwesomeIcon icon={faHouseChimney} />
				</Link>
				<h1>New Game</h1>
			</div>
			<div id="header" className="flex justify-between">
				<h2>
					Ticket#{' '}
					{user.ticketNumber
						? user.ticketNumber
						: getGame.data?.foundGame?.ticketNumber}
				</h2>

				<div id="subheader" className="flex justify-between">
					<h2 id="nameHeader">Name: {user.name}</h2>
					<button
						className="border-2 rounded-lg p-1"
						onClick={copyURLToClipboard}
					>
						Invite Players <FontAwesomeIcon icon={faPeopleGroup} />
					</button>

					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={open}
						autoHideDuration={2000}
						TransitionComponent={Fade}
						onClose={handleClose}
					>
						<Alert
							onClose={handleClose}
							severity="success"
							variant="filled"
							sx={{ width: '100%' }}
						>
							Invitation link copied to clipboard
						</Alert>
					</Snackbar>
				</div>
			</div>
			<div className="flex justify-center">{revealButton}</div>
			<div id="selection" className="flex justify-center">
				{!user.card ? (
					<img className="selectedCard" src="/deckOfCards/pickCard.jpg" />
				) : (
					<img className="selectedCard" src={`/deckOfCards/${user.card}.jpg`} />
				)}
				<div>{renderedNames}</div>
				<div>{score}</div>
			</div>
			<div className="flex justify-center">
				{fibonacci ? (
					<div className="flex">
						<div id="deck-of-cards" className="flex">
							<img
								id="1"
								className="card"
								src="/deckOfCards/1.jpg"
								onClick={onClick}
							/>
							<img
								id="2"
								className="card"
								src="/deckOfCards/2.jpg"
								onClick={onClick}
							/>
							<img
								id="3"
								className="card"
								src="/deckOfCards/3.jpg"
								onClick={onClick}
							/>
							<img
								id="5"
								className="card"
								src="/deckOfCards/5.jpg"
								onClick={onClick}
							/>
							<img
								id="8"
								className="card"
								src="/deckOfCards/8.jpg"
								onClick={onClick}
							/>
							<img
								id="13"
								className="card"
								src="/deckOfCards/13.jpg"
								onClick={onClick}
							/>
							<img
								id="_"
								className="card"
								src="/deckOfCards/_.jpg"
								onClick={onClick}
							/>
						</div>

						<FontAwesomeIcon
							icon={faPlus}
							id="moreCardsButton"
							onClick={addCards}
						/>
					</div>
				) : (
					<div className="flex">
						<div id="full-deck-of-cards" className="flex">
							<img
								id="1"
								className="card"
								src="/deckOfCards/1.jpg"
								onClick={onClick}
							/>
							<img
								id="2"
								className="card"
								src="/deckOfCards/2.jpg"
								onClick={onClick}
							/>
							<img
								id="3"
								className="card"
								src="/deckOfCards/3.jpg"
								onClick={onClick}
							/>
							<img
								id="4"
								className="card"
								src="/deckOfCards/4.jpg"
								onClick={onClick}
							/>
							<img
								id="5"
								className="card"
								src="/deckOfCards/5.jpg"
								onClick={onClick}
							/>
							<img
								id="6"
								className="card"
								src="/deckOfCards/6.jpg"
								onClick={onClick}
							/>
							<img
								id="7"
								className="card"
								src="/deckOfCards/7.jpg"
								onClick={onClick}
							/>
							<img
								id="8"
								className="card"
								src="/deckOfCards/8.jpg"
								onClick={onClick}
							/>
							<img
								id="9"
								className="card"
								src="/deckOfCards/9.jpg"
								onClick={onClick}
							/>
							<img
								id="10"
								className="card"
								src="/deckOfCards/10.jpg"
								onClick={onClick}
							/>
							<img
								id="11"
								className="card"
								src="/deckOfCards/11.jpg"
								onClick={onClick}
							/>
							<img
								id="12"
								className="card"
								src="/deckOfCards/12.jpg"
								onClick={onClick}
							/>
							<img
								id="13"
								className="card"
								src="/deckOfCards/13.jpg"
								onClick={onClick}
							/>
							<img
								id="14"
								className="card"
								src="/deckOfCards/14.jpg"
								onClick={onClick}
							/>
							<img
								id="_"
								className="card"
								src="/deckOfCards/_.jpg"
								onClick={onClick}
							/>
						</div>

						<FontAwesomeIcon
							icon={faMinus}
							id="lessCardsButton"
							onClick={addCards}
						/>
					</div>
				)}
			</div>
		</main>
	);
}
