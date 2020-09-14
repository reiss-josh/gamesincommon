import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//redirect here from login page.
//somehow retrieve steamid from the login ???
var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
var STEAM_ID_USER = "INSERT YOUR STEAM ID HERE!";
//var STEAM_ID_USER = "";
var API_KEY_USER = "INSERT YOUR API KEY HERE!";

class FriendsGamesList extends React.Component {
	constructor(props) {
		super(props);
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
		let friendButtons, selectedFriendsList, gamesButtons;

		//friend list JSX
		if(this.state.friends && this.state.friends.length > 0){
			friendButtons =
			<ul>
				{makeSelectorButton(this.state.friends, 'personaname', currComponent)}
			</ul>
		} else {
			friendButtons = <div>do you not have any friends??</div>
		}

		//selected friends JSX
		if(this.state.selectedFriends && this.state.selectedFriends.length > 0)
		{
			selectedFriendsList =
			<ul>{
				makeSelectorButton(this.state.selectedFriends, 'personaname', currComponent)
			}</ul>
		} else {
			selectedFriendsList = <div>you need to select some friends!!</div>
		}

		//games list JSX
		if(this.state.games && this.state.games.length > 0){
			gamesButtons =
			<ul> {
				alphabetizeObjects(this.state.games, 'name')
				.map((game, index) => (
					makeGameButton(game)
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
						<div className = "games-and-selected">
							<div className = "selected-friends">
								
							</div>
							<div className = "games-column">
								<div className = "games-scroll">
									{gamesButtons}
								</div>
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
}//

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
	if(response != null){
		return response.friendslist.friends;
	} else {
		return [];
	}
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

//returns an array of game libraries given an arrayof player objects
const getSteamGamesMultiple = async(playerObjs) => {
	let userIDs = playerObjs.map(a => a.steamid);
	let allLibraries = [];
	for(let i = 0; i < userIDs.length; i++)
	{
		let gms = await getSteamGames(userIDs[i], API_KEY_USER, PROXY_URL);
		allLibraries.push({steamid: userIDs[i], gameLibrary: gms});
	}
	return allLibraries;	
}

//returns the inner join of multiple game libraries, given an array of player objects
function getGamesInCommon(userObjects) {
	let libraries = userObjects.map(u => u.gameLibrary);
	return innerJoinObjectsMany(libraries, 'appid');
}

function makeGameButton(game) {
	if(game.img_logo_url !== ""){
		return (
			<li key = {game.appid}>
				<button className = 'game-button' onClick = {function() {
					console.log(game);
					console.log(game.img_logo_url);
					window.open("https://store.steampowered.com/app/"+game.appid);
				}}>
					<img
						alt = {game.name}
						src = {"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"}
					>
					</img>
					{//game.name}
					}
				</button>
			</li>
		)
	}
}

function makeSelectorButton (listObjs, alphaParam, currComponent) {
	return (
		alphabetizeObjects(listObjs, alphaParam)
		.map((person, index) => (
			<li key = {person['steamid']}>
				<button className = 'friend-button' onClick = {
						function() {
							let ind = currComponent.state.selectedFriends.indexOf(person);
							let newSelected;
							if(ind > -1) {
						newSelected = currComponent.state.selectedFriends;
						newSelected.splice(ind, 1);
							} else {
						newSelected = currComponent.state.selectedFriends;
						newSelected.push(person);
							}
								console.log("added/removed " + person.personaname);
								currComponent.setState({selectedFriends: newSelected});
								currComponent.handleGamesList();
								console.log("Refreshing...");
							}
						}>
					<img src={person.avatar} alt = {person.personaname}></img>
					<span>{person.personaname}</span>
				</button>
			</li>
		))
	)
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

/*
	"arrSrc" is the array we're looking at to determine what entries are missing etnries
	"arrNew" is the array of entries that we're checking in on
	"propCheck" is the property we're checking for missingness
	"propIdentify" is used to identify entries in arrSrc compared with arrNew
	returns [missingEntries],[foundEntries]
*/
function sepMissingParams(arrSrc, arrNew, propCheck, propIdentify){
	let arrMissing = [];
	let arrFound = [];
	let foundObj;
	arrNew.forEach(function (elt) {
		foundObj = arrSrc.find(fnd => fnd[propIdentify] === elt[propIdentify]);
		if(foundObj[propCheck] === null){
			arrMissing.push(foundObj);
		}
		else{
			arrFound.push(foundObj);
		}
	});
	return {missing: arrMissing, found: arrFound};
}

/*
	"arrNeedsFilling" is the source array, which has entries for which some property is null
	"arrCanFill" is some array with key,value entries, s.t. these pairs can be used to "repair" the source array
		--note: "arrCanFill" can have more properties than just these keys or values.
	"propFill" is the value in these k,v pairs
	"propIdentify" is the key in these k,v pairs
*/
function joinMissingParams(arrNeedsFilling, arrCanFill, propFill, propIdentify){
	let foundObj;
	arrNeedsFilling = arrNeedsFilling.slice(); //should ensure shallow copy?
	for(let i = 0; i < arrCanFill.length; i++) {
		foundObj = arrNeedsFilling.find(fnd => fnd[propIdentify] === arrCanFill[i][propIdentify]);
		foundObj[propFill] = arrCanFill[i][propFill];
	};
	return arrNeedsFilling;
}

//alphabetizes an array of objects by some property
function alphabetizeObjects(arr, prop) {
	return arr.sort((a,b) => (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : -1);
}


ReactDOM.render(
	<div>
		<FriendsGamesList/>
	</div>,
	document.getElementById('root')
);
