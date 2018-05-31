const { authenticate } = require('@feathersjs/authentication').hooks
const { populateTeacher } = require('../../hooks/populate')
const mutualRegularPrice = require('../../hooks/mutual-regular-price')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ authenticate('jwt') ],
    find: [ populateTeacher ],
    get: [ populateTeacher ],
    create: [ mutualRegularPrice() ],
    update: [ mutualRegularPrice() ],
    patch: [ mutualRegularPrice() ],
    remove: [ ]
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
}
