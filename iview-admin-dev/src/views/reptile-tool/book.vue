<template>
    <Layout>
        <Card>
            <Row>
                <Col span="20">
                    <Select v-model="reptileType" class="w150" placeholder=""  @on-change="selectChange">
                        <Option v-for="item in reptileList" :value="item.id" :key="item.id">{{ item.remark }}</Option>
                    </Select>
                    <Input @keyup.native.13="onClickSearch"
                           v-model="bookName" :placeholder="placeholder" clearable class="w200"></Input>
                </Col>
                <Col span="4" class="tr">
                    <span>启用代理搜索：</span>
                    <i-switch v-model="isProxy" class="mr20" :disabled="loading"></i-switch>
                    <Button type="primary" @click="onClickSearch">搜索</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="list" ref="table"></Table>
        </Card>
    </Layout>
</template>

<script>
import util from 'util';
export default {
    name: 'book',
    components: {
    },
    data () {
        return {
            bookName:'',
            loading: false,
            columns:[
                {
                    title: '标题',
                    key: 'title',
                    render: (h, params) => {
                        return h("div", [
                            h("span", params.row.title),
                            h('span', {
                                attrs:{
                                    style:'color:red'
                                }
                            }, `(${params.row.status})`)
                        ]);
                    }
                },
                {
                    title: '作者',
                    key: 'author'
                },
                {
                    title:'爬取地址',
                    key:"url",
                    render: (h, params) => {
                        return h("a", {
                            attrs:{
                                href:params.row.url,
                                target:'_blank'
                            }
                        }, params.row.url);
                    }
                },
                {
                    title:'爬取',
                    key:'',
                    render: (h, params) => {
                        return h("a", {
                            attrs:{
                                href:'javascript:void(0);',
                                // target:"_blank",
                                id:`${params.row.title}_${params.row.author}`
                            },
                            on: {
                                click: () => {
                                    this.onClickReptileTool(params);
                                }
                            }
                        },params.row.reptile)
                    }
                }
            ],
            list:[],
            reptileType: 0,
            placeholder:'请输入您想爬取的小说名',
            reptileList:util.reptileList,
            flag: false,    //下拉框
            isProxy:true
        };
    },
    computed: {
    },
    methods: {
        onClickSearch(){
            if(!this.bookName) {
                return;
            }
            if(!this.bookName.trim()){
                return;
            }
            if(this.loading) return;
            localStorage.bookName = this.bookName;
            localStorage.reptileType = this.reptileType;
            localStorage.isProxy = this.isProxy;
            this.$router.replace('/reptile-tool/book?bookName=' + this.bookName + '&reptileType=' + this.reptileType + '&isProxy=' + this.isProxy);
            let obj = {
                params:{
                    bookName: this.bookName,
                    reptileType: this.reptileType,
                    isProxy:this.isProxy
                }
            };
            this.loading = true;
            util.post.reptile.getUrl(obj,{timeout:10000}).then((data) => {
                this.list = data;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            });
        },
        onClickReptileTool(params) {
            let spanHtml = document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML;
            if(spanHtml == "已获取" || spanHtml == "正在获取中") {
                return;
            }

            document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "正在获取中";
            let obj = {
                params:{
                    bookName:params.row.title,
                    bookUrl:params.row.url,
                    author:params.row.author,
                    reptileType:this.reptileType
                }
            }
            util.post.reptile.getBookJson(obj).then((data) => {
                document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "已获取";
            }).catch((err) => {
                document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "获取失败";
            });
            // this.$Modal.confirm({
            //     closable:true,//按esc关闭
            //     title: `${params.row.title}_${params.row.author}`,
            //     content: '<p>你确定要获取？获取之后，后台才会根据获取的书json来爬书</p>',
            //     onOk: () => {
            //         // this.loading = true;
            //         document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "正在获取中";
            //         let obj = {
            //             params:{
            //                 bookName:params.row.title,
            //                 bookUrl:params.row.url,
            //                 author:params.row.author,
            //             }
            //         }
            //         util.post.reptile.getBookJson(obj).then((data) => {
            //             document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "已获取";
            //             // this.loading = false;
            //         }).catch((err) => {
            //             // this.loading = false;
            //             document.getElementById(`${params.row.title}_${params.row.author}`).innerHTML = "获取失败";
            //         });
            //     },
            //     onCancel: () => {
            //         this.$Message.info('你取消了获取');
            //     }
            // });
        },
        selectChange(reptileType) {
            if(!this.flag){
                // this.bookName = "";
            }
            this.flag = false;
            this.list = [];
            this.changePlaceHolder(reptileType);
        },
        changePlaceHolder(reptileType) {
            let i = 0, length = this.reptileList.length;
            for(i; i<length; i++) {
                let value = this.reptileList[i];
                if(reptileType == value.id) {
                    this.placeholder = value.placeholder;
                    break;
                }
            }
        }
    },
    created() {
        this.reptileType = parseInt(this.$route.query.reptileType || localStorage.reptileType) || 0
    },
    mounted () {},
    activated() {
        this.bookName2 = "";
        if(this.$route.query.bookName) {
            this.bookName2 = this.$route.query.bookName;
        } else if(localStorage.bookName) {
            this.bookName2 = localStorage.bookName;
        }
        this.reptileType2 = this.reptileType;
        if(this.$route.query.reptileType) {
            this.reptileType2 = parseInt(this.$route.query.reptileType)
        } else if(localStorage.reptileType) {
            this.reptileType2 = parseInt(localStorage.reptileType);
        }
        this.isProxy2 = this.isProxy;
        if(this.$route.query.isProxy) {
            this.isProxy2 = this.$route.query.isProxy == "true" ? true : false;
        } else if(localStorage.isProxy) {
            this.isProxy2 = localStorage.isProxy == "true" ? true : false;
        }

        if(this.bookName != this.bookName2 || this.reptileType != this.reptileType2) {
            this.flag = true;       //初始化，不触发select下拉框
            this.reptileType = this.reptileType2;
            this.bookName = this.bookName2;
            this.isProxy = this.isProxy2;
            // this.changePlaceHolder(this.reptileType);
            this.onClickSearch();
        }
    },
    deactivated() {
    }
};
</script>
