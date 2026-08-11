FROM node:22-alpine

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn workspace @emacare/mongo build && yarn workspace @emacare/prisma build && yarn workspace @emacare/shared-utils build && yarn workspace @emacare/notification-service build

EXPOSE 3007

CMD ["yarn", "workspace", "@emacare/notification-service", "start"]
