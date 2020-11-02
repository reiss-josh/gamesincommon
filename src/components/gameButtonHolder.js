import React, { useContext} from 'react';
import GameButton from './gameButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';

import FriendsGamesContext from '../utilities/friends-games-context';

//generate the array of GameButton objects
function generateGameButtons(gamesList){
	if(gamesList){
		return (
			<ul>{
				alphabetizeObjects(gamesList, 'name')
				.map((game, index) => (
					GameButton(game)
				))
			}</ul>
		)
	} else {
		return <div>hey! do you not have any games in common at all??</div>
	}
}

const GameButtonHolder = () => {
	const user = useContext(FriendsGamesContext);
	return generateGameButtons(user.state.gamesList);
}

export default GameButtonHolder;