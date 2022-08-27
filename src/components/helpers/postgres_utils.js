import {getRequest} from '../utilities/http_utils.js';
import {postRequest} from '../utilities/http_utils.js';

const env = {
  proxyUrl: process.env.REACT_APP_PROXY_URL,
  dbURL: process.env.REACT_APP_DB_URL
};


// curl 'https://sci-karate-cors.herokuapp.com/https://gamesincommondb.up.railway.app/games/(4000,620,250320,417860,34270,205230,205950)/' -H "X-Requested-With: XMLHttpRequest" -H "Accept: application/json"

//takes array of appids as integers, gets documents
export const getMultipleGamesPostgres = async (gamesList) => {
  const gamesArray = [];
  const idsArray = [];
  const appIDsString = '/(' + gamesList.join(",",) + ')/';
  
  console.log("About to pull from postgres once.")
  console.log(appIDsString);
  console.log(env.proxyUrl+env.REACT_APP_DB_URL+appIDsString)
  let prom = await getRequest(env.proxyUrl+env.REACT_APP_DB_URL+appIDsString)
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

//need to add line that converts "Garry's" to "Garry'\''s"
const jsonify = (game) => {
  let gamejson = {
    "appID":game.appid,
    "name":game.name,
    "isLocalMultiplayer":game.flags['isLocalMultiplayer'],
    "isMultiplayer":game.flags['isMultiplayer'],
    "isOnlineMultiplayer":game.flags['isOnlineMultiplayer'],
    "isSupportGamepad":game.flags['isSupportGamepad'],
    "isVirtualReality":game.flags['isVirtualReality'],
  }
  return JSON.stringify(gamejson);
}

export const setMultipleGamesPostgres = async (gamesList) => {
  console.log(gamesList);
  console.log("Updating PostgresDB");
  for(let i = 0; i < gamesList.length; i++){
    let game = gamesList[i];
    let jgame = jsonify(game);
    await postRequest(env.proxyUrl+env.REACT_APP_DB_URL, jgame);
  }
}