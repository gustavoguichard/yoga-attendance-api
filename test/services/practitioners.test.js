const assert = require('assert')
const app = require('../../src/app')

const service = app.service('practitioners')
describe('\'practitioners\' service', () => {
  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  let practitioner

  before(async () => {
    practitioner = await service.create({
      fullName: 'Test user',
      accessCode: '1010',
    })
  })

  describe('adds a displayName to practitioners', async () => {

    it('uses nickName when it is available', async () => {
      const result = await service.get(practitioner._id)

      assert.equal(result.displayName, 'Test user')
    })

    it('uses the fullName when there is no nickName', async () => {
      await service.patch(practitioner._id, { nickName: 'Testy' })
      const result = await service.get(practitioner._id)

      assert.equal(result.displayName, 'Testy')
    })
  })

  describe('populate hooks', async () => {
    it('populates family', async () => {
      const relative = await service.create({
        fullName: 'Relative',
        accessCode: '1234',
      })
      await service.patch(practitioner._id, { family: [relative._id] })

      const populated = await service.get(practitioner._id, { populateFamily: true })
      const result = populated.family[0]
      assert.equal(result.fullName, relative.fullName)
    })
  })
})
