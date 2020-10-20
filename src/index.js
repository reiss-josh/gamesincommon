import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SelectorButtonHolder from './components/selectorButtonHolder';
import GameButtonHolder from './components/gameButtonHolder';
import {PROXY_URL, API_KEY_USER, STEAM_ID_USER} from './jsenv.js';



const INITIAL_STATE = {
  steamid: STEAM_ID_USER,
	friends: [],
	selectedFriends: [],
	selectorButton: null,
};

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};
		this.gamesButtons = React.createRef();

		this.updateSelectedFriends = this.updateSelectedFriends.bind(this);
  }

	updateSelectedFriends(newGames) {
		//this.setState({selectedFriends: newSelected});
		//this.gamesButtons.current.handleGamesList(this.state.friends, this.state.selectedFriends);
		this.gamesButtons.current.updateGameButtons(newGames);
	}

	async componentDidMount() {
		//get the friends list, fill out its properties, then store it
		if(this.state.steamid == null){
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
		let friendButtons, gamesButtons;

		//friend list JSX
		friendButtons = this.state.selectorButton;

		//games list JSX
		gamesButtons = <GameButtonHolder ref = {this.gamesButtons}
										gamesList = {[]}/>

		if(this.state.steamid){
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