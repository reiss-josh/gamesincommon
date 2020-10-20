import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SelectorButtonHolder from './components/selectorButtonHolder';
import GameButtonHolder from './components/gameButtonHolder';
import {STEAM_ID_USER} from './jsenv.js';

const INITIAL_STATE = {
	selectorButton: null,
};

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};
		this.gamesButtons = React.createRef();

		this.updateSelectedFriends = this.updateSelectedFriends.bind(this);
  }

	updateSelectedFriends(newGamesList) {
		this.gamesButtons.current.updateGameButtons(newGamesList);
	}

	async componentDidMount() {
		if(STEAM_ID_USER == null){
			return;
		}

		this.setState({selectorButton:
			<SelectorButtonHolder
			friendsList = {this.state.friends}
			alphaParam = {'personaname'}
			selectedFriends = {this.state.selectedFriends}
			handler = {this.updateSelectedFriends}/>
		});
	}

	render() {
		//friend list JSX
		let friendButtons = this.state.selectorButton;
		//games list JSX
		let gamesButtons = <GameButtonHolder ref = {this.gamesButtons}/>

		if(STEAM_ID_USER){
			return(
				<div className = "container">
					<div className = "main-row">
						<div className = "friend-column">
							<div className = "friend-scroll">
								{friendButtons}
							</div>
						</div>
						<div className = "games-column">
							<div className = "games-scroll">
								{gamesButtons}
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return(
				<div className = "container">
					hey, why isn't there a steamid for me to check??
				</div>
			)
		}
	}
}

ReactDOM.render(
	<div>
		<FriendsGamesList/>
	</div>,
	document.getElementById('root')
);