;(function(){
    var isSelect = false,   //判断是不是选择选择编辑状态
        selectArr = [],         //选择书籍的id数组
        allBookArr = [],        //全部书籍的id数组
        selectDomArr = [],      //选择书籍的元素信息数组
        allBookDomArr = [];     //全部书籍元素信息数组

    window.addEventListener('load', function () {
        init();
    });

    /*
    * 初始化
    * */
    function init(){
        allBookDomArr = $(".book-info");
        var i = 0, length = allBookDomArr.length;
        for (i; i < length; i++) {
            allBookArr.push(allBookDomArr[i].getAttribute("book-id"));
        }

        var bookList = $(".book-list")[0];
        if(!bookList) return;
        window.touchEvent.tap(bookList, function (e) {
            onClickBook(window.tool.returnTarget(e, bookList, 'a'));
        });

        /*
        * 编辑按钮
        * */
        window.touchEvent.tap($("#edit"), onClickEdit);
        /*
        * 取消按钮
        * */
        window.touchEvent.tap($("#cancel"), onClickCancel);
        /*
        * 全选按钮
        * */
        window.touchEvent.tap($("#allSelect"), onClickAllSelect);
        /*
        * 删除按钮
        * */
        window.touchEvent.tap($("#editFooter"), onClickDel);
    }
    /*
    * 编辑按钮
    * */
    function onClickEdit() {
        window.tool.addClass($("#bookList"), "select");
        $("#editFooter").style.display = "block";
        $("#editHeader").style.display = "block";
        isSelect = true;
    }
    /*
    * type 为true  则是全选操作
    * type 为false  则是全不选操作
    * type 默认是全不选操作
    * */
    function allSelct(type) {
        var i = 0, length = allBookArr.length;
        if (type) { //全选
            selectArr = JSON.parse(JSON.stringify(allBookArr));
            $("#allSelect").innerText = "取消全选"
            for (i; i < length; i++) {
                selectDomArr.push(allBookDomArr[i]);
                window.tool.addClass(allBookDomArr[i], "act");
            }
        } else { //全不选
            selectArr = [];
            selectDomArr = [];
            $("#allSelect").innerText = "全选";
            for (i; i < length; i++) {
                window.tool.removeClass(allBookDomArr[i], "act");
            }
        }
        $("#bookCount").innerText = selectArr.length;
    }
    /*
    * 取消按钮
    * */
    function onClickCancel() {
        window.tool.removeClass($("#bookList"), "select");
        $("#editFooter").style.display = "none";
        $("#editHeader").style.display = "none";
        isSelect = false;
        allSelct();
    }
    /*
    * 全选按钮
    * */
    function onClickAllSelect() {
        if (allBookArr.length == selectArr.length) {   //取消全选操作
            allSelct();
        } else {    //全选操作
            allSelct(true);
        }
    }
    /*
    * 点击书
    * */
    function onClickBook(target) {
        if(!target) return;
        if (isSelect) { //选择了此书
            if (window.tool.hasClass(target, "act")) {
                selectArr.remove(target.getAttribute("book-id"));
                selectDomArr.remove(target);
                window.tool.removeClass(target, "act");
            } else {
                selectArr.push(target.getAttribute("book-id"));
                selectDomArr.push(target);
                window.tool.addClass(target, "act");
            }
            $("#bookCount").innerText = selectArr.length;
            if (allBookArr.length == selectArr.length) {
                $("#allSelect").innerText = "取消全选"
            } else {
                $("#allSelect").innerText = "全选"
            }
        } else {  //跳转
            location.href="/book/info?bookId=" + target.getAttribute("book-id");
        }
    }
    /*
    * 删除按钮
    * */
    function onClickDel() {
        var i = 0, length = selectDomArr.length;
        for (i; i < length; i++) {
            selectDomArr[i].remove();
        }
        allBookDomArr = $(".book-info");
        allBookArr.removeArr(selectArr);
        window.tool.setCookie("bookIds",allBookArr.join(','));

        if (allBookArr.length == 0) {
            $("#bookList").remove();
            $("#edit").remove();
            $("#allSelect").innerText = "";
            $(".no-book")[0].style.display = "flex";
            onClickCancel();
            return;
        }
    }
})();

