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
			//On cache les messages de succès
			$("#login_success .help-inline").hide();
			$("#signin_success .help-inline").hide();
			//Ajout de l'effet pour la modal
			$('.dropdown-toggle').dropdown();		
		});
    </script>
    <script type="text/javascript" src="scripts/js/myAjax.js"></script>
    
</script>

    <title>Screwy, le jeu complètement cinglé</title>
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
                				<a href="index.php" title="Accueil" class="brand actif span3">Accueil</a>
              				</li>
              				<li class="linav">
                				<a href="regles.php" title="Règles du jeu" class="brand span3">Regles</a>
              				</li>
              				<?php
								if($logged == false){
									print("
			              				<li class='linav'>
			                				<a href='#myModal' title='Jouer à Screwy !' class='brand jouer span3' data-toggle='modal'>JOUER</a>
			              				</li>
			              			");
			              		}
								else{
									print("
			              				<li class='linav'>
			                				<a href='salon.php' title='Jouer à Screwy !' class='brand jouer span3'>JOUER</a>
			              				</li>
			              			");
								}
			              	?>
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
    
	<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="myModalLabel">Inscription / Connexion</h3>
		</div>
		
		<div class="modal-body">
			
			<div class="accordion" id="myCollapse">
				
				<div class="accordion-group">
					
					<div class="accordion-heading">
						<a href="#connexion" data-toggle="collapse" data-parent="#myCollapse" title="Se connecter">Connectez-vous pour jouer à Screwy</a>
					</div>
					
					<div id="connexion" class="accordion-body collapse in">
						
						<div class="accordion-inner">
						
						    <form class="form-horizontal" id="login_form">
								<div id="login_pseudo" class="control-group">
									<label class="control-label" for="inputPseudoLog">Pseudo :</label>
									<div class="controls">
										<input type="text" id="inputPseudoLog" placeholder="Pseudo" value="<?php if($cookie == true){echo $pseudo_cookie;} ?>">
										<span class="help-inline"></span>
									</div>
								</div>
								<div id="login_password" class="control-group">
									<label class="control-label" for="inputPasswordLog">Mot de passe :</label>
									<div class="controls">
										<input type="password" id="inputPasswordLog" placeholder="Mot de passe" value="<?php if($cookie == true){echo $password_cookie;} ?>">
										<span class="help-inline"></span>
									</div>
								</div>
								<div class="control-group">
									<div class="controls">
										<label class="checkbox">
											<input id="check" type="checkbox" <?php if($cookie == true){echo $checked;} ?>> Rester connecté
										</label>
										<input type="button" class="btn" onClick="myLogin();" value="CONNEXION" title="Se connecter">
									</div>
								</div>
								<div id="login_success" class="control-group">
									<span class="help-inline"></span>
								</div>
							</form>
							
						</div>
						
					</div>
				</div>
								
				<div class="accordion-group">
					
					<div class="accordion-heading">
						<a href="#inscription" data-toggle="collapse" data-parent="#myCollapse" title="S'inscrire">Pas encore inscrit ? Cliquez ici !</a>
					</div>
					
					<div id="inscription" class="accordion-body collapse">
						
						<div class="accordion-inner">
							
							<form class="form-horizontal" id="signin_form">
								<div id="signin_pseudo" class="control-group">
									<label class="control-label" for="inputPseudoSign">Pseudo :</label>
									<div class="controls">
										<input type="text" id="inputPseudoSign" name="inputPseudoSign" placeholder="Pseudo">
										<span class="help-inline"></span>
									</div>
								</div>
								<div id="signin_email" class="control-group">
									<label class="control-label" for="inputEmailSign">Adresse email :</label>
									<div class="controls">
										<input type="text" id="inputEmailSign" name="inputEmailSign" placeholder="Adresse email">
										<span class="help-inline"></span>
									</div>
								</div>
								<div id="signin_confirm_email" class="control-group">
									<label class="control-label" for="inputConfirmEmailSign">Confirmez votre adresse email :</label>
									<div class="controls">
										<input type="text" id="inputConfirmEmailSign" name="inputConfirmEmailSign" placeholder="Email">
										<span class="help-inline"></span>
									</div>
								</div>
								<div id="signin_password" class="control-group">
									<label class="control-label" for="inputPasswordSign">Mot de passe :</label>
									<div class="controls">
										<input type="password" id="inputPasswordSign" placeholder="Mot de passe">
										<span class="help-inline"></span>
									</div>
								</div>
								<div id="signin_confirm_password" class="control-group">
									<label class="control-label" for="inputConfirmPasswordSign">Confirmez votre mot de passe :</label>
									<div class="controls">
										<input type="password" id="inputConfirmPasswordSign" placeholder="Confirmez votre mot de passe">
										<span class="help-inline"></span>
									</div>
								</div>
								<div class="control-group">
									<div class="controls">
										<input type="button" class="btn" onClick="mySignin();" value="INSCRIPTION" title="S'inscrire">
									</div>
								</div>
								<div id="signin_success" class="control-group">
									<span class="help-inline"></span>
								</div>
							</form>
						
						</div>
						
					</div>
				</div>
				
			</div>
			
		</div>
		
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" aria-hidden="true">Fermer</button>
		</div>
	</div>

    <div class="clear"></div>

    <div id="bg_content_top"></div>

    <div id="content_contenu" class="container-fluid">
        <div class="row-fluid">
            <div id="left_bar" class="span9">
                <div id="content_top">
                    <div id="center_content_top">
                        <h1>SCREWY EN QUELQUES MOTS</h1>
                        <p>Screwy est un jeu de rôle basé sur la communication entre les joueurs. 5 à 15 joueurs s'affrontent simultanément et essaient de survivre tant bien que mal...Ou de tuer tant bien que mal. Logique, déduction et bluff seront vos meilleurs alliés. Ne faites confiance à personne...</p>
                    </div>
                </div>

                <div id="principal_content">
                    <div class="news">
                        <div class="thenews">
                            <h2><a href="" title="Lire l'article">Derniere ligne droite avant la soutenance</a></h2>

                            <p class="infos_news">Par <a href="" title="Voir le profil de l'auteur" class="auteur_news">Starkadh</a>, il y a <span class="date_news">15 min</span><a href="" title="Voir les commentaires" class="nombre_commentaires_news">0 commentaire</a></p>

                            <div class="content_news">
                                <div class="row-fluid">
                                    <div class="img_news span2">
                                        <a href="" title="Lire l'article"><img src="style/images/Highway-To-Hell.jpg"></a>
                                    </div>

                                    <div class="texte_news span10">
                                        <p class="contenu_texte_news">Ça y est, nous voilà enfin dans la dernière ligne droite du projet. Beaucoup de choses sont encore à règler, mais nous restons confiants pour la soutenance. A venir sous peu : modification de quelques styles de page, amélioration des tours de jeu, rapports du projet.</p>

                                        <p class="plus_news"><a href="" title="Lire l'article">En savoir plus...</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="clear"></div>

                    <div class="news">
                        <div class="thenews">
                            <h2><a href="" title="Lire l'article">Nouvelles illustrations des cartes</a></h2>

                            <p class="infos_news">Par <a href="" title="Voir le profil de l'auteur" class="auteur_news">Don Dice</a>, il y a <span class="date_news">2 jours</span><a href="" title="Voir les commentaires" class="nombre_commentaires_news">5 commentaires</a></p>

                            <div class="content_news">
                                <div class="row-fluid">
                                    <div class="img_news span2">
                                        <a href="" title="Lire l'article"><img src="style/images/cartes/zombie.jpg"></a>
                                    </div>

                                    <div class="texte_news span10">
                                        <p class="contenu_texte_news">Bonne nouvelle pour tout le monde, voici les nouvelles illustrations des cartes, créées spécialement par Purit Kanchanawira.</p>

                                        <p class="plus_news"><a href="" title="Lire l'article">En savoir plus...</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="clear"></div>

                    <div class="news">
                        <div class="thenews">
                            <h2><a href="" title="Lire l'article">Illustration des cartes, version 1.0</a></h2>

                            <p class="infos_news">Par <a href="" title="Voir le profil de l'auteur" class="auteur_news">Don Dice</a>, il y a <span class="date_news">6 jours</span><a href="" title="Voir les commentaires" class="nombre_commentaires_news">10 commentaires</a></p>

                            <div class="content_news">
                                <div class="row-fluid">
                                    <div class="img_news span2">
                                        <a href="" title="Lire l'article"><img src="style/images/cartes/telekinesiste.jpg"></a>
                                    </div>

                                    <div class="texte_news span10">
                                        <p class="contenu_texte_news">Découvrez les illustrations des cartes par Purit Kanchanawira : pourquoi ce design, comment, quand, avec qui...Bref vous saurez tout ! Et surtout, n'hésitez pas à nous donner des retours !</p>

                                        <p class="plus_news"><a href="" title="Lire l'article">En savoir plus...</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="buttons_news">
                        <span class="prev_button"><a href="" title="Page précédente">PREC.</a></span> <span class="num_button actif_button"><a href="" title="Page 1">1</a></span> <span class="num_button"><a href="" title="Page 2">2</a></span> <span class="num_button"><a href="" title="Page 3">3</a></span> <span class="etc">...</span> <span class="num_button"><a href="" title="Page 10">10</a></span> <span class="num_button"><a href="" title="Page 11">11</a></span> <span class="num_button"><a href="" title="Page 12">12</a></span> <span class="next_button"><a href="" title="Page Suivante">Suiv.</a></span>

                        <div class="clear"></div>
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

            <p id="copyrights"><span class="email">© 2012 - 2013 <a href="index.php" title="Accueil" class="color_text">Screwy</a> . Tous droits réservés. Design par <a href="http://joottle.com" title="Portfolio de Joffrey Parisot" class="color_text">Joffrey Parisot</a>.</span></p>
        </div>
        </div>
    </footer>

    <script type="text/javascript" src="bootstrap/js/bootstrap.js"></script>

</body>
</html>
