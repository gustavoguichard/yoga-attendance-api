const { authenticate } = require('@feathersjs/authentication').hooks;
const normalizeParams = require('../../hooks/normalize-params');
const avoidDuplicateFrequency = require('../../hooks/avoid-duplicate-frequency');
const populatePractitioners = require('../../hooks/populate-practitioners');
const populateClassroom = require('../../hooks/populate-classroom');
const updatePayments = require('../../hooks/update-payments');

module.exports = {
  before: {
    all: [ authenticate('jwt'), normalizeParams() ],
    find: [],
    get: [],
    create: [ avoidDuplicateFrequency() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateClassroom(), populatePractitioners() ],
    get: [ populateClassroom(), populatePractitioners() ],
    create: [ updatePayments() ],
    update: [ updatePayments() ],
    patch: [ updatePayments() ],
    remove: [ updatePayments() ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
