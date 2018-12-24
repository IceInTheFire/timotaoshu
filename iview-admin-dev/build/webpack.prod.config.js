const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    output: {
        // publicPath: 'https://iview.github.io/iview-admin/dist/',  // 修改 https://iv...admin 这部分为你的服务器域名
        publicPath: '/dist/',
        // filename: '[name].[hash].js',
        filename: '[name].js',
        // chunkFilename: '[name].[hash].chunk.js'
        chunkFilename: '[name].js?v=[hash]'
    },
    plugins: [
        new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name].css?v=[hash]',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'vendors',
            // filename: 'vendors.[hash].js'
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({   // 压缩webpack 后生成的代码较长时间，通常推到生产环境中才使用
            compress: {
                warnings: false
            }
        }),
        // new UglifyJsParallelPlugin({
        //     workers: os.cpus().length,
        //     mangle: true,
        //     compressor: {
        //       warnings: false,
        //       drop_console: true,
        //       drop_debugger: true
        //      }
        // }),
        new CopyWebpackPlugin([
            {
                from: 'td_icon.ico'
            },
            {
                from: 'src/styles/fonts',
                to: 'fonts'
            },
            {
                from: 'tinymce/less',
                to: 'tinymce/less'
            },
            {   //为了dev的时候使用
                from: 'lib',
                to: 'lib'
            },
            {   //为了dev的时候使用
                from: 'tinymce/less',
                to: '../tinymce/less'
            },
            {   //为了dev的时候使用
                from: 'lib',
                to: '../lib'
            },
            {
                from: 'src/views/main-components/theme-switch/theme'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        }),
        new HtmlWebpackPlugin({
            // title: 'iView admin v' + package.version,
            title: '提莫淘书后台管理系统',
            favicon: './lib/td_icon.ico',
            filename: '../index.html',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: false,
            // inject: true,   // 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
            // hash: true,  // true | false。如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用。
            minify:{    //压缩html页面
                // removeAttributeQuotes:true,   //去掉双引号  不建议
                collapseWhitespace: true,     //去掉空哥
                removeComments: true,         //去掉注释
            },
        })
    ]
});