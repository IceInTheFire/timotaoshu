export default {
    getUser: '/users',
    login: '/login',
    editPassword: '/users/editPassword',
    checkLock: '/users/checkLock',

    permission: {
        list: '/permission/list',
        roleList: '/permission/roleList',
        delRole: '/permission/delRole',
        addRole: '/permission/addRole',
        editRole: '/permission/editRole',
        staffList: '/permission/staffList',
        addStaff: '/permission/addStaff',
        editStaff: '/permission/editStaff',
        delStaff: '/permission/delStaff'
    },
    books: {
        book: '/book',
        catalogList: '/book/catalogList',
        catalog: '/book/catalog',
        saveCatalog: '/book/saveCatalog',
        updateCatalog: '/book/updateCatalog',
        updateCatalogIsJin: '/book/updateCatalogIsJin',
        updateBookIsJin: '/book/updateBookIsJin',
        updateBookInfo: '/book/updateBookInfo',
        updateBookDescription: '/book/updateBookDescription',
        updateBookStatus: '/book/updateBookStatus',
        updateNewCatalog: '/book/updateNewCatalog',
        oneKeyUpdateNewCatalog: '/book/oneKeyUpdateNewCatalog',
        delBook: '/book/deleteBook',
        editBookInfo: '/book/editBookInfo'
    },
    writer: {
        bookList: '/writer/bookList',
        addBook: '/writer/addBook',
        addCatalog: '/writer/addCatalog',
        delCatalog: '/writer/delCatalog',
        editBook: '/writer/editBook',
    },
    reptile: {
        list: '/reptile',
        getUrl: '/reptile/getUrl',
        getBookJson: '/reptile/getBookJson',
        startReptile: '/reptile/startReptile',
        updateReptileList: '/reptile/updateReptileList',
        getProgressList: '/reptile/getProgressList',
        deleteError: '/reptile/deleteError',
        restartCatalog: '/reptile/restartCatalog',
        oneKeyRestartCatalog: '/reptile/oneKeyRestartCatalog',
        addChannel: '/reptile/addChannel',
        editChannel: '/reptile/editChannel',
        updateChannelSearch: '/reptile/updateChannelSearch',
        deleteChannel: '/reptile/deleteChannel',
        exportChannel: 'reptile/exportChannel',
        uploadChannel: 'reptile/uploadChannel',
    },
    ip: {
        list: '/ip',
        removeRepeat: '/ip/removeRepeat',
        startReptile: '/ip/startReptile',
        delete: '/ip/delete',
        check: '/ip/check',
        exportIp: '/ip/exportIp'
    },
    type: {
        authorList: '/type/authorList',
        bookTypeList: '/type/bookTypeList',
        updateAuthorList: '/type/updateAuthorList',
        updateBookTypeList: '/type/updateBookTypeList'
    },
    log: {
        download: '/log/download',
        clearAll: '/log/clearAll', // 即将废弃
        list: '/log/list',
        delete: '/log/delete',
        splice: '/log/splice',
    },
    common: { // 共用工具
        getCatalogFromInfo: '/common/getCatalogFromInfo', // 获取章节列表 通过一些信息(比如书名和章节名)
        oneKeyGetAllBookImg: '/common/oneKeyGetAllBookImg'
    }
}
