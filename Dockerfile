FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json & dependency
COPY package*.json ./
RUN npm install

# Compile
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

RUN npm install --only=production

EXPOSE 3000

# Run
CMD ["node", "dist/main"]