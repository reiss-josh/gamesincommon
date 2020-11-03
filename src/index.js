import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SteamID, { SteamIDContext } from './helpers/SteamID';
import AppPage from './pages/AppPage.js'
import LandingPage from './pages/LandingPage.js'

ReactDOM.render(
  <div>
    <SteamIDContext.Provider value={new SteamID()}>
      <AppPage/>
      <LandingPage/>
    </SteamIDContext.Provider>
  </div>,
  document.getElementById('root'),
);