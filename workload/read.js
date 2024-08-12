'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class queryAppointmentWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.id = [];
        this.txIndex = 0;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        
        // Generate a list of appointment IDs to read
        // This assumes you've already created appointments with IDs in this format
        for (let i = 1; i <= 1000; i++) {  // Adjust this number based on how many appointments you expect to have
            this.id.push(`app${i}`);
        }
    }

    async submitTransaction() {
        this.txIndex++;
        
        // Randomly select an appointment ID to read
        const appointmentId = this.id[Math.floor(Math.random() * this.id.length)];

        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'getAppointment',  // Assume you have a readAppointment function in your chaincode
            contractArguments: [appointmentId],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        // Any cleanup code can go here
    }
}

function readWorkloadModule() {
    return new queryAppointmentWorkload();
}

module.exports.createWorkloadModule = readWorkloadModule;