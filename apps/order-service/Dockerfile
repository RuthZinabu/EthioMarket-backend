FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn workspace @emacare/shared-utils build && yarn workspace @emacare/order-service build

EXPOSE 3003

CMD ["yarn", "workspace", "@emacare/order-service", "start"]
