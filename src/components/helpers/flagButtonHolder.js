import React, { useContext} from 'react';
import FlagButton from './flagButton.js';
import FriendsGamesContext from '../services/friends-games-context';

//generate the array of SelectorButton objects
function generateButtons(flagsList, context){
  return (
  <li className = "flag-button-holder">
    <FlagButton flag = "Multiplayer" context = {context} handler = {handleButtonClick}/>
    <FlagButton flag = "Online Multiplayer" context = {context} handler = {handleButtonClick}/>
    <FlagButton flag = "Local Multiplayer" context = {context} handler = {handleButtonClick}/>
    <FlagButton flag = "Supports Gamepad" context = {context} handler = {handleButtonClick}/>
  </li>); //returns flagButtons
}

//when a FlagButton is clicked, it calls this function.
//it takes a flag  object and a boolean.
//depending on the state of the boolean variable, the person object is either selected or deselected.
function handleButtonClick(flag, context, isBeingAdded) {
  let newSelected = context.state.selectedFlags;
  if(isBeingAdded === true){ //add to list
    newSelected.push(flag);
  } else { //remove from list
    let ind = newSelected.indexOf(flag);
    newSelected.splice(ind, 1);
  }
    
  //update the context's state.
  context.updateValue('selectedFlags', newSelected);
}

const FlagButtonHolder = () => {
  let user = useContext(FriendsGamesContext);
  let flagsList = ["Multiplayer", "Online Multiplayer", "Local Multiplayer", "Gamepad Support"];
  return generateButtons(flagsList, user);
}

export default FlagButtonHolder;