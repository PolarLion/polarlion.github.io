
$(document).ready(function() {  
    $(".navbar-nav li").click(function() {  
        $(this).attr("class","active");
    });
});

(function($){
    $.fn.hoverDelay = function(options){
        var defaults = {
            hoverDuring: 20,
            outDuring: 20,
            hoverEvent: function(){
                $.noop();
            },
            outEvent: function(){
                $.noop();    
            }
        };
        var sets = $.extend(defaults,options || {});
        var hoverTimer, outTimer;
        return $(this).each(function(){
            $(this).hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
            },function(){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(sets.outEvent, sets.outDuring);
            });    
        });
    }      
})(jQuery);


$("#polarnavbar li").each(function(){
    var that = $(this);
    var id = that.attr("id");
    if(id){
        that.hoverDelay({
            hoverEvent: function(){
                $(".active").attr("class","");
                that.attr("class","active"); //感谢“type23”提供了绑定对象方法
                // $(this).attr("class","");
            }   
        });
        that.hoverDelay({
            outEvent: function(){
                $(".active").attr("class","");
            }
        });
    }
});



$("#navbutton").click(function() {
	console.log(document.getElementById("nav").attributes["class"].value)
	if (document.getElementById("nav").attributes["class"].value == "collapse navbar-collapse") {
		$("#nav").attr("class","navbar");
	}
	else {
		$("#nav").attr("class","collapse navbar-collapse");
	}
});



