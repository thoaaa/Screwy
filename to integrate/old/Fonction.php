<?php
// INCLURE ICI LE FICHIER CONNEXION.PHP
// include("connexion.php");

$key = generateKey();
echo $key;
insertKey($pseudo, $key);

function generateKey() {
// LA VOILA TA CLEEEEEEEEEEEEEE
    $key = md5(uniqid(microtime().rand(0, 9999)));
    return $key;
}

function insertKey($pseudo, $key) {
    try {
        $connexion = new PDO('mysql:host='. $host .';dbname= '. $ma_base, $user, $password);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $connexion->exec("SET CHARACTER SET utf8");
    }
    catch(PDOException $e) {
        $msg = 'ERREUR PDO dans ' . $e->getFile() . ' L.' . $e->getLine() . ' : ' . $e->getMessage();
        die($msg);
    }

    try {    
        $query = $connexion->exec("INSERT INTO table VALUES(".$pseudo.", ".$cle."");
        $connexion = null
    }
    catch (PDOException $e) {
        die('Une erreur est survenue lors de l\'enregistrement de la clé.');
    }
}
?>
