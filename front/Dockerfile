FROM node:18 as lct-front

WORKDIR /app/

COPY --chown=node:node \
    ./package.json \
    ./package-lock.json \
    ./vite.config.ts \
    ./tailwind.config.js \
    ./postcss.config.js \
    ./env.d.ts \
    ./tsconfig.json \
    ./

RUN npm ci

CMD ["npm", "run", "dev"]
