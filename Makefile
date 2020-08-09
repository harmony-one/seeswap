.PHONY: isntall build build-cached upload upload-test help run

install:
	npm install

build:
	docker build -t harmonyone/seeswap . --no-cache

build-cached:
	docker build -t harmonyone/seeswap .

upload: build
	docker push harmonyone/localnet-test
