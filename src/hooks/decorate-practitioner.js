const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const practitioners = method === 'find' ? result.data : [ result ]
    practitioners.map(person => {
      person.displayName = person.nickName || person.fullName
    })

    return hook;
  };
};
