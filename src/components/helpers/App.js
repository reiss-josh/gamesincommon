import React from 'react';

import AppPage from '../pages/AppPage'
import LandingPage from '../pages/LandingPage'
import { isNumeric } from '../utilities/generic_utils';

class App extends React.Component{
  constructor(props){
    super();
    this.handle = this.handle.bind(this);
    this.state = {item:""};
  }

  //updates Item with whatever is passed
  handle(handlerInput){
    this.setState({item: handlerInput});
  }

  //checks if a steam id is valid
  isValid(id){
    if(isNumeric(id) && id !== "") return true;
    else return false;
  }

  render(){
		let currRender = !this.isValid(this.state.item) ?
      <LandingPage handler = {this.handle}/>:
      <AppPage/>;
    return(
      <div>
        {currRender}
      </div>
    );
  }

}
export default App;