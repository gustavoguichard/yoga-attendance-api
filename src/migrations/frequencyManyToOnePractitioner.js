const api = require('../app')

async function start() {
  const frequencies = await api.service('frequency').find({ query: { $limit: 10000 } })
  await Promise.all(frequencies.data.map(async frequency => {
    api.service('frequency').remove(frequency._id)
  }))
}

start()
