;(function(){

    var isSort = window.tool.getParams().isSort || 1;
    var page = window.tool.getParams().page || 1;
    var limit = window.tool.getParams().limit || 20;
    var bookId = window.tool.getParams().bookId;
    window.addEventListener('load', function () {
        init();
    });

    function init(){
        /*
        * 点击跳转
        * */
        window.touchEvent.tap($("#catalogJump"), onClickJump);
        $(".page-input")[0].onkeypress = function(e) {
            if (e.keyCode == 13) {
                onClickJump(e);
            }
        }
    }



    /*
    * 点击跳转
    * */
    function onClickJump(){
        var jumpPage = Math.ceil(parseInt( $('.page-input')[0].value ));
        if(!jumpPage) {
            alert("输入框的内容不合法");
            return;
        }
        if(page == jumpPage) return;
        location.href="/book/catalog?bookId=" + bookId + "&page=" + jumpPage + "&limit=" + limit + "&isSort=" + isSort;
    }

})();