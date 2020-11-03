import React, { Component } from 'react';
import {withSteamID} from '../services/SteamID';

const INITIAL_STATE = {
  isClicked: false,
};

class SelectorButton extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  //if this button is the logged-in user's button, default it to Clicked.
  componentDidMount(){
    if(this.props.person.steamid === this.props.steamid.steamid) this.setState({isClicked: true});
  }

  //when we click the button, update its state and pass that update upwards to its parent.
  onButtonClick(e) {
    if (e) {e.preventDefault()};//prevents the white outline on the button
    let newClickState = !this.state.isClicked; //store the state we are updating to
    this.setState({isClicked: newClickState}); //update our state
    this.props.handler(this.props.person, this.props.context, newClickState); //tell our parent to update our state
  }

  
  handleClick(e){
    if (e) {e.preventDefault()}; //prevents the white outline on the button
  }

  getBorderColor(ref){
    let currBorder = ref.state.isClicked ? '#75a72d' : '#a72d2d';
    return {borderColor: currBorder};
  }

  handleHover(e) {
    //if(e.target.type === 'submit')
    //  e.target.style.background = '#434855'
  }

  handleExit(e){
    //if(e.target.type === 'submit')
    //  e.target.style.background = '#262931';
  }

  render(){
    let person = this.props.person;

    return (
      <button className = {'friend-button'}
        onMouseDown={this.onButtonClick}
        style = {this.getBorderColor(this)}>
        <img src={person.avatar} alt = {person.personaname}></img>
        <span>{person.personaname}</span>
      </button>
    )
  }
}

export default withSteamID(SelectorButton);