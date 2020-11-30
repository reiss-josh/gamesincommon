import React, { useContext} from 'react';
import FriendButton from './friendButton.js';
import {alphabetizeObjects} from '../utilities/generic_utils.js';
import FriendsGamesContext from '../services/friends-games-context';

//generate the array of SelectorButton objects
function generateButtons(friendsList, context){
  return (
    <ul>{
      alphabetizeObjects(friendsList, 'personaname')
      .map((person, index) => (
        <li key = {person['steamid']}>
          <FriendButton person = {person} context = {context} handler = {handleButtonClick}/>
        </li>
      ))
    }</ul>
  )
}

//when a FriendButton is clicked, it calls this function.
//it takes a person  object and a boolean.
//depending on the state of the boolean variable, the person object is either selected or deselected.
function handleButtonClick(person, context, isBeingAdded) {
  let newSelected = context.state.selectedFriends;
  if(isBeingAdded === true){ //add to list
  newSelected.push(person);
  } else { //remove from list
    let ind = newSelected.indexOf(person);
    newSelected.splice(ind, 1);
  }
    
  //update the context's state.
  context.updateValue('selectedFriends', newSelected);
}

const FriendButtonHolder = () => {
  let user = useContext(FriendsGamesContext);
  return generateButtons(user.state.friendsList, user);
}

export default FriendButtonHolder;