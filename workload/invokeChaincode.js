'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const fs = require('fs');
const path = require('path');

class ChaincodeWorkload extends WorkloadModuleBase {
    constructor(){
        super();
        this.txIndex = 0;
        this.patientData = this.loadDataFromFile('patients.json');
        this.doctorData = this.loadDataFromFile('doctors.json');
        this.hospitalData = this.loadDataFromFile('hospitals.json');
        this.documentData = this.loadDataFromFile('documents.json');
    }

    loadDataFromFile(fileName) {
        const filePath = path.resolve(__dirname, '..', 'data', fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    }

    getRandomValue(array){
        return array[Math.floor(Math.random() * array.length)];
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext){
        this.workerIndex = workerIndex;
        this.totalWorkers = totalWorkers;
        this.roundIndex = roundIndex;
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction(){
        this.txIndex++;
        const functionName = this.roundArguments.contractFunction;
        const data = this.generateDataForFunction(functionName);

        // Store the generated ID in a file
        this.storeGeneratedID(data.id);

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: functionName,
            transientMap: { [`${functionName}_properties`]: Buffer.from(JSON.stringify(data)) },
            readOnly: false
        };
        await this.sutAdapter.sendRequests(request);
    }

    storeGeneratedID(id) {
        const idFilePath = path.resolve(__dirname, '..', 'data/generatedIDs.json');
        let generatedIDs = [];

        if (fs.existsSync(idFilePath)) {
            const fileContent = fs.readFileSync(idFilePath);
            generatedIDs = JSON.parse(fileContent);
        }

        generatedIDs.push(id);

        fs.writeFileSync(idFilePath, JSON.stringify(generatedIDs, null, 2));
    }

    generateDataForFunction(functionName){
        switch(functionName){
            case 'createPatient':
                return this.generateCreatePatientData();
            case 'updatePatient':
                return this.generateUpdatePatientData();
            case 'deletePatient':
                return this.generateDeletePatientData();
            case 'createAppointment':
                return this.generateAppointmentData();
            case 'updateAppointment':
                return this.generateUpdateAppointmentData();
            case 'deleteAppointment':
                return this.generateDeleteAppointmentData();
            default:
                throw new Error(`Unknown function ${functionName}`);
        }
    }

    generateCreatePatientData(){
        return{
            id: `pat${this.txIndex}`,
            abhaNo: this.getRandomValue(this.patientData).abhaNo,
            patientName: this.getRandomValue(this.patientData).name,
            age: this.getRandomValue(this.patientData).age,
            gender: this.getRandomValue(this.patientData).gender,
            phoneNumber: this.getRandomValue(this.patientData).phoneNumber,
            address: this.getRandomValue(this.patientData).address,
            timestamp: new Date().toISOString()
        };
    }

    generateUpdatePatientData(){
        return{
            id: `pat${this.txIndex}`,
            age: this.getRandomValue(this.patientData).age,
            address: this.getRandomValue(this.patientData).address
        };
    }

    generateDeletePatientData(){
        return{
            id: `pat${this.txIndex}`
        };
    }

    generateAppointmentData(){
        return{
            id: `app${this.txIndex}`,
            patientID: this.getRandomValue(this.patientData).patientID,
            patientName: this.getRandomValue(this.patientData).name,
            phoneNumber: this.getRandomValue(this.patientData).phoneNumber,
            abhaNo: this.getRandomValue(this.patientData).abhaNo,
            doctorName: this.getRandomValue(this.doctorData).name,
            hospitalName: this.getRandomValue(this.hospitalData).name,
            appointmentDate: new Date().toISOString()
        };
    }

    generateUpdateAppointmentData(){
        return{
            id: `app${this.txIndex}`,
            doctorName: this.getRandomValue(this.doctorData).name,
            hospitalName: this.getRandomValue(this.hospitalData).name,
            appointmentDate: new Date().toISOString()
        };
    }

    generateDeleteAppointmentData(){
        return{
            id: `app${this.txIndex}`
        };
    }
}

function createWorkloadModule(){
    return new ChaincodeWorkload();
}
module.exports.createWorkloadModule = createWorkloadModule;
