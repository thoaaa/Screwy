<?php
	//On récupère nos valeurs POST pour plus de clarté
	$comment = $_POST["comment"];
	$idUser = $_POST["idUser"];
	$idPicture = $_POST["idPicture"];
	$pseudoAuthor = $_POST["pseudoAuthor"];
		
	//On récupère la date d'upload du commentaire sur le serveur
	$date_add = date("Y-m-d");
	
	//Date en secondes
	$current_date = time();
	$currentDateReadable = date('l jS \of F Y \a\t h:i:s A', $current_date);
	
	//Connexion à la bdd
	include("connect.php");
	
	//On ajoute le commentaire dans la bdd
	$add_comment = $connexion->prepare("INSERT INTO Comments (comment_picture_id, comment_author, comment_text, comment_date, comment_date_tri) VALUES (:comment_picture_id, :comment_author, :comment_text, :comment_date, :comment_date_tri)");
	//On lie les valeurs de mes variables à la requête
	$add_comment->bindValue('comment_picture_id', $idPicture, PDO::PARAM_STR);
	$add_comment->bindValue('comment_author', $pseudoAuthor, PDO::PARAM_STR);
	$add_comment->bindValue('comment_text', $comment, PDO::PARAM_STR);
	$add_comment->bindValue('comment_date', $date_add, PDO::PARAM_STR);
	$add_comment->bindValue('comment_date_tri', $current_date, PDO::PARAM_INT);
	//On exécute
	$add_comment->execute();
	//Clore la requête préparée
	$add_comment->closeCursor();
	$add_comment = NULL;
	
	//On récupère l'avatar de l'utilisateur
	$get_avatar = $connexion->prepare("SELECT user_avatar FROM Users WHERE pseudo = :pseudo");
	//On lie les valeurs de mes variables à la requête
	$get_avatar->bindValue('pseudo', $pseudoAuthor, PDO::PARAM_STR);
	//On exécute
	$get_avatar->execute();
	//On récupère tout ça
	$avatar = $get_avatar->fetch();
	//Clore la requête préparée
	$get_avatar->closeCursor();
	$get_avatar = NULL;
	
	$url_avatar = $avatar['user_avatar'];
	
	//On affiche le commentaire
	print("
		<div class='a_comment'>
			<a href='profile.php?member=$idUser'><img src='$url_avatar' alt='$pseudoAuthor Avatar' /></a>
			<div class='content_comment'>
				<p class='infos_comment'>By <a href='profile.php?member=$idUser'>$pseudoAuthor</a>, the $currentDateReadable</p>
				<p class='a_text_comment'>$comment</p>
			</div>
		</div>
	");
?>