const { authenticate } = require('@feathersjs/authentication').hooks
const populateTeachers = require('../../hooks/populate-teachers')
const mutualRegularPrice = require('../../hooks/mutual-regular-price')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateTeachers() ],
    get: [ populateTeachers() ],
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
