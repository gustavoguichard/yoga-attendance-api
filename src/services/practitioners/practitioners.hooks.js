const { authenticate } = require('@feathersjs/authentication').hooks;

const generateToken = require('../../hooks/generate-token');
const undecoratePractitioner = require('../../hooks/undecorate-practitioner');
const decoratePractitioner = require('../../hooks/decorate-practitioner');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ undecoratePractitioner(), generateToken() ],
    update: [ undecoratePractitioner() ],
    patch: [ undecoratePractitioner() ],
    remove: []
  },

  after: {
    all: [],
    find: [ decoratePractitioner() ],
    get: [ decoratePractitioner() ],
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
