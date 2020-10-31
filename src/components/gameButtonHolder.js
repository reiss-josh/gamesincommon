import React, { Component } from 'react';
import GameButton from './gameButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';

const INITIAL_STATE = {
	gamesButtonArray: [],
};

class GameButtonHolder extends Component{
  constructor(props){
		super();
		
		this.state = {...INITIAL_STATE};
	}

	updateGameButtons(gamesList){
		this.setState({gamesButtonArray: this.generateGameButtons(gamesList)});
	}

	generateGameButtons(gamesList){
		return alphabetizeObjects(gamesList, 'name')
		.map((game, index) => (
			<GameButton game = {game}/>
		))
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