import React, { Component } from 'react';
import SelectorButton from './selectorButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';

const INITIAL_STATE = {
  selectedFriends: null,
  selectorButtonArray: [],
};

class SelectorButtonHolder extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};

    this.handleButtonClick = this.handleButtonClick.bind(this);
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
    this.props.handler(newSelected);
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
  componentDidMount(){
    this.setState({selectedFriends: this.props.selectedFriends});
    this.setState({selectorButtonArray: this.generateButtons(this.props.friendsList, this.props.alphaParam)});
  }

  render(){
    if(this.props.friendsList != null){
      return(
        <ul>{this.state.selectorButtonArray}</ul>
      )
    } else {
      return("the selectorbuttons are still loading");
    }
  }
}

export default SelectorButtonHolder;