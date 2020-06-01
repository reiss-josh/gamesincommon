const getFrnBtn = document.getElementById("get-friend-button");
const getGameBtn = document.getElementById("get-game-button");
const friendList = document.getElementById("friend-list");
const friendsChose = document.getElementById("friends-chose");
const idText = document.getElementById("steamid");
const imgZone = document.getElementById("image-list");

var steamUrl = "https://api.steampowered.com/";
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var steamUser = "ISteamUser/";
var playerSvc = "IPlayerService/";
var summaryUrl = "GetPlayerSummaries/v2/";
var friendUrl = "GetFriendList/v1/";
var gamesUrl = "GetOwnedGames/v1/";
var iconUrl = "https://steamcdn-a.akamaihd.net/steam/apps/";
var steamStoreUrl = "https://store.steampowered.com/app/";
var idsList = [];
var chosenIDs = "";
var chosenIDsArr = [];
//var steamID = ""
//var apiKey = ""
idText.value = steamID;

var baseUrl = proxyUrl + steamUrl; //baseUrl stores https://cors-anywhere.../https://api.steampowered.../
var basefriendsUrl = baseUrl + steamUser + friendUrl  + "?key=" + apiKey + "&steamid="; //friendsurl sets up for any requests to GetFriendList
var basesummaryUrl = baseUrl + steamUser + summaryUrl + "?key=" + apiKey + "&steamids="; //summaryurl sets up for GetPlayerSummaries
var basegamesUrl   = baseUrl + playerSvc + gamesUrl   + "?key=" + apiKey + "&include_appinfo=true&include_player_free_games=true&steamid=";  

//return promise object for a given HTML request (eg GET http://foo.com)
const sendHttpRequest = (method, url) => {
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

//returns response for GET url
const getData = (url) => { //call this with "await getData(url)"
  var dataGet = sendHttpRequest('GET', url);
  return dataGet.then(responseData => {
    return responseData;
  });
};

//add an ID to the list of selected IDs
const addID = (ind) => {
  console.log(idsList[ind] + " was added");
  chosenIDs += '<li>'+idsList[ind]+'</li>';
  chosenIDsArr.push(idsList[ind]);
  friendsChose.innerHTML = chosenIDs;
}

//get the list of friends
const getFriends = async() => {
  //retrieve steamID
  steamID = idText.value;
  //reset chosen user list
  chosenIDs = "";
  chosenIDsArr = [];
  friendsChose.innerHTML = chosenIDs;

  //generate initial request Url
  var friendsUrl = basefriendsUrl + steamID;
  //get friends information
  var friendsData = await getData(friendsUrl); //friendsData contains friend response
  var fl = friendsData.friendslist.friends;
  //store comma-delimited string of player ids in playerIDs
  var playerIDs = fl[0].steamid;
  for(var i = 1; i < fl.length; i++){
    playerIDs += "," + fl[i].steamid;
  };

  //generate player summaries url
  var idUrl = basesummaryUrl + playerIDs;
  //get player summaries
  var idsData = await getData(idUrl); //idsData contains summary response
  var idl = idsData.response.players;
  //output string of player names; store in playerNames
  var playerNames = "";
  //SORT idl ALPHABETICALLY BY idl.personaname HERE
  idl = idl.sort((a, b) => (a.personaname.toLowerCase() > b.personaname.toLowerCase()) ? 1 : -1);
  //output friend names to html list
  for(var i = 0; i < idl.length; i++){
    idsList.push(idl[i].steamid);
    playerNames += '<li><button onclick = addID(' + i + ')>' + idl[i].personaname + '</button></li>';
  };
  friendList.innerHTML = playerNames;
}

//get the games in common between the selected players
const getGames = async() => {
  var gamesInCommon = [];
  var gamesData = await getData(basegamesUrl + steamID);
  var myGames = gamesData.response.games;
  gamesInCommon = myGames;

  var currGames = [];
  for(var i = 0; i < chosenIDsArr.length; i++) {
    gamesData = await getData(basegamesUrl + chosenIDsArr[i]);
    currGames = gamesData.response.games;
    gamesInCommon = innerJoin(gamesInCommon, currGames);
  }
  //SORT idl ALPHABETICALLY BY idl.personaname HERE
  gamesInCommon = gamesInCommon.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  //console.log(gamesInCommon);
  getGameImgs(gamesInCommon);
}

//takes a url, a caption, and a link, then returns the html for displaying the resulting element
const imgText = (url, caption, linkTo) => {
  return (
    "<li>" +
    "<a href=\"" + linkTo + "\">" +
    "<img src=\""+url+ "\"alt=\"alternate text\" width=\"200\" height=\"100\"/>" +
    caption +
    "</a></li>"
    );
}

//takes a list of game objects and gets their header.jpg from the steam store
const getGameImgs = async(gamesList) => {
  var generatedHTML = "";
  for(var i = 0; i < gamesList.length; i++) {
    generatedHTML += imgText(iconUrl + gamesList[i].appid + "/header.jpg",
                             gamesList[i].name,
                             steamStoreUrl + gamesList[i].appid);
  }
  imgZone.innerHTML = generatedHTML;
}

const innerJoin = (array1, array2) => {
  var newArray = [];
  for(var i = 0; i < array1.length; i++) {
    for(var j = 0; j < array2.length; j++){
      if(array1[i].appid == array2[j].appid) {
        newArray.push(array1[i]);
      }
    }
  }
  return newArray;
}

getFrnBtn.addEventListener('click', getFriends);
getGameBtn.addEventListener('click', getGames);