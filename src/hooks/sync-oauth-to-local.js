const { get } = require('lodash')
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function () {
  return function (hook) {
    const email = get(hook, 'data.facebook.profile._json.email')
    const picture = get(hook, 'data.facebook.profile._json.picture.data.url')
    if(email) {
      return hook.service.find({ email }).then(({ data }) => {
        const user = data[0]
        if(user) {
          return hook.service.patch(user._id, {
            facebookId: hook.data.facebookId,
            picture
          }).then(updatedUser => {
            // Set `hook.result` to skip the actual `create` since we updated it already
            hook.result = updatedUser;
            return hook;
          });
        }

        hook.data = Object.assign(hook.data, { email, picture })
        // Just return the hook to continue as usual
        return hook;
      });
    } else {
      return Promise.resolve(hook);
    }
  };
};
