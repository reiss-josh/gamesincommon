import React, { Component } from 'react';

const INITIAL_STATE = {
  isClicked: false,
};

class FlagButton extends Component {
  constructor(props) {
    super();
    this.state = {...INITIAL_STATE};

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  //when we click the button, update its state and pass that update upwards to its parent.
  onButtonClick(e) {
    if (e) {e.preventDefault()};//prevents the white outline on the button
    let newClickState = !this.state.isClicked; //store the state we are updating to
    this.setState({isClicked: newClickState}); //update our state
    this.props.handler(this.props.flag, this.props.context, newClickState); //tell our parent to update our state
  }

  //if this button is the logged-in user's button, default it to Clicked.
  componentDidMount(){
    if(this.props.flag === "Multiplayer") this.setState({isClicked: true});
  }
  
  handleClick(e){
    if (e) {e.preventDefault()}; //prevents the white outline on the button
  }

  getBorderColor(ref){
    let currBorder = ref.state.isClicked ? '#75a72d' : '#a72d2d';
    return {borderColor: currBorder};
  }

  getTextColor(ref){
    return ({color: '#d3a16f'});
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
    let flag = this.props.flag;

    return (
      <div className = {'flag-button'}>
      <button
        onMouseDown={this.onButtonClick}
        style = {this.getBorderColor(this)}>
        <span style = {this.getTextColor(this)}>{this.props.flag}</span>
      </button>
      </div>
    )
  }
}

export default FlagButton;