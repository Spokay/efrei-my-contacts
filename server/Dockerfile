FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

# copy all files in src

COPY src ./src

RUN npm install --omit=dev

RUN npm prune --omit=dev

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/src ./src

COPY --from=build /app/src/docs ./docs

ENV PORT=3000

EXPOSE $PORT

CMD ["node", "src/server.js"]