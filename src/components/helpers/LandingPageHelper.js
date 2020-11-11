import React from 'react';

import {withSteamID} from '../services/SteamID';
import {isNumeric} from '../utilities/generic_utils'

class LandingPageHelper extends React.Component {
  constructor(props){
    super();
    this.state = {text: '', myid: ''};
  }

  onInput(targValue){
    this.setState({text: targValue});
  }

  async onClick(e){
    let output = await this.props.steamid.handleVanity(this.state.text);
    this.setState({myid: output});
  }

  render(){
    let stillLooking = <div>
      <input value={this.state.text} placeholder = "Enter your Vanity ID" onChange={e => this.onInput(e.target.value)}/>
      <button onClick = {e => this.onClick(e)}>Submit me!</button>
      {this.state.myid}
    </div>;

    return(
      <div>
        {isNumeric(this.state.myid) ? "" : stillLooking}
      </div>
    )
  }
}

export default withSteamID(LandingPageHelper);