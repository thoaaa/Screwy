
AC=./apply_conf.sh
EXEC=../php-server/scripts/php/connect.php ../node-server/conf/DbParam.js ../node-server/conf/NodeServerParam.js ../php-server/scripts/js/nodeServer-param.js

all: $(EXEC)

../php-server/scripts/php/connect.php: database.conf ../php-server/scripts/php/connect.sample.php
	@$(AC) $^ $@

../node-server/conf/DbParam.js:  database.conf ../node-server/conf/DbParam.sample.js
	@$(AC) $^ $@
	
../node-server/conf/NodeServerParam.js: nodeServer.conf ../node-server/conf/NodeServerParam.sample.js
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
