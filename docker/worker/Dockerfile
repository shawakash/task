FROM node:21

WORKDIR /base

COPY ["package.json", "./package.json"]
COPY [".eslintrc.js", "./.eslintrc.js"]
COPY ["turbo.json", "./turbo.json"]
COPY ["yarn.lock", "./yarn.lock"]
COPY ["tsconfig.json", "./tsconfig.json"]

COPY ["packages/typescript-config", "./packages/typescript-config"]
COPY ["packages/eslint-config", "./packages/eslint-config"]
COPY ["backend/worker", "./backend/worker"]

RUN cd /base
RUN yarn install
RUN yarn run build

EXPOSE 8081

WORKDIR /base/backend/worker

CMD ["yarn", "dev"]
