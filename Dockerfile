FROM node:12

SHELL ["/bin/bash", "-c"]

WORKDIR /usr/bin/

COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm install

COPY seeswap.sh seeswap

RUN chmod +x seeswap

COPY contracts contracts

COPY cmd cmd

COPY setup.sh setup.sh

WORKDIR /root

ENTRYPOINT ["/usr/bin/setup.sh"]