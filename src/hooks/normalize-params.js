const { each, pick, isEmpty } = require('lodash')

module.exports = function () {
  return function (hook) {
    const whitelist = ['populatePractitioners', 'populateClassroom', 'populateFamily']
    const paramsFromClient = pick(hook.params.query, whitelist)
    if(!isEmpty(paramsFromClient)) {
      hook.params = { ...paramsFromClient, ...hook.params, }
      each(whitelist, word => {
        delete hook.params.query[word]
      })
    }

    return hook;
  };
};
