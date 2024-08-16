'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');
const path = require('path');

class queryAppointmentWorkload extends WorkloadModuleBase {
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

        // Randomly select an appointment ID to read
        const appointmentId = this.generatedIDs[Math.floor(Math.random() * this.generatedIDs.length)];

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'getAppointment',
            contractArguments: [appointmentId],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function readWorkloadModule() {
    return new queryAppointmentWorkload();
}

module.exports.createWorkloadModule = readWorkloadModule;
