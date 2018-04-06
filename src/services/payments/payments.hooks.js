const { authenticate } = require('@feathersjs/authentication').hooks;
const openPayments = require('../../hooks/open-payments');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ openPayments() ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
