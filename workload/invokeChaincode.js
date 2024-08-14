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

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: functionName,
            transientMap: { [`${functionName}_properties`]: Buffer.from(JSON.stringify(data)) },
            readOnly: false
        };
        await this.sutAdapter.sendRequests(request);
    }

    generateDataForFunction(functionName){
        switch(functionName){
            case 'createAppointment':
                return this.generateAppointmentData();
            case 'updateAppointment':
                return this.generateUpdateData();
            case 'deleteAppointment':
                return this.generateDeleteData();
            default:
                throw new Error(`Unknown function ${functionName}`);
        }
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

    generateUpdateData(){
        return{
            id: `app${this.txIndex}`,
            doctorName: this.getRandomValue(this.doctorData).name,
            hospitalName: this.getRandomValue(this.hospitalData).name,
            appointmentDate: new Date().toISOString()
        };
    }

    generateDeleteData(){
        return{
            id: `app${this.txIndex}` //let's say id is known!
        };
    }
}

function createWorkloadModule(){
    return new ChaincodeWorkload();
}
module.exports.createWorkloadModule = createWorkloadModule;