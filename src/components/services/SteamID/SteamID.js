import {handleGamesList, handleFriendsList, handleVanityUrl} from '../../helpers/steamAPI_handlers.js';

const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_USER,
  proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL,
  steamid: '',
};

class SteamID {
  constructor() {
    this.apiKey = config.apiKey;
    this.proxyUrl = config.proxyUrl;
    this.steamid = config.steamid;
    this.vanityUrl = config.vanityUrl;
  }

  updateSteamID(newID){
    this.steamid = newID;
  }

  updateVanityUrl(newVanity){
    this.vanityUrl = newVanity;
  }

  getSteamID(){
    return this.steamid;
  }

  getProxyUrl(){
    return this.proxyUrl;
  }

  getApiKey(){
    return this.apiKey;
  }

  async handleFriends(){
    return await handleFriendsList(this.steamid, this.apiKey, this.proxyUrl);
  }

  async handleGames(fList, selFriends){
    return await handleGamesList(fList, selFriends, this.apiKey, this.proxyUrl);
  }

  async handleVanity(vanityUrl){
    if(vanityUrl === "") return "Error 0: Empty Vanity";
    let handled = await handleVanityUrl(vanityUrl, this.apiKey, this.proxyUrl)
    try{
      if(handled.success === 1) {this.steamid = handled.steamid; return handled.steamid;}
      else return "Error " + handled.success + ": " + handled.message;
    }
    catch(err) {return "Unexpected Error: "+err}
  }

}
export default SteamID;