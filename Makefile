test:
      @./node_modules/.bin/mocha -u tdd --reporter spec --recursive

.PHONY: test