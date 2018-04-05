const { each, pick, isEmpty } = require('lodash')

const whitelist = [
  'populatePractitioners',
  'populateClassroom',
  'populateFamily',
  'populateEnrollments',
]

module.exports = function () {
  return function (hook) {
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
