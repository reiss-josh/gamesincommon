import React, { Component } from 'react';
import SelectorButton from './selectorButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';
import {getSteamFriends, getPlayerSummaries} from '../utilities/steamAPI_utils.js';
import {sepMissingParams, joinMissingParams} from '../utilities/generic_utils.js';
import {getSteamGamesMultiple, getGamesInCommon} from '../utilities/steamAPI_utils.js';
//need to get this information from a login page instead
import {PROXY_URL, API_KEY_USER, STEAM_ID_USER} from '../jsenv.js';

const INITIAL_STATE = {
  friendsList: [],
  selectedFriends: [],
  selectorButtonArray: [],
  gamesList: [],
};

class SelectorButtonHolder extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};

    this.handleButtonClick = this.handleButtonClick.bind(this);
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
		//this.setState({gamesButtonArray: this.generateGameButtons(gamesInCommon, 'name')});
    this.props.handler(gamesInCommon);
    
		return gamesInCommon;
  }
  
  handleFriendsList = async() => {
		console.log("handling friends list...");
		//get friends
		let friendsResult = await getSteamFriends(STEAM_ID_USER, API_KEY_USER, PROXY_URL)
		const loginObject = {steamid: STEAM_ID_USER, realtionship: "self", friend_since: 0}; //add logged in user to list
		friendsResult.push(loginObject);
		//get summaries
		let idArray = friendsResult.map(a => a.steamid);
		let summariesResult = await getPlayerSummaries(idArray, API_KEY_USER, PROXY_URL);
		//clean up
		summariesResult.forEach(function (a) {
			a.gameLibrary = null;
		});
		
		//get the object of the currently-logged-in user
		let userObject = [summariesResult.filter(obj => {return obj.steamid === STEAM_ID_USER})[0]];

		//update object state
		this.setState({selectedFriends: userObject});
		this.setState({friendsList: summariesResult});
		return summariesResult;
	}

  //when a child SelectorButton is clicked, it calls this function.
  //it takes a person  object and a boolean.
  //depending on the state of the boolean variable, the person object is either selected or deselected.
  handleButtonClick(person, isBeingAdded)
  {
    let newSelected = this.state.selectedFriends;
    if(isBeingAdded === true){ //add to list
      newSelected.push(person);
    } else { //remove from list
      let ind = newSelected.indexOf(person);
      newSelected.splice(ind, 1);
    } //update both this object's state and the parent object's state.
    console.log("added/removed " + person.personaname);
    this.setState({selectedFriends: newSelected});
    this.handleGamesList(this.state.friendsList, newSelected);
    //this.props.handler(newSelected);
    console.log("Refreshing...");
  }

  //generate the array of SelectorButton objects
  generateButtons(friendsList, alphaParam){
    return alphabetizeObjects(friendsList, alphaParam)
		.map((person, index) => (
      <li key = {person['steamid']}>
				<SelectorButton person = {person} handler = {this.handleButtonClick}/>
			</li>
    ))
  }

  //update state based on passed props once mounted
  async componentDidMount(){
    await this.handleFriendsList();
    await this.handleGamesList(this.state.friendsList, this.state.selectedFriends);

    this.setState({selectorButtonArray: this.generateButtons(this.state.friendsList, this.props.alphaParam)});
  }

  render(){
    if(this.state.friendsList != null){
      return(
        <ul>{this.state.selectorButtonArray}</ul>
      )
    } else {
      return("the selectorbuttons are still loading");
    }
  }
}

export default SelectorButtonHolder;