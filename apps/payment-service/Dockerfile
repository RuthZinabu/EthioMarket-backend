FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn workspace @emacare/shared-utils build && yarn workspace @emacare/payment-service build

EXPOSE 3005

CMD ["yarn", "workspace", "@emacare/payment-service", "start"]
