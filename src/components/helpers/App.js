import React from 'react';
import AppPage from '../pages/AppPage.js'
import LandingPage from '../pages/LandingPage.js'
import {withSteamID} from '../services/SteamID';

const App = (props) => (
  <div>
    <LandingPage/>
    <AppPage/>
  </div>
);

export default withSteamID(App);