import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//redirect here from login page.
//somehow retrieve steamid from the login ???
var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
var STEAM_ID_USER = "76561198041117535";
var API_KEY_USER = "E1D16427E370EA735611B2EF484399A4";


class FriendsGamesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			steamid: null,
			friends: [],
			selectedFriends: [],
			games: []
		};
	}

	handleFriendsList = async() => {
		let friendsResult = await getSteamFriends(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
		const loginObject = {steamid: STEAM_ID_USER, realtionship: "self", friend_since: 0}; //add logged in user to list
		friendsResult.push(loginObject);
		let idArray = friendsResult.map(a => a.steamid);
		const summariesResult = await getPlayerSummaries(idArray, API_KEY_USER, PROXY_URL);
		this.setState({friends: summariesResult});

		//init our selected list with the logged-in user
		let userObject = [summariesResult.filter(obj => {return obj.steamid === STEAM_ID_USER})[0]];
		this.setState({selectedFriends: userObject});
		return summariesResult;
	}

	handleGamesList = async() => {
		console.log("handling games list");
		let currIDS = this.state.selectedFriends.map(a => a.steamid);
		let allLibraries = await getSteamGamesMultiple(currIDS);
		let gamesInCommon = getGamesInCommon(allLibraries);
		this.setState({games: gamesInCommon});
		return gamesInCommon;
	}

	async componentDidMount() {
		//get the friends list, fill out its properties, then store it
		await this.handleFriendsList();
		await this.handleGamesList();
	}

	render() {
		let currComponent = this; //cache reference for the "setState" in here
		return(
			<div>
				<div>
					<ul>
						{
						alphabetizeObjects(this.state.friends, 'personaname')
						.map((person, index) => (
						<li key = {person['steamid']}>
							<button onClick = {function() {
									let ind = currComponent.state.selectedFriends.indexOf(person);
									if(ind > -1) {
										let newSelected = currComponent.state.selectedFriends;
										newSelected.splice(ind, 1);
										currComponent.setState({selectedFriends: newSelected});
										console.log("removed " + person.personaname);
									} else {
										let newSelected = currComponent.state.selectedFriends.concat(person);
										currComponent.setState({selectedFriends: newSelected});
										console.log("added " + person.personaname);
									}
									currComponent.handleGamesList();
									console.log("Refreshing...");
								}}>
								username is {person.personaname}
							</button>
						</li>
					))}
				</ul>
				<ul>
					{this.state.selectedFriends
					.map((person,index) => (
					<li key = {person.steamid}>
						{person.personaname}
					</li>
					))}
				</ul>
			</div>
			<div>
				<button onClick = {function() {
							currComponent.handleGamesList();
							console.log("Refreshing...");
						}}>
							get games
						</button>
				<ul>
					{alphabetizeObjects(this.state.games, 'name')
					.map((game, index) => (
					<li key = {game.appid}>
						<button onClick = {function() {
							console.log(game);
						}}>
							game is {game.name}
						</button>
					</li>
					))}
				</ul>
			</div>
		</div>
		);
	}
}

//alphabetizes an array of objects by some property
function alphabetizeObjects(arr, prop) {
	return arr.sort((a,b) => (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : -1);
}

//returns promise object given HTTP method and url
const SendHttpRequest = (method, url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.send();
  });
  return promise;
};

//returns the result from a GET request at a given url
const getRequest = (url) => {
	let dataGet = SendHttpRequest('GET', url);
	return (
		dataGet
			.then(responseData => {
				return responseData;
			})
			.catch(function(error) {
				console.log(error.message);
			} )
	)
}

//returns an array of friend objects given a steamid
const getSteamFriends = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetFriendList/v1/";
	let response = await getRequest(proxy + baseUrl + "?key="+ apiKey + "&steamid=" + userID);
	return response.friendslist.friends;
}

//returns an array of player summaries given an array of steamIDs
const getPlayerSummaries = async(userIDs, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
	let userIDsString;
	userIDs.map((id) => userIDsString += "," + id);
	userIDsString = userIDsString.substr(1);
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamids=" + userIDsString);
	return response.response.players;
}

//retuns game library (an array of game objects) given a steamID
const getSteamGames = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamid=" + userID
																	+ "&include_appinfo=true&include_player_free_games=true");
	return response.response.games;
}

//returns an array of game libraries given an arrayof steamIDs
const getSteamGamesMultiple = async(userIDs) => {
	let allLibraries = [];
	for(let i = 0; i < userIDs.length; i++)
	{
		let gms = await getSteamGames(userIDs[i], API_KEY_USER, PROXY_URL);
		allLibraries.push(gms);
	}
	return allLibraries;	
}

//returns the inner join of multiple game libraries, given as an array
function getGamesInCommon(libraries) {
	return innerJoinObjectsMany(libraries, 'appid');
}

//gets the image urls given an array of games
const getGameImages = async(games) => {

}

//take a game object, add game tags to the object
function getGameTags(game) {

}

//takes an image url, a redirect url, and a caption
//returns an html element
function createImage(imgurl, clickurl, caption) {

}

//returns inner join of many arrays of objects by some parameter
function innerJoinObjectsMany(arr, prop)
{
	let result = arr[0];
	for(let i = 1; i < arr.length; i++){
		result = innerJoinObjectsTwo(result, arr[i], prop);
	}
	return result;
}

//returns inner join of two arrays of objects by some parameter
function innerJoinObjectsTwo(a, b, prop) {
	let c = [];
  for(var i = 0; i < a.length; i++) {
    for(var j = 0; j < b.length; j++){
      if(a[i][prop]===b[j][prop]) {
        c.push(a[i]);
      }
    }
  }
  return c;
}


ReactDOM.render(
	<div>
		<FriendsGamesList/>
	</div>,
	document.getElementById('root')
);