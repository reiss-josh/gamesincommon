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

   onFormSubmit = async(e) => {
    e.preventDefault();
    let output = await this.props.steamid.handleVanity(this.state.text);
    this.setState({myid: output});
    this.props.handler(output);
  }

  
  render(){
    return(
      <div class = "landing-page">
        <div class = "errorCode">
          <span style = {{color:"#d36f6f"}}>{this.state.myid}</span>
        </div>
        <div class = "idInputBox">
          <input type = "text" value={this.state.text} placeholder = "Vanity URL or Steam ID" onChange={e => this.onInput(e.target.value)}/>
        </div>
        <div class = "idInputButton">
          <form onSubmit={this.onFormSubmit}>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
        <div class = "tutImages">
          <div class = "vanityImg">
            <img
              alt="example of a steam vanity url"
              src={"https://raw.githubusercontent.com/reiss-josh/gamesincommon/master/src/img/vanityExample.png"}
            />
          </div>
          <div class = "steamidImg">
            <img
              alt="example of a steam id url"
              src={"https://raw.githubusercontent.com/reiss-josh/gamesincommon/master/src/img/steamidExample.png"}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withSteamID(LandingPageHelper);