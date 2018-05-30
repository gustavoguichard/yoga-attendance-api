module.exports = beforeAllFn => {
  let runSetup = false

  return beforeEach(async () => {
    if (runSetup) {
      return Promise.resolve()
    }

    runSetup = true
    return beforeAllFn()
  })
}
