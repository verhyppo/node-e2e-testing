
FROM node:lts-stretch-slim

RUN mkdir -p /opt/e2e-testing
WORKDIR /opt/e2e-testing
COPY .env /opt/e2e-testing/
COPY index.js /opt/e2e-testing/
COPY project /opt/e2e-testing/project
COPY package*.json /opt/e2e-testing/
RUN npm ci
CMD ["npm", "run", "start"]