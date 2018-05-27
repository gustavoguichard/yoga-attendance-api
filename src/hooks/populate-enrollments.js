const { compact, filter, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const practitioners = method === 'find' ? result.data : [ result ]
    if(params.populateEnrollments) {

      await Promise.all(practitioners.map(async person => {
        if(!person.enrollments || person.enrollments.length === 0) {
          return null
        }

        delete params.populateEnrollments

        const enrollments = await Promise.all(person.enrollments.map(
          async enrollment => app.service('enrollment').get(enrollment.enrollmentId)
            .then(enrl => {
              enrollment.data = enrl
              return enrollment
            }).catch(e => {
              app.service('practitioners').patch(person._id, {
                enrollments: filter(person.enrollments, e => toString(e.enrollmentId) !== toString(enrollment.enrollmentId))
              })
              return null
            })
        ))

        person.enrollments = compact(enrollments)
      }))
    }

    return hook;
  };
};