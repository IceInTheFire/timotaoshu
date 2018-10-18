#### 案例网址：

​	pc后台管理页面：http://106.12.37.138:9092		http://admin.yueqingfang.cn （不建议使用这个，国外服务器，速度较慢）

​	h5移动端页面：http://106.12.37.138:1111/		http://m.yueqingfang.cn/ （不建议使用这个，国外服务器，速度较慢）

#### 初衷：

```
1、作为一名多年的网路小说爱好者和网站开发人员，怎么能忍受别人网站里的广告？还特么的是一些乱七八糟的广告。
2、因为手痒，用node做后台接口，搭建web服务器，用node做爬虫，主要是因为兴趣，所以想玩玩。
3、更是因为之前有大把大把的空闲时间，所以就有时间了。
```

#### 服务器：

```
linux系统、nginx、mysql、redis、pm2、privoxy配合shadowsocks搭建的http代理（防止服务器ip被封，所以用了另一个代理ip）
```

#### 技术栈：

```
node用到的库：
	redis、mysql、express、compression(支持gzip压缩)、morgan（中间件记录日志，在本项目的作用相当于服务器访问日志）、jwt-simple（登录加密）、scheduleObj(定时任务)、request、request-promise、cheerio（爬来的页面，用$去获取自己想要的数据，相当于jquery库）、multer（文件上传）、node-xlsx(解析xls文件的插件)

前端用到的框架：
	iview-admin脚手架（vue2）
	
h5用到的技术栈：
	node、pug、less、gulp、markdown
	
注：为了避免版本错误，node_modules建议用yarn来下载
```

#### 思路：

​	先去其他渠道的网站爬取我想要的小说，先爬取到我的服务器上。后台管理页面就是专门操作这些的。

​	移动端网页只是显示小说（最适合移动端uc浏览器）。

#### 未完需求：

​	1、日周月年榜榜单，根据访问量来确定；

​	2、凌晨0点定时任务，自动爬取代理ip；凌晨1点，自动更新所有正在连载的书；凌晨6点，自动更新

​	3、移动端记录当前阅读章节，待我下次进来时，可以直接进入上次阅读的章节。

#### BUG：

​	1、兴许是request-promise的问题，当我使用了代理ip时，timeout超时设置不知道为什么莫名无效了，导致爬书有点无力，效率低下。

​	目测感觉是连接了不可靠的代理ip导致了timoout无效（有用的代理ip，timeout则有效）。

​	2、可能是queue的问题，爬书爬着爬着，有时候就停在哪里了，不知道为什么，队列里明明还有很多任务，但它就这么莫名其妙的停了，adminApi系统重开，然后一切又好了。

#### 暂且搁置的原因：

​	1、接下来的日子，要忙别的了，可能没有大把大把的时间了。

​	2、花在这两个bug上的时间太久了，久到我不想做别的了。我是很执拗的，可能接下来大部分空余时间，我都在弄这两个bug吧。

#### 跑项目之前

```
拉取项目代码前
请确保电脑上node版本是8.10.0以上
请确保电脑上支持yarn
请确保电脑上有mysql和redis
```

#### 1、开始跑项目的第一步(项目内所有的node_modules)

	##### 下载公共的node_modules包

```
cd timotaoNew
yarn install
```

#####下载adminApi的node_modules包

```
cd timotaoNew/adminApi
yarn install
```

#####下载iview-admin的node_modules包

```
cd timotaoNew/iview-admin
yarn install
```

##### 下载h5的node_modules包

```
cd timotaoNew/h5
yarn install
```

#### 2、检查端口号

```
确保电脑上8080、3000、1111、9092、8000这五个端口没有被禁用
```

#### 3、导入数据库

#### 4、更改mysql和redis的config文件

#### 5、跑项目

```
cd timotaoNew/adminApi
npm run dev

另开一个窗口
cd timotaoNew/iview-admin
npm run dev

另开一个窗口
cd timotaoNew/h5
npm run dev


访问
```









​	

​	