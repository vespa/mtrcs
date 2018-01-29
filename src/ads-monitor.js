// avoiding const, let or arrow functions only for make IE compatibility easer



var adMonitor =(function(window, chainer, addEvents, windowMonitor){
    "use strict";
    var elementsNameList    = [];
    var elementsList        = [];
    var getElementListName = function(){
        return elementsNameList;
    };

    var getAds = function(){
        return elementsList;
    };

    var createElement = function(data){
        return data.map(function(item){
            var getProp = function(prop){
                return Number(window.getComputedStyle(item, null).getPropertyValue(prop).replace(/px/,""));
            };
            return  {
                target: item,
                identifier: item.id || item.className,
                adIsViewable: false,
                area: getProp('height') * getProp('width'),
                width:  getProp('width'),
                height:  getProp('height'),
                visibleHorizontal: 0,
                visibleVertical:0,
                visibleArea: 0,
                percentageVisibleHorizontal: 0,
                percentageVisibleVertical: 0,
                percentageVisibleArea: 0, 
                clicks: 0
            };
        });
    };

    // find objects and prevent duplicate identifiers
    var addElements = function(){
        var elems = [].slice.call(arguments);
        var nValues =  elementsNameList.concat(elems).sort();
        elementsNameList = nValues.filter(function(item, i){
            return nValues[i-1] !== item;
        });
        return addElements;
    };

    var addClickBehavior = function(elems){
        return elems.map(function(item){
            addEvents(item.target, ['click', 'touch'], function(e){
                e.preventDefault();
                item.clicks = item.clicks+1;
                window.getSelection().removeAllRanges();
                console.log('CLICK ON ' + item.identifier+ ": "+item.clicks);
            });
            return item;
        });
    };

    // identify if elements are in the page
    var findAds = function(res){
        var elemArray = [];
        var elems =  res.map(function(item){
            return [].slice.call(document.querySelectorAll(item));
        }).filter(function(item){
            return item.length > 0;
        }).map(function(item){
            elemArray = elemArray.concat(item);
            return item;
        });
        return elemArray;
    };
    var percentage = function(total, portion){
        if(portion <=0){
            return 0;
        }else{
            return Math.floor(portion / total *100);
        }
    };

    var checkVisibleAreaY = function(winHeight, scrollY, item){
        var itemBorders     = item.target.getBoundingClientRect();
        var currentHeight   = itemBorders.height;
        var totalHeight     = itemBorders.top + itemBorders.height;
        if(itemBorders.bottom < itemBorders.height){
            currentHeight = itemBorders.bottom;
        }
        if(winHeight < totalHeight){
            currentHeight = currentHeight - (totalHeight- winHeight);
        }
        return (currentHeight <=0)? 0 : currentHeight ;   
    };

    var checkVisibleAreaX = function(winWidth, scrollX, item){
        var itemBorders     = item.target.getBoundingClientRect();
        var currentWidth    = itemBorders.width;
        var totalWidth      = itemBorders.left + itemBorders.width;
        if(itemBorders.right < itemBorders.width){
            currentWidth = itemBorders.right;
        }
        if(winWidth < totalWidth){
            currentWidth = currentWidth - (totalWidth- winWidth);
        }
        return (currentWidth <=0)? 0 : currentWidth ; 
    };

    var updateItem = function(windowMonitor){
        return function(item){
            var target                      = item.target.getBoundingClientRect(),
                scrollX                     = windowMonitor.status('scrollX'),
                scrollY                     = windowMonitor.status('scrollY'),
                winWidth                    = windowMonitor.status('width'),
                winHeight                   = windowMonitor.status('height'),
                visibleVertical             = (checkVisibleAreaY(winHeight, scrollY, item)).toFixed(2),
                visibleHorizontal           = (checkVisibleAreaX(winWidth, scrollX, item)).toFixed(2),
                visibleArea                 = (visibleVertical * visibleHorizontal),
                percentageVisibleVertical   = percentage(target.height,visibleVertical),
                percentageVisibleHorizontal = percentage(target.width, visibleHorizontal),
                percentageVisibleArea       = percentage((target.height * target.width), visibleArea);

            if(visibleVertical === 0 || visibleHorizontal ===0){
                visibleHorizontal = visibleVertical = percentageVisibleVertical = percentageVisibleHorizontal = 0;
            }
            item.visibleVertical                = visibleVertical;
            item.visibleHorizontal              = visibleHorizontal;
            item.visibleArea                    = visibleArea;
            item.percentageVisibleVertical      = percentageVisibleVertical + "%";
            item.percentageVisibleHorizontal    = percentageVisibleHorizontal + "%";
            item.percentageVisibleArea          = percentageVisibleArea + "%";
            item.adIsViewable                   = (percentageVisibleArea > 0)? true : false;
            return item;
        };
    };

    var listenToElementPosition = function(windowMonitor){
        return function(res){
            return res.map(function(item){
                updateItem(windowMonitor)(item);
                addEvents(window, ['scroll','resize','blur', 'focus', 'visibilitychange'], function(){
                    return updateItem(windowMonitor)(item);
                });
                return item;
            });
        };
    };

    var saveElements = function(elems){
        elementsList = elems;
    };
    addEvents(window, "load", function(){
       chainer([ 
            getElementListName, 
            findAds,
            createElement,
            addClickBehavior,
            listenToElementPosition(windowMonitor),
            saveElements,
        ]);
    });

    return {
        add : addElements,
        getAds: getAds
    };
})(window, chainer, addEvents, windowMonitor);