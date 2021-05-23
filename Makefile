JS_COMPILER = ./node_modules/.bin/uglifyjs
TESTER = ./node_modules/.bin/nodeunit

all: tree.min.js tree.d.ts

test: tree.js
	$(TESTER) test/tree-test.js

test-cov: tree.js
	./node_modules/.bin/istanbul cover \
	  $(TESTER) -- test/tree-test.js

tree.min.js: tree.js
	@rm -f $@
	$(JS_COMPILER) < tree.js > $@

clean:
	rm -f tree.min.js tree.js tree.js.map tree.d.ts

tree.js tree.d.ts tree.js.map: tree.ts tsconfig.json Makefile package.json
	npm run ts

.PHONY: all clean test test-w test-cov
