FROM node:16.15-alpine

COPY package*.json ./
RUN ["npm", "i", "--legacy-peer-deps"]
RUN ["npm", "cache", "clean", "-f"]

COPY . .
RUN ["npm", "run","build"]
CMD ["node", "dist/main.js"]
