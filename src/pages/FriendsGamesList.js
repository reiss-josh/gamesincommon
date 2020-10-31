import React from 'react';

import SelectorButtonHolder from '../components/selectorButtonHolder';
import GameButtonHolder from '../components/gameButtonHolder';
import {STEAM_ID_USER} from '../jsenv.js';
import FriendsGamesContext from '../utilities/friends-games-context';
const INITIAL_STATE = {
  selectorButtonHolder: null,
  friendsList: [],
  gamesList: [],
};

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};
		this.gamesButtons = React.createRef();
  }
  
  updateValue = (key,val) => {
    this.setState({[key]: val});
    if(key == 'gamesList') this.gamesButtons.current.updateGameButtons(val);
 }

	render() {
		//friend list JSX
		let friendButtons =
      <FriendsGamesContext.Provider value = {{state: this.state, updateValue: this.updateValue}}>
        <SelectorButtonHolder/>
      </FriendsGamesContext.Provider>;
		//games list JSX
		let gamesButtons =
      <FriendsGamesContext.Provider value = {{state: this.state}}>
        <GameButtonHolder ref = {this.gamesButtons}/>
      </FriendsGamesContext.Provider>
		if(STEAM_ID_USER){
			return(
				<div className = "container">
					<div className = "main-row">
						<div className = "friend-column">
							<div className = "friend-scroll">
								{friendButtons}
							</div>
						</div>
						<div className = "games-column">
							<div className = "games-scroll">
								{gamesButtons}
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return(
				<div className = "container">
					hey, why isn't there a steamid for me to check??
				</div>
			)
		}
	}
}

export default FriendsGamesList;