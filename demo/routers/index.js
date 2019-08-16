const router = require('koa-router')();
const signCheck = require('../libs/signcheck').signCheck;  // 路由之前验证，该处可进行不同的路由限制权限
const admin = require('../controllers/admin');
const user = require('../controllers/user');
const redis = require('../controllers/redisTest');
const mongo = require('../controllers/mongoTest')

// admin相关路由
router.get('/admin', signCheck, admin.loginSystem);

// user相关路由
router.put('/user', signCheck, user.insertUser);
router.del('/user', signCheck, user.delUser);
router.post('/user', signCheck, user.updateUser);
router.get('/user', signCheck, user.findUser);

// redis测试
router.put('/redis', signCheck, redis.setData);
router.get('/redis', signCheck, redis.getData);

// mongo测试
router.get('/mongo', signCheck, mongo.find);

module.exports = router;
