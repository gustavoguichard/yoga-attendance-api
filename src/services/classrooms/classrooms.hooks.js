const { authenticate } = require('@feathersjs/authentication').hooks
const permissions = require('../../hooks/permissions')
const permitOwner = require('../../hooks/permit-owner')
const normalizeData = require('../../hooks/normalize-data')
const mutualRegularPrice = require('../../hooks/mutual-regular-price')

const checkAdmin = permissions({ roles: ['admin'] })
const checkOwner = permitOwner('classrooms', 'teacher')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ checkAdmin, normalizeData('classrooms') ],
    update: [ checkOwner, checkAdmin, normalizeData('classrooms') ],
    patch: [ checkOwner, checkAdmin, normalizeData('classrooms') ],
    remove: [ checkAdmin ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ mutualRegularPrice() ],
    update: [ mutualRegularPrice() ],
    patch: [ mutualRegularPrice() ],
    remove: [ ],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  }
}
