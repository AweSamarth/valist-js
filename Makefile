SHELL=/bin/bash

all: install valist

valist: frontend

install: install-sdk install-web install-evm-contracts install-evm-subgraph

install-sdk:
	npm install --prefix ./packages/valist-sdk

install-web:
	npm install --prefix ./packages/valist-web

install-evm-contracts:
	npm install --prefix ./packages/evm-contracts

install-evm-subgraph:
	npm install --prefix ./packages/evm-subgraph

sdk:
	npm run build --prefix ./packages/valist-sdk

web:
	rm -rf ./packages/web/out
	npm run build --prefix ./packages/valist-web
	npm run export --prefix ./packages/valist-web

frontend: sdk app

start: sdk
	npm run start --prefix ./packages/valist-sdk

evm-start-subgraph:
	docker-compose -f ./packages/evm-subgraph/docker-compose.yml up

evm-build-subgraph:
	npm run codegen --prefix ./packages/evm-subgraph
	npm run build --prefix ./packages/evm-subgraph

evm-deploy-subgraph: evm-build-subgraph
	npm run create-local --prefix ./packages/evm-subgraph
	npm run deploy-local --prefix ./packages/evm-subgraph

evm-build-contracts:
	npm run export-abi --prefix ./packages/evm-contracts
	rm -Rf ./packages/valist-sdk/src/contract/abis
	rm -Rf ./packages/evm-subgraph/abis
	cp -R ./packages/evm-contracts/abis ./packages/valist-sdk/src/contract/abis
	cp -R ./packages/evm-contracts/abis ./packages/evm-subgraph/abis

evm-deploy-contracts:
	npm run deploy:local --prefix ./packages/evm-contracts

dev-sdk:
	npm run dev --prefix ./packages/valist-sdk

dev-web:
	npm run dev --prefix ./packages/valist-web

dev:
	@make -j 2 dev-sdk dev-web

lint-sdk:
	npm run lint --prefix ./packages/valist-sdk

lint-web:
	npm run lint --prefix ./packages/valist-web

lint-fix-sdk:
	npm run lint:fix --prefix ./packages/valist-sdk

lint-fix-web:
	npm run lint:fix --prefix ./packages/valist-web

lint: lint-sdk lint-web

lint-fix: lint-fix-sdk lint-fix-web

test-sdk:
	npm run test --prefix ./packages/valist-sdk

test: test-sdk

clean:
	rm -rf ./packages/valist-web/.next
	rm -rf ./packages/valist-web/out
	rm -rf ./packages/valist-web/node_modules
	rm -rf ./packages/valist-sdk/node_modules
	rm -rf ./packages/valist-sdk/dist
	rm -rf ./packages/evm-subgraph/data
	rm -rf dist

.PHONY: packages
