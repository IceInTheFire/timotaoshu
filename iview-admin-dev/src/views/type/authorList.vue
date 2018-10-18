<template>
    <Layout>
        <Card>
            <Row>
                <Col span="24" style="text-align: left;">
                    <Button type="primary" @click="onClickUpdate">更新作者分类</Button>
                </Col>
            </Row>
        </Card>
        <Card>
            <Table border highlight-row :loading="loading" :columns="columns" :data="authorList" ref="table"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getAuthorList"></Page>
        </Card>
    </Layout>

</template>
<script type="text/ecmascript-6">
    import util from 'util';
    export default {
        name: "author-list",
        data() {
            return {
                loading:false,
                columns: [
                    {
                        title: '爬了该作者多少书',
                        key: 'count(author)'
                    },
                    {
                        title: '作者',
                        key: 'author'
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
                                        this.$router.push("/home?author=" + params.row.author);
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
                authorList:[]
            }
        },
        computed: {},
        methods: {
            getAuthorList(page) {
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
                this.$router.replace({path:'/type/authorlist', query:Object.assign({}, obj.params)});
                util.post.type.authorList(obj).then((data) => {
                    this.loading = false;
                    this.authorList = data.authorList;
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
                util.post.type.updateAuthorList(obj).then((data) => {
                    this.loading = false;
                    this.authorList = data.authorList;
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

                this.getAuthorList();
            } else {
                this.$router.replace({path:'/type/authorlist', query:Object.assign({}, this.params)});
            }


        },
        deactivated() {

        }
    }
</script>
