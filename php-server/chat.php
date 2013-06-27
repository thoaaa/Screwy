<?php
    //Accès aux variables superglobales de la session
    session_start();
    
	//On regarde si des cookies sont présents, et si oui on récupère 3 variables : $pseudo_cookie, $password_cookie, et $checked
	if (isset($_COOKIE['screwy_pseudo']) && isset($_COOKIE['screwy_password'])) {
		$cookie = true;
		include("scripts/php/isCookieSet.php");
	}
	else{
		$cookie = false;
		$pseudo_cookie = '';
        $password_cookie = '';
        $checked = '';
	}

	//On regarde si l'utilisateur est connecté ou pas, si oui on lance notre fonction qui récupère ses infos
	if ($_SESSION['islogged'] == 1){
		$logged = true;
		include("scripts/php/isLogged.php");
	}
	else{
		$logged = false;
		//On redirige vers la page d'accueil
		echo "<meta http-equiv=refresh content=2;URL=index.php />";
		//On s'assure que la suite du code ne sera pas exécuté
		exit("Vous devez vous connecter pour voir cette page !");
	}
	
?>
<!DOCTYPE html>

<html>
<head>
    <link rel="icon" type="image/png" href="style/images/favicon.png">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="style/reset.css" rel="stylesheet" type="text/css">
    <link href="lib/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="lib/bootstrap/css/bootstrap-responsive.css" rel="stylesheet" type="text/css">
    <link href="style/style.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="lib/jquery/jquery.js"></script>
    <script type="text/javascript" src="scripts/js/myAjax.js"></script>
    <script type="text/javascript" src="scripts/js/script_screwy.js"></script>
  

    <title>Salon <?php ?></title>
</head>

<body>
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
        			<button id="button_pret" class="btn btn-large btn-block" type="button" onClick="im_ready()">   <i class="icon-play icon-white"></i> PRÊT</button>
        		</div>
        		
        		
            	<div id="vote_normal" style="display:none">
                    <form>
                        <select id="select_normal">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
                    </form>
        		</div>
                <div id="vote_psycho" style="display:none">
                    <form>
                        <select id="select_psycho">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
                    </form>
        		</div>
                <div id="vote_special" style="display:none">
                    <form>
                        <select id="select_special">	 
                        	<option value="personne">Personne</option>
                        </select>
                    <button id="button_vote" class="btn btn-large btn-block" type="button"><i class="icon-thumbs-down icon-white"></i> VOTE <i class="icon-thumbs-down icon-white"></i></button>
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
    							<input id="area_type" type="text" placeholder="Type something…" class="span10">
    							<button id="button_envoyer" type="submit" class="btn span2">Envoyer</button>
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
    
    <div id="test" style="text-align:center;border:1px solid white;padding:5px;width:1000px;margin-left:auto;margin-right:auto">
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
	</div>
	
	<script type="text/javascript" src="lib/bootstrap/js/bootstrap.js"></script>
    <script type="text/javascript">
		$(document).ready(function() {
			$('body').css('display', 'none');
			$('body').fadeIn(600);
		});
    </script>

</body>
</html>
