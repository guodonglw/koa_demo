const crypto = require('crypto');

/**
 * @function MD5加密
 * @param password
 * @returns {*|PromiseLike<ArrayBuffer>}
 * @constructor
 */
exports.MD5 = password => {
  hash = crypto.createHash('md5');
  hash.update(password);
  return hash.digest('hex')
};
