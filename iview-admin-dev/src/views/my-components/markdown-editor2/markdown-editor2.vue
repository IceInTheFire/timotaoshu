<style lang="less">
    @import '../../../styles/common.less';
    /*@import 'markdown-editor.less';*/
    .vm-markdown{

    }
</style>


<template>
    <div>
        <Row class="margin-top-20">
            <Col span="16" offset="4">
                <div class="markdown-con">
                    <VmMarkdown :theme="theme"
                                width="1000px"
                                height="600px"
                                v-on:getHtml="showHtml"
                                :defaultText="intro">
                    </VmMarkdown>
                </div>
            </Col>
        </Row>
        <button @click="insertText('前来探探路')">前来探探路</button>
    </div>
</template>

<script>
    import VmMarkdown from 'vm-markdown';
    import insertText from './insertText.js'
    export default {
        name: 'markdown-editor',
        data () {
            return {
                theme: 'default',
                intro: 'like'
            };
        },
        components: {
            VmMarkdown
        },
        methods: {
            showHtml (data) {
                console.log(data);
            },
            insertText(string){
                let content = document.querySelector('.vm-markdown-content')
                insertText(content, string)
                this.$emit('textChange', content.value)
            }
        },
        mounted () {
            // new SimpleMDE({
            //     element: document.getElementById('iview_admin_markdown_editor'),
            //     toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'heading-smaller', 'heading-bigger', 'heading-1', 'heading-2', 'heading-3', '|', 'code', 'quote', 'unordered-list', 'clean-block', '|', 'link', 'image', 'table', 'horizontal-rule', '|', 'preview', 'guide']
            // });
        }
    };
</script>
