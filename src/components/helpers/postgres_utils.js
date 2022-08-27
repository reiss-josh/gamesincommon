import {getRequest} from '../utilities/http_utils.js';
import {postRequest} from '../utilities/http_utils.js';

const env = {
  proxyUrl: process.env.REACT_APP_PROXY_URL,
  dbURL: process.env.REACT_APP_DB_URL
  //dbURL: 'http://localhost:3333/games'
};

//takes array of appids as integers, gets documents
export const getMultipleGamesPostgres = async (gamesList) => {
  const gamesArray = [];
  const idsArray = [];
  const appIDsString = '/(' + gamesList.join(",",) + ')/';

  console.log("About to pull from postgres once.")
  const pulledData = await getRequest(env.dbURL+appIDsString)
  //console.log(appIDsString);
  //console.log(env.dbURL+appIDsString)
  
  //assemble the flagdata string
  for(var i in pulledData){
    pulledData[i].fieldsString = JSON.parse('{"isMultiplayer": '+ pulledData[i]['ismultiplayer'] +',' +
      '"isOnlineMultiplayer": '+ pulledData[i]['isonlinemultiplayer'] +',' +
      '"isLocalMultiplayer": '+ pulledData[i]['islocalmultiplayer'] +',' +
      '"isSupportGamepad": '+ pulledData[i]['issupportgamepad'] + ',' +
      '"isVirtualReality": '+ pulledData[i]['isvirtualreality']
      +'}'
    );
    gamesArray.push(pulledData[i]);
    idsArray.push(pulledData[i]['appid']);
  }
  return [gamesArray, idsArray];
}

//take a game's flag list and turn it into individual variables
const jsonifyGames = (gamesList) => {
  const gamejsons = []
  for(var i in gamesList){
    gamesList[i].name = gamesList[i].name.replace('\'',''); //converts "Garry's" to "Garrys"
    gamejsons.push({
      "appID":gamesList[i].appid,
      "name":gamesList[i].name,
      "isLocalMultiplayer":gamesList[i].flags['isLocalMultiplayer'],
      "isMultiplayer":gamesList[i].flags['isMultiplayer'],
      "isOnlineMultiplayer":gamesList[i].flags['isOnlineMultiplayer'],
      "isSupportGamepad":gamesList[i].flags['isSupportGamepad'],
      "isVirtualReality":gamesList[i].flags['isVirtualReality'],
    })
  }
  const games = {"games":gamejsons}
  return JSON.stringify(games);
}

export const setMultipleGamesPostgres = async (gamesList) => {
  //console.log(gamesList);
  console.log("Updating PostgresDB...");
  let jgame = jsonifyGames(gamesList);
  //console.log(jgame);
  console.log(await postRequest(env.dbURL, jgame));
}

//export const updateMultipleGamesPostgres = async (gamesList) => {}