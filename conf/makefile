all: ../php-server/scripts/php/connect.php ../node-server/db-param.js

../php-server/scripts/php/connect.php: ../php-server/scripts/php/connect.sample.php database.conf
	./apply_conf.sh database.conf ../php-server/scripts/php/connect.sample.php ../php-server/scripts/php/connect.php

../node-server/db-param.js: ../node-server/db-param.sample.js database.conf
	./apply_conf.sh database.conf ../node-server/db-param.sample.js ../node-server/db-param.js


database.conf : samples/database.sample.conf
	cp samples/database.sample.conf database.conf

clean:

mrproper:
	rm ../php-server/scripts/php/connect.php
	rm ../node-server/db-param.js
