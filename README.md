# koa_demo
koa搭建的一个后端服务器，可用于项目参考

## 项目结构

└── demo
    ├── app.js  // 单进程项目启动文件（搭建了koa服务）
    ├── clusterCtl.sh  // bash脚本，在linux下可通过执行（clusterCtrl.sh start | stop | restart）来启动
    ├── clusterEntrance.js  // 整个项目的真正入口文件（用于启动多进程）
    ├── config  // 所有需要配置的文件（如数据库信息等）
    │   └── default.js
    ├── controllers  // 业务逻辑代码存放
    │   ├── admin.js
    │   ├── redisTest.js
    │   └── user.js
    ├── libs  // 包括数据库的封装以及一些其他操作
    │   ├── authutil.js  // 一些公用的方法
    │   ├── dateutil.js
    │   ├── mongo.js  // 对mongo进行了简单的封装，根据需要可使用mongoose模块
    │   ├── mysql.js  // 对mysql的简单连接操作（根据需求，和sequelize.js中选择一个用于项目即可）
    │   ├── redis.js  // 简单的封装了redis操作，如需拓展redis操作，在该处拓展
    │   ├── sequelize.js  // 引入了sequelize模块，用于mysql的orm映射
    │   └── signcheck.js  // 路由验证中间件
    ├── log4js.json  // log4js模块的相关配置
    ├── logs  // 日志输入
    │   └── app-.2019-08-07.log
    ├── models  // 关于数据库的操作及如果用到orm映射时，model存放
    │   ├── admin.js
    │   └── user.js
    ├── package.json  // 包管理文件
    ├── package-lock.json
    ├── public  // 存放公共资源
    │   ├── images
    │   │   └── postman.PNG
    │   └── stylesheets
    │       └── style.css
    ├── routers  // 路由文件
    │   └── index.js
    ├── run  // 存放了主进程的进程pid，主要用于bash脚本，不必过多关注
    └── views  // 存放静态页面
        └── error.pug

项目运行思路： clusteEntrance.js | app.js => routers/index.js => controllers/... => models/...

## 让代码运行
```
// 进入demo文件夹下
cd ./demo

// 安装依赖包
npm install --save

// 运行项目
方法一：启动单一进程
node app.js

方法二：启动多进程
node clusterEntrance.js

方法三：在linux下启动项目
clusterCtl.sh start

// 前端调用接口(可用postman进行接口调用测试)
request(http://127.0.0.1:4001/admin/login)
```

## postman请求图示
![avatar](./demo/public/images/postman.PNG)
