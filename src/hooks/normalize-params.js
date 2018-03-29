const { map, pick } = require('lodash')

module.exports = function () {
  return function (hook) {
    const whitelist = ['populatePractitioners']
    const paramsFromClient = pick(hook.params.query, whitelist)
    hook.params = { ...paramsFromClient, ...hook.params, }
    map(whitelist, word => {
      delete hook.params.query[word]
    })
    return hook;
  };
};
