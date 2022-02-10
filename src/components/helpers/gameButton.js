import React from 'react';

const GameButton = (game, selectedFlags) =>{
	if(
		(selectedFlags.includes("Multiplayer") && game.flags.isMultiplayer === false) ||
		(selectedFlags.includes("Online Multiplayer") && game.flags.isOnlineMultiplayer === false) ||
		(selectedFlags.includes("Local Multiplayer") && game.flags.isLocalMultiplayer === false) ||
		(selectedFlags.includes("Supports Gamepad") && game.flags.isSupportgamepad === false)
	)
		return ('');
  if(game.img_logo_url !== ""){
		return (
			<li key = {game.appid}>
				<button className = 'game-button' onClick = {
					function() {
						window.open("https://store.steampowered.com/app/"+ game.appid);
					}}>
					<img
						alt = {game.name}
						src = {
							"https://steamcdn-a.akamaihd.net/steam/apps/" + game.appid + "/header.jpg"
							//"http://cdn.akamai.steamstatic.com/steam/apps/" +
							//game.appid + "/" + "header_292x136.jpg"
							//"http://media.steampowered.com/steamcommunity/public/images/apps/" +
							//game.appid + "/" + game.img_logo_url + ".jpg"
						}
						onError={(e)=>{e.target.onerror = null; e.target.src="https://raw.githubusercontent.com/reiss-josh/gamesincommon/master/src/img/defaultheader.png"}}
					></img>
				</button>
			</li>
		)
  } else {
    return('');
  }
}

export default GameButton;