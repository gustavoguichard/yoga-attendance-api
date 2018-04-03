const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const enrollments = method === 'find' ? result.data : [ result ]
    await Promise.all(enrollments.map(async enrollment => {
      const classroom = enrollment.classroom ? await app.service('classrooms').get(enrollment.classroom) : { title: 'Aulas regulares' }
      enrollment.className = classroom.title
    }))

    return hook;
  };
};
