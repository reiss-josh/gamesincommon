import {sepMissingParams, joinMissingParams} from '../utilities/generic_utils.js';
import {getSteamFriends, getPlayerSummaries,
        getSteamGamesMultiple, getGamesInCommon,
        getIDfromVanity,
        getSteamGameCategories} from './steamAPI_utils.js';

function determineCategoryFlags(newCategories){
  let isMultiplayer = false;
  let isOnlineMultiplayer = false;
  let isLocalMultiplayer = false;
  let isSupportGamepad = false;
  for (let i = 0; i < newCategories.length; i++){
    if(newCategories[i].id === 1 || newCategories[i].id === 9 || newCategories[i].id === 49) isMultiplayer = true;
    if(newCategories[i].id === 36 || newCategories[i].id === 38) {isMultiplayer = true; isOnlineMultiplayer = true;}
    if(newCategories[i].id === 24 || newCategories[i].id === 37 || newCategories[i].id === 47) {isMultiplayer = true; isLocalMultiplayer = true;}
    if(newCategories[i].id === 18 || newCategories[i].id === 28) {isSupportGamepad = true;}
    if(isMultiplayer && isOnlineMultiplayer && isLocalMultiplayer && isSupportGamepad) i = 100;
  }
  return JSON.parse(
    '{ "isMultiplayer": '+ isMultiplayer + ',' +
    '"isOnlineMultiplayer": '+ isOnlineMultiplayer + ',' +
    '"isLocalMultiplayer": '+ isLocalMultiplayer + ',' +
    '"isSupportgamepad": '+ isSupportGamepad + ' }'
  );
}

//todo: make this less of a horrible mess
export async function handleGamesList(currFrns, currSelected, API_KEY_USER, PROXY_URL) {
  console.log("handling games list...");

  //determine what data has/hasn't been memoized; retrieve it
  let missFound = sepMissingParams(currFrns, currSelected, 'gameLibrary', 'steamid');

  //look up the missing data
  let allLibraries = [];
  if(missFound.missing.length > 0){ //if there's anything missing...
    let missingLibraries = await getSteamGamesMultiple(missFound.missing, API_KEY_USER, PROXY_URL);
    let newGames = missingLibraries[0].gameLibrary;
    for(let i = 0; i < newGames.length; i++){
      let newCategories = await getSteamGameCategories(newGames[i].appid, API_KEY_USER, PROXY_URL);
      if(newCategories){
        newGames[i].flags = determineCategoryFlags(newCategories);
      }
      else{
        newCategories = JSON.parse("[{}]");
        newGames[i].flags = JSON.parse('{"isMultiplayer": '+ false +',' +
        '"isOnlineMultiplayer": '+ false +',' +
        '"isLocalMultiplayer": '+ false +',' +
        '"isSupportgamepad": '+ false +'}');
      }
      newGames[i].categories = newCategories;
    }
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

export async function handleVanityUrl(vanityUrl, API_KEY_USER, PROXY_URL){
  console.log("handling vanity url...");
  return await getIDfromVanity(vanityUrl, API_KEY_USER, PROXY_URL);
}