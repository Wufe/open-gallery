FROM node:12.6

WORKDIR /app
COPY release /app
RUN ls -al /app && \
	npm install && \
	npm run build:prod && \
	ls -al dist && \
	mkdir -p /tmp/app && \
	mv dist /tmp/app/dist && \
	mv node_modules /tmp/app/node_modules && \
	mv public /tmp/app/public && \
	mv presentation /tmp/app/presentation && \
	rm -rf /app && \
	mv /tmp/app /app

CMD node dist/server-backend.js