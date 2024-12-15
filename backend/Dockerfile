FROM node:12-slim

USER node

RUN mkdir /home/node/src

WORKDIR /home/node/src

COPY --chown=node:node package.json yarn.lock ./

# install right after copying package.json and yarn.lock and before copying
# all the code to avoid needing to re-install when only the code changed
RUN yarn install --pure-lockfile --prod --frozen-lockfile --ignore-engines --ignore-optional --non-interactive

COPY --chown=node:node dist dist
# only for local testing
# COPY --chown=node:node .env .env

CMD ["yarn", "start"]