;(function () {

    window.addEventListener('load', function () {
        init();
    });


    function init() {
        /*
        * 修改文字大小
        * 开灯关灯
        * 护眼
        * */
        window.touchEvent.tap($(".catalog-tool")[0], function (e) {
            updateBookConfig(window.tool.returnTarget(e, $(".catalog-tool")[0], 'span'));
        });

        /*
        * 搜索功能
        * */
        window.touchEvent.tap($(".book-searct-a")[0], search);
        /*
        * 回车搜索
        * */
        $('.book-search-input')[0].onkeypress = function (e) {
            if (e.keyCode == 13) {
                search();
            }
        }

        /*
        * 点击页面  上下翻页
        * */
        window.touchEvent.tap($('#content'), updatePage);


       //  /*
       //  * 右滑事件   与body内的上下滚动事件有冲突
       //  * */
       //  window.touchEvent.swipeRight($('#content'), function(e) {
       //      console.log("向右滑动");
       //  });
       //  /*
       // * 左滑事件   与body内的上下滚动事件有冲突
       // * */
       //  window.touchEvent.swipeLeft($('#content'), function(e) {
       //      console.log("向左滑动");
       //  });
    }

    /*
    * 修改文字大小
    * */
    function updateFontSize(fontName) {
        var str = fontName.replace('fontSize', '');
        var fontSize = '1.25';
        var index = 0;
        switch (str) {
            case 'big':
                fontSize = '1.25';
                index = 0;
                break;
            case 'middle':
                fontSize = '1';
                index = 1;
                break;
            case 'small':
                fontSize = '0.8';
                index = 2;
                break;
        }

        window.tool.removeAllClass($(".catalog-tool-btn.fr"), "act");
        window.tool.addClass($(".catalog-tool-btn.fr")[index], "act");
        $(".catalog-name")[0].style.fontSize = fontSize + "rem";
        $(".catalog-container")[0].style.fontSize = fontSize + "rem";
        window.tool.setCookie("fontSize", str);
    }

    /*
    * 修改配置
    * 护眼，开关灯  字体  大中小
    * */
    function updateBookConfig(target) {
        // console.log(target);
        if (!target) return;
        var text = target.getAttribute("data-id");

        switch (text) {
            case 'huyan':
                var huyanAct = window.tool.hasClass($(".catalog-tool-btn.fl")[0], "act");
                var lightAct = window.tool.hasClass($(".catalog-tool-btn.fl")[1], "act");
                if (huyanAct && !lightAct) {         //恢复默认模式
                    $("body")[0].style.color = "#333";
                    $("body")[0].style.backgroundColor = "#f6f4ec";
                    window.tool.removeClass($(".catalog-tool-btn.fl")[0], "act");
                    window.tool.setCookie("huyan", '');
                }
                else if (huyanAct && lightAct) {  //开启关灯模式
                    $("body")[0].style.color = "rgb(153, 153, 153)";
                    $("body")[0].style.backgroundColor = "rgb(50, 55, 59)";
                    window.tool.removeClass($(".catalog-tool-btn.fl")[0], "act");
                    window.tool.setCookie("huyan", '');
                }
                else if (!huyanAct && lightAct) {   //开启关灯模式
                    $("body")[0].style.color = "rgb(153, 153, 153)";
                    $("body")[0].style.backgroundColor = "rgb(50, 55, 59)";
                    window.tool.addClass($(".catalog-tool-btn.fl")[0], "act");
                    window.tool.setCookie("huyan", 'true');
                } else {        //开启护眼模式
                    $("body")[0].style.color = "#333";
                    $("body")[0].style.backgroundColor = "rgb(220, 236, 210)";
                    window.tool.addClass($(".catalog-tool-btn.fl")[0], "act");
                    window.tool.setCookie("huyan", 'true');
                }
                break;
            case 'light':
                var huyanAct = window.tool.hasClass($(".catalog-tool-btn.fl")[0], "act");
                var lightAct = window.tool.hasClass($(".catalog-tool-btn.fl")[1], "act");
                if (lightAct && !huyanAct) { //恢复默认模式
                    $("body")[0].style.color = "#333";
                    $("body")[0].style.backgroundColor = "#f6f4ec";
                    window.tool.removeClass($(".catalog-tool-btn.fl")[1], "act");
                    window.tool.setCookie("light", '');
                } else if (lightAct && huyanAct) { //开启护眼模式
                    $("body")[0].style.color = "#333";
                    $("body")[0].style.backgroundColor = "rgb(220, 236, 210)";
                    window.tool.removeClass($(".catalog-tool-btn.fl")[1], "act");
                    window.tool.setCookie("light", '');
                }
                // else if(huyanAct) {
                //     $("body")[0].style.color = "#333";
                //     $("body")[0].style.backgroundColor = "rgb(220, 236, 210)";
                //     window.tool.addClass($(".catalog-tool-btn.fl")[0], "act");
                //     window.tool.setCookie("light",'true');
                // }
                else {  //开启关灯模式
                    $("body")[0].style.color = "rgb(153, 153, 153)";
                    $("body")[0].style.backgroundColor = "rgb(50, 55, 59)";
                    window.tool.addClass($(".catalog-tool-btn.fl")[1], "act");
                    window.tool.setCookie("light", 'true');
                }
                break;
            case 'fontSizebig':
                updateFontSize('fontSizebig');
                break;
            case 'fontSizemiddle':
                updateFontSize('fontSizemiddle');
                break;
            case 'fontSizesmall':
                updateFontSize('fontSizesmall');
                break;
            default:
                break;

        }
    }

    /*
   * 搜索功能
   * */
    function search() {
        let bookName = $('.book-search-input')[0].value || '';
        if (!bookName) {
            return;
        }
        if (!bookName.trim()) {
            return;
        }
        location.href = "/book/search?bookName=" + bookName;
    }

    function updatePage(e) {
        var clientHeight = document.documentElement.clientHeight;
        var fontSize = document.documentElement.style.fontSize.substring(0,document.documentElement.style.fontSize.length-2);
        clientHeight -= fontSize * 4;
        var touch = e.changedTouches ? e.changedTouches[0] : {clientY:e.clientY,clientX:e.clientX};
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        console.log(scrollHeight);
        if (touch.clientY > Math.floor(clientHeight / 2)) { //下一页
            if( scrollTop + clientHeight >= scrollHeight) {
                document.body.scrollTop = document.documentElement.scrollTop = scrollHeight;
            } else {
                document.body.scrollTop = document.documentElement.scrollTop = scrollTop + clientHeight;
            }
        } else {  //上一页
            if(scrollTop - clientHeight <= 0 ) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
                document.body.scrollTop = document.documentElement.scrollTop = scrollTop - clientHeight;
            }
        }
    }

})();