FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

# copy all files in src

COPY src ./src

RUN npm install --omit=dev

RUN npm run build

RUN npm prune --omit=dev

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY --from=build /app/src/docs ./dist/docs

ENV PORT=3000

EXPOSE $PORT

CMD ["node", "dist/server.js"]