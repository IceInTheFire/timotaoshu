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
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
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
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
