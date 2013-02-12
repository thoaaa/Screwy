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
		exit("Vous devez être connecté pour voir cette page !");
	}
	
?>
<!DOCTYPE html>

<html>
<head>
    <link rel="icon" type="image/png" href="style/images/favicon.png">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="style/reset.css" rel="stylesheet" type="text/css">
    <link href="bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet" type="text/css">
    <link href="style/style.css" rel="stylesheet" type="text/css">
    
    <script type="text/javascript" src="scripts/js/jquery-1.7.1.min.js"></script>
    <script type="text/javascript">
		$(document).ready(function() {
			//Effet de "transition"
			$('body').css('display', 'none');
			$('body').fadeIn(600);
			//On cache tous les .help-inline
			$(".help-inline").hide();
			//On cache toutes les cartes inutiles de base
			$(".li_carte:not(.carte_choice)").hide();
			//(Ré)activer le bouton qui permet de rejoindre une partie
			$("#join_game input[type='button']").attr("disabled", false);
		});
    </script>
    <script type="text/javascript" src="scripts/js/myAjax.js"></script>
    
</script>

    <title>Jouer - Création et liste des Salons de Screwy</title>
</head>

<body>
    <header>
        <div id="content_header" class="container-fluid">
            <div id="logo">
                <a href="index.php" title="Accueil">Screwy</a>
            </div>
        </div>
        <div class="navbar navbar-inverse">
    		<div class="navbar-inner">
    			<div class="container-fluid">
    				<button type="button" class="btn btn-navbar btn-large btn-block" data-toggle="collapse" data-target=".nav-collapse">
            			<span class="brand span12">menu</span>
          			</button>
          			<div class="nav-collapse collapse">
           				<ul class="nav">
              				<li class="linav">
                				<a href="index.php" title="Accueil" class="brand span3">Accueil</a>
              				</li>
              				<li class="linav">
                				<a href="salon.php" title="Jouer à Screwy !" class="brand actif jouer span3">JOUER</a>
              				</li>
              				<li class="linav">
                				<a href="forum.php" title="Forum du jeu" class="brand span3">Forum</a>
              				</li>						
              				<?php
								if($logged == true){
									print("
			              				<li class='linav'>
			                				<a href='compte.php' title='Mon Compte' class='brand span3'>Compte</a> 
			              				</li>
		              				");
								}
							?>
            			</ul>
          			</div>		
    			</div>
   		 	</div>
    	</div>
    </header>

    <div class="clear"></div>

    <div id="bg_content_top"></div>

    <div id="content_contenu" class="container-fluid">
        <div class="row-fluid">
            <div id="left_bar" class="span9">
                <div id="content_top">
                    <div id="center_content_top">
                        <h1>Salle de jeu</h1>
                        <p>Créez ou rejoignez facilement et rapidement une partie !</p>
                    </div>
                </div>

                <div id="principal_content">
                	
					<div id="create_game">
						<h2>Creer une partie</h2>
						
				        <form id="create_form" class="form-horizontal">
						    <div id="nom_create" class="control-group">
							    <label class="control-label" for="inputNomPartie">Nom de la partie</label>
							    <div class="controls">
							    	<input type="text" id="inputNomPartie" placeholder="Nom de la partie">
							    	<span class="help-inline"></span>
							    </div>
						    </div>
						    <div class="control-group">
							    <label class="control-label" for="inputNombreJoueurs">Nombre de joueurs</label>
							    <div class="controls">
							    	<select id="inputNombreJoueurs" onchange="setCards(this.value)">
										<option>5</option>
										<option>6</option>
										<option>7</option>
										<option>8</option>
										<option>9</option>
										<option>10</option>
										<option>11</option>
										<option>12</option>
										<option>13</option>
										<option>14</option>
										<option>15</option>
									</select>
							    </div>
						    </div>
						    <div class="control-group">
							    <p>Set de cartes utilisé pour ce nombre de joueurs :</p>
							    
							    <div>
							    	
						    	    <ul class="thumbnails">
						    	    	 <li class="span3 li_carte carte_choice" id="li_innocent">
										    <div class="thumbnail">
											    <img src="style/images/cartes/innocent.jpg" alt="Innocent">
											    <div class="caption">
												    <h3>Innocent</h3>
												    <p>Description Innocent</p>
												    <span class="nombre_carte">x4</span>
											    </div>
										    </div>
									    </li>
									    <li class="span3 li_carte carte_choice" id="li_psychopathe">
										    <div class="thumbnail">
											    <img src="style/images/cartes/psychopathe.jpg" alt="Psychopathe">
											    <div class="caption">
												    <h3>Psychopathe</h3>
												    <p>Description Psychopathe</p>
												    <span class="nombre_carte">x1</span>
												</div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_heretique">
										    <div class="thumbnail">
											    <img src="style/images/cartes/heretique.jpg" alt="Hérétique">
											    <div class="caption">
												    <h3>Hérétique</h3>
												    <p>Description Hérétique</p>
												    <span class="nombre_carte">x1</span>
											    </div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_sage">
										    <div class="thumbnail">
											    <img src="style/images/cartes/sage.jpg" alt="Sage">
											    <div class="caption">
												    <h3>Sage</h3>
												    <p>Description Sage</p>
												    <span class="nombre_carte">x1</span>
											    </div>
										    </div>
									    </li>
								    </ul>
								    
								    <ul class="thumbnails">
									    <li class="span3 li_carte" id="li_zombie">
										    <div class="thumbnail">
											    <img src="style/images/cartes/zombie.jpg" alt="Zombie">
											    <div class="caption">
												    <h3>Zombie</h3>
												    <p>Description Zombie</p>
												    <span class="nombre_carte">x1</span>
										    	</div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_boitier">
										    <div class="thumbnail">
											    <img src="style/images/cartes/boitier_bugge.jpg" alt="Boitié buggé">
											    <div class="caption">
												    <h3>Boitié buggé</h3>
												    <p>Description Boitié buggé</p>
												    <span class="nombre_carte">x1</span>
											    </div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_telekinesiste">
										    <div class="thumbnail">
											    <img src="style/images/cartes/telekinesiste.jpg" alt="Télékinesiste">
											    <div class="caption">
												    <h3>Télékinesiste</h3>
												    <p>Description Télékinesiste</p>
												    <span class="nombre_carte">x1</span>
											    </div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_miracule">
										    <div class="thumbnail">
											    <img src="style/images/cartes/miracule.jpg" alt="Miraculé">
											    <div class="caption">
												    <h3>Miraculé</h3>
												    <p>Description Miraculé</p>
												    <span class="nombre_carte">x1</span>
											    </div>
										    </div>
									    </li>
								    </ul>
								    
								    <ul class="thumbnails">
									    <li class="span3 li_carte" id="li_theo">
										    <div class="thumbnail">
											    <img src="style/images/cartes/theo_hazard.jpg" alt="Théo Hazard">
											    <div class="caption">
												    <h3>Théo Hazard</h3>
												    <p>Description Théo Hazard</p>
												    <span class="nombre_carte">x1</span>
										    	</div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_mentalist">
										    <div class="thumbnail">
											    <img src="style/images/cartes/mentalist.jpg" alt="Mentaliste">
											    <div class="caption">
												    <h3>Mentaliste</h3>
												    <p>Description Mentaliste</p>
												    <span class="nombre_carte">x1</span>
										    	</div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_ninja">
										    <div class="thumbnail">
											    <img src="style/images/cartes/ninja.jpg" alt="Ninja">
											    <div class="caption">
												    <h3>Ninja</h3>
												    <p>Description Ninja</p>
												    <span class="nombre_carte">x1</span>
										    	</div>
										    </div>
									    </li>
									    <li class="span3 li_carte" id="li_tentateur">
										    <div class="thumbnail">
											    <img src="style/images/cartes/tentateur.jpg" alt="Tentateur">
											    <div class="caption">
												    <h3>Tentateur</h3>
												    <p>Description Tentateur</p>
												    <span class="nombre_carte">x1</span>
										    	</div>
										    </div>
									    </li>
								    </ul>
								    
							    </div>
						    </div>
						    
						    <div class="control-group">
							    <div class="controls">
							    	<input type="button" class="btn" onClick="createGame(<?php echo $id_user; ?>);" value="Créer" title="Créer une partie">
							    </div>
						    </div>
						    <div id="create_success" class="control-group">
								<span class="help-inline"></span>
							</div>
					    </form>
					    
					</div>
					
					<div id="join_game">
						<h2>Rejoindre une partie</h2>
						
						<table cols="5">
							<tbody>
								<tr id="intitules">
									<td class="span3">Partie</td>
									<td class="span2">Créateur</td>
									<td class="span1">Joueurs</td>
									<td class="span2">Créée depuis</td>
									<td class="span1">Set utilisé</td>
								</tr>
								<?php include("scripts/php/getGameInProgress.php"); ?>
							</tbody>
						</table>
						
						<input type="button" class="btn" onClick="joinGame(<?php echo $id_user; ?>);" value="Rejoindre" title="Rejoindre une partie">
						<div class="control-group">
							<span class="help-inline"></span>
						</div>
					</div>
                </div>
            </div>

            <div id="right_bar_content" class="span3">
            	
            	<div id="right_bar_left_right">
            		            			            		
		                <div class="right_bar_bloc">
		                    <h2>TOP 5</h2>
		
		                    <ul>
		                        <?php include("scripts/php/getTopFive.php"); ?>
		                    </ul>
		                </div>
		
		                <div class="right_bar_bloc">
		                    <h2>FORUM</h2>
		
		                    <ul>
		                        <li>
		                            <a href="" title="Voir la discussion">
		
		                            <p class="titre_discussion">Un sujet du forum</p>
		
		                            <p class="infos_discussion"><span class="auteur_discussion">Auteur</span><span class="heure_discussion">01:47</span><span class="date_discussion">25/01/2013</span></p>
		                            </a>
		                        </li>
		                        <li>
		                            <a href="" title="Voir la discussion">
		
		                            <p class="titre_discussion">Un sujet du forum</p>
		
		                            <p class="infos_discussion"><span class="auteur_discussion">Auteur</span><span class="heure_discussion">01:47</span><span class="date_discussion">25/01/2013</span></p>
		                            </a>
		                        </li>
		                        <li>
		                            <a href="" title="Voir la discussion">
		
		                            <p class="titre_discussion">Un sujet du forum</p>
		
		                            <p class="infos_discussion"><span class="auteur_discussion">Auteur</span><span class="heure_discussion">01:47</span><span class="date_discussion">25/01/2013</span></p>
		                            </a>
		                        </li>                      
		                    </ul>
		                </div>
		
		                <div class="right_bar_bloc">
		                    <h2>MEDIAS SOCIAUX</h2>
		
		                    <ul id="medias_sociaux">
		                        <li id="twitter_btn"><a href="" title="Nous suivre sur Twitter !" target="_blank"></a></li>
		
		                        <li id="facebook_btn"><a href="" title="Devenir Fan de Screwy !" target="_blank"></a></li>
		
		                        <li id="github_btn"><a href="" title="Contribuer au projet sur Github !" target="_blank"></a></li>
		                        
		                        <div class="clear"></div>
		                    </ul>

		                </div>
		                              
	                <div id="right_bar_bg"></div>
	                
                </div>
                
                <div id="right_bar_bot"></div>
                
            </div>
            
        </div>
        
    </div>

    <div class="clear"></div>

    <footer>
        <div id="content_footer" class="container-fluid">
        	<div class="row-fluid">
            <div class="span3">
                <h3>PLAN DU SITE</h3>

                <ul>
                    <li><a href="index.php" title="Accueil" class="actif">Accueil</a></li>

                    <li><a href="regles.php" title="Règles du jeu">Regles</a></li>

                    <li><a href="jouer.php" title="Jouer à Screwy !">JOUER</a></li>

                    <li><a href="forum.php" title="Forum du jeu">Forum</a></li>

                    <li><a href="compte.php" title="Mon Compte">Compte</a></li>
                </ul>
            </div>
            
            <div class="span1"></div>

            <div class="span3">
                <h3>A PROPOS</h3>

                <ul>
                    <li><a href="faq.php" title="F.A.Q.">F.A.Q.</a></li>

                    <li><a href="mentions.php" title="Mentions légales">Mentions légales</a></li>

                    <li><a href="credits.php" title="Crédits">Crédits</a></li>
                </ul>
            </div>
            
            <div class="span1"></div>

            <div id="contact" class="span4">
                <h3>CONTACT</h3>

                <p>Vous avez des questions ? Vous souhaitez nous faire part de vos idées ? Vous voulez nous reporter un bug ? Vous n’avez pas peur de nous ?<br>
                <br>
                Quelqu’un <span class="lol">se chargera</span> de vous ici (à vos risques et périls) :<br>
                <span class="email">contact@screwy.com</span></p>
            </div>

            <div class="clear"></div>

            <p id="copyrights"><span class="email">© 2012 - 2013 <a href="index.php" title="Accueil" class="color_text">Screwy</a> . Tous droits réservés. Design par <a href="www.joottle.com" title="Portfolio de Joffrey Parisot" class="color_text">Joffrey Parisot</a>.</span></p>
        </div>
        </div>
    </footer>

    <script type="text/javascript" src="bootstrap/js/bootstrap.js"></script>
    <script type="text/javascript" src="scripts/js/jquery.color-2.1.1.min.js"></script>
    <script type="text/javascript" src="scripts/js/listGame.js"></script>
    <script type="text/javascript" src="scripts/js/changeCards.js"></script>

</body>
</html>
