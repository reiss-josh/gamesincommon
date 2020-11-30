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
        {this.state.myid}
        <div>
          <input value={this.state.text} placeholder = "Enter your Vanity ID" onChange={e => this.onInput(e.target.value)}/>
          <button onClick = {e => this.onClick(e)}>Submit me!</button>
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