FROM mhart/alpine-node:8.1

WORKDIR /src
ADD . .

RUN apk add --no-cache bash git openssh python make gcc g++ && \
    npm install --no-optional --unsafe-perm && \
    npm run build && \
    npm prune --production && \
    apk del bash git openssh python make gcc g++ && \
    rm -rf ./common ./server ./client

CMD ["npm", "start"]

EXPOSE 3000
