import React from 'react';
import SelectorButtonHolder from '../components/selectorButtonHolder';
import GameButtonHolder from '../components/gameButtonHolder';
import {handleGamesList, handleFriendsList} from '../helpers/steamAPI_handlers.js';
import FriendsGamesContext from '../helpers/friends-games-context';

let STEAM_ID_USER = process.env.REACT_APP_STEAM_ID_USER;

const INITIAL_STATE = {
	selectedFriends: [],
  friendsList: [],
  gamesList: [],
};

class FriendsGamesList extends React.Component {
	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};
		this.handleGames = this.handleGames.bind(this);
  }
  
  updateValue = (key,val) => {
		this.setState({[key]: val});
		if(key === 'selectedFriends') this.handleGames();
	}

	async handleGames(){
		let gamesListResult = await handleGamesList(this.state.friendsList, this.state.selectedFriends);
    this.setState({gamesList: gamesListResult}); //update stored games
	}
	
	async componentDidMount() {
		let friendHandled = await handleFriendsList();
    this.setState({friendsList : friendHandled.newFriendsList});
		this.setState({selectedFriends: friendHandled.loggedInUserObject});
		
		this.handleGames();
	}

	render() {
		//friend list JSX
		let friendButtons =
      <FriendsGamesContext.Provider value = {{state: this.state, updateValue: this.updateValue}}>
        <SelectorButtonHolder/>
      </FriendsGamesContext.Provider>
		//games list JSX
		let gamesButtons =
      <FriendsGamesContext.Provider value = {{state: this.state}}>
        <GameButtonHolder/>
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