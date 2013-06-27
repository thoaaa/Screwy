var sys = require('sys');
var _mysql = require('mysql');

function recupererCle(pseudo, cle) {
    var HOST = 'localhost';
    var USER = 'user';
    var PASS = 'mdp';
    var DB = 'database';
    var CHAMP = 'champ';
    var TABLE = 'table';

    console.log(pseudo);
    consolo.log(cle);

    var mysql = _mysql.createClient({
        host: HOST;
        user: USER;
        password: PASS;
    });

    mysql.query('use '+ DATABASE);

    console.log('Connexion effectue');

    mysql.query('SELECT * FROM '+ TABLE +' WHERE pseudo=' + pseudo + ' AND cle=' + cle +'', function(error, results) {
        if (error) {
            console.log('Erreur ' + error.message);
            return;
        }
        else {
            for(var i in result) {
                var record = result[i];
                console.log (record.title);
            }
        }
    });

    mysql.query('DELETE '+ CHAMP +' FROM '+ TABLE +' WHERE pseudo=' + pseudo + '', function(error, results) {
        if (error) {
            console.log('Erreur ' + error.message);
            return;
        }
        else {
            for(var i in result) {
                var record = result[i];
                console.log (record.title);
            }
        }

      mysql.end();
      console.log('Fin de connexion');
    });
}
