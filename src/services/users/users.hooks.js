const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

const syncOauthToLocal = require('../../hooks/sync-oauth-to-local');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [hashPassword(), syncOauthToLocal()],
    update: [...restrict, hashPassword(), syncOauthToLocal()],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
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
