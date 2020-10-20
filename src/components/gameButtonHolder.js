import React, { Component } from 'react';
import GameButton from './gameButton.js';
import {alphabetizeObjects, sepMissingParams, joinMissingParams} from '../utilities/generic_utils.js';
import {getSteamGamesMultiple, getGamesInCommon} from '../utilities/steamAPI_utils.js';

const INITIAL_STATE = {
	gamesList: [],
	gamesButtonArray: [],
};

class GameButtonHolder extends Component{
  constructor(props){
    super();
	}

	//todo: make this less of a horrible mess
	handleGamesList = async(friends, selectedFriends) => {
		console.log("handling games list...");
		this.setState({gamesList: []}); //resets list --- should start up a "loading" image around here
		let currFrns = friends;
		let currSelected = selectedFriends;

		//determine what data has/hasn't been memoized; retrieve it
		let missFound = sepMissingParams(currFrns, currSelected, 'gameLibrary', 'steamid');
		//console.log(missFound);

		//look up the missing data
		let allLibraries = [];
		if(missFound.missing.length > 0){ //if there's anything missing...
			let missingLibraries = await getSteamGamesMultiple(missFound.missing);
			allLibraries = allLibraries.concat(missingLibraries);
		};
		
		//memoize the missing data, now that we've grabbed it
		if(allLibraries.length > 0){ //if we found something above...
			joinMissingParams(missFound.missing, allLibraries, 'gameLibrary', 'steamid');
		};

		//make sure that we actually use the memoized data
		allLibraries = allLibraries.concat(missFound.found);

		//get gamesInCommon, now that we have all our data
		let gamesInCommon = getGamesInCommon(allLibraries);
		this.setState({gamesList: gamesInCommon}); //update stored games
		this.setState({gamesButtonArray: this.generateGameButtons(gamesInCommon, 'name')});
		
		return gamesInCommon;
	}

	generateGameButtons(gamesList, alphaparam){
		return alphabetizeObjects(gamesList, 'name')
		.map((game, index) => (
			<GameButton game = {game}/>
		))
	}

  componentDidMount(){
		this.setState({gamesList: this.props.gamesList});
  }

  render(){
    if(this.state){
    return(
			<ul> {this.state.gamesButtonArray} </ul>
			)
    } else {
      return("");
    }
  }
}

export default GameButtonHolder;