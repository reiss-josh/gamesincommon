import React from 'react';
import Head from 'next/head';

import SteamID, { SteamIDContext } from '/src/components/services/SteamID';
import App from '/src/components/helpers/App';

function HomePage(){
  return (
    <div>
      <Head>
        <title>Games In Common</title>
        <meta property="og:title" content="Games In Common" key="title" />
      </Head>
      <SteamIDContext.Provider value={new SteamID()}>
        <App/>
      </SteamIDContext.Provider>
    </div>
  )
}
export default HomePage