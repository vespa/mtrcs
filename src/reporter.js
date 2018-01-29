var reports = (function(window, addEvents, adMonitor, windowMonitor, chainer){
    var timer = 0;
    var inPageReportTmpl; 
    var reportBar;
    var startTimer = function(){
        setInterval(function(){
            timer+=1;
        },1000);
    };
    var generateInPageReport = function(){
        reportBar = document.createElement("div");
        var tmpl  = document.createElement("div");
        reportBar.setAttribute("style", "position:fixed;bottom:0;width:100%; text-align; pointer-events: none;");
        tmpl.setAttribute("style", "border:1px solid #ccc; width: 200px; float:right;margin:12px; background-color:#fff;opacity:.9; padding:6px;font-family:arial;font-size:12px");
        document.body.appendChild(reportBar);
        inPageReportTmpl = tmpl;
    };
    var getTimer = function(){
        return timer;
    };
    var message = function(item){
        return {
            "Identifier": item.identifier,
            "Ad is viewable" : item.adIsViewable,
            "Active user"                   : windowMonitor.status("viewable"),
            "Viewability time of the ad in sec": timer,
            "Area"                          : item.area + "px\u00B2",
            "Width"                         : item.width + "px",
            "Height"                        : item.height + "px",
            "Total visible area"            : item.visibleArea+ "px\u00B2",
            "Visible horizontal"            : item.visibleHorizontal+ "px",
            "Visible vertical"              : item.visibleVertical+ "px",
            "Percentage visible area"        : item.percentageVisibleArea,
            "Percentage visible horizontal" : item.percentageVisibleHorizontal,
            "Percentage visible vertical"   : item.percentageVisibleVertical,
            "Clicks"                        : item.clicks
        };
    };
    var inPageReport = function(ads){
        var line = document.createElement("div");
        var onOf = document.createElement("span");
        line.setAttribute("style","padding:2px 0; border-bottom:1px dotted #ccc");
        reportBar.innerHTML = "";
        ads.map(function(item){
            var cont = inPageReportTmpl.cloneNode();
            var lines = message(item);
            Object.keys(lines).map(function(k){
                var nLine = line.cloneNode();
                var content = lines[k];
                if(content.constructor === Boolean){
                    var val = onOf.cloneNode();
                    val.style.color = (content)? "#0a0" : "#c00";
                    val.innerHTML = content.toString();
                    content = val.outerHTML;
                }
                nLine.innerHTML = k + "<b>: " + content +"</b>";
                cont.appendChild(nLine);
            });
            reportBar.appendChild(cont);
        });
        return ads;
    };

    var consoleReport = function(ads){
        return ads.map(function(item){
            var msg = "";
            var messageObj = message(item);
            Object.keys(messageObj).map(function(k){
                msg += k + ": " + messageObj[k] + "\n";
            });
            console.log(msg);
            return item;
        });
    };
    var init = function(){
        setInterval(function(){
            chainer([
                adMonitor.getAds,
                inPageReport,
                consoleReport,
            ]);
            var ads = adMonitor.getAds();   
        }, 500);
    };
    addEvents(window, 'load', function(){
        chainer([
            startTimer,
            generateInPageReport,
            init
        ]);
    });
    return {};

})(window, addEvents, adMonitor, windowMonitor, chainer);