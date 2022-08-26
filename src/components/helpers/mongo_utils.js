import {getRequest} from '../utilities/http_utils.js';
import {postRequest} from '../utilities/http_utils.js';

const env = {
  proxyUrl: process.env.REACT_APP_PROXY_URL,
  dbURL: process.env.REACT_APP_DB_URL
};


//takes array of appids as integers, gets documents
export const getMultipleGamesMongo = async (gamesList) => {
  const gamesArray = [];
  const idsArray = [];
  
  console.log("About to pull from mongo once.")
  let prom = await getRequest(env.proxyUrl+env.dbURL)

  //currently mongo is returning entire database... maybe okay???
  let flagData = []
  for(let i=0; i < prom.length; i++){
    if(1==1){ //if appid in range
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
  }
  return [gamesArray, idsArray];
}

const jsonify = (game) => {
  let gamejson = {
    "appid":game.appid,
    "name":game.name,
    "isLocalMultiplayer":game.flags['isLocalMultiplayer'],
    "isMultiplayer":game.flags['isMultiplayer'],
    "isOnlineMultiplayer":game.flags['isOnlineMultiplayer'],
    "isSupportGamepad":game.flags['isSupportGamepad'],
    "isVirtualReality":game.flags['isVirtualReality'],
  }
  return JSON.stringify(gamejson);
}

export const setMultipleGamesMongo = async (gamesList) => {
  console.log("Updating MongoDB");
  for(let i = 0; i < gamesList.length; i++){
    let game = gamesList[i];
    let jgame = jsonify(game);
    let prom = await postRequest(env.proxyUrl+env.dbURL, jgame);
    console.log(prom);
  }
}

