import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


// export const preview = {
//     path: '/preview',
//     name: 'preview',
//     component: () => import('@/views/form/article-publish/preview.vue')
// };

//锁页面的  页面
export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'catalog', title: '章节', name: 'catalog', component: () => import('@/views/home/catalog.vue') },
        { path: 'bookContainer', title: '内容', name: 'bookContainer', component: () => import('@/views/home/bookContainer.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        // { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        // { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        // { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
    //     ]
    // },
    {
        path: '/reptile-tool',
        icon: 'ios-flower-outline',
        title: '爬取配置',
        name: 'reptile-tool',
        component: Main,
        access:["2000","4000"],
        children: [
            { path: 'ipList', title: '代理IP', access:["2000"], name: 'reptile-tool_ipList', component: () => import('@/views/reptile-tool/ipList.vue') },
            { path: 'channel', title: '来源渠道', access:["4000"], name: 'reptile-tool_index', component: () => import('@/views/reptile-tool/channel.vue') },
            { path: 'progress-error', title: '爬取错误/遗漏', access:["4000"], name: 'reptile-tool-error', component: () => import('@/views/reptile-tool/progress-error.vue') },
            { path: 'progress', title: '爬书进度', access:["4000"], name: 'reptile-tool_progress', component: () => import('@/views/reptile-tool/progress.vue') },
            { path: 'book', title: '搜书爬取', access:["4000"], name: 'reptile-tool_book', component: () => import('@/views/reptile-tool/book.vue') }
        ]
    },
    {
        path: '/type',
        icon: 'ios-grid-view',
        title: '类别',
        name: 'type',
        component: Main,
        access:["5000"],
        children: [
            { path: 'authorList', title: '作者分类', access:["5000"], name: 'type_authorList', component: () => import('@/views/type/authorList.vue') },
            { path: 'bookTypeList', title: '小说分类', access:["5000"], name: 'type_bookTypeList', component: () => import('@/views/type/bookTypeList.vue') },
        ]
    },
    {
        path: '/Permission',
        icon: 'person-stalker',
        title: '权限管理',
        name: 'person',
        component: Main,
        access:["6000"],
        children: [
            { path: 'role', title: '角色管理', access:["6000"], name: 'person_role', component: () => import('@/views/Permission/role.vue') },
            { path: 'staff', title: '职员管理', access:["6000"], name: 'person_staff', component: () => import('@/views/Permission/staff.vue') }
        ]
    },
    {
        path: '/log',
        icon: 'social-buffer',
        title: '服务器',
        name: 'urlLog',
        component: Main,
        access:["3000"],
        children: [
            { path: 'index', title: '访问日志', access:["3000"], name: 'url_log', component: () => import('@/views/log/index.vue') },
            { path: 'out', title: '打印日志', access:["3000"], name: 'out_log', component: () => import('@/views/log/out.vue') },
            { path: 'error', title: '错误日志', access:["3000"], name: 'error_log', component: () => import('@/views/log/error.vue') },
        ]
    },
    {
        path: '/img',
        icon: 'ios-image',
        title: '图片',
        name: 'img-tool',
        component: Main,
        access:["7000"],
        children: [
            { path: 'index', title: '图片上传', access:["7000"], name: 'img-list', component: () => import('@/views/img/index.vue') },
         ]
    },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         // { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') },
    //         // { path: '500', title: '500-服务端错误', name: 'error-500', component: () => import('@/views/error-page/500.vue') },
    //         // { path: '404', title: '404-页面不存在', name: 'error-404', component: () => import('@/views/error-page/404.vue') },
    //         // { path: '403', title: '403-权限不足', name: 'error-403', component: () => import('@/views/error-page/403.vue') }
    //     ]
    // },
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         // {
    //         //     path: 'text-editor',
    //         //     icon: 'compose',
    //         //     name: 'text-editor',
    //         //     title: '富文本编辑器',
    //         //     component: () => import('@/views/my-components/text-editor/text-editor.vue')
    //         // },
    //         // {
    //         //     path: 'md-editor',
    //         //     icon: 'pound',
    //         //     name: 'md-editor',
    //         //     title: 'Markdown编辑器',
    //         //     component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')
    //         // },
    //         // {
    //         //     path: 'md-editor2',
    //         //     icon: 'pound',
    //         //     name: 'md-editor2',
    //         //     title: 'Markdown编辑器',
    //         //     component: () => import('@/views/my-components/markdown-editor2/markdown-editor2.vue')
    //         // },
    //
    //
    //
    // //         {
    // //             path: 'image-editor',
    // //             icon: 'crop',
    // //             name: 'image-editor',
    // //             title: '图片预览编辑',
    // //             component: () => import('@/views/my-components/image-editor/image-editor.vue')
    // //         },
    // //         {
    // //             path: 'draggable-list',
    // //             icon: 'arrow-move',
    // //             name: 'draggable-list',
    // //             title: '可拖拽列表',
    // //             component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
    // //         },
    // //         {
    // //             path: 'area-linkage',
    // //             icon: 'ios-more',
    // //             name: 'area-linkage',
    // //             title: '城市级联',
    // //             component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
    // //         },
    // //         {
    // //             path: 'file-upload',
    // //             icon: 'android-upload',
    // //             name: 'file-upload',
    // //             title: '文件上传',
    // //             component: () => import('@/views/my-components/file-upload/file-upload.vue')
    // //         },
    // //         {
    // //             path: 'count-to',
    // //             icon: 'arrow-graph-up-right',
    // //             name: 'count-to',
    // //             title: '数字渐变',
    // //             // component: () => import('@/views/my-components/count-to/count-to.vue')
    // //             component: () => import('@/views/my-components/count-to/count-to.vue')
    // //         },
    // //         {
    // //             path: 'split-pane-page',
    // //             icon: 'ios-pause',
    // //             name: 'split-pane-page',
    // //             title: 'split-pane',
    // //             component: () => import('@/views/my-components/split-pane/split-pane-page.vue')
    // //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: () => import('@/views/form/article-publish/article-publish.vue') },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: () => import('@/views/form/work-flow/work-flow.vue') }
    //
    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: () => import('@/views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: () => import('@/views/access/access.vue') }
    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue') },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue') },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue') },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue') },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue') }
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
    //     ]
    // },

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    // preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
