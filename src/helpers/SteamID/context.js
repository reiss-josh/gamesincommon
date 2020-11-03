import React, {createContext} from "react";
const SteamIDContext = createContext(null);


export const withSteamID = Component => props => (
  <SteamIDContext.Consumer>
    {steamid => <Component {...props} steamid={steamid} />}
  </SteamIDContext.Consumer>
);
export default SteamIDContext;