install:
	npm install

build:
	rm -rf dist
	mkdir dist
	npm run build
	chmod +x dist/bin/gendiff.js

test:
	npm run test

start:
	npx babel-node src/bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npx eslint .
