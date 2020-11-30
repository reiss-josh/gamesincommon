import React from 'react';

import {withSteamID} from '../services/SteamID';
import {isNumeric} from '../utilities/generic_utils'



class LandingPageHelper extends React.Component {
  constructor(props){
    super();
    this.state = {text: '', myid: '', submitted: false};
  }

  onInput(targValue){
    this.setState({text: targValue});
  }

  async onClick(e){
    this.setState({submitted: true});
    let output = await this.props.steamid.handleVanity(this.state.text);
    this.setState({myid: output});
    if(!isNumeric(output)) this.setState({submitted:false});
    this.props.handler(output);
  }

  
  render(){
    return(
      <div>
        <span style = {{color:"#d36f6f"}}>{this.state.myid}</span>
        <div>
          <input value={this.state.text} placeholder = "Vanity URL or Steam ID" onChange={e => this.onInput(e.target.value)}/>
          <button onClick = {e => this.onClick(e)}>SUBMIT</button>
        </div>
        <img
          alt="example of a steam vanity url"
          src={"https://raw.githubusercontent.com/reiss-josh/gamesincommon/master/src/img/vanityExample.png"}
        />
        <img
          alt="example of a steam id url"
          src={"https://raw.githubusercontent.com/reiss-josh/gamesincommon/master/src/img/steamidExample.png"}
        />
      </div>
    )
  }
}

export default withSteamID(LandingPageHelper);