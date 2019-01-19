/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : timotaoshu

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-01-19 17:27:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键，自增长，唯一',
  `name` varchar(40) NOT NULL COMMENT '书名',
  `author` varchar(40) DEFAULT NULL COMMENT '作者',
  `description` text COMMENT '描述',
  `originUrl` varchar(100) DEFAULT NULL COMMENT '来源网址',
  `imgUrl` text COMMENT '图片地址',
  `type` int(10) NOT NULL DEFAULT '1' COMMENT '类型\r\n1：爬了章节名，未爬内容 也未填充作者描述来源等  默认\r\n2：填充作者描述来源等。\r\n3：内容已经爬完\r\n',
  `updateTime` datetime DEFAULT NULL COMMENT '小说更新时间\r\n对应被爬取网站的更新时间\r\n',
  `bookStatus` int(10) NOT NULL DEFAULT '1' COMMENT '小说状态\r\n默认1\r\n1：连载\r\n2：完本\r\n',
  `bookType` varchar(60) DEFAULT NULL COMMENT '小说类型\r\n直接爬\r\n都市言情\r\n玄幻小说\r\n…….\r\n',
  `reptileType` int(10) DEFAULT '1' COMMENT '来源名称/来源类型\r\n默认1\r\n\r\n对应reptileTool表里的id\r\n',
  `isJin` int(10) NOT NULL DEFAULT '1' COMMENT '1、启用\r\n2、禁用\r\n\r\n默认1\r\n',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------

-- ----------------------------
-- Table structure for catalog
-- ----------------------------
DROP TABLE IF EXISTS `catalog`;
CREATE TABLE `catalog` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键，自增长，唯一',
  `bookId` int(10) NOT NULL COMMENT '外键跟book表的id绑定',
  `name` varchar(100) NOT NULL COMMENT '章节名',
  `num` int(10) NOT NULL COMMENT '章节序号\r\n章节序号可以重复\r\n\r\n第一章 我的世界\r\n',
  `type` int(10) NOT NULL DEFAULT '1' COMMENT '类型\r\n1： 普通，章节名前有序号\r\n2： 特殊，章节名前没序号\r\n默认1\r\n',
  `createTime` datetime NOT NULL COMMENT '第一次时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
  `isJin` int(10) NOT NULL DEFAULT '2' COMMENT '是否禁用\r\n1：禁用，页面上不显示该章节\r\n2：不禁用，页面上显示该章节\r\n默认2\r\n',
  `isReptileTool` int(10) NOT NULL DEFAULT '2' COMMENT '是否是爬取来的\r\n1：不是爬取的，后来新增的\r\n2：爬取的，就算后来改了这个章节，也没事。这里是做连载的标识\r\n\r\n默认2\r\n',
  `reptileAddress` varchar(100) DEFAULT NULL COMMENT '爬取的地址\r\n为空则表示不是爬取来的\r\n不为空则是爬取的地址（地址里若没有http的话，那则是要跟book表的OriginUrl字段搭配）\r\n',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of catalog
-- ----------------------------

-- ----------------------------
-- Table structure for catalogcontent
-- ----------------------------
DROP TABLE IF EXISTS `catalogcontent`;
CREATE TABLE `catalogcontent` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `content` varchar(255) DEFAULT NULL,
  `bookId` int(11) DEFAULT NULL COMMENT '小说id',
  `num` int(11) DEFAULT NULL COMMENT '序号',
  `catalogId` int(11) DEFAULT NULL COMMENT '章节id',
  PRIMARY KEY (`id`),
  KEY `catalogId` (`catalogId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of catalogcontent
-- ----------------------------

-- ----------------------------
-- Table structure for progresserror
-- ----------------------------
DROP TABLE IF EXISTS `progresserror`;
CREATE TABLE `progresserror` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键，自增长，唯一 错误id',
  `reptileType` int(10) DEFAULT NULL COMMENT '来源名称/来源类型\r\n默认1\r\n\r\n对应reptileTool表里的id\r\n',
  `originUrl` varchar(100) DEFAULT NULL COMMENT '来源网址',
  `bookId` int(40) NOT NULL COMMENT '小说id',
  `catalogId` int(40) NOT NULL COMMENT '章节id',
  `reptileAddress` varchar(100) NOT NULL COMMENT '爬取的地址\r\n为空则表示不是爬取来的\r\n不为空则是爬取的地址（地址里若没有http的话，那则是要跟book表的OriginUrl字段搭配）\r\n',
  `Isjin` int(10) NOT NULL DEFAULT '2' COMMENT '1、允许爬取\r\n2、禁止爬取（错误没解决之前都是禁止爬取.）\r\n默认2\r\n',
  `bookName` varchar(100) DEFAULT NULL COMMENT '书名',
  `catalogName` varchar(100) DEFAULT NULL COMMENT '章节名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of progresserror
-- ----------------------------

-- ----------------------------
-- Table structure for reptiletool
-- ----------------------------
DROP TABLE IF EXISTS `reptiletool`;
CREATE TABLE `reptiletool` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键，自增长，唯一',
  `codeType` varchar(20) NOT NULL COMMENT '编码格式，\r\nGbk，utf-8\r\n',
  `remark` varchar(40) NOT NULL COMMENT '笔趣阁，笔趣岛，起点',
  `originUrl` varchar(100) NOT NULL COMMENT '主站网址',
  `bookName` varchar(100) DEFAULT NULL COMMENT '书名爬虫标记',
  `author` varchar(150) DEFAULT NULL COMMENT '作者名爬虫标记',
  `imgUrl` varchar(100) DEFAULT NULL COMMENT '图片地址爬虫',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reptiletool
-- ----------------------------
INSERT INTO `reptiletool` VALUES ('1', 'gbk', '笔趣阁小说网', 'http://www.biqugexsw.com/', '', '', '');
INSERT INTO `reptiletool` VALUES ('2', 'gbk', '笔趣阁5200', 'https://www.biquge5200.cc', '', '', '');
INSERT INTO `reptiletool` VALUES ('3', 'utf-8', '笔趣阁备用站', 'https://www.biquge.cc/', '', '', '');
INSERT INTO `reptiletool` VALUES ('4', 'gbk', '笔趣阁1', 'http://www.biquge.com.tw/', '', '', '');

-- ----------------------------
-- Table structure for reptiletool2
-- ----------------------------
DROP TABLE IF EXISTS `reptiletool2`;
CREATE TABLE `reptiletool2` (
  `reptileTypeId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '爬取配置Id',
  `code` varchar(20) DEFAULT '' COMMENT '页面编码格式',
  `name` varchar(60) DEFAULT NULL COMMENT '备注名称',
  `baseUrl` varchar(100) DEFAULT NULL COMMENT '来源地址',
  `codeTransform` varchar(20) DEFAULT NULL COMMENT '页面转码方式，用于搜索转码方式',
  `searchUrl` varchar(200) DEFAULT '' COMMENT '搜索地址',
  `searchList` varchar(60) DEFAULT NULL COMMENT '搜索到的列表',
  `searchListStart` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页   第一本小说从哪里开始      索引值从0开始',
  `searchListEnd` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页   最后几条不是小说',
  `searchListTitle` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页  小说标题',
  `searchListUrl` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页  小说详情url地址',
  `searchListAuthor` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页  小说作者',
  `searchListStatus` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页   小说状态',
  `searchListLastTime` varchar(60) DEFAULT NULL COMMENT '搜索到的列表页   小说最后更新时间',
  `bookTitle` varchar(60) DEFAULT NULL COMMENT '小说名称',
  `bookAuthor` varchar(60) DEFAULT NULL COMMENT '小说作者',
  `updateTime` varchar(60) DEFAULT NULL COMMENT '最后更新时间',
  `bookType` varchar(60) DEFAULT NULL COMMENT '小说分类',
  `catalogList` varchar(60) DEFAULT NULL COMMENT '目录列表',
  `firstCatalogList` varchar(60) DEFAULT NULL COMMENT '第一个索引值',
  `endCatalogList` varchar(60) DEFAULT NULL COMMENT '最后一个索引值',
  `bookImgUrl` varchar(60) DEFAULT NULL COMMENT '小说封面地址',
  `bookDescription` varchar(60) DEFAULT NULL COMMENT '小说目录页  小说详情',
  `catalogContent` varchar(60) DEFAULT NULL COMMENT '小说章节详情',
  `isSearch` int(10) DEFAULT '2' COMMENT '是否启用\r\n1、  启用\r\n2、  禁用',
  `catalogListUrl` varchar(60) DEFAULT NULL,
  `catalogTitle` varchar(60) DEFAULT NULL,
  `catalogUrl` varchar(60) DEFAULT NULL,
  `reason` varchar(100) DEFAULT '' COMMENT '原因，多用于禁用原因',
  PRIMARY KEY (`reptileTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reptiletool2
-- ----------------------------
INSERT INTO `reptiletool2` VALUES ('1', 'gbk', '笔趣阁小说网', 'http://www.biqugexsw.com/', 'gbk', 'http://www.biqugexsw.com/s.php?ie=gbk&s=2758772450457967865&q=${name}', '.bookbox', '0', '0', '.bookname>a、html', '.bookname>a、attrhref', '.author、html、split、：、1', '.cat、html、split、：、1', '', '.info h2、html', '.small span:nth-child(1)、html、split、：、1', '.small .last、html、split、：、1', '.small span:nth-child(2)、html、split、：、1', '.listmain a', '.listmain>dl>dt:eq(1)、index-1', '', '.info>.cover>img、attrsrc', '.intro、html', '#content、html', '1', '', '、html', '、attrhref、split、/、length-1', '');
INSERT INTO `reptiletool2` VALUES ('2', 'gbk', '笔趣阁5200', 'https://www.biquge5200.cc/', 'utf-8', 'https://www.biquge5200.cc/modules/article/search.php?searchkey=${name}', '.grid>tbody>tr', '1', '0', 'td>a、html', 'td>a、attrhref', 'td:nth-child(3)、html', 'td:nth-child(6)、html', 'td:nth-child(5)、html', '#info>h1、html', '#info>p:nth-child(2)、html、split、：、1', '#info>p:nth-child(4)、html、split、：、1', '.con_top、html、split、>、9、split、<、0', '#list a', '#list>dl>dt:eq(1)、index-2', '', '#fmimg>img、attrsrc', '#intro>p、html', '#content、html', '1', '', '、html', '、attrhref、split、/、length-1', '');
INSERT INTO `reptiletool2` VALUES ('3', 'utf-8', '笔趣阁备用站', 'https://www.biquge.cc/', 'gbk', 'https://sou.xanbhx.com/search?t=920895234054625192&siteid=biqugecc&q=${name}', '.s2>a', '', '', '、html', '、attrhref', '.s4、html', 'td:nth-child(6)、html', 'td:nth-child(6)、html', '#info>h1、html', '#info>p:nth-child(2)、html、split、：、1', '#info>p:nth-child(4)、html、split、：、1', '.con_top、html、split、>、7、split、 > 、2', '#list a', '#list>dl>dt:eq(1)、index-1', '', '#fmimg>img、attrsrc', '#intro、html', '#content、html', '2', '', '、html', '、attrhref、split、/、length-1', '笔趣阁备用站的搜索不可用');
INSERT INTO `reptiletool2` VALUES ('12', 'gbk', '全书网', 'http://www.quanshuwang.com/', 'gbk', 'http://www.quanshuwang.com/modules/article/search.php?searchkey=+${name}&searchtype=articlename&searchbuttom.x=51&searchbuttom.y=15', '.seeWell>li', '', '', '.stitle、html', 'a、attrhref', 'span>a:nth-child(2)、html', '', '', '.b-info>h1、html', '.bookso>dd、html', '.ulnav>li、html、split、[、1、split、]、0', '.main-index>a:nth-child(2)、html', '.dirconone>li>a', '', '', '.detail>a.mr11>img、attrsrc', '#waa、html、split、介绍:&nbsp;&nbsp;&nbsp;&nbsp;、1', '#content、html', '1', '.reader、attrhref', '、html', '、attrhref', '');
INSERT INTO `reptiletool2` VALUES ('13', 'gbk', '笔趣阁', 'http://www.biquge.com.tw/', 'gbk', 'http://www.biquge.com.tw/modules/article/soshu.php?searchkey=+${name}', '.grid>tbody>tr', '1', '0', 'a、html', 'a、attrhref', 'td:nth-child(3)、html', 'td:nth-child(6)、html', 'td:nth-child(5)、html', '#info>h1、html', '#info>p:nth-child(2)、html、split、：、1', '#info>p:nth-child(4)、html、split、：、1', '.con_top、html、split、>、7、split、 > 、2', '#list a', '', '', '#fmimg>img、attrsrc', '#intro、html', '#content、html', '1', '', '、html', '、attrhref、split、/、length-1', 'pc端不能访问了，手机可以访问，目测是对方服务器崩了');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(100) NOT NULL COMMENT '角色名称',
  `permission` varchar(255) DEFAULT NULL COMMENT '权限\r\n\r\n1,2,3,4,5,6,7,8',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '超级管理员', 'all');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键，自增长，唯一',
  `name` varchar(40) NOT NULL COMMENT '用户名，唯一',
  `pwd` varchar(40) NOT NULL COMMENT '密码',
  `mobile` varchar(40) DEFAULT NULL COMMENT '手机号，唯一',
  `roleId` int(10) NOT NULL DEFAULT '1014' COMMENT '指向role里的id',
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `roleId` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '冰中焱', '7c4a8d09ca3762af61e59520943dc26494f8941b', '16666666666', '1');
INSERT INTO `users` VALUES ('2', '火炎', '7c4a8d09ca3762af61e59520943dc26494f8941b', '16666666667', '1');
