<?php
	session_start();
	$pseudo = $_SESSION['pseudo'];
	$_post[idSalon];
	
	
	function recupererCle(pseudo, cle) {
    if ( ! function_exists('echo') ) {
        function echo() {
            echo 'ROCCO ça marche pas';
        }
    }
    echo 'ROCCO ça marche';
    $cle = "gthuhg23445ffbn35";
    return $cle;
	}
?>
<html>
	<form method="POST" enctype="multipart/form-data" >
		<ul>
			<li><input type='hidden' name='pseudo' value="pseudo" /></li>
			<li><input type='hidden' name='idSalon' value="idSalon" /></li>
			<li><input type='hidden' name='cle' value="cle" /></li>
		</ul>
	</form>
</html>