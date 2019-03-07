<template>
    <Layout>
        <Card>
            <Row>
                <Col span="12" class="tl">
                    配置：从第
                    <Input v-model="startIndex"  clearable class="w80" placeholder="默认是1"></Input>
                    页到第
                    <Input v-model="endIndex"  clearable class="w80" placeholder="默认是3"></Input>
                    页
                    <span class="ml10"></span>
                    <!--检查数量<span class="red">(数量越大越快，但对服务器压力巨大)</span>：-->
                    <!--<Input v-model="checkCount"  clearable class="w80" placeholder="默认是100"></Input>-->
                    <Button class="ml10" type="primary" @click="onClickReptile">爬取</Button>
                </Col>
                <Col span="12" class="tr">
                    <Upload class="upload" :show-upload-list="false" :action="baseUrl + '/ip/uploadIp'" :data="uploadParams" :on-success="uploadIpSuccess" :on-error="uploadIpError" :format="['xls']" :on-format-error="uploadFormatError">
                        <Button type="primary">导入代理IP</Button>
                    </Upload>
                    <Button type="primary" @click="onClickExportIp">导出代理IP</Button>
                    <Button type="primary" @click="onClickDelChecked">删除选中</Button>
                    <Button type="primary" @click="onClickRemoveRepeat">IP池去重</Button>
                    <Button type="primary" @click="onClickCheckIp">检查所有IP</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="ipList" ref="table" @on-selection-change="onClickSelect"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getList"></Page>
        </Card>
    </Layout>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">
    .upload{
        display: inline-block;vertical-align: top;width: 200px;
    }
</style>
<script type="text/ecmascript-6">
    import util from "util";
    import config from '../../libs/config';
    import Cookies from 'js-cookie';
    export default {
        name: "ip-list",
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
                        // type: 'index',
                        // width: 60,
                        // align: 'center'
                        title:'Index',
                        key:'index',
                    },
                    {
                        title:'IP',
                        key:'IP',
                        render: (h, params) => {
                            return h('a', {
                                    attrs:{
                                        href:"javascript:void(0);"
                                    },
                                    on: {
                                        click: (e) => {
                                        }
                                    }
                                }, `${params.row.protocol}://${params.row.ip}:${params.row.port}`
                            )
                        }
                    },
                    {
                        title:'地址',
                        key:'address'
                    },
                    {
                        title: '类型',
                        key: 'status'
                    },
                    {
                        title: '来自',
                        key: 'from',
                        render: (h, params) => {
                            return h('a', {
                                    attrs:{
                                        href: params.row.fromHref ? params.row.fromHref: "javascript:void(0);",
                                        target: params.row.fromHref ? '_blank' : ''
                                    }
                                }, `${params.row.from || ''}`
                            )
                        }
                    },
                    {
                        title: '响应时间',
                        key: 'responseTime'
                    },
                    {
                        title:'操作',
                        render:(h, params) => {
                            return h('a', {
                                    attrs:{
                                        href:"javascript:void(0);",
                                        class:'red'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.onClickDel(params);
                                        }
                                    }
                                }, `删除`
                            )
                        }
                    }
                ],
                ipList:[],
                params:{
                    page:1,
                    limit:20
                },
                total:0,
                startIndex:1,
                endIndex:3,
                // checkCount: 100,
                selection:[],
                baseUrl:config.apiUrl,
                token: Cookies.get("token"),
                uploadParams:{
                    token:Cookies.get("token")
                }
            }
        },
        computed: {},
        methods: {
            getList(page, noReptile){
                if(page) this.params.page = page;
                let obj = {
                    params:{
                        page: this.params.page,
                        limit: this.params.limit
                    }
                };
                this.loading = true;
                this.$router.replace({path:'/reptile-tool/ipList', query:Object.assign({}, obj.params)});
                if(noReptile) {
                    obj.params.noReptile = true;
                }
                util.post.ip.list(obj).then((data) => {
                    this.ipList = data.ipList;
                    this.total = data.count;
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickRemoveRepeat() {
                if(this.loading) return;
                this.loading = true;
                let obj = {
                    params:{
                    }
                };
                this.loading = true;
                util.post.ip.removeRepeat(obj).then((data) => {
                    this.$Message.success(data);
                    this.loading = false;
                    this.getList();
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickReptile(){
                let startIndex = 1, endIndex = 10;
                if(this.startIndex) startIndex = this.startIndex;
                if(this.endIndex) endIndex = this.endIndex;
                // if(this.checkCount) checkCount = this.checkCount;

                if(this.loading) return;
                this.loading = true;
                let obj = {
                    params:{
                        startPage:startIndex,
                        endPage:endIndex,
                        // checkCount:checkCount
                    }
                };
                this.loading = true;
                util.post.ip.startReptile(obj).then((data) => {
                    this.$Message.success(data);
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickSelect(selection){       //check选择框选中
                this.selection = selection;
            },
            onClickDelChecked(){  //删除选中
                console.log(this.ipList);
                let indexarr = [];
                this.selection.forEach((value, index) => {
                    indexarr.push(value.index);
                });
                let obj = {
                    params:{
                        index:indexarr.join(',')
                    }
                };
                this.loading = true;
                util.post.ip.delete(obj).then((data) => {
                    this.loading = false;
                    this.getList(this.params.page, true);
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickDel(params){
                let obj = {
                    params:{
                        index:params.row.index
                    }
                };
                this.loading = true;
                util.post.ip.delete(obj).then((data) => {
                    this.loading = false;
                    this.getList(this.params.page, true);
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickCheckIp() {
                let obj = {
                    params:{
                    }
                };
                this.loading = true;
                util.post.ip.check(obj).then((data) => {
                    this.loading = false;
                    this.getList(this.params.page, true);
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickExportIp() {    //导出ip xls
                let obj = {
                    responseType:'blob',
                    params:{
                    }
                };
                this.loading = true;
                util.post.ip.exportIp(obj).then((data) => {
                    this.loading = false;

                    const content = data;
                    const blob = new Blob([content])
                    const fileName = '代理IP列表.xls'
                    /*xls下载*/
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                }).catch((err) => {
                    this.loading = false;
                    console.error(err);
                });
            },
            uploadIpSuccess(data) {
                console.log("成功了");
                console.log(data);
                this.succesFun(data);
            },
            uploadIpError(err){
                console.log("失败了")
                this.$Message.error("上传失败，失败原因:" + err);
            },
            uploadFormatError(file, fileList){
                console.log(file);
                console.log(fileList);
                this.$Message.error("上传失败，失败原因：文件格式不正确，只支持xls后缀的格式");
            },
            succesFun(data) {
                if(data.code == "1002") {
                    this.$Message.error(data.msg);
                } else if(data.code == "1003") {
                    this.$Message.error(data.msg);
                } else if(data.code == "1000"){
                    this.getList();
                    this.$Message.success(data.data);
                } else {
                    this.$Message.error("上传失败，失败原因：文件格式不正确，只支持xls后缀的格式")
                }
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
            let limit = parseInt(this.$route.query.limit) || 20;

            if(page !== this.params.page || limit !== this.params.limit) {
                if(this.params.page !== page) this.params.page = page;
                if(this.params.limit !== limit) this.params.limit = limit;
            }
            this.getList()
        },
        deactivated() {

        }
    }
</script>
