module.exports = function () {
  return async function (hook) {
    delete hook.data.className

    return hook
  }
}
