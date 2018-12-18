<template>
    <Layout>
        <Card shadow>
            <Row>
                <Col span="20">
                    <span class="span-title">搜索配置：</span>
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll()">全选</Checkbox>
                    <CheckboxGroup v-model="reptileType" @on-change="checkAllGroupChange" style="display: inline-block;">
                        <Checkbox v-for="item in reptileList" :label="item.reptileTypeId" :key="item.reptileTypeId">{{ item.name }}</Checkbox>
                    </CheckboxGroup>
                </Col>
            </Row>
        </Card>
        <Card>
            <Row>
                <Col span="18">
                    <span class="span-title">搜索小说名或作者名：</span>
                    <Input @keyup.native.13="onClickSearch"
                           v-model="bookName"
                           placeholder="请输入您想爬取的小说名或者作者名"
                           clearable
                           class="w300"
                    ></Input>
                </Col>
                <Col span="6" class="tr">
                    <span>启用代理搜索：</span>
                    <i-switch v-model="isProxy" class="mr20" :disabled="loading"></i-switch>
                    <Button type="primary" @click="onClickSearch">搜索</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="list" ref="table"></Table>
        </Card>
    </Layout>
</template>
<style scoped rel="stylesheet/less" type="text/less" lang="less">
    .span-title{
        vertical-align: middle;
    }
</style>

<script>
import util from 'util';
export default {
    name: 'book',
    components: {
    },
    data () {
        return {
            indeterminate: false,             //如果有勾选，则为true    true
            checkAll: true,            //如果全部勾选了，为true   true

            bookName:'',
            loading: false,
            columns:[
                {
                    title: '标题',
                    key: 'title',
                    width:400,
                    render: (h, params) => {
                        return h("div", [
                            h("span", params.row.title),
                            h('span', {
                                attrs:{
                                    style:'color:red'
                                }
                            }, `(${params.row.status})`)
                        ]);
                    }
                },
                {
                    title: '作者',
                    key: 'author'
                },
                {
                    title:'来源',
                    key:'reptileType',
                    render: (h, params) => {
                        return h("span", {
                            attrs:{
                            }
                        }, this.remarkList[params.row.reptileType]);
                    }
                },
                {
                    title:'爬取地址',
                    key:"url",
                    render: (h, params) => {
                        return h("a", {
                            attrs:{
                                href:params.row.url,
                                target:'_blank'
                            }
                        }, params.row.url);
                    }
                },
                {
                    title:'爬取',
                    key:'',
                    render: (h, params) => {
                        return h("a", {
                            attrs:{
                                href:'javascript:void(0);',
                                // target:"_blank",
                                id:`${params.row.title}_${params.row.author}`
                            },
                            on: {
                                click: () => {
                                    this.onClickReptileTool(params);
                                }
                            }
                        },params.row.reptile)
                    }
                }
            ],
            list:[],
            reptileType: [],
            reptileList:[],
            remarkList:{},
            isProxy:true
        };
    },
    computed: {
    },
    methods: {
        handleCheckAll (init) {
            if(init) { //初始化
                if(this.reptileType.length == this.reptileList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if(this.reptileType.length >0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                return ;
            }

            if (this.indeterminate) {       //如果有勾选
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            if (this.checkAll) {
                this.reptileType = [];
                this.reptileList.forEach((value, index) => {
                    this.reptileType.push(value.reptileTypeId);
                });
            } else {
                this.reptileType = [];
            }
        },
        checkAllGroupChange (data) {
            if (data.length === this.reptileList.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },

        onClickSearch(){
            if(!this.bookName) {
                return;
            }
            if(!this.bookName.trim()){
                return;
            }
            if(this.loading) return;
            localStorage.bookName = this.bookName;
            let reptileType = this.reptileType.join(',');
            localStorage.reptileType = reptileType;
            localStorage.isProxy = this.isProxy;
            this.$router.replace('/reptile-tool/book?bookName=' + this.bookName + '&reptileType=' + reptileType + '&isProxy=' + this.isProxy);
            let obj = {
                params:{
                    bookName: this.bookName,
                    reptileType: reptileType,
                    isProxy:this.isProxy
                }
            };
            this.loading = true;
            util.post.reptile.getUrl(obj,{timeout:10000}).then((data) => {
                this.list = data.urlList;
                data.errorArr.forEach((value, index) => {
                    this.$Message.error(value);
                })
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            });
        },
        onClickReptileTool(params) {
            let spanHtml = document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML;
            if(spanHtml == "已获取" || spanHtml == "正在获取中") {
                return;
            }

            document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "正在获取中";
            let obj = {
                params:{
                    bookName:params.row.title,
                    bookUrl:params.row.url,
                    author:params.row.author,
                    reptileType:params.row.reptileType
                }
            }
            util.post.reptile.getBookJson(obj).then((data) => {
                document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "已获取";
            }).catch((err) => {
                document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "获取失败";
            });
            // this.$Modal.confirm({
            //     closable:true,//按esc关闭
            //     title: `${params.row.title}_${params.row.author}`,
            //     content: '<p>你确定要获取？获取之后，后台才会根据获取的书json来爬书</p>',
            //     onOk: () => {
            //         // this.loading = true;
            //         document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "正在获取中";
            //         let obj = {
            //             params:{
            //                 bookName:params.row.title,
            //                 bookUrl:params.row.url,
            //                 author:params.row.author,
            //             }
            //         }
            //         util.post.reptile.getBookJson(obj).then((data) => {
            //             document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "已获取";
            //             // this.loading = false;
            //         }).catch((err) => {
            //             // this.loading = false;
            //             document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "获取失败";
            //         });
            //     },
            //     onCancel: () => {
            //         this.$Message.info('你取消了获取');
            //     }
            // });
        },
        getReptileList() {  //获取配置列表
            let obj = {
                params:{
                }
            };
            let reptileList = [];
            util.post.reptile.list(obj).then((data) => {
                data.reptileList.forEach((value, index) => {
                    if(value.isSearch == 1) {   //启用
                        value.reptileTypeId = value.reptileTypeId + '';     //转成字符串，因为checkbox    int和string不相等
                        this.remarkList[value.reptileTypeId] = value.name;
                        reptileList.push(value);
                    } else {
                       value = null;
                    }
                });
                this.reptileList = this.reptileList.concat(reptileList);
                this.reptileType = (this.$route.query.reptileType && this.$route.query.reptileType.split(',')) || (localStorage.reptileType && localStorage.reptileType.split(',')) || [];
            }).catch((error) => {});
        },
        activatedStart(){
            this.handleCheckAll(true);
            let bookName2 = "";
            if(this.$route.query.bookName) {
                bookName2 = this.$route.query.bookName;
            } else if(localStorage.bookName) {
                bookName2 = localStorage.bookName;
            }
            let reptileType2 = this.reptileType.join(',');
            if(this.$route.query.reptileType) {
                reptileType2 = this.$route.query.reptileType;
            } else if(localStorage.reptileType) {
                reptileType2 = localStorage.reptileType;
            }
            let isProxy2 = this.isProxy;
            if(this.$route.query.isProxy) {
                isProxy2 = this.$route.query.isProxy == "true" ? true : false;
            } else if(localStorage.isProxy) {
                isProxy2 = localStorage.isProxy == "true" ? true : false;
            }

            if(this.bookName != bookName2 || this.reptileType != reptileType2 || this.isProxy != isProxy2) {
                this.reptileType = reptileType2.split(',');
                this.bookName = bookName2;
                this.isProxy = isProxy2;
                // this.changePlaceHolder(this.reptileType);
                this.onClickSearch();
            }
        },
        start(){
            if(this.reptileList.length > 0) {
                this.activatedStart();
            } else {
                let set = setTimeout(() => {
                    this.start();
                    clearTimeout(set);
                    set = null;
                },300);
            }
        }
    },
    created() {
        this.getReptileList();      //获取配置列表
    },
    mounted () {
    },
    activated() {
        this.start();
    },
    deactivated() {
    }
};
</script>
