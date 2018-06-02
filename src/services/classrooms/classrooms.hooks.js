const { authenticate } = require('@feathersjs/authentication').hooks
const { populateTeacher } = require('../../hooks/populate')
const normalizeData = require('../../hooks/normalize-data')
const mutualRegularPrice = require('../../hooks/mutual-regular-price')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ normalizeData('classrooms') ],
    update: [ normalizeData('classrooms') ],
    patch: [ normalizeData('classrooms') ],
    remove: []
  },

  after: {
    all: [ populateTeacher ],
    find: [],
    get: [],
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
