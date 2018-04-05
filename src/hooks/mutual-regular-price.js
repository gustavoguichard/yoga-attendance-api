const { compact, filter, map, difference, uniq, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, params, result, type } = hook

    if(params.isProcessingMutualPrice || !result.regularClass) {
      return hook
    }

    delete params.isProcessingMutualPrice

    const classrooms = await app.service('classrooms').find({query: {
      _id: { $ne: result._id }, regularClass: true },
    })

    await Promise.all(classrooms.data.map(async classroom => {
      return app.service('classrooms').patch(classroom._id, { tuition: result.tuition }, { isProcessingMutualPrice: true })
    }))

    return hook;
  };
};
