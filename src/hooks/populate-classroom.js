const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const frequency = method === 'find' ? result.data : [ result ]
    if(params.populateClassroom && !!result.total) {
      await Promise.all(frequency.map(async attendance => {
        attendance.classroom = await app.service('classrooms').get(attendance.classId)
      }))
    }

    return hook;
  };
};
