import {sepMissingParams, joinMissingParams} from '../utilities/generic_utils.js';
import {getSteamFriends, getPlayerSummaries,
        getSteamGamesMultiple, getGamesInCommon} from './steamAPI_utils.js';

//todo: make this less of a horrible mess
export async function handleGamesList(currFrns, currSelected, API_KEY_USER, PROXY_URL) {
  console.log("handling games list...");

  //determine what data has/hasn't been memoized; retrieve it
  let missFound = sepMissingParams(currFrns, currSelected, 'gameLibrary', 'steamid');
  console.log(missFound);

  //look up the missing data
  let allLibraries = [];
  if(missFound.missing.length > 0){ //if there's anything missing...
    let missingLibraries = await getSteamGamesMultiple(missFound.missing, API_KEY_USER, PROXY_URL);
    allLibraries = allLibraries.concat(missingLibraries);
  };
  
  //memoize the missing data, now that we've grabbed it
  if(allLibraries.length > 0){ //if we found something above...
    joinMissingParams(missFound.missing, allLibraries, 'gameLibrary', 'steamid');
  };

  //make sure that we actually use the memoized data
  allLibraries = allLibraries.concat(missFound.found);

  //get gamesInCommon, now that we have all our data
  let gamesInCommon = getGamesInCommon(allLibraries);
  return gamesInCommon;
}

export async function handleFriendsList (STEAM_ID_USER, API_KEY_USER, PROXY_URL){
  console.log("handling friends list...");
  //get friends
  let friendsResult = await getSteamFriends(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
  const loginObject = {steamid: STEAM_ID_USER, realtionship: "self", friend_since: 0}; //add logged in user to list
  friendsResult.push(loginObject);
  //get summaries
  let idArray = friendsResult.map(a => a.steamid);
  let newFriendsList = await getPlayerSummaries(idArray, API_KEY_USER, PROXY_URL);
  //clean up
  newFriendsList.forEach(function (a) {
    a.gameLibrary = null;
  });
  
  //get the object of the currently-logged-in user
  let loggedInUserObject = [newFriendsList.filter(obj => {return obj.steamid === STEAM_ID_USER})[0]];

  return {
    newFriendsList,
    loggedInUserObject
  };
}