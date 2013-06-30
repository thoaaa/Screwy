all:
	@cd conf && $(MAKE)

clean:
	@cd conf && $(MAKE) clean
	
mrproper:
	@cd conf && $(MAKE) mrproper
