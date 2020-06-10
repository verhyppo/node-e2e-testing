
FROM node:lts-stretch-slim

RUN mkdir -p /opt/e2e-testing
WORKDIR /opt/e2e-testing
COPY gulpfile.js /opt/e2e-testing/
COPY projects /opt/e2e-testing/project
COPY package*.json /opt/e2e-testing/
RUN npm i
CMD ["npm", "run", "start"]

