<?php
	function getAllComments($id_image){
	
		//Connexion à la bdd
		include("connect.php");
		
		$id_image = $id_image;
		
		//On va chercher tous les commentaires relatifs à l'id de l'image, triés par date
		$get_all_comments = $connexion->prepare("SELECT comment_author, comment_text, comment_date, comment_date_tri FROM Comments WHERE comment_picture_id = :id_image ORDER BY comment_date_tri DESC");
		//On lie notre variable
		$get_all_comments->bindValue('id_image', $id_image, PDO::PARAM_INT);
		//On exécute
		$get_all_comments->execute();
		
		//Tant qu'on a une ligne à afficher
		while($all_comments = $get_all_comments->fetch()){
			
			//On stocke nos résultats dans des variables
			$comment_author = $all_comments['comment_author'];
			$comment_text = $all_comments['comment_text'];
			$comment_date = $all_comments['comment_date'];
			$comment_date_tri = $all_comments['comment_date_tri'];
			
			$dateReadable = date('l jS \of F Y \a\t h:i:s A', $comment_date_tri);
			
			//On va chercher l'id et l'avatar de l'auteur du commentaire
			$get_id_avatar = $connexion->prepare("SELECT user_id, user_avatar FROM Users WHERE pseudo = :comment_author");
			//On lie notre variable
			$get_id_avatar->bindValue('comment_author', $comment_author, PDO::PARAM_STR);
			//On exécute
			$get_id_avatar->execute();
			//On récupère tout ça
			$id_avatar = $get_id_avatar->fetch();
			//Clore la requête préparée
			$get_id_avatar->closeCursor();
			$get_id_avatar = NULL;
			
			//On stocke dans des variables l'id et l'avatar
			$id_author = $id_avatar['user_id'];
			$url_avatar = $id_avatar['user_avatar'];

			//On affiche le commentaire
			print("
				<div class='a_comment'>
					<a href='profile.php?member=$id_author'><img src='$url_avatar' alt='$comment_author Avatar' /></a>
					<div class='content_comment'>
						<p class='infos_comment'>By <a href='profile.php?member=$id_author'>$comment_author</a>, the $dateReadable</p>
						<p class='a_text_comment'>$comment_text</p>
					</div>
				</div>
			");
		}
		//Clore la requête préparée
		$get_all_comments->closeCursor();
		$get_all_comments = NULL;
	}
?>