<style lang="less">
    @import "./catalog.less";
    /*.textarea{*/
    /*width: calc(~'100% - 150px');*/
    /*}*/
    .bookImg{
        max-width:300px;
        max-height:300px;
    }
</style>
<template>
    <Layout>
        <Card>
            <Row>
                <Col span="24">
                    <Upload class="upload" :show-upload-list="false" multiple :action="baseUrl + '/upload'" :data="uploadParams" :on-success="uploadSuccess" :on-error="uploadError" :format="['jpg','png','gif']" :on-format-error="uploadFormatError">
                        <img class="bookImg" :src="imgUrl + params.bookId + imgHash" alt="书名">
                    </Upload>
                    <!--<img class="bookImg" :src="imgUrl + params.bookId" alt="书名">-->
                    <h1>
                        {{book.name}}
                        <Button type="primary" :disabled="loading" @click="isEdit = !isEdit;" class="fr" >{{isEdit?'取消编辑':'编辑描述'}}</Button>
                        <Button type="primary" :disabled="loading" @click="onClickSaveDescription" class="fr mr10" v-show="isEdit">保存描述</Button>

                        <Button type="primary" :disabled="loading" class="fr mr10" v-show="isMyBook" @click="onClickAddCatalog">新增章节</Button>
                    </h1>
                    <p class="description" v-show="!isEdit">{{book.description}}</p>
                    <Input class="textarea" v-show="isEdit" v-model="description" type="textarea" :rows="4" placeholder="请输入描述"></Input>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="catalog" ref="table" ></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getCatalog"></Page>
        </Card>

        <edit-catalog-info :edit="editStatus" :book="book" ref="edit" @search="getCatalog"></edit-catalog-info>
    </Layout>
</template>

<script type="text/ecmascript-6">
    import util from 'util';
    import config from "config";
    import Cookies from 'js-cookie';
    import editCatalogInfo from "modal/home/editCatalogInfo";
    export default {
        name: "catalog",
        data() {
            return {
                params:{
                    bookId:null,
                    page:null,
                    limit:null
                },
                total:1,
                loading:false,
                initColumns:[
                    {
                        title: "id",
                        key: 'id',
                        width:100,
                        render: (h, params) => {
                            return h('a', {
                                attrs:{
                                    href:"javascript:void(0)"
                                },
                                on: {
                                    click: (e) => {
                                        this.$router.push("/bookContainer?bookId=" + this.params.bookId + "&catalogId=" + params.row.id + "&num=" + params.row.num );
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                }
                            },params.row.id)
                        }
                    },
                    {
                        title:'章节名称',
                        key:'name',
                        width:300
                    },
                    {
                        title:'排序NUM',
                        key:'num',
                        // width:100
                    },
                    {
                        title:'是否禁用',
                        key:'isJin',
                        // width:130,
                        render: (h, params) => {
                            // return h('span', {
                            // }, params.row.isJin == "2" ? "未禁用":"已禁用")
                            return h("div", [
                                h("span", params.row.isJin == "2" ? "未禁用":"已禁用"),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`color:${params.row.isJin == "2" ?'red':'auto'}`
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickUpdateCatalogisJin(params.row.id, params.row.isJin == "2" ? "1" : "2")
                                        }
                                    }
                                }, `(${params.row.isJin == "2" ? "禁用":"启用"})`)
                            ]);
                        }
                    },
                    {
                        title:'章节类型',
                        key:'type',
                        // width:100,
                        render: (h, params) => {
                            return h('span', {
                            }, params.row.type == "2" ? "特殊章节":"普通章节")
                        }
                    },
                    {
                        title:'创建时间',
                        key:'createTime',
                        // width:200,
                        render: (h, params) => {
                            return h('span', {
                            }, util.timeChange(params.row.createTime))
                        }
                    },
                    {
                        title: '最后修改时间',
                        key: 'updateTime',
                        // width:200,
                        render: (h, params) => {
                            return h('span', {}, util.timeChange(params.row.updateTime))
                        }
                    }
                ],
                columns:[],
                myBookColumns:[
                    {
                        title:"操作（来源本站）",
                        key:"handle",
                        render:(h, params) => {
                            return h('div', [
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);'
                                    },
                                    on:{
                                        click: () => {
                                            this.$Message.info("功能尚未开放，敬请期待");
                                        }
                                    }
                                }, `上移`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: () => {
                                            this.$Message.info("功能尚未开放，敬请期待");

                                        }
                                    }
                                }, `下移`),
                                h("a", {
                                    attrs: {
                                        href:"javascript:void(0);",
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: (e) =>{
                                            // this.$router.push("/reptile-tool/channel");
                                            this.showEdit(params.row);
                                        }
                                    },
                                }, `编辑`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: () => {
                                            // this.onClickDelBook(params.row.id, params.row.name)
                                            this.onClickDelCatalog(params.row);
                                        }
                                    }
                                }, `删除`),
                            ])
                        }
                    }
                ],
                catalog:[],
                book:{

                },
                imgUrl: config.apiUrl + '/images/',
                isEdit:false,    //是否是编辑状态
                description:'',


                imgHash:"",
                baseUrl:config.apiUrl,
                uploadParams:{
                    token:Cookies.get("token"),
                    type:1,  //表示小说封面上传
                    bookId:''
                },
                isMyBook:false,
                editStatus:{
                    status:false
                },
            }
        },
        computed: {},
        methods: {
            getCatalog(page) {
                if(page > 0) {
                    this.params.page = page;
                }
                let obj = {
                    params: Object.assign({},this.params)
                };
                this.loading = true;
                this.$router.replace({path:'/catalog', query:this.params})
                util.post.books.catalogList(obj).then((data) => {
                    this.catalog = data.catalog;
                    this.total = data.count;

                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            initColumnsFn(){
                if(this.isMyBook) {
                    this.columns = [...this.initColumns, ...this.myBookColumns];
                } else {
                    this.columns = [...this.initColumns];
                }
            },
            getBook(){
                let obj = {
                    params:{
                        bookId:this.params.bookId
                    }
                };
                util.post.books.book(obj).then((data) => {
                    this.book = data.book[0];
                    this.description = this.book.description;
                    if(this.book.reptileType == 0  && this.book.author == this.$store.state.user.user.name){
                        this.isMyBook = true;
                    } else {
                        this.isMyBook = false;
                    }
                    this.initColumnsFn();
                })
            },
            onClickUpdateCatalogisJin(catalogId, isJin) {
                let obj = {
                    params: {
                        catalogId: catalogId,
                        isJin: isJin
                    }
                }
                this.loading = true;
                util.post.books.updateCatalogIsJin(obj).then((data) => {
                    this.$Message.success(data);
                    this.getCatalog();
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickSaveDescription(){       //输入书的描述
                let obj = {
                    params:{
                        bookId:this.params.bookId,
                        description:this.description
                    }
                };
                this.loading = true;
                util.post.books.updateBookDescription(obj).then((data) => {
                    this.loading = false;
                    this.book.description = this.description;

                    this.isEdit = false;
                    this.$Message.success("修改成功");
                }).catch((err) => {
                    this.loading = false;
                })
            },


            showEdit(catalogInfo){
                this.$refs.edit.$emit("editCatalog",catalogInfo);
            },
            onClickAddCatalog(){
                this.showEdit();
            },

            onClickDelCatalog(catalog){
                this.$Modal.confirm({
                    closable:true,//按esc关闭
                    title: `温馨提示`,
                    content: `<p>你确定要删除《${catalog.name}》吗？</p>`,
                    onOk: () => {
                        if(this.loading) return;
                        this.loading = true;
                        let obj = {
                            params:{
                                id:catalog.id,
                                num:catalog.num,
                                bookId: catalog.bookId,
                            }
                        };
                        util.post.writer.delCatalog(obj).then((data) =>{
                            this.$Message.success(data);
                            this.loading = false;
                            this.getCatalog();
                        }).catch((err) => {
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了删除');
                    }
                });
            },
            succesFun(data) {
                this.imgHash = "?v=" + new Date().getTime();
            }
        },
        components: {
            editCatalogInfo
        },
        created() {

        },
        mounted() {

        },
        beforeDestroy() {

        },
        destroyed() {
        },
        activated() {
            let bookId = parseInt(this.$route.query.bookId) || 0;
            let page = parseInt(this.$route.query.page) || 1;
            let limit = parseInt(this.$route.query.limit) || 20;

            if(bookId !== this.params.bookId || page !== this.params.page || limit !== this.params.limit) {
                if(bookId !== this.params.bookId) {
                    this.params.bookId = bookId;
                    this.uploadParams.bookId = bookId;
                    this.getBook();
                }
                if(page !== this.params.page) {
                    this.params.page = page;
                }
                if(limit !== this.params.limit) {
                    this.params.limit = limit;
                }

                this.getCatalog();
            }


        },
        deactivated() {
        }
    }
</script>
