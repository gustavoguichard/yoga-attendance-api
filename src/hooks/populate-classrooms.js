const { find, map, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const practitioners = await hook.app.service('practitioners').find({
      query: { teacher: true }
    })
    const newData = map(hook.result.data, room => {
      if(room.teacher) {
        const teacherObj = find(practitioners.data, p =>
          toString(p._id) === toString(room.teacher)
        )
        room.teacher = teacherObj || null
      }
      return room
    })
    hook.result.data = newData
    return hook;
  };
};
