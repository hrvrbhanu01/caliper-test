FROM node:18-alpine

WORKDIR /caliper-test

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "caliper", "launch", "manager", "--caliper-workspace", "/caliper-test", "--caliper-benchconfig", "/caliper-test/benchmark/config.yaml", "--caliper-networkconfig", "/caliper-test/network/network.yaml"]
