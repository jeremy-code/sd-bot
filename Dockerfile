# allow control node.js version from command line
ARG NODE_VERSION=16.14.2
FROM node:${NODE_VERSION}-alpine3.15 as base
# cache bust to make sure the next step is running 
# modify this if you found docker image caching
# make OS level software not up to date
LABEL cache_burst_date=2022-04-05
# force latest security fix 
RUN apk update && apk upgrade 
WORKDIR /app

#---------------------
FROM base as base-deps 
COPY package.json yarn.lock ./
# only package.json's dependency is install as this stage
RUN yarn install --frozen-lockfile --production

#---------------------
FROM base-deps as builder
# install missing devDependencies, 
# base-deps already have some yarn's cache so this should be fast
RUN yarn --frozen-lockfile 
COPY . . 
RUN yarn build

#---------------------
FROM base 
COPY --from=base-deps app/node_modules node_modules 
COPY --from=builder app/dist dist
# use node user to run the app, because root is not a good idea
RUN adduser -u 1002 -D -h /nodeuser nodeuser && \ 
  chown -R nodeuser ./ && \ 
  chmod -R u=rwX,go= ./ 
USER nodeuser
WORKDIR /app 
ENV NODE_ENV=production 
EXPOSE 8080 
CMD ["node", "dist/app.js"]