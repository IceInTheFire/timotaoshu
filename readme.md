#### 案例网址：

​	pc后台管理页面：http://212.64.78.88:9092

    账号：火炎   密码：123456

    登录进去后，在权限管理里的职员管理，给自己新增一个账号，不然账号很容易被顶掉。

​	h5移动端页面：http://212.64.78.88:1111/

#### 初衷：

```
1、作为一名多年的网路小说爱好者和网站开发人员，怎么能忍受别人网站里的广告？还特么的是一些乱七八糟的广告。
2、因为手痒，用node做后台接口，搭建web服务器，用node做爬虫，主要是因为兴趣，所以想玩玩。
```

#### 服务器：

```
linux系统、nginx、mysql、redis、pm2、privoxy配合shadowsocks搭建的http代理（防止服务器ip被封，所以用了另一个代理ip）
```

#### 技术栈：

```
node主要用到的库：
	redis、mysql、express、compression(支持gzip压缩)、
	morgan（中间件记录日志，在本项目的作用相当于服务器访问日志）、
	jwt-simple（redis里存储用户加密信息，获取用户信息的时候需要解密）、
	crypto(使用sha1再次加密用户加密信息得到用户token。)、
	scheduleObj(定时任务)、
	request、request-promise、cheerio（爬来的页面，用$去获取自己想要的数据，相当于jquery库）、
	multer（文件上传）、node-xlsx(解析xls文件的插件)
    ......

前端用到的框架：
	iview-admin脚手架（vue2）
	
h5主要用到的技术栈：
	node、pug、less、gulp
	......

注：为了避免版本错误，node_modules建议用yarn来下载
```

#### 思路：

​	先去其他渠道的网站爬取我想要的小说，先爬取到我的服务器上。后台管理页面就是专门操作这些的。

​	移动端网页只是显示小说（最适合移动端uc浏览器，目前还没有开始怎么做）。

#### 已实现需求：

​	1、代理ip的爬取、使用、导出、导入；

​	2、小说来源渠道可配置化；

​	3、设置一个稳定的http代理；（在linux服务器里实现，是privoxy搭配shadowsocks在服务器里设置了一个稳定了http代理，不在该代码里，[若想了解学习，请戳我](https://segmentfault.com/a/1190000009251798)）

​	4、服务器日志下载；

​	5、根据来源渠道的配置，爬小说，更新小说；

​	6、定时任务；

```
1、每天凌晨1点和中午13点定时任务（爬取代理ip，然后去重，然后再检查）

2、每两个小时一次的定时任务
* 1、未爬取的开始爬小说
* 2、开始爬取错误章节列表里的章节
* 间隔5分钟
* 3、检查代理ip是否可用，若不可用则删除
* 4、再一次爬取错误章节列表里的章节

3、每日凌晨3点自动更新日志
```

​	7、后台管理手动更改小说描述；

​	8、待续...

#### 已解决bug：

​	1、防止sql注入；

​	2、request使用代理ip后，因timeout失效导致爬书无力的bug；

#### 未完需求：

​	1、日周月年榜榜单，根据访问量来确定；

​	2、完整的h5页面；

​	3、h5的api文档开放；

​	4、后台管理添加作者模块  和  在爬来的小说章节里插入章节；

​	5、待续...

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
cd timotaoshu
yarn install
```

##### 下载adminApi的node_modules包

```
cd timotaoshu/adminApi
yarn install
```

##### 下载iview-admin的node_modules包

```
cd timotaoshu/iview-admin
yarn install
```

##### 下载h5的node_modules包

```
cd timotaoshu/h5
yarn install
```

#### 2、检查端口号

```
确保电脑上8080、3000、1111、9092、8000这五个端口没有被使用或禁用
```

#### 3、导入数据库

```
在mysql里，新建一个名为timotaoshu的数据库（字符集：utf8 -- UTF-8 Unicode；
排序规则：utf8_general_ci）

然后在timotaoshu里运行sql文件夹内的timotaoshu.sql文件

温馨提示:数据库里的user表里的账号是冰中焱，密码是123456。（mysql里存的用户密码是加密文）
```

#### 4、更改mysql和redis的config文件

```
在目录的config文件夹
里面有mysql的连接配置和redis的连接配置
```

#### 5、跑项目（开发模式）

```
cd timotaoshu/adminApi
npm run dev

另开一个命令窗口
cd timotaoshu/iview-admin
npm run dev

另开一个命令窗口
cd timotaoshu/h5
npm run dev


访问 localhost:8080
访问 localhost:1111



操作，建议先爬30个以上的ip代理数量后，再爬书，不然没有足够的代理ip，则会导致不能爬书
```

#### 6、部署项目

```
cd timotaoshu/adminApi/bin
pm2 start www

另开一个窗口（部署pc后台管理的前端项目前，请先npm run dist生成vue静态文件）
cd timotaoshu/iview-admin/server
pm2 start server

另开一个窗口
cd timotaoshu/h5/bin
pm2 start h5


访问 localhost:9092
访问 localhost:1111


操作：
pc端后台管理    账号：冰中焱  密码：123456
建议先爬30个以上的ip代理数量后，再爬书，不然没有足够的代理ip，则会导致不能爬书。（使用代理ip爬书的目的是防止服务器ip被封。一般想防爬的网站都会有防爬机制的，一旦某发现个ip在某个时间段访问特别频繁，他们则会把那个ip列入黑名单。）
```



### 7、加入我们

```
1、现实过于骨感，项目过于庞大，个人力量过于弱小，所以，我们需要志同道合的人一起努力、切磋、交流。
努力改造提莫淘书，切磋交流前端、node、安卓、IOS、服务器等互联网技术。

2、这里代码我上传了，个人觉得这个代码对于那些想学node的人来说，是一个很好的学习机会，
    代码拉下来后，兴许会遇到很多开发、部署、服务器等问题，欢迎加入我们，共同参讨学习。


QQ群号：831613487    申请时注明：github提莫淘书
```







​	

​	