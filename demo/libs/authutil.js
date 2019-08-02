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

/**
 * @function 生成随机数字token
 * @param len 随机数字串长度
 */
exports.getVerifyCode = len => {
  if (!len) {
      len = 6;
  }
  var verifyCode = '';
  var alpha = '1234567890789890238490237841289342734829034720834902304982903482793084';
  for (var i = 0; i < len; i++) {
      verifyCode += alpha.charAt((Math.random() * 10000) % alpha.length);
  }
  return verifyCode.toString();
};
