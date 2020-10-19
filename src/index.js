import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SelectorButtonHolder from './components/selectorButtonHolder';
import GameButtonHolder from './components/gameButtonHolder';
import {alphabetizeObjects, sepMissingParams, joinMissingParams} from './utilities/generic_utils.js';
import {getSteamFriends, getPlayerSummaries,
				getSteamGamesMultiple, getGamesInCommon} from './utilities/steamAPI_utils.js';

//need to get this information from a login page instead
import {PROXY_URL, API_KEY_USER, STEAM_ID_USER} from './jsenv.js';

const INITIAL_STATE = {
  steamid: STEAM_ID_USER,
	friends: [],
	selectedFriends: [],
	games: [],
	selectorButton: null,
	gamesButtons: null,
};

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};

		this.updateSelectedFriends = this.updateSelectedFriends.bind(this);
  }

	updateSelectedFriends(newSelected) {
		this.setState({selectedFriends: newSelected});
		this.handleGamesList();
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

	handleGamesList = async() => {
		console.log("handling games list...");
		this.setState({games: []}); //resets list --- should start up a "loading" image around here
		let currFrns = this.state.friends;
		let currSelected = this.state.selectedFriends;

		//determine what data has/hasn't been memoized; retrieve it
		let missFound = sepMissingParams(currFrns, currSelected, 'gameLibrary', 'steamid');
		//console.log(missFound);

		//look up the missing data
		let allLibraries = [];
		if(missFound.missing.length > 0){ //if there's anything missing...
			let missingLibraries = await getSteamGamesMultiple(missFound.missing);
			allLibraries = allLibraries.concat(missingLibraries);
		};
		
		//memoize the missing data, now that we've grabbed it
		if(allLibraries.length > 0){ //if we found something above...
			joinMissingParams(missFound.missing, allLibraries, 'gameLibrary', 'steamid');

			//i have somehow accidentally made the following unnecessary...
			//i'm assuming i messed up some deep vs. shallow copying somewhere, which is probably very bad
			/*
			//let joined = joinMissingParams(missFound.missing, allLibraries, 'gameLibrary', 'steamid');
			let ind;
			joined.forEach(function (elt) {
				ind = currFrns.map(e => e.steamid).indexOf(elt.steamid);
				currFrns[ind].gameLibrary = elt.gameLibrary;
			});
			this.setState({friends: currFrns});
			*/
		};

		//make sure that we actually use the memoized data
		allLibraries = allLibraries.concat(missFound.found);

		//get gamesInCommon, now that we have all our data
		let gamesInCommon = getGamesInCommon(allLibraries);
		this.setState({games: gamesInCommon}); //update stored games
		
		if(this.state.gamesButtons){ //need to pass updated games list down
			let beep = this.state.gamesButtons;
			beep.coolFunction("hee")
		}
		return gamesInCommon;
	}

	async componentDidMount() {
		//get the friends list, fill out its properties, then store it
		if(this.state.steamid == null){
			return;
		}
		await this.handleFriendsList();
		await this.handleGamesList();

		this.setState({selectorButton: 
			<SelectorButtonHolder
			friendsList = {this.state.friends}
			alphaParam = {'personaname'}
			selectedFriends = {this.state.selectedFriends}
			handler = {this.updateSelectedFriends}/>
		});

		this.setState({gamesButtons:
			<GameButtonHolder
			gamesList = {this.state.games}/>
		});
	}

	render() {
		let currComponent = this; //cache reference for the "setState" in here
		let friendButtons, gamesButtons;

		//todo: this shouldn't all be happening in render, right?
		//friend list JSX
		friendButtons = (this.state.friends && this.state.friends.length > 0) ?
										this.state.selectorButton : <div>do you not have any friends??</div>;

		//todo: this shouldn't all be happening in render
		//games list JSX
		if(this.state.games && this.state.games.length > 0){
			gamesButtons = this.state.gamesButtons;
		} else {
			gamesButtons = <div>you have no games in common!! is one of your friends' games library private? maybe you haven't selected any users?</div>
		}

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