<style scoped rel="stylesheet/less" type="text/less" lang="less">
    .config-content{

    }
    .config-kuai{
        line-height: 32px;
        font-size:0;
        margin-bottom: 7px;
        &:last-child{
            margin-bottom: 0;
        }
        .config-title{
            width:80px;
            display: inline-block;
            text-align: right;
            font-size:12px;
            vertical-align: middle;
            white-space: pre;
        }
        .config-input,.config-content{
            width:calc(~"100% - 85px");
            margin-left:5px;
            vertical-align: middle;
            display: inline-block;
            font-size:12px;
            word-wrap: break-word;
        }
        .config-content{
            line-height: 20px;
            padding:6px 0 ;
        }
    }

</style>
<template>
    <Modal v-model="modal.showModal" :closable='true' :mask-closable='false' :width="500" @on-cancel="onClickCancel">
        <h3 slot="header" class="modal-header-color" v-if=" type == 'add' || type == 'copyAdd' ">新增渠道</h3>
        <h3 slot="header" class="modal-header-color" v-else-if=" type == 'edit'">编辑渠道</h3>
        <h3 slot="header" class="modal-header-color" v-else-if=" type == 'look'">查看渠道</h3>

        <Collapse v-model="Collapse" v-show="type != 'look'">
            <Panel class="config-box" name="1">
                基本配置
                <div slot="content">
                    <p class="config-kuai" v-show="type != 'add' && type != 'copyAdd'">
                        <span class="config-title">配置ID：</span>
                        <span class="config-content">{{config.reptileTypeId}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">网站编码：</span>
                        <Input v-model="config.code" class="config-input" placeholder="页面编码格式" :maxlength="10"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">备注名称：</span>
                        <Input v-model="config.name" class="config-input" placeholder="备注名称"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">来源地址：</span>
                        <Input v-model="config.baseUrl" class="config-input" placeholder="来源地址"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">转码格式：</span>
                        <Input v-model="config.codeTransform" class="config-input" placeholder="页面转码方式，用于搜索转码方式" :maxlength="10"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">搜索地址：</span>
                        <Input v-model="config.searchUrl" class="config-input" placeholder="搜索地址，${name}是书名填充位置"></Input>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="2">
                搜索列表配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">搜索列表：</span>
                        <Input v-model="config.searchList" class="config-input" placeholder="搜索列表"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">start索引：</span>
                        <Input v-model="config.searchListStart" class="config-input" placeholder="基于搜索列表的start索引"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">end索引：</span>
                        <Input v-model="config.searchListEnd" class="config-input" placeholder="基于搜索列表的end索引"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说名称：</span>
                        <Input v-model="config.searchListTitle" class="config-input" placeholder="基于搜索列表的小说名称"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说地址：</span>
                        <Input v-model="config.searchListUrl" class="config-input" placeholder="基于搜索列表的小说地址"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说作者：</span>
                        <Input v-model="config.searchListAuthor" class="config-input" placeholder="基于搜索列表的小说足总和"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说状态：</span>
                        <Input v-model="config.searchListStatus" class="config-input" placeholder="基于搜索列表的小说状态"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">最后更新时间：</span>
                        <Input v-model="config.searchListLastTime" class="config-input" placeholder="基于搜索列表的最后更新时间"></Input>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="3">
                小说章节目录（详情）页配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">小说名称：</span>
                        <Input v-model="config.bookTitle" class="config-input" placeholder="基于小说详情的小说名称"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说作者：</span>
                        <Input v-model="config.bookAuthor" class="config-input" placeholder="基于小说详情的小说作者"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">最后更新时间：</span>
                        <Input v-model="config.updateTime" class="config-input" placeholder="基于小说详情的最后更新时间"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说分类：</span>
                        <Input v-model="config.bookType" class="config-input" placeholder="基于小说详情的小说分类"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说封面：</span>
                        <Input v-model="config.bookImgUrl" class="config-input" placeholder="基于小说详情页的小说封面"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说描述：</span>
                        <Input v-model="config.bookDescription" class="config-input" placeholder="基于小说详情页的小说封描述"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节目录地址：</span>
                        <Input v-model="config.catalogListUrl" class="config-input" placeholder="小说章节目录地址，从小说详情页获取，目录详情一个页面则是空"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节目录：</span>
                        <Input v-model="config.catalogList" class="config-input" placeholder="小说章节目录列表"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">start索引：</span>
                        <Input v-model="config.firstCatalogList" class="config-input" placeholder="基于章节目录的start索引"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">end索引：</span>
                        <Input v-model="config.endCatalogList" class="config-input" placeholder="基于章节目录的end索引"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节名称：</span>
                        <Input v-model="config.catalogTitle" class="config-input" placeholder="章节名称"></Input>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节Url地址：</span>
                        <Input v-model="config.catalogUrl" class="config-input" placeholder="章节Url地址"></Input>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="4">
                小说详情配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">小说详情：</span>
                        <Input v-model="config.catalogContent" class="config-input" placeholder="小说详情"></Input>
                    </p>
                </div>
            </Panel>
        </Collapse>
        <Collapse v-model="Collapse" v-show="type == 'look'">
            <Panel class="config-box" name="1">
                基本配置
                <div slot="content">
                    <p class="config-kuai" v-show="type != 'add' && type != 'copyAdd'">
                        <span class="config-title">配置ID：</span>
                        <span class="config-content">{{config.reptileTypeId}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">网站编码：</span>
                        <span class="config-content">{{config.code}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">备注名称：</span>
                        <span class="config-content">{{config.name}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">来源地址：</span>
                        <span class="config-content">{{config.baseUrl}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">转码格式：</span>
                        <span class="config-content">{{config.codeTransform}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">搜索地址：</span>
                        <span class="config-content">{{config.searchUrl}}</span>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="2">
                搜索列表配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">搜索列表：</span>
                        <span class="config-content">{{config.searchList}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">start索引：</span>
                        <span class="config-content">{{config.searchListStart}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">end索引：</span>
                        <span class="config-content">{{config.searchListEnd}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说名称：</span>
                        <span class="config-content">{{config.searchListTitle}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说地址：</span>
                        <span class="config-content">{{config.searchListUrl}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说作者：</span>
                        <span class="config-content">{{config.searchListAuthor}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说状态：</span>
                        <span class="config-content">{{config.searchListStatus}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">最后更新时间：</span>
                        <span class="config-content">{{config.searchListLastTime}}</span>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="3">
                小说章节目录（详情）页配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">小说名称：</span>
                        <span class="config-content">{{config.bookTitle}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说作者：</span>
                        <span class="config-content">{{config.bookAuthor}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">最后更新时间：</span>
                        <span class="config-content">{{config.updateTime}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说分类：</span>
                        <span class="config-content">{{config.bookType}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说封面：</span>
                        <span class="config-content">{{config.bookImgUrl}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">小说描述：</span>
                        <span class="config-content">{{config.bookDescription}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节目录地址：</span>
                        <span class="config-content">{{config.catalogListUrl}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节目录：</span>
                        <span class="config-content">{{config.catalogList}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">start索引：</span>
                        <span class="config-content">{{config.firstCatalogList}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">end索引：</span>
                        <span class="config-content">{{config.endCatalogList}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节名称：</span>
                        <span class="config-content">{{config.catalogTitle}}</span>
                    </p>
                    <p class="config-kuai">
                        <span class="config-title">章节Url地址：</span>
                        <span class="config-content">{{config.catalogUrl}}</span>
                    </p>
                </div>
            </Panel>
            <Panel class="config-box" name="4">
                小说详情配置
                <div slot="content">
                    <p class="config-kuai">
                        <span class="config-title">小说详情：</span>
                        <span class="config-content">{{config.catalogContent}}</span>
                    </p>
                </div>
            </Panel>
        </Collapse>

        <div slot="footer">
            <Button type="text" @click="onClickCancel">取消</Button>
            <Button type="primary" :loading="loading" @click="onClickSave" v-show="type != 'look'">{{type == 'edit' ? '保存' : '新增'}}</Button>
        </div>
    </Modal>
</template>

<script type="text/ecmascript-6">
    import util from 'util';
    export default {
        name: "edit-cannel",
        props:{
            modal: {
                type: Object,
                default: {showModal:false}
            },
        },
        data() {
            return {
                loading:false,
                Collapse:"0",
                initConfig:{
                    reptileTypeId:'',
                    code:'',                 //页面编码格式
                    name:'',              //备注名称
                    baseUrl:'',    //来源地址
                    codeTransform:'',            //页面转码方式，用于搜索转码方式
                    searchUrl:'', //搜索地址前缀

                    /*
                    * 搜索列表start
                    * */
                    searchList:'',        //搜索到的列表
                    searchListStart:'',                  //搜索到的列表页   第一本小说从哪里开始      索引值从0开始
                    searchListEnd:'',                    //搜索到的列表页   最后几条不是小说
                    searchListTitle:'',           //搜索到的列表页  小说标题
                    searchListUrl:'',         //搜索到的列表页  小说详情url地址
                    searchListAuthor:'',    //搜索到的列表页  小说作者
                    searchListStatus:'',                  //搜索到的列表页   小说状态
                    searchListLastTime:'',                       //搜索到的列表页   小说最后更新时间
                    /*
                    * 搜索列表end
                    * */

                    /*
                    * 小说目录页、详情页  start
                    * */
                    bookTitle:'',
                    bookAuthor:'',
                    updateTime:'',
                    bookType:'',
                    bookImgUrl:'',                            //小说封面
                    bookDescription:'',                                   //小说描述
                    catalogListUrl:'',                      //章节目录地址
                    catalogList:'',                                  //目录列表
                    firstCatalogList:'',              //第一个索引值
                    endCatalogList:'',                                          //最后一个索引值
                    catalogTitle:'',                    //小说名称
                    catalogUrl:'',                      //小说章节地址
                    /*
                    * 小说目录页、详情页  end
                    * */
                    catalogContent:''
                },
                config:{},
                type:'add'
            }
        },
        computed: {},
        methods: {
            onClickCancel(){
                this.modal.showModal = false;
                this.Collapse = "0";
            },
            onClickSave(){
                if(this.loading) return;
                let obj = {
                    params: {
                        config:JSON.stringify(this.config)
                    }
                };
                if(this.type == 'edit') {
                    this.loading = true;
                    util.post.reptile.editChannel(obj).then((data) => {
                        this.loading = false;
                        this.modal.showModal = false;
                        this.$parent.$parent.$emit('reset');
                    }).catch((err)=> {
                        this.loading = false;
                    });
                } else if(this.type == 'add' || this.type =='copyAdd') {
                    this.loading = true;
                    util.post.reptile.addChannel(obj).then((data) => {
                        this.loading = false;
                        this.modal.showModal = false;
                        this.$parent.$parent.$emit('reset');
                    }).catch((err)=> {
                        this.loading = false;
                    });
                }




            },
            init(type, data){
                switch (type) {
                    case "add":
                        console.log("新增");
                        this.config = Object.assign({}, this.initConfig);
                        this.type = type;
                        break;
                    case "copyAdd":
                        console.log("复制新增");
                        this.config = Object.assign({}, data);
                        this.type = type;
                        break;
                    case "look":
                        console.log("查看");
                        this.config = Object.assign({}, data);
                        this.type = type;
                        break;
                    case "edit":
                        console.log("编辑");
                        this.config = Object.assign({}, data);
                        this.type = type;
                        break;
                    default:
                        break;
                }
            }
        },
        components: {},
        created() {

        },
        mounted() {
            this.$on('reset', (type, data) => {
                this.init(type,data);
            });
        },
        beforeDestroy() {

        },
        destroyed() {
        },
        activated() {

        },
        deactivated() {

        }
    }
</script>
