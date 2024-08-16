'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');
const path = require('path');

class QueryWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
        this.generatedIDs = [];
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        // Load generated IDs from the file
        this.loadGeneratedIDs();
    }

    loadGeneratedIDs() {
        const idFilePath = path.resolve(__dirname, '..', 'data/generatedIDs.json');
        if (fs.existsSync(idFilePath)) {
            const fileContent = fs.readFileSync(idFilePath);
            this.generatedIDs = JSON.parse(fileContent);
        } else {
            throw new Error('Generated IDs file not found. Make sure invoke.js has run and created IDs.');
        }
    }

    async submitTransaction() {
        this.txIndex++;

        const functionName = this.roundArguments.contractFunction;
        const id = this.getRandomIDForFunction(functionName);

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: functionName,
            contractArguments: [id],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(request);
    }

    getRandomIDForFunction(functionName) {
        // Adjust the logic based on the function type to pick the correct ID
        switch (functionName) {
            case 'getPatient':
                return this.getRandomID('pat');
            case 'getAppointment':
                return this.getRandomID('app');
            case 'getDocument':
                return this.getRandomID('doc');
            default:
                throw new Error(`Unknown function ${functionName}`);
        }
    }

    getRandomID(prefix) {
        // Filter the IDs by the prefix (e.g., 'pat' for patients, 'app' for appointments, etc.)
        const filteredIDs = this.generatedIDs.filter(id => id.startsWith(prefix));
        if (filteredIDs.length === 0) {
            throw new Error(`No IDs found for prefix ${prefix}`);
        }
        return filteredIDs[Math.floor(Math.random() * filteredIDs.length)];
    }
}

function readWorkloadModule() {
    return new QueryWorkload();
}

module.exports.createWorkloadModule = readWorkloadModule;
