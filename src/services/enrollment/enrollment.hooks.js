const { authenticate } = require('@feathersjs/authentication').hooks;
const undecorateEnrollment = require('../../hooks/undecorate-enrollment');
const decorateEnrollment = require('../../hooks/decorate-enrollment');


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ undecorateEnrollment() ],
    update: [ undecorateEnrollment() ],
    patch: [ undecorateEnrollment() ],
    remove: []
  },

  after: {
    all: [],
    find: [ decorateEnrollment() ],
    get: [ decorateEnrollment() ],
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
