module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const classrooms = method === 'find' ? result.data : [ result ]
    await Promise.all(classrooms.map(async lesson => {
      if(!lesson.teacher) { return null }
      const teacher = await app.service('practitioners').get(lesson.teacher, params)
      lesson.teacher = teacher
    }))

    return hook;
  };
};
