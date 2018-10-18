<template>
    <Layout>
        <Card>
            <Row>
                <Col span="12">
                <Select v-model="params.logType" class="w100" placeholder="全部" label-in-value @on-change="selectChange">
                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="primary" @click="onClickSplice" :loading="loading" >截取日志</Button>
                </Col>
                <!--<Col span="12">-->
                <!--<Button type="primary" @click="onClickDown" :loading="loading" >下载日志</Button>-->
                <!--</Col>-->
                <Col span="12" class="tr">
                <Button type="primary" @click="onClickDel" :loading="loading" >删除日志</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="list" ref="table" @on-selection-change="onClickSelect"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getList"></Page>
        </Card>
    </Layout>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import util from "util";
    export default {
        name: "outLog",
        data() {
            return {
                loading:false,
                columns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title:'日志',
                        key:'index'
                    },
                    {
                        title: '日志',
                        key: 'name'
                    },
                    {
                        title: '操作',
                        // key: 'name',
                        render: (h, params) => {
                            return  h("a", {
                                attrs: {
                                    href:"javascript:void(0);",
                                    target:"_blank"
                                },
                                on:{
                                    click: (e) =>{
                                        this.onClickDown(params.row);
                                    }
                                },
                            }, '下载')
                        }
                    }
                ],
                params:{
                    page:parseInt(this.$route.query.page) || 1,
                    limit:parseInt(this.$route.query.limit) || 20,
                    logType:parseInt(this.$route.query.logType) || 2
                },
                selectList:[
                    {
                        value:2,
                        label:'adminApi'
                    },
                    {
                        value:7,
                        label:'www'
                    },
                    {
                        value:5,
                        label:'h5'
                    }
                ],
                total:0,
                list:[],
                selection:[]
            }
        },
        computed: {},
        methods: {
            // 下载文件
            download (data, pathName) {
                console.log(data);
                if (!data) {
                    return;
                }
                // data = decodeURI(data);
                // console.log(data);
                let url = window.URL.createObjectURL(new Blob([data]));
                console.log(url);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                // link.setAttribute('download', 'log.txt');
                link.setAttribute('download', pathName);
                document.body.appendChild(link);
                link.click();
            },
            onClickDown(row){
                if(this.loading) return;
                let obj = {
                    params:{
                        logType:row.logType,
                        name:row.name
                    },
                    responseType: "blob"
                }
                let obj2 = {
                    timeout:'100000'
                };
                this.loading = true;
                util.post.log.download(obj, obj2).then((response) => {
                    this.loading = false;
                    if(response.status == 202) {
                        this.$Message.error("下载失败");
                    } else {
                        this.download(response,row.name)
                    }
                }).catch((err)=> {
                    this.loading = false;
                    // this.$Message.error("下载失败");
                });
            },
            onClickDel(){
                if(this.loading) return;
                this.$Modal.confirm({
                    closable:true,//按esc关闭
                    title: `温馨提示`,
                    content: `<p>你确定要删除日志？</p>`,
                    onOk: () => {
                        let nameArr = [];
                        this.selection.forEach((value, index) => {
                            nameArr.push(value.name);
                        })
                        if(this.loading) return;
                        let obj = {
                            params:{
                                logType:this.params.logType,
                                nameArr:nameArr.join(',')
                            }
                        }
                        this.loading = true;
                        util.post.log.delete(obj).then((data) => {
                            this.loading = false;
                            this.$Message.success(data);
                            this.getList();
                        }).catch((err)=> {
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了清除');
                    }
                });
            },
            onClickClear(){
                if(this.loading) return;
                this.$Modal.confirm({
                    closable:true,//按esc关闭
                    title: `温馨提示`,
                    content: `<p>你确定要删除日志？</p>`,
                    onOk: () => {
                        if(this.loading) return;
                        let obj = {
                            params:{
                                logType:0
                            }
                        }
                        this.loading = true;
                        util.post.log.clearAll(obj).then((data) => {
                            this.loading = false;
                            this.$Message.success(data);
                        }).catch((err)=> {
                            this.loading = false;
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('你取消了清除');
                    }
                });
            },
            onClickSplice() {
                let obj = {
                    params:{
                        logType:this.params.logType
                    }
                };
                this.loading = true;
                util.post.log.splice(obj).then((data) => {
                    this.$Message.success(data)
                    this.getList();
                    this.loading = false;
                }).catch((err)=> {
                    this.loading = false;
                });
            },
            getList(page){
                if(page){
                    this.params.page = page;
                }
                let obj = {
                    params:{
                        page:this.params.page,
                        limit:this.params.limit,
                        logType:this.params.logType
                    }
                }
                this.loading = true;
                this.$router.replace({path:'/log/out', query:Object.assign({}, obj.params)});
                util.post.log.list(obj).then((data) => {
                    this.loading = false;
                    this.total = data.count;
                    this.list = data.list;
                }).catch((err)=> {
                    this.loading = false;
                });
            },
            onClickSelect(selection){       //check选择框选中
                this.selection = selection;
                console.log(this.selection);
            },
            selectChange(){
                this.getList(1);
            }
        },
        components: {},
        created() {

        },
        mounted() {
            this.getList();
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
