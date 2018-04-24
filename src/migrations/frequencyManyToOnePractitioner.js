const api = require('../app')

async function start() {
  const frequencies = await api.service('frequency').find({ query: { $limit: 10000 } })
  await Promise.all(frequencies.data.map(async frequency => {
    await Promise.all(frequency.practitioners.map(async person =>
      api.service('frequency').create({
        practitionerId: person,
        teacher: frequency.teacher,
        classId: frequency.classId,
        createdAt: frequency.createdAt,
      })
    ))
    api.service('frequency').remove(frequency._id)
  }))
}

start()
