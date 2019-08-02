/**
 * 名称：server端koa实践
 * 作者：xxx
 */
const koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const log4js = require('log4js');
const http = require('http');
const staticCache = require('koa-static-cache');
const config = require('./config/default');
const log4jsConfig = require('./log4js');
const routers = require('./routers/index');
var app = new koa();

// 配置session相关参数
app.use(session({
  key: 'session-id',        // cookie 中存储 session-id 时的键名
  cookie: {                 // 与 cookie 相关的配置
    domain: 'localhost',    // 写 cookie 所在的域名
    path: '/',              // 写 cookie 所在的路径
    maxAge: 1000 * 30,      // cookie 有效时长
    httpOnly: true,         // 是否只用于 http 请求中获取
    overwrite: false        // 是否允许重写
  }
}));

// 设置cookies的签名
app.keys = ['test'];
app.use(async (ctx, next) => {
  ctx.cookies.set('key', 'value', {
    domain: 'localhost', 
    signed: true, 
    path: '/',
    maxAge: 10 * 60 * 1000, 
    httpOnly: false,
    overwrite: false
  })
  await next()
})

// 用于缓存静态资源
app.use(staticCache(path.join(__dirname, './public'), {dynamic: true}, {
  maxAge: 30 * 24 * 60 * 60
}));

// 配置解析请求中间件
app.use(bodyParser());

// 配置路由（中间件需写成方法的形式）
app.use(routers.routes());

// 配置logjs日志打印模块
log4js.configure(log4jsConfig);
var logger = log4js.getLogger('index');

// 监听端口，构建服务器
http.createServer(app.callback()).listen(config.port, function () {
  logger.info("server start");
  logger.info("listening on port: http://127.0.0.1:" + config.port)
});
