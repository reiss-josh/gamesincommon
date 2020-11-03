import React from 'react';

import {withSteamID} from '../services/SteamID';

class LandingPageHelper extends React.Component {
  constructor(props){
    super();
    this.state = {text: ''};
  }

  onInput(targValue){
    this.setState({text: targValue});
    this.props.steamid.steamid = targValue;
  }

  render(){
    return(
      <div>
        <input value={this.state.text} onChange={e => this.onInput(e.target.value)}/>
      </div>
    );
  }
}

export default withSteamID(LandingPageHelper);