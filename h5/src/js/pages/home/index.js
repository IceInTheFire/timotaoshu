;(function() {
    window.addEventListener('load', function () {
        init();
    });

    function init(){
        // var swiper = new Swiper('.swiper-container', {
        //     pagination: {
        //         el: '.swiper-pagination',
        //     },
        // });


        //搜索功能
        window.touchEvent.tap($(".book-searct-a")[0], search);
        $('.book-search-input')[0].onkeypress = function (e) {
            if (e.keyCode == 13) {
                search();
            }
        }
    }


    /*
    * 搜索功能
    * */
    function search(){
        let bookName = $('.book-search-input')[0].value || '';
        if(!bookName){
            return;
        }
        if(!bookName.trim()) {
            return;
        }
        location.href="/book/search?bookName=" + bookName;
    }
})();



