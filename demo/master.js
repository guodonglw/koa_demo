/**
 * 该处为程序入口，用于开启多进程
 */
var fork = require('child_process').fork;
var cpuNums = require('os').cpus();
var http = require('http');
var config = require('./config/default');

// 构建服务器，监听端口
var server = http.createServer();
server.listen(config.port);

var limit = 10;  // 重连次数
var during = 60000;
var restart = [];
var isTooFrequently = () => {
  // 记录重启时间
  var time = Date.now();
  var length = restart.push(time);
  if (length > limit) {
    // 取出最后10个记录
    restart = restart.slice(limit * -1);
  }
  // 最后一次重启到前10次重启之间的时间间隔
  return restart.length >= limit && restart[restart.length - 1] - restart[0] > during
}

var workers = {};
// 创建新的工作进程
var createWorker = () => {
  /*
  // 检查是否太过频繁
  if (isTooFrequently()) {
    // 触发giveup事件后，不在重启
    process.emit('giveup', limit, during);
    return
  }
  */
  var worker = fork(__dirname + '/app.js');
  // 子进程退出前发送自杀信号
  worker.on('message', (message) => {
    if(message.act === 'suicide') {
      createWorker();
    }
  })
  // 子进程退出从进程中删除子进程号
  worker.on('exit', () => {
    console.log('Worker ' + worker.pid + ' exited.');
    delete workers[worker.pid]
  });
  // 发送句柄
  worker.send('server', server);
  workers[worker.pid] = worker;
  console.log('Create worker.pid: ' + worker.pid)
}

for(let i = 0; i < cpuNums.length; i++) {
  createWorker()
}

// 主进程退出，子进程全部退出
process.on('exit', () => {
  for(var pid in workers) {
    workers[pid].kill()
  }
})