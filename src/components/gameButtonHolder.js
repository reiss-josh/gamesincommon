import React, { Component } from 'react';
import GameButton from './gameButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';


const INITIAL_STATE = {
	gamesList: [],
	gamesButtonArray: [],
};

class GameButtonHolder extends Component{
  constructor(props){
    super();
	}

	updateGameButtons(gamesList){
		this.setState({gamesButtonArray: this.generateGameButtons(gamesList, this.props.alphaparam)});
	}

	generateGameButtons(gamesList, alphaparam){
		return alphabetizeObjects(gamesList, 'name')
		.map((game, index) => (
			<GameButton game = {game}/>
		))
	}

  componentDidMount(){
		//this.setState({gamesList: this.props.gamesList});
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