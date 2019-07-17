const router = require('koa-router')();
const signCheck = require('../libs/signcheck').signCheck;  // 路由之前验证，该处可进行不同的路由限制权限
const controller = require('../controllers/admin');

// 总的路由
router.use('/admin', signCheck, controller.loginSystem);

module.exports = router;
