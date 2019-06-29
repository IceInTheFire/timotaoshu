
let permissionList = [{
    expand: true,
    title: '全部权限',
    children: [
        {
            title: '小说模块',
            expand: false,
            // id:1000,
            children: [
                {
                    title:'获取',
                    expand:false,
                    children:[
                        {title:'获取章节内容',id:1001},
                        {title:'获取章节列表',id:1002},
                        {title:'获取小说列表',id:1003}
                    ]
                },
                {
                    title:'修改',
                    expand:false,
                    children:[
                        {title:'修改章节内容',id:1101},
                        {title:'修改小说禁用状态',id:1102},
                        {title:'修改小说连载状态',id:1103},
                        {title:'修改章节禁用状态',id:1104},
                        {title:'编辑小说基本内容',id:1105},
                    ]
                },
                {
                    title:'更新',
                    expand:false,
                    children:[
                        {title:'更新全部连载小说至最新章节',id:1201},
                        {title:'更新小说基本信息',id:1202},
                        {title:'更新该章节内容（爬取）',id:1203},
                        {title:'更新至该小说的最新章节',id:1204}
                    ]
                },
                {
                    title:'删除',
                    expand:false,
                    children:[
                        {title:'删除小说',id:1301}
                    ]
                }
            ]
        },
        {
            title: '代理模块',
            expand: false,
            // id: 2000,
            children: [
                {title:'获取IP列表',id:2001},
                {title:'检查IP是否可用',id:2002},
                {title:'移除重复IP',id:2003},
                {title:'爬取新的代理IP',id:2004},
                {title:'删除IP',id:2005},
                {title:'上传IP',id:2006},
                {title:'下载IP',id:2007}
            ]
        },
        {
            title: '日志模块',
            expand: false,
            // id: 3000,
            children:[
                {title:'下载服务器日志',id:3001},
                {title:'服务器日志删除',id:3002},
                {title:'服务器日志列表',id:3003},
                {title:'服务器日志截取',id:3004}
            ]
        },
        {
            title: '爬取模块',
            expand: false,
            // id: 4000,
            children:[
                {
                    title:'爬取操作',
                    expand: false,
                    children:[
                        {title:'爬取小说JSON',id:4001},
                        {title:'爬取小说基本信息',id:4002},
                        {title:'通过JSON爬取',id:4003},
                        {title:'获取来源渠道配置列表',id:4004},
                        {title:'更新来源渠道配置列表',id:4005},
                        {title:'新增来源渠道配置',id:4006},
                        {title:'编辑来源渠道配置',id:4007},
                        {title:'启用禁用来源渠道配置',id:4008},
                        {title:'删除来源渠道配置',id:4009},
                        {title:'上传来源渠道配置',id:4010},
                        {title:'下载来源渠道配置',id:4011},
                    ]
                },
                {
                    title:"错误操作",
                    expand: false,
                    children:[
                        {title:'获取爬取错误列表',id:4006},
                        {title:'再次爬取该章节',id:4007},
                        {title:'通过错误列表，一键再次爬取该小说全部章节',id:4008},
                        {title:'删除爬取错误',id:4009},
                    ]
                }
            ]
        },
        {
            title: '类型模块',
            expand: false,
            // id: 5000,
            children:[
                {title:'获取作者列表',id:5001},
                {title:'获取小说类型列表',id:5002},
                {title:'更新服务器作者列表',id:5003},
                {title:'更新服务器小说类型列表',id:5004}
            ]
        },
        {
            title: '权限模块',
            expand: false,
            // id: 6000,
            children:[
                {
                    title:'角色',
                    expand: false,
                    children:[
                        {title:'获取角色列表',id:6001},
                        {title:'添加角色',id:6002},
                        {title:'编辑角色',id:6003},
                        {title:'删除角色',id:6004},
                    ]
                },
                {
                    title:'职员',
                    expand: false,
                    children:[
                        {title:'获取职员列表',id:6101},
                        {title:'添加职员',id:6102},
                        {title:'编辑职员',id:6103},
                        {title:'删除职员',id:6104},
                    ]
                },
                {title:'获取权限列表',id:6201},
            ]
        },
        {
            title: '图片模块',
            expand: false,
            // id: 7000,
            children:[
                {title:'图片上传',id:7001},
            ]
        },
        {
            title: '作家模块',
            expand: false,
            // id: 8000,
            children:[
                {title:'我的书籍',id:8001},
                {title:'添加小说',id:8002},
                {title:'添加编辑章节',id:8003},
                {title:'删除章节',id:8004},
                {title:'编辑小说',id:8005},
            ]
        },
    ]
}];

let selectArr = [];
let moduleArr = [];

editInitPermission(permissionList);








let allPermissionList = moduleArr.concat(selectArr).join(',');


function  editInitPermission(permissionList){
    permissionList.forEach((value, index) => {
        if(value.children) {
            editInitPermission(value.children);
        } else {
            if(value.id) {
                value.id = value.id + "";
                let moduleNum = value.id.substr(0, value.id.length - 3)
                if(moduleArr.indexOf(moduleNum + "000") == -1) {
                    moduleArr.push(moduleNum + "000");
                };
                selectArr.push(value.id);
            }
        }
    });
}



module.exports = {
    permissionList,
    allPermissionList
};

