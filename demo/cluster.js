var cluster = require('cluster');

cluster.schedulingPolicy = cluster.SCHED_RR  // 启用轮叫调度，实现负载均衡

cluster.setupMaster({
  exec: 'app.js'
});

// 子进程复制后返回进程号
var workers = {};
cluster.on('online', (m) => {
  var pid = m.process.pid;
  workers[pid] = m
})

// 监听子进程退出事件，保持服务总进程不变
cluster.on('exit', (m) => {
  console.log('exit ')
  var deadPid = m.process.pid
  delete workers[deadPid]
  cluster.fork()
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

