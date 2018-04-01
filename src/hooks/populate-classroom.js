const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const frequency = method === 'find' ? result.data : [ result ]
    if(params.populateClassroom) {
      await Promise.all(frequency.map(async attendance => {
        attendance.classRoom = await app.service('classrooms').get(attendance.classId)
      }))
    }

    return hook;
  };
};