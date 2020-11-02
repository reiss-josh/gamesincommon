import React, {createContext} from "react";
const FriendsGamesContext = createContext(null);

/*
const withContext = Component => props => (
  <FriendsGamesContext.Consumer>
    {context => <Component {...props} context={context} />}
  </FriendsGamesContext.Consumer>
);
*/
export default FriendsGamesContext;