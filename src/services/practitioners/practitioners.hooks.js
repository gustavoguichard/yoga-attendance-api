const md5 = require('md5')
const { authenticate } = require('@feathersjs/authentication').hooks
const generateToken = require('../../hooks/generate-token')
const { populateFamily } = require('../../hooks/populate')
const populateEnrollments = require('../../hooks/populate-enrollments')
const mutualFamily = require('../../hooks/mutual-family')
const removeMutualFamily = require('../../hooks/remove-mutual-family')
const { alterItems } = require('feathers-hooks-common/lib/services')

const gravatar = email => {
  const hash = email && md5(email)
  return `http://gravatar.com/avatar/${hash}?s=100&d=mp`
}

const decoratePractitioner = alterItems(rec => {
  rec.displayName = rec.nickName || rec.fullName
  rec.picture = rec.picture || gravatar(rec.email)
})

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ mutualFamily(), generateToken() ],
    update: [ mutualFamily() ],
    patch: [ mutualFamily() ],
    remove: []
  },

  after: {
    all: [ populateEnrollments(), populateFamily, decoratePractitioner ],
    find: [],
    get: [],
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
