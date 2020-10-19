import React, { Component } from 'react';
import {STEAM_ID_USER} from '../jsenv.js';

const INITIAL_STATE = {
  isClicked: false,
};

class SelectorButton extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};
  }

  //if this button is the logged-in user's button, default it to Clicked.
  componentDidMount(){
    if(this.props.person.steamid === STEAM_ID_USER) this.setState({isClicked: true});
  }

  //when we click the button, update its state and pass that update upwards to its parent.
  onButtonClick(ref) {
    let newClickState = !ref.state.isClicked; //store the state we are updating to
    ref.setState({isClicked: newClickState}); //update our state
    ref.props.handler(ref.props.person, newClickState); //tell our parent to update our state
  }

  render(){
    let isClicked = this.state.isClicked;
    let person = this.props.person;

    return (
      <button className = {isClicked ? 'friend-button-on' : 'friend-button'} onClick={() => {this.onButtonClick(this)}}>
        <img src={person.avatar} alt = {person.personaname}></img>
        <span>{person.personaname}</span>
      </button>
    )
  }
}

export default SelectorButton;