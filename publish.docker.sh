#!/bin/sh

rm -rf docker/release
mkdir docker/release
rsync -av --progress ./ ./docker/release/ --exclude node_modules --exclude .vscode --exclude report
docker build -t gallery:latest docker
rm -rf docker/release