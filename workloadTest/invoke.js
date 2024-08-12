'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class CreateAppointmentWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
        this.patientIDs = ["patient1", "patient2", "patient3", "patient4", "patient5"];
        this.patientNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
        this.phoneNumbers = ["1234567890", "2345678901", "3456789012", "4567890123", "5678901234"];
        this.abhaNos = ["ABHA001", "ABHA002", "ABHA003", "ABHA004", "ABHA005"];
        this.doctorNames = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones"];
        this.hospitalNames = ["City Hospital", "General Hospital", "Central Clinic", "Medical Center", "Health Institute"];
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        this.workerIndex = workerIndex;
        this.totalWorkers = totalWorkers;
        this.roundIndex = roundIndex;
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        this.txIndex++;
        const appointmentID = `app${this.txIndex}`;

        const appointmentData = {
            id: appointmentID,
            patientID: this.getRandomValue(this.patientIDs),
            patientName: this.getRandomValue(this.patientNames),
            phoneNumber: this.getRandomValue(this.phoneNumbers),
            abhaNo: this.getRandomValue(this.abhaNos),
            doctorName: this.getRandomValue(this.doctorNames),
            hospitalName: this.getRandomValue(this.hospitalNames)
        };

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'createAppointment',
            transientMap: { createAppointment_properties: Buffer.from(JSON.stringify(appointmentData)) },
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }

    getRandomValue(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

function createWorkloadModule() {
    return new CreateAppointmentWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;