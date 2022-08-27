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
  //console.log(appIDsString);
  console.log(env.dbURL+appIDsString)
  let prom = await getRequest(env.dbURL+appIDsString)
  console.log(prom);
  if(!prom) prom = [];

  let flagData = []
  for(let i=0; i < prom.length; i++){
    flagData = JSON.parse('{"isMultiplayer": '+ prom[i]['isMultiplayer'] +',' +
      '"isOnlineMultiplayer": '+ prom[i]['isOnlineMultiplayer'] +',' +
      '"isLocalMultiplayer": '+ prom[i]['isLocalMultiplayer'] +',' +
      '"isSupportGamepad": '+ prom[i]['isSupportGamepad']
      +'}'
    );
    prom[i].fieldsString = flagData;
    gamesArray.push(prom[i]);
    idsArray.push(prom[i]['appid']);
  }
  return [gamesArray, idsArray];
}

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
  console.log(gamesList);
  console.log("Updating PostgresDB...");
  let jgame = jsonifyGames(gamesList);
  //console.log(jgame);
  console.log(await postRequest(env.dbURL, jgame));
}

//export const updateMultipleGamesPostgres = async (gamesList) => {}