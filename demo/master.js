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

var workers = {};
// 创建新的工作进程
var createWorker = () => {
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