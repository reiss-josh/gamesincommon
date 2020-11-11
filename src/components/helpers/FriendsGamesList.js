import React from 'react';
import SelectorButtonHolder from './selectorButtonHolder';
import GameButtonHolder from './gameButtonHolder';
import FriendsGamesContext from '../services/friends-games-context';
import {withSteamID} from '../services/SteamID';

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
		if(this.props.steamid.getSteamID() === '')
			return;
		let friendHandled = await this.props.steamid.handleFriends();
    this.setState({friendsList : friendHandled.newFriendsList});
		this.setState({selectedFriends: friendHandled.loggedInUserObject});

		this.handleGames();
	}

	async handleGames(){
		let gamesListResult = await this.props.steamid.handleGames(
			this.state.friendsList, this.state.selectedFriends
		);
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
		
		if(this.props.steamid.getSteamID()){
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
					{/*hey, why isn't there a steamid for me to check??*/}
					<button onClick = {this.handleFriends}>UpdateMe!</button>
				</div>
			)
		}
	}
}

export default withSteamID(FriendsGamesList);