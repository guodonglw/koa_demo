const router = require('koa-router')();
const signCheck = require('../libs/signcheck').signCheck;  // 路由之前验证，该处可进行不同的路由限制权限

// 总的路由
router.use('/admin', signCheck, require('./module_routers/admin').routes());

module.exports = router;
