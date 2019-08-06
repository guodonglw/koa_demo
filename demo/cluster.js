var cluster = require('cluster');

cluster.setupMaster({
  exec: 'app.js'
});

var cpus = require('os').cpus();
for(let i = 0; i < cpus.length; i++) {
  cluster.fork()
}