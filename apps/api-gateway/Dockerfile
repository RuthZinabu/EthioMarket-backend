FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn workspace @emacare/shared-utils build && yarn workspace @emacare/api-gateway build

EXPOSE 3000

CMD ["yarn", "workspace", "@emacare/api-gateway", "start"]
