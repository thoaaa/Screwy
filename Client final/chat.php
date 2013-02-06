<!DOCTYPE html>

<html>
<head>
    <link rel="icon" type="image/png" href="http://www.dondice.com/wp-content/uploads/2012/11/favicon.png">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="style/reset.css" rel="stylesheet" type="text/css">
    <link href="bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet" type="text/css">
    <link href="style/style.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="scripts/js/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="bootstrap/js/bootstrap.js"></script>
    <script type="text/javascript" src="scripts/js/script_screwy.js"></script>
    <script type="text/javascript">
		$(document).keypress(function(e) {
        	if(e.keyCode == 13) {
				sendInstruction('message');
             }
        });
    </script>
  

    <title>Screwy | Chat</title>
</head>

<body onLoad="webSocket()">
<input id="pseudo_hidden" type="hidden" /> 
<input id="key_hidden" type="hidden" />
<input id="id-salon_hidden" type="hidden" />
    <header>
        <div id="content_headers" class="container-fluid">
            <div id="logo">
                <a href="index.php" title="Accueil">Screwy</a>
            </div>
        </div> 
    </header>

    <div class="clear"></div>

    <div id="content_contenu" class="container-fluid">
        <div id="contenu_chat" class="row-fluid">
        	<div id="left_chat" class="span3">
        		<div id="pret" style="display:none">
        			<button id="button_pret" class="btn btn-large btn-block" type="button" onClick="sendInstruction('pret')">   <i class="icon-play icon-white"></i> PRÊT</button>
        		</div>
        		
        		
            	<div id="vote_normal" style="display:none">
                    <form>
                        <select id="select_normal">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button" onClick="sendInstruction('voteNormal')"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
                    </form>
        		</div>
                <div id="vote_psycho" style="display:none">
                    <form>
                        <select id="select_psycho">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button" onClick="sendInstruction('votePsycho')"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
                    </form>
        		</div>
                <div id="vote_special" style="display:none">
                    <form>
                        <select id="select_special">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button" onClick="sendInstruction('voteSpecial')"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
                    </form>
        		</div>
        		<div id="role_image">
        			<img align="middle" src=""/>
        		</div>
        	</div>
        	<div id="center_chat" class="span7">
        		
        		<div id="form_envoyer_chat">
        			<form>
  						<fieldset>
    						<div id="area_chat" class="span12 img-rounded">	
    						</div>
    						<div class="row-fluid">
    							<input id="area_type" type="text" placeholder="Type something…" autocomplete="off" class="span10" />
    							<button id="button_envoyer" type="button" onClick="sendInstruction('message')" class="btn span2">Envoyer</button>
    						</div>
  						</fieldset>
					</form>
        		</div>
        	</div>
        	<div id="right_chat" class="span2">
        		<div id="list_user_chat">
        		<table id="list_players" class="table table-condensed">
				</table>
				</div>
				<span id="chrono" style="display:none;"><i class="icon-time icon-white"></i></span>
        	</div>
            
        </div>
    </div>

    <div class="clear"></div>
    
    <!--<div id="test" style="text-align:center;border:1px solid white;padding:5px;width:1000px;margin-left:auto;margin-right:auto">
	  <script type="text/javascript">
          var instruction1 = '{"type":"userInfo","pseudo":"Damien","role":"null","alive":"true"}';
          var instruction2 = '{"type":"userInfo","pseudo":"Damien","role":"zombie","alive":"true"}';
          var instruction3 = '{"type":"userInfo","pseudo":"Damien","role":"zombie","alive":"false"}';
          var instruction4 = '{"type":"userInfo","pseudo":"Thomas","role":"null","alive":"true"}';
          var instruction5 = '{"type":"message","sender":"Damien","date":"11:11:11","txt":"Message de Damien !!!"}';
          var instruction6 = '{"type":"deconnexion","pseudo":"Damien"}';
          var instruction7 = '{"type":"message","sender":"null","date":"12:12:12","txt":"Message du système !!!"}';
          var instruction8 = '{"type":"message","sender":"Thomas","date":"13:13:13","txt":"Message de Thomas !!!"}';
		  var instruction9 = '{"type":"deconnexion","pseudo":"Thomas"}';
		  var instruction10 = '{"type":"voteActivate","typeVote":"normal","pseudoNominees":["Damien", "Thomas", "Purit", "Joffrey", "Frank", "Rocco"]}';
		  var instruction11 = '{"type":"voteDeactivate","typeVote":"normal"}';
		  var instruction12 = '{"type":"starterActivate"}';
		  var instruction13 = '{"type":"starterDeactivate"}';
		  var instruction14 = '{"type":"timerActivate","time":"70"}';	  
      </script>
      <input type="button" value="Connexion_Damien" onclick="parse_json(instruction1)" />
      <input type="button" value="Connexion_Thomas" onclick="parse_json(instruction4)" /> 
      <input type="button" value="Affichage_Role_Damien" onclick="parse_json(instruction2)" />
      <input type="button" value="Mort_Damien" onclick="parse_json(instruction3)" />
      <input type="button" value="Message_Damien" onclick="parse_json(instruction5)" />
      <input type="button" value="Message_Thomas" onclick="parse_json(instruction8)" />
      <input type="button" value="Message_Systeme" onclick="parse_json(instruction7)" />
      <input type="button" value="Deconnexion_Damien" onclick="parse_json(instruction6)" />
      <input type="button" value="Deconnexion_Thomas" onclick="parse_json(instruction9)" />
      <input type="button" value="Activation_vote" onclick="parse_json(instruction10)" />
      <input type="button" value="Desactivation_vote" onclick="parse_json(instruction11)" />
      <input type="button" value="Activation_starter" onclick="parse_json(instruction12)" />
      <input type="button" value="Desactivation_starter" onclick="parse_json(instruction13)" />
      <input type="button" value="Timer_70sec" onclick="parse_json(instruction14)" />
	</div>-->

</body>
</html>
