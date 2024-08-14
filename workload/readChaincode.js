'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class QueryWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.id = [];
    this.txIndex = 0;
  }

  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    // Populate IDs or other data needed
  }

  async submitTransaction() {
    this.txIndex++;
    const functionName = this.roundArguments.contractFunction;
    const request = {
      contractId: this.roundArguments.contractId,
      contractFunction: functionName,
      contractArguments: this.getArgumentsForFunction(functionName),
      readOnly: true
    };

    await this.sutAdapter.sendRequests(request);
  }

  getArgumentsForFunction(functionName) {
    // Return arguments based on the function being tested
    switch (functionName) {
      case 'queryAppointment':
        return [/* IDs or other args for query */];
      // Add cases for other functions if needed
      default:
        throw new Error(`Unknown function ${functionName}`);
    }
  }
}

function readWorkloadModule() {
  return new QueryWorkload();
}

module.exports.createWorkloadModule = readWorkloadModule;
