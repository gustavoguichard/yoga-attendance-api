const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    delete hook.data.displayName

    return hook;
  };
};
