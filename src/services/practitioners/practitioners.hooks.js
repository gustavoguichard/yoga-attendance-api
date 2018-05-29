const { authenticate } = require('@feathersjs/authentication').hooks
const { paramsFromClient } = require('feathers-hooks-common')
const generateToken = require('../../hooks/generate-token')
const { populateFamily } = require('../../hooks/populate')
const mutualFamily = require('../../hooks/mutual-family')
const removeMutualFamily = require('../../hooks/remove-mutual-family')
const { alterItems } = require('feathers-hooks-common/lib/services')

const decoratePractitioner = alterItems(rec => {
  rec.displayName = rec.nickName || rec.fullName
  return rec
})

module.exports = {
  before: {
    all: [ authenticate('jwt'), paramsFromClient('populateFamily') ],
    find: [],
    get: [],
    create: [ mutualFamily(), generateToken() ],
    update: [ mutualFamily() ],
    patch: [ mutualFamily() ],
    remove: []
  },

  after: {
    all: [],
    find: [ populateFamily, decoratePractitioner ],
    get: [ populateFamily, decoratePractitioner ],
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
}
