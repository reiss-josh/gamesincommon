import React from 'react';
import SelectorButtonHolder from '../components/selectorButtonHolder';
import GameButtonHolder from '../components/gameButtonHolder';
import {handleGamesList, handleFriendsList} from '../helpers/steamAPI_handlers.js';
import FriendsGamesContext from '../helpers/friends-games-context';

import {withSteamID} from '../helpers/SteamID';

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
		this.handleFriends = this.handleFriends.bind(this);
  }
  
  updateValue = (key,val) => {
		this.setState({[key]: val});
		if(key === 'selectedFriends') this.handleGames();
	}

	async handleFriends(){
		if(this.props.steamid.steamid === '')
			return;
		let friendHandled = await handleFriendsList(this.props.steamid.steamid, this.props.steamid.apiKey, this.props.steamid.proxyUrl);
    this.setState({friendsList : friendHandled.newFriendsList});
		this.setState({selectedFriends: friendHandled.loggedInUserObject});

		this.handleGames();
	}

	async handleGames(){
		let gamesListResult = await handleGamesList(this.state.friendsList, this.state.selectedFriends, this.props.steamid.apiKey, this.props.steamid.proxyUrl);
    this.setState({gamesList: gamesListResult}); //update stored games
	}
	
	async componentDidMount() {
		this.handleFriends();
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
		
		if(this.props.steamid.steamid){
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
					<button onClick = {this.handleFriends}>UpdateMe!</button>
				</div>
			)
		}
	}
}

export default withSteamID(FriendsGamesList);