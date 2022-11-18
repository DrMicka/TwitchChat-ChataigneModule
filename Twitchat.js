function init()
{
	local.values.lastPseudoMessage.set("");
	local.values.lastMessage.set("");		
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
	if(param.name == "giveMeOAuth") {
		if (local.parameters.clientID.get() != "" && local.parameters.oAuthRedirectURL.get() != "") {
				util.gotoURL("https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=" 
				+ local.parameters.clientID.get()
				+"&redirect_uri="
				+ local.parameters.oAuthRedirectURL.get()
				+"&scope=chat%3Aread+chat%3Aedit+channel%3Amoderate+whispers%3Aread+whispers%3Aedit");
		}
		else {
			util.showMessageBox("Information", "Please, fill in the client ID and OAuth redirect URL fields", "info", "Got it");
		}
	}
	if(param.name == "connected") {
		local.parameters.identified.set(false);
	}
}

/* 	--------------------------------------------------------------------------------------------------------------
										CONNEXION TO TWITCHCHAT BY WEBSOCKET
	--------------------------------------------------------------------------------------------------------------*/
function wsMessageReceived(message)
{
	script.log("Websocket message received : " +message);

    // Message si la connection a échoué  
    if(message.indexOf(":tmi.twitch.tv NOTICE * :Login authentication failed") != -1){
        util.showMessageBox("Alerte !", "Problem with your Login authentication : check the Channel Name and the Received OAuth", "warning", "Got it");
		local.parameters.identified.set(false);
    }
	
	// Message keepalive PING-PONG  
	if(message.indexOf("PING") != -1){
		script.log("PONG :tmi.twitch.tv");
        local.send ("PONG :tmi.twitch.tv");	
    }
	
	// Dernier message dans le chat avec le pseudo
	//message type :pseudo!pseudo@pseudo.tmi.twitch.tv PRIVMSG #channel :message
	if (message.indexOf("PRIVMSG") != -1){
		var lgChanName = local.parameters.channelName.get().length;
	//1.le message envoyé
		var startMsg = message.indexOf("#"+local.parameters.channelName.get().toLowerCase());
		var msg = message.substring(startMsg+lgChanName+3,message.length);
		local.values.lastMessage.set(msg);
	//2.le pseudo
		var lgPseudo = (message.indexOf(".tmi.twitch.tv")-3)/3;
		var pseudo = message.substring(1, lgPseudo+1);
		local.values.lastPseudoMessage.set(pseudo);			
    }
}
/* 	--------------------------------------------------------------------------------------------------------------
										DIFFERENTS FUNCTIONS FOR SCRIPT
	--------------------------------------------------------------------------------------------------------------*/
function Privmsg(message) {
	local.send("PRIVMSG #"+local.parameters.channelName.get().toLowerCase()+" :"+message);
}

function RemoveValues() {
	local.values.lastMessage.set("");
	local.values.lastPseudoMessage.set("");
}

function Commande(data) {
	local.send(data);
}

