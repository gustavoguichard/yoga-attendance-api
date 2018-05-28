const assert = require('assert')
const normalizeParams = require('../../src/hooks/normalize-params')

describe(`'normalize-params' hook`, () => {
  it('gets selected words from the query and add to the params', async () => {
    const hook = {
      params: {
        foo: 'bar',
        query: {
          populatePractitioners: true,
          $limit: 20,
          teacher: true,
        },
      },
    }
    const result = normalizeParams()(hook)

    assert.deepEqual(result.params.query, { $limit: 20, teacher: true })
    assert.equal(result.params.populatePractitioners, true)
  })
})
