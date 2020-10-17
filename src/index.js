import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SelectorButton from './components/selectorButton';
import {alphabetizeObjects, sepMissingParams, joinMissingParams,
				innerJoinObjectsTwo, innerJoinObjectsMany} from './utilities/generic_utils.js';
import {SendHTTPRequest, getRequest} from './utilities/http_utils.js';
import {getSteamFriends, getPlayerSummaries,
				getSteamGamesMultiple, getGamesInCommon} from './utilities/steamAPI_utils.js';

//need to get this information from a login page instead
import {PROXY_URL, API_KEY_USER, STEAM_ID_USER} from './jsenv.js';

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {
			steamid: STEAM_ID_USER,
			friends: [],
			selectedFriends: [],
			games: [],
		};
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
		this.setState({friends: summariesResult});

		//init our selected list with the logged-in user
		let userObject = [summariesResult.filter(obj => {return obj.steamid === STEAM_ID_USER})[0]];
		this.setState({selectedFriends: userObject});
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
		this.setState({games: gamesInCommon});
		return gamesInCommon;
	}

	//todo: this should be in another file
	makeGameButton(game) {
		if(game.img_logo_url !== ""){
			return (
				<li key = {game.appid}>
					<button className = 'game-button' onClick = {function() {
						window.open("https://store.steampowered.com/app/"+ game.appid);
					}}>
						<img
							alt = {game.name}
							src = {"http://media.steampowered.com/steamcommunity/public/images/apps/" +
											game.appid + "/" + game.img_logo_url + ".jpg"}
						>
						</img>
					</button>
				</li>
			)
		}
	}

	//todo: this should be in another file
	makeSelectorButton (listObjs, alphaParam, currComponent) {
		return (
			alphabetizeObjects(listObjs, alphaParam)
			.map((person, index) => (
				<li key = {person['steamid']}>
					<SelectorButton person = {person} currComponent = {currComponent}/>
				</li>
			))
		)
	}

	async componentDidMount() {
		//get the friends list, fill out its properties, then store it
		if(this.state.steamid == null){
			return;
		}
		await this.handleFriendsList();
		await this.handleGamesList();
	}

	render() {
		let currComponent = this; //cache reference for the "setState" in here
		let friendButtons, gamesButtons;

		//todo: this should be in another file
		//friend list JSX
		if(this.state.friends && this.state.friends.length > 0){
			friendButtons =
			<ul>{
				this.makeSelectorButton(this.state.friends, 'personaname', currComponent)
			}</ul>
		} else {
			friendButtons = <div>do you not have any friends??</div>
		}

		//todo: this should be in another file
		//games list JSX
		if(this.state.games && this.state.games.length > 0){
			gamesButtons =
			<ul> {
				alphabetizeObjects(this.state.games, 'name')
				.map((game, index) => (
					this.makeGameButton(game)
				))
			} </ul>
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

//HELPER FUNCTIONS
//todo: export all the below helpers to other files







ReactDOM.render(
	<div>
		<FriendsGamesList/>
	</div>,
	document.getElementById('root')
);