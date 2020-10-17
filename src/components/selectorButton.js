import React, { Component } from 'react';
import {STEAM_ID_USER} from '../jsenv.js';

const INITIAL_STATE = {
  person: '',
  currComponent: null,
  isClicked: false,
};

class SelectorButton extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};
  }

  render(){
    let currButton = this;
    if(this.state.person == ''){
      this.setState({person: this.props.person});
      this.setState({currComponent: this.props.currComponent})
    }
    const {
      person,
      currComponent,
      isClicked,
    } = this.state;

    return (
      <button className = {isClicked ? 'friend-button-on' : 'friend-button'} onClick = {
        function() {
          console.log(process.env);
          let ind = currComponent.state.selectedFriends.indexOf(person);
          let newSelected;
          //remove from list
          if(ind > -1) {
            newSelected = currComponent.state.selectedFriends;
            newSelected.splice(ind, 1);
            currButton.setState({isClicked: false});
          //add to list
          } else {
            newSelected = currComponent.state.selectedFriends;
            newSelected.push(person);
            currButton.setState({isClicked: true});
          }
            console.log("added/removed " + person.personaname);
            currComponent.setState({selectedFriends: newSelected});
            currComponent.handleGamesList();
            console.log("Refreshing...");
          }
        }
      >
      <img src={person.avatar} alt = {person.personaname}></img>
      <span>{person.personaname}</span>
      </button>
    )
  }
}

export default SelectorButton;