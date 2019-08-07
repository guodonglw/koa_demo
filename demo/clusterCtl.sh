#!/bin/sh
DIR=`pwd`
NODE=`which node`
#get action
ACTION=$1

#help
usage() {
  echo "Usage: ./clusterCtl.sh {start|stop|restart}"
  exit 1;
}

get_pid() {
  if [ -f ./run/cluster.pid ]; then
    echo `cat ./run/cluster.pid`
  fi
}

#start cluster
start() {
  pid=`get_pid`

  if [ ! -z $pid ]; then
    echo 'server is already running'
  else 
    $NODE $DIR/cluster.js 2>&1 &
    echo 'server is running'
  fi
}

#stop cluster
stop() {
  pid=`get_pid`
  if [ -z $pid ]; then
    echo 'server not running'
  else 
    echo "server is stop..."
    kill -15 $pid
    echo "server stoped !"
  fi
}

restart() {
  stop
  sleep 0.5
  echo ====
  start
}

case "$ACTION" in
  start)
    start
  ;;
  stop)
    stop
  ;;
  restart)
    restart
  ;;
  *)
    usage
  ;;
esac