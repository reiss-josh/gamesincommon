import React from 'react';

import SteamID, { SteamIDContext } from '/src/components/services/SteamID';
import App from '/src/components/helpers/App';

function HomePage(){
  return <div><SteamIDContext.Provider value={new SteamID()}><App/></SteamIDContext.Provider></div>
}
export default HomePage