;(function (doc, win) {
    win.tool = {
        getCookie:getCookie,
        setCookie:setCookie,
        deleteCookie:deleteCookie,
        clearAllCookie:clearAllCookie,
        returnTarget:returnTarget,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        removeAllClass:removeAllClass,
        addAllClass:addAllClass,
        getParams:getParams
   };
    var isMobile = navigator.userAgent.toLowerCase().indexOf('mobile') != -1;


    win.touchEvent = {
       /*单次触摸事件*/
       tap:function(element,fn){
           if(!isMobile){
               element.addEventListener('click',function(e){
                    fn(e);
                   e.preventDefault();
                   e.stopPropagation();
               }, false );
               return;
           }
           var startTx, startTy;
           element.addEventListener('touchstart',function(e){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
           }, false );

           element.addEventListener('touchend',function(e){
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY;
                // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
               if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
                   fn(e);
                   // e.preventDefault();
                   // e.stopPropagation();
               }
           }, false );
       },
       /*两次触摸事件*/
       doubleTap:function(element,fn){
           if(!isMobile) {
               element.addEventListener('dblclick',function(e){
                   fn(e);
                   e.preventDefault();
                   e.stopPropagation();
               }, false );
               return;
           }
           var isTouchEnd = false,
               lastTime = 0,
               lastTx = null,
               lastTy = null,
               firstTouchEnd = true,
               body = document.body,
               dTapTimer, startTx, startTy, startTime;
           element.addEventListener( 'touchstart', function(e){
               if( dTapTimer ){
                   clearTimeout( dTapTimer );
                   dTapTimer = null;
               }
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
           }, false );
           element.addEventListener( 'touchend',function(e){
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   now = Date.now(),
                   duration = now - lastTime;
// 首先要确保能触发单次的 tap 事件
               if( Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6 ){
// 两次 tap 的间隔确保在 500 毫秒以内
                   if(duration < 301 ){
// 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
                       if( lastTx !== null &&
                           Math.abs(lastTx - endTx) < 45 &&
                           Math.abs(lastTy - endTy) < 45 ){
                           firstTouchEnd = true;
                           lastTx = lastTy = null;
                           fn(e);
                       }
                   }
                   else{
                       lastTx = endTx;
                       lastTy = endTy;
                   }
               }
               else{
                   firstTouchEnd = true;
                   lastTx = lastTy = null;
               }
               lastTime = now;
           }, false );
// 在 iOS 的 safari 上手指敲击屏幕的速度过快，
// 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
// 同时手指长时间的touch不会触发click
           if(~navigator.userAgent.toLowerCase().indexOf('iphone os')){
               body.addEventListener( 'touchstart', function(e){
                   startTime = Date.now();
               }, true );
               body.addEventListener( 'touchend', function(e){
                   var noLongTap = Date.now() - startTime < 501;
                   if(firstTouchEnd ){
                       firstTouchEnd = false;
                       if( noLongTap && e.target === element ){
                           dTapTimer = setTimeout(function(){
                               firstTouchEnd = true;
                               lastTx = lastTy = null;
                               fn(e);
                           },400);
                       }
                   }
                   else{
                       firstTouchEnd = true;
                   }
               }, true );
// iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
               element.addEventListener( 'click', function( e ){
                   if(dTapTimer ){
                       clearTimeout( dTapTimer );
                       dTapTimer = null;
                       firstTouchEnd = true;
                   }
               }, false );
           }
       },
       /*长按事件*/
       longTap:function(element,fn,endFn){
           var startTx, startTy, lTapTimer;
           element.addEventListener( 'touchstart', function( e ){
               if( lTapTimer ){
                   clearTimeout( lTapTimer );
                   lTapTimer = null;
               }
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               lTapTimer = setTimeout(function(){
                   fn(e);
                   e.preventDefault();
               }, 1000 );

           }, false );
           element.addEventListener( 'touchmove', function( e ){
               var touches = e.touches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY;
               if( lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5) ){
                   clearTimeout( lTapTimer );
                   lTapTimer = null;
                   e.preventDefault();
               }

           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( lTapTimer ){
                   clearTimeout( lTapTimer );
                   endFn(e);//长按结束
                   lTapTimer = null;
                   e.preventDefault();
               }
           }, false );
       },
       /*滑屏事件*/
       swipe:function(element,fn){
           var isTouchMove, startTx, startTy;
           element.addEventListener( 'touchstart', function( e ){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               isTouchMove = false;
           }, false );
           element.addEventListener( 'touchmove', function( e ){
               isTouchMove = true;
               e.preventDefault();
           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( !isTouchMove ){
                   return;
               }
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   distanceX = startTx - endTx,
               distanceY = startTy - endTy,
                   isSwipe = false;
               if( Math.abs(distanceX)>20||Math.abs(distanceY)>20 ){
                   fn(e);
               }
           }, false );
       },
       /*向上滑动事件*/
       swipeUp:function(element,fn){
           var isTouchMove, startTx, startTy;
           element.addEventListener( 'touchstart', function( e ){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               isTouchMove = false;
           }, false );
           element.addEventListener( 'touchmove', function( e ){
               isTouchMove = true;
               e.preventDefault();
           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( !isTouchMove ){
                   return;
               }
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   distanceX = startTx - endTx,
               distanceY = startTy - endTy,
                   isSwipe = false;
               if( Math.abs(distanceX) < Math.abs(distanceY) ){
                   if( distanceY > 20 ){
                       fn(e);
                       isSwipe = true;
                   }
               }
           }, false );
       },
       /*向下滑动事件*/
       swipeDown:function(element,fn){
           var isTouchMove, startTx, startTy;
           element.addEventListener( 'touchstart', function( e ){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               isTouchMove = false;
           }, false );
           element.addEventListener( 'touchmove', function( e ){
               isTouchMove = true;
               // e.preventDefault();
           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( !isTouchMove ){
                   return;
               }
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   distanceX = startTx - endTx,
               distanceY = startTy - endTy,
                   isSwipe = false;
               if( Math.abs(distanceX) < Math.abs(distanceY) ){
                   if( distanceY < -20 ){
                       fn(e);
                       isSwipe = true;
                   }
               }
           }, false );
       },
       /*向左滑动事件*/
       swipeLeft:function(element,fn){
           var isTouchMove, startTx, startTy;
           element.addEventListener( 'touchstart', function( e ){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               isTouchMove = false;
           }, false );
           element.addEventListener( 'touchmove', function( e ){
               isTouchMove = true;
               // e.preventDefault();
           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( !isTouchMove ){
                   return;
               }
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   distanceX = startTx - endTx,
               distanceY = startTy - endTy,
                   isSwipe = false;
               if( Math.abs(distanceX) >= Math.abs(distanceY) ){
                   if( distanceX > 20 ){
                       fn(e);
                       isSwipe = true;
                   }
               }
           }, false );
       },
       /*向右滑动事件*/
       swipeRight:function(element,fn){
           var isTouchMove, startTx, startTy;
           element.addEventListener( 'touchstart', function( e ){
               var touches = e.touches[0];
               startTx = touches.clientX;
               startTy = touches.clientY;
               isTouchMove = false;
           }, false );
           element.addEventListener( 'touchmove', function( e ){
               isTouchMove = true;
               e.preventDefault();
           }, false );
           element.addEventListener( 'touchend', function( e ){
               if( !isTouchMove ){
                   return;
               }
               console.log(startTx);
               console.log(startTy);
               var touches = e.changedTouches[0],
                   endTx = touches.clientX,
                   endTy = touches.clientY,
                   distanceX = startTx - endTx,
               distanceY = startTy - endTy,
                   isSwipe = false;
               if( Math.abs(distanceX) >= Math.abs(distanceY) ){
                   if( distanceX < -20 ){
                       fn(e);
                       isSwipe = true;
                   }
               }
           }, false );
       }
   };



    function getCookie(){
        var cookie = {};
        var all = document.cookie;
        if( all == "" ){
            return {};
        }
        var list = all.split(";");
        for( var i = 0; i < list.length; i++ ){
            var cok = list[i];
            var p = cok.indexOf("=");
            var name = cok.substring( 0,p ).trim();
            var value = cok.substring(p+1);
            value = decodeURIComponent( value );
            cookie[ name ] = value;
        }
        return cookie || {};
    };
    function setCookie(name,value,dayToLive){
        var cookie = name + "=" + encodeURIComponent( value );
        if( typeof dayToLive === "number"){
            cookie += ";max-age=" + ( dayToLive * 60 * 60 * 24 );
        }
        cookie += ";path=/";
        doc.cookie = cookie;
    };
    function deleteCookie( name ){
        var cookie = name + '=;max-age=0;path=/';
        doc.cookie = cookie;
    };
    function clearAllCookie() {   //慎用。可能会删掉app种下的app信息。 可能用不到
        var keys = doc.cookie.match(/[^ =;]+(?=\=)/g);
        if(keys) {
            for(var i = keys.length; i--;)
                doc.cookie = keys[i] + '=;max-age=0;path=/';
        }
    };
    /*
    * 事件委托
    * e  事件返回的e
    * dom  事件委托的对象
    * nowDom  当前点击的dom节点标签名称，可能冒泡上来的
    * */
    function returnTarget(e, dom, nowDom) {
        var target = e.target;
        while(target !== dom ){
            if(target.tagName.toLowerCase() == nowDom){
                return target;
                break;
            }
            target = target.parentNode;
        }
    };
    function hasClass( elements,cName ){
        if(!elements) return;
        return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );
    };
    function addClass( elements,cName ){
        if(!elements) return;
        if( !hasClass( elements,cName ) ){
            elements.className += " " + cName;
        };
    };
    function removeClass( elements,cName ){
        if(!elements) return;
        if( hasClass( elements,cName ) ){
            elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
        };
    };
    function removeAllClass(elementsArr, cName) {
        if(!elementsArr) return;
        var i=0, length=elementsArr.length;
        for(i;i<length;i++) {
            removeClass(elementsArr[i],cName);
        }
    };
    function addAllClass(elementsArr, cName) {
        if(!elementsArr) return;
        var i=0, length=elementsArr.length;
        for(i;i<length;i++) {
            addClass(elementsArr[i],cName);
        }
    }
    function getParams() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };
})(document, window);

/*
* 选择器
* */
var $ = function(name) {
    if(typeof name != "string") return null;
    if(name.substring(0,1) == "#") {
        return document.querySelector(name);
    } else {
        return document.querySelectorAll(name);
    }
}

window.addEventListener('load', function() {
    if(window.VConsole) {new VConsole();}
});
