<style lang="less">
    @import '../../styles/loading.less';
    .catalog-href{
        margin-left: 15px;
    }
    .padding16-16-0-16{
        padding: 16px 16px 0 16px
    }

</style>

<template>
    <div>
        <Card shadow :padding="0">
            <Row class="padding16-16-0-16">
                <Col span="24">
                <h1>{{book.name}}</h1>
                </Col>
            </Row>
            <Row class="padding16-16-0-16">
                <Col span="18">
                <span>{{catalog.name}}</span>
                <a class="catalog-href" v-if="lastCatalog" href="javascript:;" @click="replace(true)" :style="{color:lastCatalog.isJin==1?'red':'auto'}">上一章：{{lastCatalog.name}}</a>
                <a class="catalog-href" v-if="nextCatalog" href="javascript:;" @click="replace()" :style="{color:nextCatalog.isJin==1?'red':'auto'}">下一章：{{nextCatalog.name}}</a>
                </Col>
                <Col span="6" class="tr">
                <Button type="primary" @click="onClickUpdate">更新</Button>
                <Button type="primary" @click="onClickSave">保存</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        </Card>
        <Spin fix v-if="loading">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>

<script>
    import tinymce from 'tinymce';
    import util from 'util';
    export default {
        name: 'book-container',
        data () {
            return {
                loading: false,
                book:{},
                catalog:{},
                nextCatalog:null,
                lastCatalog:null,
                params:{
                    bookId:null,
                    catalogId:null,
                    num:null
                },
                container:''
            };
        },
        methods: {
            initTinymce () {
                if(tinymce.get('tinymceEditer')) {
                    // if(this.container){
                    this.loading = false;
                    let tinymceDom = tinymce.get('tinymceEditer').dom.doc;
                    tinymceDom.documentElement.scrollTop = tinymceDom.body.scrollTop = 0;
                    tinymce.get('tinymceEditer').setContent(this.container);
                    // }
                } else {
                    this.$nextTick(() => {
                        let vm = this;
                        let height = document.body.offsetHeight - 300;
                        tinymce.init({
                            selector: '#tinymceEditer',
                            branding: false,
                            elementpath: false,
                            height: height,
                            language: 'zh_CN.GB2312',
                            // menubar: 'edit insert view format table tools',
                            // menubar: 'view',
                            menubar: 'insert',
                            plugins: [
                                // 'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                                'preview code',
                                'paste'
                                // 'searchreplace visualblocks visualchars code fullpage',
                                // 'insertdatetime media nonbreaking save table contextmenu directionality',
                                // 'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                            ],
                            // toolbar1: ' undo redo | newnote print preview | code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent |',
                            toolbar1: ' undo redo | newnote print preview | code ',
                            autosave_interval: '20s',
                            image_advtab: true,
                            table_default_styles: {
                                width: '100%',
                                borderCollapse: 'collapse'
                            },
                            content_css:[
                                '../dist/tinymce/less/common.css'
                            ],
                            paste_preprocess:function(plugin, args) {
                                var content = args.content;
                                content = args.content.replace(/<(?!p|\/p|br|\/br).*?>/g, "");
                                content = content.replace(/&nbsp;/g, "");
                                content = content.replace(/\s+/g, "");
                                vm.container = vm.returnContainerP(content);
                                args.content = vm.container;
                            },
                            setup: function (editor) {
                                editor.on('init', function (e) {
                                    vm.loading = false;
                                    // if (localStorage.editorContent) {
                                    //     // tinymce.get('tinymceEditer').setContent(localStorage.editorContent);
                                    //     tinymce.get('tinymceEditer').setContent(localStorage.editorContent);
                                    // }
                                    if(vm.container) {
                                        console.log(vm.container);
                                        tinymce.get('tinymceEditer').setContent(vm.container);
                                    }
                                });
                                editor.on('keydown', function (e) {
                                    if(e.ctrlKey && (e.which?e.which:e.keyCode) == 83) {
                                        console.log("保存");
                                        if (document.all) {
                                            return false;
                                        } else {
                                            e.preventDefault();
                                        }
                                        vm.onCtrlSSave();
                                    }
                                });
                            }
                        });
                    });
                }
            },
            ctrlS(e) {
                if(e.ctrlKey && (e.which?e.which:e.keyCode) == 83) {
                    this.$Message.error("请在文本内进行保存操作");
                    if (document.all)
                    {
                        return false;
                    } else {
                        e.preventDefault();
                    }
                }
            },
            onCtrlSSave(){
                // vm.$Message.info("正在保存中");
                if(this.loading) return;
                let content = tinymce.get('tinymceEditer').getContent();
                let contentArr = content.split("</p>");
                let i = 0, length = contentArr.length;
                content = "";
                for(i; i<length; i++) {
                    let value = contentArr[i];
                    if(i == length - 1) {
                        console.log(value);
                        content += value ? value.split("<p>")[1] :'';
                    } else {
                        content += value ? value.split("<p>")[1] + "<br>" : '';
                    }
                }
                let obj = {
                    params: {
                        container: content,
                        catalogId:this.params.catalogId,
                        bookId:this.params.bookId,
                        num:this.params.num
                    }
                };
                this.loading = true;
                util.post.books.saveCatalog(obj).then((data) => {
                    this.$Message.success(data);
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            getContainer(){
                if(this.loading) return;
                let obj = {
                    params:Object.assign({},this.params)
                };
                this.loading = true;
                util.post.books.catalog(obj).then((data) => {
                    // this.container = "";
                    // let containerArr = data.container.split("<br>");
                    // let i = 0, length = containerArr.length;
                    // for(i; i<length; i++) {
                    //     if(containerArr[i].trim()) {
                    //         containerArr[i] = "<p>" + containerArr[i] + "</p>"
                    //     } else {
                    //         containerArr.splice(i,1);
                    //         i--;
                    //         length--;
                    //     }
                    // }
                    //
                    // this.container = containerArr.join("");

                    this.book = data.book;
                    this.catalog = data.catalog;
                    this.nextCatalog = data.nextCatalog || null;
                    this.lastCatalog = data.lastCatalog || null;
                    console.log("哈哈哈");
                    this.container = this.returnContainerP(data.container);
                    this.initTinymce();
                }).catch((err) => {
                    this.loading = false;
                    console.error(err);
                })
            },
            returnContainerP(content) {
                content = content.replace(/<br\s*\/*>/g, "<br>");  //将所有的br规范化    比如<br > <br/> <br />
                let containerArr = content.split("<br>");
                let i = 0, length = containerArr.length;
                for(i; i<length; i++) {
                    if(containerArr[i].trim()) {
                        containerArr[i] = "<p>" + containerArr[i] + "</p>"
                    } else {
                        containerArr.splice(i,1);
                        i--;
                        length--;
                    }
                }
                return containerArr.join("");
            },
            replace(bool) {
                if(bool){   //上一章
                    this.$router.replace('/bookContainer?bookId=' + this.params.bookId + '&catalogId=' + this.lastCatalog.id + '&num=' + this.lastCatalog.num);
                } else {
                    this.$router.replace('/bookContainer?bookId=' + this.params.bookId + '&catalogId=' + this.nextCatalog.id + '&num=' + this.nextCatalog.num);
                }
                this.init();
            },
            init() {
                if(this.params.bookId != this.$route.query.bookId) {
                    this.params.bookId = this.$route.query.bookId;
                }
                if(this.params.catalogId != this.$route.query.catalogId) {
                    this.params.catalogId = this.$route.query.catalogId;
                }
                if(this.params.num != this.$route.query.num) {
                    this.params.num = this.$route.query.num;
                }

                this.getContainer();
            },
            onClickUpdate() {
                if(this.loading) return;
                let obj = {
                    params: {
                        catalogId:this.params.catalogId,
                        bookId:this.params.bookId,
                        num:this.params.num
                    }
                };
                this.loading = true;
                util.post.books.updateCatalog(obj).then((data) => {
                    this.$Message.success("更新成功");
                    tinymce.get('tinymceEditer').setContent(data.container);
                    this.initTinymce();
                    this.loading = false;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickSave() {
                this.onCtrlSSave();
            }
        },
        mounted () {
        },
        beforeDestroy() {
            tinymce.get('tinymceEditer') && tinymce.get('tinymceEditer').destroy();
        },
        destroyed () {

        },
        activated() {
            document.addEventListener('keydown', this.ctrlS, false);
            if(this.params.bookId == this.$route.query.bookId && this.params.catalogId == this.$route.query.catalogId && this.params.num == this.$route.query.num) {
                this.initTinymce();  //目测不会再进这里了。
            } else {
                this.init();
            }
        },
        deactivated() {
            document.removeEventListener('keydown', this.ctrlS, false);
            this.$destroy();
        }
    };
</script>