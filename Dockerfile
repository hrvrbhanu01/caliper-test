FROM node:18

# Set working directory
WORKDIR /caliper-test

COPY package*.json ./

RUN npm install

# Copy the rest of the Caliper files into the container
COPY ccp.yaml /caliper-test/network/ccp.yaml
COPY network.yaml /caliper-test/network/network.yaml
COPY config.yaml /caliper-test/benchmark/config.yaml
COPY invoke.js /caliper-test/workload/invoke.js
COPY read.js /caliper-test/workload/read.js

# Set the command to start Caliper
CMD ["npx", "caliper", "launch", "manager", "--caliper-workspace", "/caliper-test", "--caliper-benchconfig", "/caliper-test/benchmark/config.yaml", "--caliper-networkconfig", "/caliper-test/network/network.yaml"]
