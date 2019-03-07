<template>
    <Layout>
        <Card>
            <Row>
                <Col span="24">
                    <Input @keyup.native.13="onClickSearch(1)"
                       v-model="bookName" placeholder="输入书名" clearable class="w200"></Input>
                    <Button type="primary" @click="onClickSearch(1)">搜索</Button>
                    <Button v-if="showSimpleReptile" type="primary" @click="onClickOneKey()">{{showSimpleReptile}}一键爬取</Button>

                    <Button v-if="showSimpleReptile" type="primary" @click="onClickOneKey('',true)">{{showSimpleReptile}}替代式一键爬取</Button>
                    <!--<Button type="primary" class="fr" style="margin-left:10px;"  @click="onClickOneKey('all',true)">全部一键替代式爬取</Button>-->
                    <Button type="primary" class="fr" @click="onClickOneKey('all')">全部一键爬取</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="list" ref="table"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="onClickSearch"></Page>
        </Card>
    </Layout>
</template>
<script type="text/ecmascript-6">
    import util from "util";
    export default {
        name: "progress-error",
        data() {
            return {
                loading:false,
                reptileList:{length:0},
                columns:[
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '备注',
                        key: 'reptileType',
                        render: (h, params) => {
                            return  h('span', {}, `${this.reptileList[params.row.reptileType].name}`);
                        }
                    },
                    {
                        title: '书名',
                        key: 'bookName'
                    },
                    {
                        title: '章节名',
                        key: 'catalogName',
                        render: (h, params) => {
                            return h('a',{
                                attrs: {
                                    href: 'javascript:void(0)',
                                    target: '_blank'
                                },
                                on:{
                                    click: () => {
                                        this.onJumpToCatalogInfo(params.row.bookName, params.row.catalogName);
                                    }
                                }
                            }, params.row.catalogName)
                        }
                    },
                    {
                        title: '来源地址',
                        key: 'originUrl',
                        render: (h, params) => {
                            let href = "";
                            if(params.row.reptileAddress.indexOf("http") === 0) {
                                href = params.row.reptileAddress;
                            } else {
                                href = params.row.originUrl + params.row.reptileAddress;
                            }
                            return h('a',{
                                attrs: {
                                    href: href,
                                    target: '_blank'
                                }
                            }, href)
                        }
                    },
                    {
                        title:'操作',
                        key: 'handle',
                        render: (h, params) => {
                            return h('div',[
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickDel(params.row.id);
                                        }
                                    }
                                }, `删除`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`,
                                        id:`${params.row.title}_${params.row.id}`
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickUpdate(params);
                                        }
                                    }
                                }, `爬取`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`,
                                        id:`${params.row.title}_ti${params.row.id}`
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickUpdate(params, 1);
                                        }
                                    }
                                }, `替代式爬取`),
                                h('a', {
                                    attrs:{
                                        href:`https://www.baidu.com/s?wd=${params.row.bookName}`,
                                        style:`margin-left:10px;`,
                                        target:'_blank'
                                        // id:`${params.row.title}_${params.row.id}`
                                    },
                                    // on:{
                                    //     click: () => {
                                    //         this.onClickUpdate(params);
                                    //     }
                                    // }
                                }, `其他来源`),
                            ])
                        }
                    }
                ],
                list:[],
                params:{
                    page:1,
                    limit:10
                },
                total:0,
                bookName:'',
                showSimpleReptile:"",
                first:true,//第一次
            }
        },
        computed: {},
        methods: {
            onClickSearch(page) {
                if(this.loading) return;
                if(page) {
                    this.params.page = page;
                }
                if(this.bookName){
                    this.showSimpleReptile = this.bookName;
                } else {
                    this.showSimpleReptile = "";
                }
                let obj = {
                    params:{
                        page: this.params.page,
                        limit: this.params.limit,
                    }
                };
                if(this.bookName) obj.params.bookName = this.bookName;
                this.$router.replace({path:'/reptile-tool/progress-error', query:Object.assign({}, obj.params)});
                this.loading = true;
                util.post.reptile.getProgressList(obj).then((data) => {
                    this.list = data.data;
                    this.total = data.count;
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickDel(id){
                let obj = {
                    params:{
                        errorId:id
                    }
                };
                this.loading = true;
                util.post.reptile.deleteError(obj).then((data) => {
                    this.$Message.success(data);
                    this.loading = false;
                    this.onClickSearch();
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickUpdate(params, tiType){
                // this.$Message.info("功能尚未开放，请等待");

                let spanHtml = document.getElementById(`${params.row.title}_${tiType==1?'ti':''}${params.row.id}`).innerHTML;
                if(spanHtml == "已获取" || spanHtml == "正在获取中") {
                    return;
                }

                document.getElementById(`${params.row.title}_${tiType==1?'ti':''}${params.row.id}`).innerHTML = "正在获取中";
                let obj = {
                    params:{
                        errorId:params.row.id,
                        tiType:tiType   //当tiType为1时，是替代爬取
                    }
                }
                util.post.reptile.restartCatalog(obj).then((data) => {
                    this.$Message.success(data);
                    this.onClickSearch();
                    // document.getElementById(`${params.row.title}_${params.row.id}`).innerHTML = "已获取";
                }).catch((err) => {
                    document.getElementById(`${params.row.title}_${tiType==1?'ti':''}${params.row.id}`).innerHTML = "获取失败";
                });
            },
            onClickOneKey(all,tiType){
                // if(!this.showSimpleReptile) return false;
                // console.log(this.showSimpleReptile);
                let obj = {
                    params:{}
                };
                if(all=='all'){

                } else {
                    obj.params.bookName = this.showSimpleReptile;
                }
                if(tiType) {
                    obj.params.tiType = 1;
                } else {

                }
                this.loading = true;
                util.post.reptile.oneKeyRestartCatalog(obj).then((data) => {
                    this.$Message.success(data);
                    this.onClickSearch();
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onJumpToCatalogInfo(bookName, catalogName){
                let obj = {
                    params:{
                        bookName: bookName,
                        catalogName: catalogName,
                    }
                };
                this.loading = true;
                util.post.common.getCatalogFromInfo(obj).then((data) => {
                    this.loading = false;
                    if(data.count > 0) {
                        let catalog = data.data[0];
                        // this.$router.push(`/bookContainer?bookId=${catalog.bookId}&catalogId=${catalog.id}&num=${catalog.num}`);
                        let a = document.createElement('a');
                        a.href = `/#/bookContainer?bookId=${catalog.bookId}&catalogId=${catalog.id}&num=${catalog.num}`;
                        a.style.display = "none";
                        a.setAttribute('target', '_blank');
                        a.click();
                        a.remove();

                        return;
                    }
                    this.$message.error("未知错误");
                }).catch((err) => {
                    console.error(err);
                    this.loading = false;
                });
            },
            getReptileList() {  //获取配置列表
                let obj = {
                    params:{
                    }
                };
                util.post.reptile.list(obj).then((data) => {
                    // this.reptileList = this.reptileList.concat(data.reptileList);
                    this.reptileList = {};
                    data.reptileList.forEach((value,index) => {
                        this.reptileList[value.reptileTypeId] = value;
                    })
                    this.reptileList.length = data.reptileList.length;
                }).catch((error) => {});
            },
            activatedStart(){
                let bookName = this.$route.query.bookName || "";
                if(bookName != this.bookName || this.first) {
                    this.bookName = bookName;
                    this.onClickSearch();
                    this.first = false;
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
        components: {},
        created() {
            this.getReptileList();
        },
        mounted() {
        },
        beforeDestroy() {
        },
        destroyed() {
        },
        activated() {
            this.start();
        },
        deactivated() {

        }
    }
</script>
