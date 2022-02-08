import {sepMissingParams, joinMissingParams} from '../utilities/generic_utils.js';
import {getSteamFriends, getPlayerSummaries,
        getSteamGamesMultiple, getGamesInCommon,
        getIDfromVanity, getSteamGameCategories,
        determineCategoryFlags, assembleIDsArray} from './steamAPI_utils.js';
import {getMultipleGamesFirebase, setMultipleGamesFirebase} from './firebase_utils';

//todo: make this less of a horrible mess
export async function handleGamesList(currFrns, currSelected, API_KEY_USER, PROXY_URL) {
  console.log("handling games list...");

  //determine what data has/hasn't been memoized; retrieve it
  let missFound = sepMissingParams(currFrns, currSelected, 'gameLibrary', 'steamid');

  //look up the missing data
  let allLibraries = [];
  if(missFound.missing.length > 0){ //if there's anything missing...
    //get all libraries that we need to query still
    let missingLibraries = await getSteamGamesMultiple(missFound.missing, API_KEY_USER, PROXY_URL);
    //then, check what games are in there. (THIS LINE MIGHT BE WRONG)
    let newGames = missingLibraries[0].gameLibrary; //new games from library
    //then, get the appids of these new games.
    let newAppIDs = assembleIDsArray(newGames); //new app ids
    //query the firebase data for those appids.
    let [pulledFirebaseData, pulledFirebaseIDs] = await getMultipleGamesFirebase(newAppIDs); //new data pulled from firebase

    let steamBlock = 0;
    const CAP = 100;

    const toBePushed = [];
    //go through games list.
    for(let i = 0; i < newGames.length && steamBlock < CAP; i++){
      let flagData = [];
      //if the game's appid was in the pulled firebase ids, just pull it
      if(pulledFirebaseIDs.includes(newGames[i].appid)){
        flagData = (pulledFirebaseData[pulledFirebaseIDs.indexOf(newGames[i].appid)].fieldsString);
      } else {
        //otherwise, try to get it from steam.
        let newCategories = await getSteamGameCategories(newGames[i].appid, API_KEY_USER, PROXY_URL);
        steamBlock++;
        if(newCategories){
          flagData = determineCategoryFlags(newCategories);
        } else {
          flagData = JSON.parse('{"isMultiplayer": '+ false +',' +
          '"isOnlineMultiplayer": '+ false +',' +
          '"isLocalMultiplayer": '+ false +',' +
          '"isSupportgamepad": '+ false +'}');
        }
        //then, get ready to push it to firebase.
        toBePushed.push(newGames[i]);
      }
      //finally, store the flags in the game's object.
      newGames[i].flags = flagData;

      if(i === newGames.length) {console.log("All games successfully pulled.")}
      else if (steamBlock === CAP) {console.log("Aborting to avoid hitting steam API quota.")};
    }
    //now, upload whatever we need to firebase.
    if(toBePushed && toBePushed.length > 0){await setMultipleGamesFirebase(toBePushed);}
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