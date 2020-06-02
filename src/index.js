import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//redirect here from login page.
//somehow retrieve steamid from the login ???
var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
var STEAM_ID_USER = "76561198041117535";
var API_KEY_USER = "E1D16427E370EA735611B2EF484399A4";
var SELECTED_IDS = [];

//component for showing friends
class FriendsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			steamid: null,
			friends: [],
			selectedFriends: [],
		};
	}

	async componentDidMount() {
		const friendsResult = await getSteamFriends(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
		let idArray = friendsResult.map(a => a.steamid);
		const summariesResult = await getPlayerSummaries(idArray, API_KEY_USER, PROXY_URL);
		let merged = friendsResult.map((item,i) => Object.assign({}, item, summariesResult[i]));
		this.setState({friends: merged});
	}

	render() {
		let currComponent = this; //cache reference for the "setState" in here
		return (
			<div>
				<ul>
					{this.state.friends
						.sort((a,b) => (a.personaname.toLowerCase() > b.personaname.toLowerCase()) ? 1 : -1)
						.map((person, index) => (
						<li key = {person.steamid}>
							<button onClick = {function() {
									SELECTED_IDS.push(person.steamid); //i'm so sorry this is a global var
									currComponent.setState({selectedFriends: SELECTED_IDS})
								}}>
								username is {person.personaname}
							</button>
						</li>
					))}
				</ul>
				<ul>
					{this.state.selectedFriends
						.map((person,index) => (
						<li key = {person}>
							{person}
						</li>
					))}
				</ul>
			</div>
		);
	}
}

//component for showing games
class GamesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games: []
		};
	}

	async componentDidMount() {
		const gamesOwnedByUser = await getSteamGames(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
		let currIDS = SELECTED_IDS.slice();
		currIDS.push(STEAM_ID_USER);
		let allLibraries = await getSteamGamesMultiple(currIDS);
		let gamesInCommon = getGamesInCommon(allLibraries);
		this.setState({games: gamesInCommon});
		SELECTED_IDS = [];
	}

	render() {
		//console.log(this.state.games);
		let currComponent = this;
		return (
			<div>
				<button onClick = {function() {
							currComponent.componentDidMount();
							console.log("Refreshing...");
						}}>
							game is blah
						</button>
			<ul>
				{this.state.games
				.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
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
		);
	}
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

//returns friend objects given a steamid
const getSteamFriends = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetFriendList/v1/";
	let response = await getRequest(proxy + baseUrl + "?key="+ apiKey + "&steamid=" + userID);
	return response.friendslist.friends;
}

//returns array of player summaries given an array of steamIDs
const getPlayerSummaries = async(userIDs, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
	let userIDsString;
	userIDs.map((id) => userIDsString += "," + id);
	userIDsString = userIDsString.substr(1);
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamids=" + userIDsString);
	return response.response.players;
}

//retuns array of owned game objects given a steamID
const getSteamGames = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamid=" + userID
																	+ "&include_appinfo=true&include_player_free_games=true");
	return response.response.games;
}

//returns array of games in common given array of steamids
const getSteamGamesMultiple = async(userIDs) => {
	let allLibraries = [];
	for(let i = 0; i < userIDs.length; i++)
	{
		let gms = await getSteamGames(userIDs[i], API_KEY_USER, PROXY_URL);
		allLibraries.push(gms);
	}
	return allLibraries;	
}

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
		<FriendsList/>
		<GamesList/>
	</div>,
	document.getElementById('root')
);