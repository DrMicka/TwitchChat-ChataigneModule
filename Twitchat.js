function init()
{

}

function update()
{
	if (local.parameters.channelName.get() != "" && local.parameters.receivedOAuth.get() != "" && local.parameters.identified.get() == false) {
		local.send("PASS oauth:"+local.parameters.receivedOAuth.get());
		local.send("NICK "+local.parameters.channelName.get().toLowerCase());
		local.send("JOIN #"+local.parameters.channelName.get().toLowerCase()+",#"+local.parameters.channelName.get().toLowerCase());
		local.parameters.identified.set(true);
	}
}

function moduleParameterChanged(param)
{
	if(param.name == "giveLinkForOAuth") {
		local.parameters.linkForOAuth.set("https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=" 
			+ local.parameters.clientID.get()
			+"&redirect_uri=http://localhost:3000&scope=chat%3Aread+chat%3Aedit+channel%3Amoderate+whispers%3Aread+whispers%3Aedit");
	}
	if(param.name == "connected") {
		local.parameters.identified.set(false);
	}

	
}

/* 	--------------------------------------------------------------------------------------------------------------
										CONNEXION TO TWITCHCHAT BY WEBSOCKET
	--------------------------------------------------------------------------------------------------------------*/
function dataReceived(data)
{
	//If mode is "Lines", you can expect data to be a single line String
	script.log("Data received : " +data);
}

function wsMessageReceived(message)
{
	script.log("Websocket message received : " +message);

    // Message si la connection à échoué  
    if(message.indexOf(":tmi.twitch.tv NOTICE * :Login authentication failed") != -1){
        util.showMessageBox("Alerte !", "Problem with your Login authentication : check the Channel Name and the Received OAuth", "warning", "Got it");
		local.parameters.identified.set(false);
    }
	
}

function wsDataReceived(data)
{
	script.log("Websocket data received : " +data);
}

/* 	--------------------------------------------------------------------------------------------------------------
										DIFFERENTS FUNCTIONS FOR SCRIPT
	--------------------------------------------------------------------------------------------------------------*/
function Privmsg(message) {
	local.send("PRIVMSG #"+local.parameters.channelName.get().toLowerCase()+" :"+message);
}

function Commande(data) {
	local.send(data);	
}

