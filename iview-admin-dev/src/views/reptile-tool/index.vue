<template>
    <Layout>
        <Card>
            <Row>
                <Col span="24" class="tl">
                    <Button type="primary" @click="onClickUpdate">更新爬取配置</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="reptileList" ref="table"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getList"></Page>
        </Card>
    </Layout>
</template>

<script>
import util from 'util';
export default {
    name: 'reptile',
    components: {
    },
    data () {
        return {
            columns: [
                {
                    title: 'id',
                    key: 'id'
                },
                {
                    title: '字符编码',
                    key: 'codeType'
                },
                {
                    title:'网址',
                    key:'orginUrl',
                    render: (h, params) => {
                        return h("a", {
                            attrs:{
                                href:params.row.originUrl,
                                target:"_blank",
                            }
                        },params.row.originUrl)
                    }
                },
                {
                    title: '备注',
                    key: 'remark'
                },
                // {
                //     title:'书名标志',
                //     key:'bookName'
                // },
                // {
                //     title:'作者名标志',
                //     key:'author'
                // },
                // {
                //     title:'封面图片标志',
                //     key:'imgUrl'
                // },
                // {
                //     title:'章节内容标志',
                //     key:'content'
                // },
            ],
            loading: false,
            params:{
                page:1,
                limit:10
            },
            total:0,
            reptileList:[]
        };
    },
    computed: {
    },
    methods: {
        getList(){
            let obj = {
                params:{
                    page: this.params.page,
                    limit: this.params.limit
                }
            };
            this.loading = true;
            util.post.reptile.list(obj).then((data) => {
                this.reptileList = data.reptileList;
                this.total = data.count;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            });
        },
        onClickUpdate() {
            if(this.loading) return;
            let obj = {
                params: {
                    page:this.params.page,
                    limit:this.params.limit
                }
            };
            this.loading = true;
            util.post.reptile.updateReptileList(obj).then((data) => {
                this.loading = false;
                this.reptileList = data.reptileList;
                this.total = data.count;
            }).catch((err)=> {
                this.loading = false;
            });
        },
    },
    mounted () {
        this.getList();
    },
    activated() {

    },
    deactivated() {
    }
};
</script>
