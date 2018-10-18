<template>
    <div>
        <Card>
            <Row>
                <Col span="12" class="lh32">
                    与服务器的连接状态：<span class="red">{{state}}</span>
                </Col>
                <Col span="4" class="lh32">
                    停留人数：{{count}}
                </Col>
                <Col span="8" class="tr">
                    <Button type="primary" @click="clear">清除log</Button>
                    <Button type="primary" @click="startReptile" :disabled="loading">{{btnTitle}}</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <div ref="body" class="progress_log" :style="{height:tableHeight, overflowY:'auto'}"></div>
        </Card>
    </div>
</template>
<style>
    .progress_log span{
        width:400px; margin-right:30px;overflow: hidden; display: inline-block;
    }
</style>
<script type="text/ecmascript-6">
    import util from 'util';
    import config from '../../config'
    export default {
        name: "progress__",
        data() {
            return {
                readyState:["正在连接","已经连接","正在断开","已经断开"],
                ws:null,
                state:"已经断开",
                count:0,//留在当前页面的人数
                tableHeight:'500px',
                loading: false,
                columns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '爬取进度',
                        key: 'progress',
                        align:'center',
                        render: (h, params) => {
                            return h("span", {
                                attrs:{
                                    style:'text-align:left'
                                }
                            }, params.row && params.row.progress);
                        }
                    }
                ],
                list:[
                    // {progress:'like'}
                ],
                btnTitle:'开始爬取',
                index:1,
                scrollTop: 0
            }
        },
        computed: {},
        methods: {
            clear(){
                // this.list.splice(0,this.list.length);
                this.$refs.body.innerHTML = '';
            },
            startReptile(){
                if(this.loading || this.btnTitle =='正在爬取') {
                    return;
                }
                let obj = {
                    params:{
                    }
                };
                this.loading = true;
                util.post.reptile.startReptile(obj).then((data) => {
                    this.loading = false;
                    this.$Message.info("开始爬取");
                    this.btnTitle = "正在爬取";
                }).catch((err) => {
                    this.loading = false;
                    this.btnTitle = "正在爬取";
                });
            }
        },
        components: {},
        created() {
            this.ws = new WebSocket(config.wssServer + '?token=token');
            this.ws.onopen = () => {
                this.ws.send('我是从客户端发送的消息');
            };
            this.ws.onmessage = (response) => {
                let data = JSON.parse(response.data);
                let firstData = data[0];
                if(firstData.count >=0) {
                    this.count = firstData.count;
                } else {
                    // this.list = this.list.concat(data);
                    // data.forEach((value, index) => {
                    //     this.list.push(value);
                    // })
                    var html = ``;
                    data.forEach((value,index) => {
                        this.index += index;
                        html += `<span>${value.progress}</span>`;
                    })
                    this.scrollTop += 40;
                    this.$refs.body.innerHTML += html;
                    this.$refs.body.scrollTop = this.scrollTop;

                }


                this.state = this.readyState[this.ws.readyState];
            };
            this.ws.onclose = () => {
                this.state = this.readyState[this.ws.readyState];
            };
            this.ws.onerror = () => {
                this.state = this.readyState[this.ws.readyState];
            };

            //页面被破坏时触发下
            window.onbeforeunload = () => {
                this.ws.close();
            }
        },
        mounted() {
            // this.tableHeight = (window.innerHeight - this.$refs.table.$el.offsetTop - 173 ) + 'px';
            this.tableHeight = (window.innerHeight - this.$refs.body.offsetTop - 173 ) + 'px';
        },
        beforeDestroy() {

        },
        destroyed() {
        },
        activated() {

        },
        deactivated() {
            this.ws.close();
            this.$destroy();
        }
    }
</script>
