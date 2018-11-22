const md5 = require('md5')
const { tail, words } = require('lodash')
const { authenticate } = require('@feathersjs/authentication').hooks
const { alterItems } = require('feathers-hooks-common/lib/services')
const validations = require('../../hooks/validations')
const generateToken = require('../../hooks/generate-token')
const normalizeData = require('../../hooks/normalize-data')
const populateEnrollments = require('../../hooks/populate-enrollments')
const mutualFamily = require('../../hooks/mutual-family')
const removeData = require('../../hooks/remove-practitioner-data')

const gravatar = email => {
  const hash = email && md5(email)
  return `https://gravatar.com/avatar/${hash}?s=100&d=mp`
}

const decoratePractitioner = alterItems(rec => {
  rec.displayName = rec.nickName || words(rec.fullName)[0]
  rec.surname = rec.nickName
    ? rec.fullName
    : tail(words(rec.fullName)).join(' ')
  rec.avatar = rec.picture || gravatar(rec.email)
})

const beforeEditing = [
  validations('practitioners'),
  normalizeData('practitioners'),
  mutualFamily(),
]

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [...beforeEditing, generateToken()],
    update: beforeEditing,
    patch: beforeEditing,
    remove: [],
  },

  after: {
    all: [populateEnrollments(), decoratePractitioner],
    find: [],
    get: [],
    create: [mutualFamily()],
    update: [mutualFamily()],
    patch: [mutualFamily()],
    remove: [removeData()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
