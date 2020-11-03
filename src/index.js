import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SteamID, { SteamIDContext } from './helpers/SteamID';
import App from './helpers/App';


ReactDOM.render(
  <div>
    <SteamIDContext.Provider value={new SteamID()}>
      <App/>
    </SteamIDContext.Provider>
  </div>,
  document.getElementById('root'),
);