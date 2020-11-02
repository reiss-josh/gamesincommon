import {getRequest} from '../utilities/http_utils.js';
import {innerJoinObjectsMany} from '../utilities/generic_utils.js';
import {API_KEY_USER, PROXY_URL} from '../jsenv.js';

//returns an array of friend objects given a steamid
export const getSteamFriends = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetFriendList/v1/";
	let response = await getRequest(proxy + baseUrl + "?key="+ apiKey + "&steamid=" + userID);
	if(response != null){
		return response.friendslist.friends;
	} else {
		return [];
	}
}

//returns an array of player summaries given an array of steamIDs
export const getPlayerSummaries = async(userIDs, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
	let userIDsString;
	userIDs.map((id) => userIDsString += "," + id);
	userIDsString = userIDsString.substr(1);
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamids=" + userIDsString);
	return response.response.players;
}

//retuns game library (an array of game objects) given a steamID
export const getSteamGames = async (userID, apiKey, proxy = "") => {
	const baseUrl = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
	let response = await getRequest(proxy + baseUrl + "?key=" + apiKey + "&steamid=" + userID
																	+ "&include_appinfo=true&include_player_free_games=true");
	return response.response.games;
}

//returns an array of game libraries given an arrayof player objects
export const getSteamGamesMultiple = async(playerObjs) => {
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
export function getGamesInCommon(userObjects) {
	let libraries = userObjects.map(u => u.gameLibrary);
	return innerJoinObjectsMany(libraries, 'appid');
}
