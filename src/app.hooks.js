// Application hooks that run for every service
const logger = require('./hooks/logger')
const { setNow } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [ hook => {if(hook.params.provider) console.log(hook.params.provider, hook.params.headers); return hook} ],
    find: [],
    get: [],
    create: [ setNow('updatedAt') ],
    update: [ setNow('updatedAt') ],
    patch: [ setNow('updatedAt') ],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
