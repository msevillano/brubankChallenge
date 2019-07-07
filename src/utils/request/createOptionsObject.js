/**
 * Creates the options object for request-promise.
 * @param {String} uri - desired endpoint to call.
 *
 * @return {Object} - Required Object from request-promise.
 */
function createOptionsObject(uri) {
  return {
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
}

export default createOptionsObject;
