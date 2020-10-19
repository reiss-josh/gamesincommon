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

  coolFunction(beep){
    console.log(beep);
  }

  componentDidMount(){
    this.setState({gamesList: this.props.gamesList});
  }

  render(){
    if(this.state){
    return(
			<ul> {
				alphabetizeObjects(this.state.gamesList, 'name')
				.map((game, index) => (
					<GameButton game = {game}/>
				))
      } </ul>);
    } else {
      return("");
    }
  }
}

export default GameButtonHolder;