<template>
    <div>
        <Card>
            <Row>
                <Col span="24" style="text-align: left;">
                    <Button type="primary" @click="onClickUpdate">更新作者分类</Button>
                </Col>
            </Row>
        </Card>
        <Card>
            <Table border highlight-row :loading="loading" :columns="columns" :data="bookTypeList" ref="table"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getBookTypeList"></Page>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
    import util from 'util';
    export default {
        name: "book-type-list",
        data() {
            return {
                loading:false,
                columns: [
                    {
                        title: '爬了该类型多少书',
                        key: 'count(bookType)'
                    },
                    {
                        title: '小说类型',
                        key: 'bookType'
                    },
                    {
                        title:'操作',
                        render: (h, params) => {
                            return h('a', {
                                attrs:{
                                    href:"javascript:void(0);"
                                },
                                on: {
                                    click: (e) => {
                                        this.$router.push("/home?bookType=" + params.row.bookType);
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                }
                            },"跳转")
                        }
                    }
                ],
                params:{
                    limit:null,
                    page:null
                },
                total:1,
                bookTypeList:[]
            }
        },
        computed: {},
        methods: {
            getBookTypeList(page) {
                if(this.loading) return;
                if(page > 0) {
                    this.params.page = page;
                }
                let obj = {
                    params: {
                        page:this.params.page,
                        limit:this.params.limit
                    }
                };
                this.loading = true;
                this.$router.replace({path:'/type/bookTypeList', query:Object.assign({}, obj.params)});
                util.post.type.bookTypeList(obj).then((data) => {
                    this.loading = false;
                    this.bookTypeList = data.bookTypeList;
                    this.total = data.count;
                }).catch((err)=> {
                    this.loading = false;
                });
            },
            onClickUpdate(){
                if(this.loading) return;
                let obj = {
                    params: {
                        page:this.params.page,
                        limit:this.params.limit
                    }
                };
                this.loading = true;
                util.post.type.updateBookTypeList(obj).then((data) => {
                    this.loading = false;
                    this.bookTypeList = data.bookTypeList;
                    this.total = data.count;
                }).catch((err)=> {
                    this.loading = false;
                });
            }
        },
        components: {},
        created() {

        },
        mounted() {
        },
        beforeDestroy() {

        },
        destroyed() {
        },
        activated() {
            let page = parseInt(this.$route.query.page) || 1;
            let limit = parseInt(this.$route.query.limit) || 10;

            if(this.params.page != page || this.params.limit != limit) {
                if(this.params.page != page) this.params.page = page;
                if(this.params.limit != page) this.params.limit = limit;

                this.getBookTypeList();
            } else {
                this.$router.replace({path:'/type/bookTypeList', query:Object.assign({}, this.params)});
            }
        },
        deactivated() {

        }
    }
</script>
