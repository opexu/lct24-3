FROM node:18-alpine
WORKDIR /opt/
COPY ./package.json ./package-lock.json ./tsconfig.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm i
WORKDIR /opt/app
COPY ./ .
RUN npm run build && npm run strapi telemetry:disable
EXPOSE 1337
CMD ["npm", "run", "develop"]