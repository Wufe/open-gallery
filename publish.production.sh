#!/bin/sh

date=$(date +'%m-%d-%Y_%H-%M')

rm -rf tmp
mkdir tmp
mkdir tmp/release
rsync -av --progress ./ ./tmp/release/ --exclude node_modules --exclude tmp --exclude .vscode --exclude dist --exclude public/uploads --exclude public/static/node --exclude public/static/web --exclude .tmp --exclude .git
tar -czvf tmp/src.tar.gz ./tmp*
ssh s01.elisaevito 'mkdir -p /tmp/gallery'
scp ./tmp/src.tar.gz root@s01.elisaevito:/tmp/gallery/src.tar.gz
ssh s01.elisaevito 'cd /tmp/gallery && tar -xzvf src.tar.gz && rm src.tar.gz'
ssh s01.elisaevito 'cd /tmp/gallery/tmp/release && chmod +x publish.docker.sh && ./publish.docker.sh'
ssh s01.elisaevito 'mkdir -p /root/gallery && mv /tmp/gallery/tmp/release/docker-compose.production.yml /root/gallery/docker-compose.production.yml && rm -rf /tmp/gallery'
ssh s01.elisaevito 'mkdir -p /root/gallery/backup/mysql/'$date' && cp -R /root/gallery/mysql /root/gallery/backup/mysql/'$date
ssh s01.elisaevito 'cd /root/gallery && docker-compose -f docker-compose.production.yml down && docker-compose -f docker-compose.production.yml rm && docker-compose -f docker-compose.production.yml up -d'
rm -rf tmp
ssh s01.elisaevito 'cd /root/gallery && docker-compose -f docker-compose.production.yml logs -f'

# docker save gallery > tmp/gallery.tar

# ssh s01.elisaevito 'cd /tmp && docker load < gallery.tar'