;(function(){
    window.addEventListener('load', function () {
        init();
    });

    function init(){
        /*
        * 注册  加入移出书架功能
        * */
        window.touchEvent.tap($(".book-add")[0], onClickEnterBook);
    }



    /*
    * 加入移出书架
    * */
    function onClickEnterBook(){
        var bookAdd = $(".book-add")[0];
        var bookIdCookie = window.tool.getCookie().bookIds ? window.tool.getCookie().bookIds.split(',') : [];
        var bookId = window.tool.getParams().bookId;
        if(bookAdd.innerText == '移出书架'){
            bookIdCookie.remove(bookId);
            console.log(bookIdCookie);
            window.tool.setCookie("bookIds", bookIdCookie.join(','));
            bookAdd.innerText = "加入书架";
        } else {    //加入书架
            bookIdCookie.push(bookId);
            window.tool.setCookie("bookIds", bookIdCookie.join(','));
            bookAdd.innerText = "移出书架";

        }
    }

})();