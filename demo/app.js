/**
 * 名称：server端koa实践
 * 作者：xxx
 */
const koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const views = require('koa-views');
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

// 配置解析请求中间件
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text']
}));

// 用于缓存公共资源
app.use(staticCache(path.join(__dirname, './public'), {dynamic: true}, {
  maxAge: 30 * 24 * 60 * 60
}));

// 用于加载静态页面
app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}))

// 配置路由（中间件需写成方法的形式）
app.use(routers.routes());

// 配置logjs日志打印模块
log4js.configure(log4jsConfig);
var logger = log4js.getLogger('index');

// 监听错误事件
app.on('error', (err, ctx) => {
  logger.error('server error: ', err, ctx);
})

// 监听端口，构建服务器
http.createServer(app.callback()).listen(config.port, () => {
  logger.info("server start");
  logger.info("listening on port: http://127.0.0.1:" + config.port)
});

/*
var server = http.createServer(app.callback())

// 开启子进程
var worker;
process.on('message', (m, tcp) => {
  if (m === 'server') {
    worker = tcp;
    worker.on('connection', (socket) => {
      server.emit('connection', socket)
    })
  }
})

// 子进程异常退出
process.on('uncaughtException', (err) => {
  logger.error('子进程err: ', err)
  process.send({act: 'suicide'})  // 发送自杀信号
  worker.on('close', () => {
    process.exit(1)
  });
  // 超时退出
  setTimeout(() => {
    process.exit(1)
  }, 5000)
})
*/