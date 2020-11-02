import React from 'react';

const GameButton = (game) =>{
  if(game.img_logo_url !== ""){
		return (
			<li key = {game.appid}>
				<button className = 'game-button' onClick = {function() {
					window.open("https://store.steampowered.com/app/"+ game.appid);
				}}>
					<img
						alt = {game.name}
						src = {"http://media.steampowered.com/steamcommunity/public/images/apps/" +
									game.appid + "/" + game.img_logo_url + ".jpg"}>
					</img>
				</button>
			</li>
		)
  } else {
    return('');
  }
}

export default GameButton;