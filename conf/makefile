
AC=./apply_conf.sh
EXEC=../php-server/scripts/php/connect.php ../node-server/db-param.js ../node-server/nodeServer-param.js ../php-server/scripts/js/nodeServer-param.js

all: $(EXEC)

../php-server/scripts/php/connect.php: database.conf ../php-server/scripts/php/connect.sample.php
	@$(AC) $^ $@

../node-server/db-param.js:  database.conf ../node-server/db-param.sample.js
	@$(AC) $^ $@
	
../node-server/nodeServer-param.js: nodeServer.conf ../node-server/nodeServer-param.sample.js
	@$(AC) $^ $@
	
../php-server/scripts/js/nodeServer-param.js: nodeServer.conf ../php-server/scripts/js/nodeServer-param.sample.js
	@$(AC) $^ $@

database.conf : samples/database.sample.conf
	@echo 'Please configure the file "/conf/database.conf"'
	@cp $^ $@
	
nodeServer.conf : samples/nodeServer.sample.conf
	@echo 'Please configure the file "/conf/nodeServer.conf"'
	@cp $^ $@

clean:
	@rm $(EXEC)

mrproper: clean
