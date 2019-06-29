<style lang="less">
    @import "./home.less";
</style>
<template>
    <Layout>
        <Card>
            <Row>
                <Col span="12">
                    <Select v-model="selectName" class="w100" placeholder="全部" label-in-value @on-change="selectChange">
                        <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-show="selectName" @keyup.native.13="onClickSearch"
                           v-model="inputValue" :placeholder="inputPlaceholder" clearable class="w200"></Input>
                    <!--:type="selectName == 'bookId'? 'number':'text'"-->
                    <Select v-model="isJin" class="w100" placeholder="全部" label-in-value @on-change="onClickSearch">
                        <Option v-for="item in isJinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="type" class="w100" placeholder="全部" label-in-value @on-change="onClickSearch">
                        <Option v-for="item in reptileStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>

                    <Select v-model="bookType" class="w100" placeholder="全部" label-in-value @on-change="onClickSearch">
                        <Option v-for="item in bookTypeList" :value="item.bookType" :key="item.bookType">{{ item.bookType }}</Option>
                    </Select>
                    <Select v-model="bookStatus" class="w100" placeholder="全部" label-in-value @on-change="onClickSearch">
                        <Option v-for="item in bookStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>

                    <Checkbox :value="fromMe" @click.prevent.native="handleCheckAll">来源本站</Checkbox>
                </Col>
                <Col span="12" class="tr">
                    <Button type="primary" :disabled="loading" @click="onClickSearch">搜索</Button>
                    <Button type="primary" :disabled="loading" @click="onClickUpdateBookisJin">批量启用</Button>
                    <Button type="primary" :disabled="loading" @click="onClickOneKeyUpdateNewCatalog">一键全部更新至最新章节</Button>
                    <Button type="primary" :disabled="loading" @click="onclickOneKeyGetAllBookImg">一键更新全部图片</Button>
                </Col>
            </Row>
        </Card>

        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="books" ref="table" @on-row-dblclick="expandToggle" @on-selection-change="onClickSelect" ></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getBooks"></Page>
        </Card>

        <wb-img :img="bigImg.url" :right="bigImg.right" :top="bigImg.top"></wb-img>
        <edit-book :edit="editStatus" :book-type-list="bookTypeList" ref="edit" @search="onClickSearch"></edit-book>
    </Layout>
</template>

<script>
    import util from 'util';
    import config from "config"
    import description from "./components/description";
    import wbImg from "./components/wb-img";
    import editBook from 'modal/home/editBook.vue';
    import isMeMixin from '@/mixins/isMe';
    export default {
        mixins:[isMeMixin],
        name: 'home',
        components: {
            description,
            wbImg,
            editBook
        },
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        key:'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'id',
                        key: 'id',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    attrs:{
                                        href:"javascript:void(0);"
                                    },
                                    on: {
                                        click: (e) => {
                                            this.$router.push("/catalog?bookId=" + params.row.id);
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }
                                    }
                                },params.row.id),
                                h('a', {
                                    attrs:{
                                        href:"javascript:void(0);",
                                        style:"margin-left:5px;" + "color:" + (params.row.isJin == 2 && "red;")
                                    },
                                    on: {
                                        click: (e) => {
                                            this.onClickUpdateBookisJin(params.row.id, params.row.isJin == "2" ? "1" : "2", params.row.name);
                                        }
                                    }
                                },params.row.isJin == 1 ? "(禁用)" : "(启用)")
                            ])
                        }
                    },
                    {
                        title: '书名',
                        key: 'name',
                        // width:200
                    },
                    {
                        title: '小说类型',
                        key: 'bookType'
                    },
                    {
                        title: '作者',
                        key: 'author'
                    },
                    {
                        title: '来源名称',
                        key: 'reptileType',
                        render: (h, params) => {
                            return  h("a", {
                                attrs: {
                                    href: "javascript:void(0);",
                                    target: "_blank"
                                },
                                on:{
                                    click: (e) =>{
                                        if(params.row.reptileType){
                                            this.$router.push("/reptile-tool/channel");
                                        }
                                    }
                                },
                            }, params.row.reptileType ? this.reptileList[params.row.reptileType].name : "本站")
                        }
                    },
                    {
                        title: '来源地址',
                        key: 'OriginUrl',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href:params.row.reptileType ? params.row.OriginUrl : "javascript:void(0);",
                                    target:"_blank"
                                }
                            },params.row.reptileType ? params.row.OriginUrl : "本站")
                        }
                    },
                    {
                        title: '图片地址',
                        key: 'imgUrl',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: config.apiUrl + '/images/' + params.row.id,
                                    style:'max-width:50px; max-height:50px;display:block;margin:2px;'
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
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '爬取状态',
                        key: 'type',
                        render: (h, params) => {
                            return h('span', {
                                attrs: {
                                    style:'color:' + ((params.row.type != 3 && params.row.type != 4) && "red;")
                                }
                            },params.row.type == 4 ? "来源本站": (params.row.type == 3 ? "已爬取":"未爬取"))
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
                            return h('span', {
                            }, util.timeChange(params.row.updateTime))
                        }
                    },
                    {
                        title: '操作',
                        key: 'handle',
                        // width: 280,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);'
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickUpdateBookInfo(params.row.id);
                                        }
                                    }
                                }, `更新小说基本信息`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: () => {
                                            if(params.row.bookStatus != "1" ) {
                                                this.$Message.info("已经是最新章节")
                                                return;
                                            }
                                            this.onClickUpdateNewCatalog(params.row.id, params.row.name)
                                            // this.onClickUpdateBookInfo(params.row.id);
                                        }
                                    }
                                }, params.row.bookStatus == "1" ? `更新到最新章节`:`已经是最新章节`),
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
                                            this.onClickDelBook(params.row.id, params.row.name)
                                        }
                                    }
                                }, `删除`),
                            ])
                        }
                    },
                    {
                        title:'描述',
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
                books:[],
                params:{
                    page: 1,
                    limit: 0,
                },
                total:1,
                loading:false,
                selectList: [
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 'bookId',
                        label: 'bookId'
                    },
                    {
                        value: 'bookName',
                        label: '书名'
                    },
                    {
                        value: 'author',
                        label: '作者名'
                    },
                    {
                        value: 'description',
                        label: '描述'
                    }
                ],
                bookStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'1',
                        label:'连载'
                    },
                    {
                        value:'2',
                        label:'完本'
                    }
                ],
                bookStatus: "",
                selectName: '',
                inputValue: '',
                inputPlaceholder:'',
                reptileStatusList:[
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 3,
                        label: '已爬'
                    },
                    {
                        value: 2,
                        label: '未爬'
                    },
                ],
                isJinList:[
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '2',
                        label: '禁用'
                    }
                ],
                isJin: '',
                type: '',
                bigImg: {
                    url: '',
                    right: 0,
                    top: 0
                },
                bookTypeList: [],
                bookType: '',
                reptileList: {length:0},

                editStatus: {
                    status: false
                },
                selection: [],
                fromMe: '',
            };
        },
        computed: {},
        methods: {
            handleCheckAll(){
                this.fromMe = !this.fromMe;
            },
            getBooks(page) {
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
                if(this.fromMe) {
                    obj.params.fromMe = this.fromMe;
                }

                this.loading = true;
                this.$router.replace({path:'/home', query:Object.assign({}, obj.params)});
                util.post.books.book(obj).then((data) => {
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
            expandToggle(row, index) {  //触发click事件
                this.$refs.table.$el.getElementsByClassName("ivu-table-cell-expand")[index].click();
            },
            selectChange(obj) {
                if(!this.isme) return;
                this.inputValue = "";
                if(obj.value) {
                    this.inputPlaceholder = "请输入" + obj.label;
                } else {
                    this.inputPlaceholder = "";
                    this.getBooks(1);
                }
            },
            onClickSearch() {
                if(!this.isme) return;
                this.getBooks(1);
            },
            onClickUpdateBookInfo(id) {
                if(this.loading) return;
                let obj = {
                    params:{
                        bookId:id
                    }
                };
                this.loading = true;
                util.post.books.updateBookInfo(obj).then((data) => {
                    this.loading = false;
                    if(data.book[0].isHandle) {
                        this.$Message.success("已更新")
                        this.getBooks();
                    } else {
                        this.$Message.success("已是最新状态")
                    }

                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
            },
            onClickUpdateNewCatalog(bookId, bookName) {
                if(this.loading) return;
                this.loading = true;
                let obj = {
                    params:{
                        bookId: bookId,
                        bookName: bookName
                    }
                };
                util.post.books.updateNewCatalog(obj).then((data) =>{
                    this.loading = false;
                    this.getBooks();
                }).catch((err) => {
                    this.getBooks();
                    this.loading = false;
                });
            },
            onClickOneKeyUpdateNewCatalog(){
                if(this.loading) return;
                this.loading = true;
                let obj = {
                    params:{
                    }
                };
                util.post.books.oneKeyUpdateNewCatalog(obj).then((data) =>{
                    this.loading = false;
                    this.getBooks();
                }).catch((err) => {
                    this.getBooks();
                    this.loading = false;
                });
            },
            onclickOneKeyGetAllBookImg(){
                if(this.loading) return;
                this.loading = true;
                let obj = {
                    params:{
                    }
                };
                util.post.common.oneKeyGetAllBookImg(obj).then(() =>{
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
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
            onClickUpdateBookStatus(id, bookStatus, params) {
                let statusStr = (bookStatus == 1 || bookStatus == 3) ? "连载" : "完本";
                this.$Modal.confirm({
                    closable: true, // 按esc关闭
                    title: `${params.row.name}_${params.row.author}`,
                    content: `<p>你确定要转成${statusStr}状态?</p>`,
                    onOk: () => {
                        if(this.loading) return;
                        let obj = {
                            params: {
                                bookId: id,
                                bookStatus: bookStatus
                            }
                        };
                        this.loading = true;
                        util.post.books.updateBookStatus(obj).then((data)=> {
                            this.$Message.success(`已转为${statusStr}`);
                            this.loading = false;
                            this.getBooks();
                        }).catch((err) => {
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了转换');
                    }
                });
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
            onClickSelect(selection){       //check选择框选中
                this.selection = selection;
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
            getReptileList() {  //获取配置列表
                let obj = {
                    params:{
                    }
                };
                util.post.reptile.list(obj).then((data) => {
                    // data.reptileList.forEach((value, index) => {
                    //     value.reptileTypeId = value.reptileTypeId + '';     //转成字符串，因为checkbox    int和string不相等
                    //     this.remarkList[value.reptileTypeId] = value.name;
                    // });
                    this.reptileList = {};
                    data.reptileList.forEach((value,index) => {
                        this.reptileList[value.reptileTypeId] = value;
                    })
                    this.reptileList.length = data.reptileList.length;
                    // this.reptileList = this.reptileList.concat(data.reptileList);
                    // this.reptileType = (this.$route.query.reptileType && this.$route.query.reptileType.split(',')) || (localStorage.reptileType && localStorage.reptileType.split(',')) || [];
                }).catch((error) => {});
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
                let fromMe = this.$route.query.fromMe || "";

                let selectName = "";
                let inputValue = "";
                if(this.bookTypeList.length <= 0) {
                    this.getBookTypeList();
                }

                this.selectList.forEach((value, index) =>{
                    if(this.$route.query[value.value]) {
                        selectName = value.value;
                        inputValue = this.$route.query[value.value]
                    }
                });
                if(page !== this.params.page || limit !== this.params.limit || type !== this.type || selectName !== this.selectName || inputValue !== this.inputValue || bookType !== this.bookType || this.bookStatus !== bookStatus || this.isJin !== isJin || this.fromMe !== fromMe) {

                    if(this.type !== type) this.type = type;
                    if(this.selectName !== selectName) this.selectName = selectName;
                    if(this.inputValue !== inputValue) this.inputValue = inputValue;
                    if(this.bookStatus !== bookStatus) this.bookStatus = bookStatus;
                    if(this.isJin !== isJin) this.isJin = isJin;
                    if(this.fromMe !== fromMe) this.handleCheckAll();
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
            showEdit(book){
                // console.log(book);
                // this.editStatus.status = true;
                this.$refs.edit.$emit("editBook",book)
            }
        },
        created() {
            this.getReptileList();
        },
        mounted () {
            // 设置表格高度
            // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 303;
            // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 240;
        },
        activated() {
            this.start();
        },
        deactivated() {
        }
    };
</script>
