<style scoped rel="stylesheet/less" type="text/less" lang="less">
    @border-color:#e9eaec;
    @background-color:#ebf7ff;
    .backColor{
        background-color:@background-color;
        line-height: 50px;
    }
    .ivu-row{
        border:1px solid @border-color;
        margin-bottom:-1px;
        padding:0px 20px;
    }
    .tc{
        padding:20px;
    }
    .ivu-col{
        border-right:1px solid @border-color;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24" class="tc">
                <h3>基本配置</h3>
            </Col>
        </Row>
        <Row class="backColor">
            <Col span="2">配置Id：{{row.reptileTypeId}}</Col>
            <Col span="2">编码：{{row.code}}</Col>
            <Col span="2">备注：{{row.name}}</Col>
            <Col span="2">搜索编码：{{row.codeTransform}}</Col>
            <Col span="6">网址：{{row.baseUrl}}</Col>
            <Col span="8">搜索网址：{{row.searchUrl}}</Col>
        </Row>
        <Row>
            <Col span="24" class="tc">
                <h3>搜索列表配置</h3>
            </Col>
        </Row>
        <Row class="backColor">
            <Col span="4">搜索列表：{{row.searchList}}</Col>
            <Col span="4">列表firstIndex：{{row.searchListStart}}</Col>
            <Col span="4">列表lastIndex：{{row.searchListEnd}}</Col>
            <Col span="4">列表小说标题：{{row.searchListTitle}}</Col>
            <Col span="4">列表小说url地址：{{row.searchListUrl}}</Col>
            <Col span="4">列表作者：{{row.searchListAuthor}}</Col>
        </Row>
        <Row class="backColor">
            <Col span="12">列表最后更新时间：{{row.searchListLastTime}}</Col>
            <!--<Col span="12">网址：{{row.baseUrl}}</Col>-->
            <!--<Col span="8">搜索网址：{{row.searchUrl}}</Col>-->
        </Row>
        <Row>
            <Col span="24" class="tc">
                <h3>小说目录页配置</h3>
            </Col>
        </Row>
        <Row class="backColor">
            <Col span="6">小说名称：{{row.bookTitle}}</Col>
            <Col span="6">小说作者：{{row.bookAuthor}}</Col>
            <Col span="6">最后更新时间：{{row.updateTime}}</Col>
            <Col span="6">小说分类：{{row.bookType}}</Col>
        </Row>
        <Row class="backColor">
            <Col span="5">目录列表：{{row.catalogList}}</Col>
            <Col span="4">目录startIndex：{{row.firstCatalogList}}</Col>
            <Col span="4">目录lastIndex：{{row.endCatalogList}}</Col>
            <Col span="5">小说封面：{{row.bookImgUrl}}</Col>
            <Col span="6">小说描述：{{row.bookDescription}}</Col>
        </Row>
        <Row>
            <Col span="24" class="tc">
                <h3>小说详情配置</h3>
            </Col>
        </Row>
        <Row class="backColor">
            <Col span="24">小说详情：{{row.catalogContent}}</Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data:[
            {
                reptileTypeId:0,
                code:'gbk',                 //页面编码格式
                name:'笔趣阁1',              //备注名称
                baseUrl:'http://www.biquge.com.tw/',    //来源地址
                codeTransform:'gbk',            //页面转码方式，用于搜索转码方式
                searchUrl:'http://www.biquge.com.tw/modules/article/soshu.php?searchkey=+${name}', //搜索地址前缀

                /*
                * 搜索列表start
                * */
                searchList:'.grid>tbody>tr',        //搜索到的列表
                searchListStart:1,                  //搜索到的列表页   第一本小说从哪里开始      索引值从0开始
                searchListEnd:0,                    //搜索到的列表页   最后几条不是小说
                searchListTitle:'a、html',           //搜索到的列表页  小说标题
                searchListUrl:'a、attrhref',         //搜索到的列表页  小说详情url地址
                searchListAuthor:'td:nth-child(3)、html',    //搜索到的列表页  小说作者
                searchListStatus:'td:nth-child(6)、html',                  //搜索到的列表页   小说状态
                searchListLastTime:'td:nth-child(5)、html',                       //搜索到的列表页   小说最后更新时间
                /*
                * 搜索列表end
                * */

                /*
                * 小说目录页、详情页  start
                * */
                bookTitle:'#info>h1、html',
                bookAuthor:'#info>p:nth-child(2)、html、split、：、1',
                updateTime:'#info>p:nth-child(4)、html、split、：、1',
                bookType:'.con_top、html、split、>、7、split、 > 、2',
                catalogList:'#list a',                                  //目录列表
                firstCatalogList:null,              //第一个索引值
                endCatalogList:null,                                          //最后一个索引值
                bookImgUrl:'#fmimg>img、attrsrc',                            //小说封面
                bookDescription:'#intro、html',                                   //小说描述
                /*
                * 小说目录页、详情页  end
                * */
                catalogContent:'#content、html'
            }
        ]
    };
</script>