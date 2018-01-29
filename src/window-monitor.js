var windowMonitor = (function(window, chainer, addEvents){
    var focused = false;
    //var windowEventTrack = [];

    var hasfocus = function(){
        return document.hasFocus();
    };

    var currentStatus = function(){
        return {
            width: window.document.documentElement.clientWidth,
            height: window.document.documentElement.clientHeight,
            viewable : hasfocus(),
            scrollX : window.pageXOffset,
            scrollY :window.pageYOffset 
        };
    };
    var getCurrentStatus = function(prop){
        return (prop === undefined)? currentStatus() : currentStatus()[prop];
    };

    addEvents(window, ['focus', 'blur' , 'load','visibilitychange'], function(){
        document.body.focus();
        setTimeout(function(){
            currentStatus();
        });
        
    });
    addEvents(document, ['click','mouseover'], function(){
        setTimeout(function(){
            currentStatus();
        },30);
    });
 
    return {
        status: getCurrentStatus
    };
})(window, chainer, addEvents);