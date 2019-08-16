var cluster = require('cluster');
var fs = require('fs');
var path = require('path');

// 向文件中写入主进程号
var pidFile = path.join(__dirname, 'run/cluseter.pid');
fs.writeFileSync(pidFile, process.pid);

cluster.schedulingPolicy = cluster.SCHED_RR  // 启用轮叫调度，实现负载均衡

// cluster复制的子进程执行文件
cluster.setupMaster({
  exec: 'app.js'
});

// 子进程复制后返回进程号
var workers = {};
cluster.on('online', (m) => {
  var pid = m.process.pid;
  workers[pid] = m
})

var limit = 10;
var during = 60000;
var restart = [];
var isTooFrequency = () => {
  var time = Date.now();
  restart.push(time);
  var len = restart.length;
  if (len > limit) {
    restart = restart.slice(limit * -1)
  }
  return restart.length >= 10 && restart[restart.length - 1] - restart[0] < during
}
// 监听子进程退出事件，保持服务总进程不变
cluster.on('exit', (m) => {
  console.log('exit ')
  var deadPid = m.process.pid
  delete workers[deadPid]
  if (!isTooFrequency()) {
    cluster.fork()
  } else {
    console.log('重启过于频繁，请检查问题')
  }
})

// 开启多个子进程
var cpus = require('os').cpus();
for(let i = 0; i < cpus.length; i++) {
  cluster.fork();
}

// 主进程退出，子进程全部退出
process.on('exit', () => {
  for(var pid in workers) {
    workers[pid].kill()
  }
})

// 进程被杀或重启时删除pid文件
process.on('SIGTERM', () => {
  if(fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
  }
  process.exit(0)
})

