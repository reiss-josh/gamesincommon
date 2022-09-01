import {getRequest} from '../utilities/http_utils.js';
import {innerJoinObjectsMany, isNumeric} from '../utilities/generic_utils.js';

//take array of games, extract their appIDs
export function assembleIDsArray(newGamesArr){
  let outArr = [];
  newGamesArr.forEach(element => outArr.push(element.appid));
  return outArr;
}

//take list of categories, return relevant boolean flags
export function determineCategoryFlags(newCategories){
  let isMultiplayer = false;
  let isOnlineMultiplayer = false;
  let isLocalMultiplayer = false;
  let isSupportGamepad = false;
	let isVirtualReality = false;
	//1 = Multiplayer
	//9 = Co-op
	//18 = Partial Controller
	//28 = Full Controller
	//27 = Cross-Platform Multiplayer
	//36 = Online PVP
	//38 = Online Co-op
	//24 = Shared/Split Screen
	//37 = Shared/Split Screen PVP
	//39 = Shared/Split Screen Co-op
	//49 = PVP
  for (let i = 0; i < newCategories.length; i++){
    if(newCategories[i].id === 1 || newCategories[i].id === 9 || newCategories[i].id === 49) isMultiplayer = true;
    if(newCategories[i].id === 36 || newCategories[i].id === 38 || newCategories[i].id === 27) {isMultiplayer = true; isOnlineMultiplayer = true;}
    if(newCategories[i].id === 24 || newCategories[i].id === 37 || newCategories[i].id === 39) {isMultiplayer = true; isLocalMultiplayer = true;}
    if(newCategories[i].id === 18 || newCategories[i].id === 28) {isSupportGamepad = true;}
    if(isMultiplayer && isOnlineMultiplayer && isLocalMultiplayer && isSupportGamepad) i = 100;
		//need to check for VR here
	}
  return JSON.parse(
    '{ "isMultiplayer": '+ isMultiplayer + ',' +
    '"isOnlineMultiplayer": '+ isOnlineMultiplayer + ',' +
    '"isLocalMultiplayer": '+ isLocalMultiplayer + ',' +
    '"isSupportGamepad": '+ isSupportGamepad + ',' + 
		'"isVirtualReality": '+ isVirtualReality + '}'
  );
}

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
	if(response.response.games){
		return response.response.games;
	}
	return [];
}

//returns an array of game libraries given an arrayof player objects
export const getSteamGamesMultiple = async(playerObjs, apiKey, proxy) => {
	let userIDs = playerObjs.map(a => a.steamid);
	let allLibraries = [];
	for(let i = 0; i < userIDs.length; i++)
	{
		let gms = await getSteamGames(userIDs[i], apiKey, proxy);
		allLibraries.push({steamid: userIDs[i], gameLibrary: gms});
	}
	return allLibraries;
}

//gets categories list for a given game
export const getSteamGameCategories = async(appID, apiKey, proxy = "") => {
	const baseUrl = "https://store.steampowered.com/api/appdetails?filters=categories&appids=";
	console.log("Getting game categories for " + appID + "...");
	let response = await getRequest(proxy + baseUrl + appID);
	if (response[appID].success){
		return response[appID].data.categories;
	}
}

//returns the inner join of multiple game libraries, given an array of player objects
export function getGamesInCommon(userObjects) {
	let libraries = userObjects.map(u => u.gameLibrary);
	return innerJoinObjectsMany(libraries, 'appid');
}

export const getIDfromVanity = async(userVanityUrlName, apiKey, proxy = "") => {
	const baseURL = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/";
	let response = await getRequest(proxy + baseURL + "?key=" + apiKey + "&vanityurl=" + userVanityUrlName)
	//if user does not have a vanity id
	if(response.response.success === 42 && isNumeric(userVanityUrlName)){
		response.response.steamid = userVanityUrlName;
		response.response.success = 1;
	};
	return response.response;
}