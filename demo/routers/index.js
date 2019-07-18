const router = require('koa-router')();
const signCheck = require('../libs/signcheck').signCheck;  // 路由之前验证，该处可进行不同的路由限制权限
const admin = require('../controllers/admin');
const user = require('../controllers/user');


// admin相关路由
router.get('/admin', signCheck, admin.loginSystem);

// user相关路由
router.post('/user/insert', signCheck, user.insertUser);
router.del('/user/delete', signCheck, user.delUser);
router.post('/user/update', signCheck, user.updateUser);
router.get('/user/find', signCheck, user.findUser);

module.exports = router;
