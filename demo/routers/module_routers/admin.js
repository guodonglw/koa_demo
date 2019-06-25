const router = require('koa-router')();
const controller = require('../../controllers/admin/index');

// 分路由
router.post('/login', controller.loginSystem);

module.exports = router;
