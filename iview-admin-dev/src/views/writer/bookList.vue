<template>
    <div>
        <Card>
            <Button type="primary" :disabled="loading" @click="onClickAddBook">添加新书</Button>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="books" ref="table" @on-row-dblclick="expandToggle"></Table>
            <!--<Table border highlight-row :loading="loading" :columns="columns" :data="books" ref="table"></Table>-->
        </Card>
        <Card shadow>
            <!--<Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getBooks"></Page>-->
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator></Page>
        </Card>


        <Upload class="upload" :show-upload-list="false" multiple :action="baseUrl + '/upload'" :data="uploadParams" :on-success="uploadSuccess" :on-error="uploadError" :format="['jpg','png','gif']" :on-format-error="uploadFormatError" ref="upload">
            <label id="uploadClick"></label>
        </Upload>

        <wb-img :img="bigImg.url" :right="bigImg.right" :top="bigImg.top"></wb-img>
        <edit-book :edit="editStatus" :book-type-list="bookTypeList" ref="edit" @search="onClickSearch"></edit-book>
    </div>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less"></style>
<script type="text/ecmascript-6">
    import util from 'util';
    import description from "@/views/home/components/description";
    import config from "config";
    import wbImg from "@/views/home/components/wb-img";
    import editBook from 'modal/writer/editBook.vue';
    import Cookies from 'js-cookie';
    import isMeMixin from '@/mixins/isMe';

    export default {
        mixins:[isMeMixin],
        name: "write",
        data() {
            return {
                columns: [
                    {
                        title: 'id',
                        key: 'id',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    attrs: {
                                        href: "javascript:void(0);"
                                    },
                                    on: {
                                        click: (e) => {
                                            this.$router.push("/catalog?bookId=" + params.row.id);
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }
                                    }
                                }, params.row.id),
                                h('a', {
                                    attrs: {
                                        href: "javascript:void(0);",
                                        style: "margin-left:5px;" + "color:" + (params.row.isJin == 2 && "red;")
                                    },
                                    on: {
                                        click: (e) => {
                                            this.onClickUpdateBookisJin(params.row.id, params.row.isJin == "2" ? "1" : "2", params.row.name);
                                        }
                                    }
                                }, params.row.isJin == 1 ? "(禁用)" : "(启用)")
                            ])
                        }
                    },
                    {
                        title: '书名',
                        key: 'name',
                    },
                    {
                        title: '小说类型',
                        key: 'bookType'
                    },
                    {
                        title: '图片地址',
                        key: 'imgUrl',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: config.apiUrl + '/images/' + params.row.id,
                                    style: 'max-width:50px; max-height:50px;display:block;margin:2px;',
                                    id:'img'+ params.row.id,
                                },
                                on: {
                                    mouseenter: (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        this.bigImg.url = e.target.src;
                                    },
                                    mousemove: (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        // console.log(e.screenX,e.screenY);   //相对于屏幕
                                        // console.log(e.clientX,e.clientY);   //相对于浏览器
                                        this.bigImg.right = document.activeElement.clientWidth - e.clientX;
                                        this.bigImg.top = e.clientY;
                                    },
                                    mouseleave: (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        this.bigImg.url = "";
                                        this.bigImg.right = 0;
                                        this.bigImg.top = 0;
                                    },
                                    click: (e) => {
                                        this.uploadParams.bookId = params.row.id;

                                        document.getElementById("uploadClick").click();
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '小说状态',
                        key: 'bookStatus',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    attrs: {
                                        style:'color:' + ((params.row.bookStatus == 2 || params.row.bookStatus == 4) && "red;")
                                    }
                                },(params.row.bookStatus == 1 || params.row.bookStatus == 3) ? "连载":"完本"),
                                h('a', {
                                    attrs: {
                                        href:'javascript:void(0);',
                                        style:"color:" + ((params.row.bookStatus == 1 || params.row.bookStatus == 3) && "red;")
                                    },
                                    on:{
                                        click: () => {
                                            if(params.row.bookStatus == 1 || params.row.bookStatus == 2) {
                                                this.onClickUpdateBookStatus(params.row.id, params.row.bookStatus == 1 ? 2:1, params)
                                            } else if(params.row.bookStatus == 3 || params.row.bookStatus == 4) {
                                                this.onClickUpdateBookStatus(params.row.id, params.row.bookStatus == 3 ? 4:3, params)
                                            }

                                        },
                                    }
                                },(params.row.bookStatus == 1 || params.row.bookStatus == 3) ? "(转完本)":"(转连载)")

                            ]);
                        }
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        render: (h, params) => {
                            return h('span', {}, util.timeChange(params.row.updateTime))
                        }
                    },
                    {
                        title: '操作',
                        key: 'updateTime',
                        // width: 280,
                        render: (h, params) => {
                            return h('div', [
                                h("a", {
                                    attrs: {
                                        href: "javascript:void(0);",
                                        style: `margin-left:10px;`
                                    },
                                    on: {
                                        click: (e) => {
                                            // this.$router.push("/reptile-tool/channel");
                                            this.showEdit(params.row);
                                        }
                                    },
                                }, `编辑`),
                                h('a', {
                                    attrs: {
                                        href: 'javascript:void(0);',
                                        style: `margin-left:10px;`
                                    },
                                    on: {
                                        click: () => {
                                            this.onClickDelBook(params.row.id, params.row.name)
                                        }
                                    }
                                }, `删除`),
                            ])
                        }
                    },
                    {
                        title: '描述',
                        type: 'expand',
                        width: 70,
                        render: (h, params) => {
                            return h(description, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                ],
                books: [],
                params: {
                    page: 1,
                    limit: 10,
                },
                bigImg:{
                    url:'',
                    right:0,
                    top:0
                },
                total: 1,
                loading: false,
                bookTypeList:[],
                editStatus:{
                    status:false
                },
                reptileList:{length:0},



                baseUrl:config.apiUrl,
                uploadParams:{
                    token:Cookies.get("token"),
                    type:1,  //表示小说封面上传
                    bookId:''
                },
            }
        },
        computed: {},
        methods: {
            onClickDelBook(bookId, bookName){
                this.$Modal.confirm({
                    closable:true,//按esc关闭
                    title: `温馨提示`,
                    content: `<p>你确定要删除《${bookName}》吗？</p>`,
                    onOk: () => {
                        if(this.loading) return;
                        this.loading = true;
                        let obj = {
                            params:{
                                bookId: bookId,
                                bookName: bookName
                            }
                        };
                        util.post.books.delBook(obj).then((data) =>{
                            this.$Message.success(data);
                            this.loading = false;
                            this.getBooks();
                        }).catch((err) => {
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了删除');
                    }
                });
            },
            expandToggle(row, index) {  //触发click事件
                console.log(this.$refs.table.$el);
                this.$refs.table.$el.getElementsByClassName("ivu-table-cell-expand")[index].click();
            },
            onClickUpdateBookisJin(bookId, isJin, bookName) {
                let obj = {

                }
                if(!isJin) {
                    let bookIds = [];   //批量
                    this.selection.forEach((value, index) => {
                        bookIds.push(value.id);
                    });
                    obj = {
                        params:{
                            bookIds:bookIds.join(','),
                            isJin:1
                        }
                    }
                } else {
                    obj = {
                        params: {
                            bookId: bookId,
                            isJin: isJin
                        }
                    }
                }


                this.loading = true;

                util.post.books.updateBookIsJin(obj).then((data) => {
                    this.$Message.success(data);
                    this.loading = false;
                    this.getBooks();
                }).catch((err) => {
                    this.loading = false;
                    if(isJin == 1) {
                        this.$router.push("/reptile-tool/progress-error?bookName=" + bookName);
                    }
                });
            },
            showEdit(book){
                this.$refs.edit.$emit("editBook",book);
            },
            onClickSearch() {
                if(!this.isme) return;
                this.getBooks(1);
            },
            onClickAddBook(){
                this.showEdit();
            },
            getBookTypeList(page) {
                let obj = {
                    params: {}
                };
                util.post.type.bookTypeList(obj).then((data) => {
                    data.bookTypeList.unshift({
                        bookType:"NULL"
                    });
                    data.bookTypeList.unshift({
                        bookType:"全部"
                    });
                    this.bookTypeList = data.bookTypeList;
                }).catch((err)=> {
                    console.error("err");
                });
            },
            onClickUpdateBookStatus(id, bookStatus, params) {
                let statusStr = bookStatus == 3 ? "连载" : "完本";
                this.$Modal.confirm({
                    closable:true,//按esc关闭
                    title: `${params.row.name}_${params.row.author}`,
                    content: `<p>你确定要转成${statusStr}状态?</p>`,
                    onOk: () => {
                        if(this.loading) return;
                        let obj = {
                            params:{
                                bookId:id,
                                bookStatus:bookStatus
                            }
                        };
                        this.loading = true;
                        util.post.books.updateBookStatus(obj).then((data)=> {
                            this.$Message.success(`已转为${bookStatus == 3 ? "连载" : "完本"}`);
                            this.loading = false;
                            this.getBooks();
                        }).catch((err)=>{
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了转换');
                    }
                });
            },
            getReptileList() {  //获取配置列表
                let obj = {
                    params:{
                    }
                };
                util.post.reptile.list(obj).then((data) => {
                    this.reptileList = {};
                    data.reptileList.forEach((value,index) => {
                        this.reptileList[value.reptileTypeId] = value;
                    })
                    this.reptileList.length = data.reptileList.length;
                }).catch((error) => {});
            },
            getBooks(page){
                if(this.loading) return;
                if(page > 0) {
                    this.params.page = page;
                }
                let obj = {
                    params: {
                        page: this.params.page,
                        limit: this.params.limit,
                    }
                };
                if(this.selectName && this.inputValue) {
                    obj.params[this.selectName] = this.inputValue;
                }
                if(this.type) {
                    obj.params.type = this.type;
                }
                if(this.bookType && this.bookType !="全部") {
                    obj.params.bookType = this.bookType;
                }
                if(this.bookStatus) {
                    obj.params.bookStatus = this.bookStatus;
                }
                if(this.isJin){
                    obj.params.isJin = this.isJin;
                }

                this.loading = true;
                this.$router.replace({path:'/write/index', query:Object.assign({}, obj.params)});
                util.post.writer.bookList(obj).then((data) => {
                    this.books = data.book;
                    this.total = data.count;
                    this.loading = false;

                    this.$nextTick(() => {  //当dom发生变化后，执行打勾
                        this.$refs.table.selectAll(true);
                    });
                }).catch((err) => {
                    this.loading = false;
                });
            },
            activatedStart() {
                let page = parseInt(this.$route.query.page) || 1;
                let limit = parseInt(this.$route.query.limit) || 10;
                // let selectName = this.$route.query.selectName;
                // let selectName = this.$route.query.selectName;
                let type = parseInt(this.$route.query.type) || "";
                let bookType = this.$route.query.bookType || "";
                let bookStatus = this.$route.query.bookStatus || "";
                let isJin = this.$route.query.isJin || "";

                let selectName = "";
                let inputValue = "";
                if(this.bookTypeList.length <= 0) {
                    this.getBookTypeList();
                }

                // this.selectList.forEach((value, index) =>{
                //     if(this.$route.query[value.value]) {
                //         selectName = value.value;
                //         inputValue = this.$route.query[value.value]
                //     }
                // });

                if(page !== this.params.page || limit !== this.params.limit || type !== this.type || selectName !== this.selectName || inputValue !== this.inputValue || bookType !== this.bookType || this.bookStatus !== bookStatus || this.isJin !== isJin) {

                    if(this.type !== type) this.type = type;
                    if(this.selectName !== selectName) this.selectName = selectName;
                    if(this.inputValue !== inputValue) this.inputValue = inputValue;
                    if(this.bookStatus !== bookStatus) this.bookStatus = bookStatus;
                    if(this.isJin !== isJin) this.isJin = isJin;
                    if(this.bookType !== bookType) {
                        if(this.bookTypeList.length <= 0) {
                            this.bookTypeList = [
                                {
                                    bookType:"全部"
                                },
                                {
                                    bookType:bookType
                                }
                            ];
                        }
                        this.bookType = bookType;
                    }
                    if(page !== this.params.page) this.params.page = page;
                    if(limit !== this.params.limit) this.params.limit = limit;

                    this.getBooks();
                }
            },
            start(){
                if(this.reptileList.length > 0) {
                    this.activatedStart();
                } else {
                    let set = setInterval(() => {
                        if(this.reptileList.length > 0){
                            this.activatedStart();
                            clearInterval(set);
                            set = null;
                        }
                    },300);
                }
            },
            succesFun() {
                let imgDom = document.getElementById("img" + this.uploadParams.bookId);
                let imgUrl = imgDom.src;
                imgDom.src = imgUrl.split("?")[0] + "?v=" + Date.now();
            }
        },
        components: {
            description,
            wbImg,
            editBook
        },
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
