import React from 'react';

import {withSteamID} from '../helpers/SteamID';

class LandingPageHelper extends React.Component{
  constructor(props){
    super();
  }
  render(){
    this.props.steamid.steamid = "76561198119551697";
    return(<div>{this.props.steamid.steamid}</div>);
  }
}

export default withSteamID(LandingPageHelper);