import React, {useState} from 'react';

import {withSteamID} from '../helpers/SteamID';

function updateSteamID(input, steamUserObject){
  steamUserObject.steamid = input;
}

function LandingPageHelper (props){
  const [input, setInput] = useState('');
  return(
    <div>
    <label>
      SteamID:
      <input value={input} onInput={e => setInput(e.target.value)}/>
    </label>
    <button onMouseDown = {() => {updateSteamID(input, props.steamid)}}>hey</button>
    </div>
  );
}

export default withSteamID(LandingPageHelper);