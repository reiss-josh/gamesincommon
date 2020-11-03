const config = {
  apiKey: process.env.REACT_APP_API_KEY_USER,
  proxyUrl: process.env.REACT_APP_PROXY_URL,
  //steamid: process.env.REACT_APP_STEAM_ID_USER,
  steamid: '',
};

class SteamID {
  constructor() {
    this.apiKey = config.apiKey;
    this.proxyUrl = config.proxyUrl;
    this.steamid = config.steamid;
  }

  testMethod(beep){
    console.log(beep);
  }

} 
export default SteamID;