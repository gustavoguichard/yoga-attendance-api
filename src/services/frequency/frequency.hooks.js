const { authenticate } = require('@feathersjs/authentication').hooks;
const normalizeParams = require('../../hooks/normalize-params');
const populateTeachers = require('../../hooks/populate-teachers');
const populatePractitioners = require('../../hooks/populate-practitioners');

module.exports = {
  before: {
    all: [ authenticate('jwt'), normalizeParams() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateTeachers(), populatePractitioners() ],
    get: [ populateTeachers(), populatePractitioners() ],
    create: [],
    update: [],
    patch: [],
    remove: []
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
