import Cookies from 'js-cookie';

const user = {
    state: {
        user:Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {}
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('token');
            Cookies.remove('user');
            Cookies.remove('access');
            state.user = {};
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        setUser(state,user) {
            state.user = user;
        }
    }
};

export default user;
