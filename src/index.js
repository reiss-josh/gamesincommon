import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SelectorButtonHolder from './components/selectorButtonHolder';
import GameButtonHolder from './components/gameButtonHolder';
import {getSteamFriends, getPlayerSummaries} from './utilities/steamAPI_utils.js';

//need to get this information from a login page instead
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

	updateSelectedFriends(newSelected) {
		this.setState({selectedFriends: newSelected});
		this.gamesButtons.current.handleGamesList(this.state.friends, this.state.selectedFriends);
	}

	handleFriendsList = async() => {
		console.log("handling friends list...");
		//get friends
		let friendsResult = await getSteamFriends(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
		const loginObject = {steamid: STEAM_ID_USER, realtionship: "self", friend_since: 0}; //add logged in user to list
		friendsResult.push(loginObject);
		//get summaries
		let idArray = friendsResult.map(a => a.steamid);
		let summariesResult = await getPlayerSummaries(idArray, API_KEY_USER, PROXY_URL);
		//clean up
		summariesResult.forEach(function (a) {
			a.gameLibrary = null;
		});
		
		//get the object of the currently-logged-in user
		let userObject = [summariesResult.filter(obj => {return obj.steamid === STEAM_ID_USER})[0]];

		//update object state
		this.setState({selectedFriends: userObject});
		this.setState({friends: summariesResult});
		return summariesResult;
	}

	async componentDidMount() {
		//get the friends list, fill out its properties, then store it
		if(this.state.steamid == null){
			return;
		}

		await this.handleFriendsList();

		if(this.gamesButtons.current){ //need to pass updated games list down
			await this.gamesButtons.current.handleGamesList(this.state.friends, this.state.selectedFriends); //todo: need to make this work
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