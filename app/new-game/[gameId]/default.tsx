'use client';

import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Input } from '@mui/base/Input';
import { useState } from 'react';

export default function NewGame() {
	const [username, setUsername] = useState('');

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

	const onClick = () => {};

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
