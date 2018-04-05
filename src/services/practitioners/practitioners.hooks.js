const { authenticate } = require('@feathersjs/authentication').hooks;
const normalizeParams = require('../../hooks/normalize-params');
const generateToken = require('../../hooks/generate-token');
const populateFamily = require('../../hooks/populate-family');
const populateEnrollments = require('../../hooks/populate-enrollments');
const mutualFamily = require('../../hooks/mutual-family');
const removeMutualFamily = require('../../hooks/remove-mutual-family');
const undecoratePractitioner = require('../../hooks/undecorate-practitioner');
const decoratePractitioner = require('../../hooks/decorate-practitioner');

module.exports = {
  before: {
    all: [ authenticate('jwt'), normalizeParams() ],
    find: [],
    get: [],
    create: [ undecoratePractitioner(), mutualFamily(), generateToken() ],
    update: [ undecoratePractitioner(), mutualFamily() ],
    patch: [ undecoratePractitioner(), mutualFamily() ],
    remove: []
  },

  after: {
    all: [],
    find: [ populateFamily(), populateEnrollments(), decoratePractitioner() ],
    get: [ populateFamily(), populateEnrollments(), decoratePractitioner() ],
    create: [ mutualFamily() ],
    update: [ mutualFamily() ],
    patch: [ mutualFamily() ],
    remove: [ removeMutualFamily() ]
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
