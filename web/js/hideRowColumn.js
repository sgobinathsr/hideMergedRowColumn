/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var tableStack = {};

function enableColumnHideMenu(tableid){
    var theadMatrix = {};
    //console.log("col_gone "+$(tableid).html());
    var thead = $(tableid);
    var totalcolspan = 0;
    $(thead).find('tr:first').find('th').each(function(index, element){
        if(!isNaN($(element).attr('colspan'))){
            totalcolspan = totalcolspan + parseInt($(element).attr('colspan'));
        }else{
            totalcolspan = totalcolspan + 1;
        }
    });

    $(thead).find('tr').each(function(index, element){
        
        // th context menu
        $(element).contextMenu({
            selector: 'th', 
            callback: function(key, options){
                var Obj = $(options.$trigger);
                if(key=="hideColumn"){
                    $(window).trigger("col_gone", Obj);
                }
            },
            items: {
                "hideColumn": {name: "Hide Column", icon: "hide"},
                "sep1": "---------",
                "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
            }
        });
        
        //td context menu
        $(element).contextMenu({
            selector: 'th,td', 
            callback: function(key, options){
                var Obj = $(options.$trigger);                
                if(key=="hideRow"){
                    $(window).trigger("tr_gone", Obj);
                }
            },
            items: {
                "hideRow": {name: "Hide Row", icon: "hide"},
                "sep1": "---------",
                "quit": {name: "Quit", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
            }
        });
        
        
        $(element).find('th,td[class!="delete-cell"]').each(function(i,e){
            var columnPattern = new RegExp('^hideColumn_[0-9]+');
            var rowPattern = new RegExp('^hideRow_[0-9]+');
            
            /*
            $(e).on('mouseover',function(){                
                $($(this).attr('class').split(' ')).each(function(ind, val){
                    if(columnPattern.test(val) || rowPattern.test(val)){
                        $("."+val).each(function(x,y){
                            $(y).addClass('hideHover');
                        });
                    }
                });
            });
            
            $(e).on('mouseout',function(){
                $($(this).attr('class').split(' ')).each(function(ind, val){
                    if(columnPattern.test(val) || rowPattern.test(val)){
                        $("."+val).each(function(x,y){
                            $(y).removeClass('hideHover');
                        });
                    }
                });
            });
            */            
            
            //console.log("---th start---");
            var rowspan = $(e).attr('rowspan'), colspan = $(e).attr('colspan');
            var colflag = true, singleRowFlag = false;
            if(!isNaN(rowspan) && parseInt(rowspan) > 1){
                colflag = false;                   
                //console.log("goRowSpan Start avail, rowspan : "+rowspan);
                var rowspanlocal = rowspan;
                var col = 0;
                for(var x = 0; rowspanlocal != 0; x++){
                    var json = {};
                    json['name'] = index +"."+ i;
                    json['text'] = $(e).html();
                    json['rowspan'] = rowspan;
                    if(isNaN(colspan)){
                        json['colspan'] = 1;
                    }else{
                        json['colspan'] = colspan;
                    }
                    json['object'] = e;
                    if(theadMatrix[(index + x)+","+(i + col)] == undefined){
                        //console.log("goRowSpan "+(index + x)+","+(i + col)+" : "+JSON.stringify(json));
                        theadMatrix[(index + x)+","+(i + col)] = json;
                        $(e).addClass("hideColumn_"+(i + col));
                        $(e).addClass("hideRow_"+(index + x));
                        if($(e).attr("rowBeforCell") == undefined){
                            $(e).attr("rowBeforCell", (i + col - 1));
                        }
                        --rowspanlocal;
                    }else{
                        //console.log("duplicate key goRowSpan "+(index + x)+","+(i + col)+" : "+JSON.stringify(theadMatrix[(index + x)+","+(i + col)]));
                        ++col;--x;
                    }
                }                    
            }else{
                colflag = false;
                singleRowFlag = true;
                //console.log("goRowSpan Start");
                var rowspanlocal = 1;
                var col = 0;
                for(var x = 0; rowspanlocal != 0; x++){
                    var json = {};
                    json['name'] = index +"."+ i;
                    json['text'] = $(e).html();
                    json['rowspan'] = 1;
                    if(isNaN(colspan)){
                        json['colspan'] = 1;
                    }else{
                        json['colspan'] = colspan;
                    }
                    json['object'] = e;
                    if(theadMatrix[(index + x)+","+(i + col)] == undefined){
                        //console.log("goRowSpan "+(index + x)+","+(i + col)+" : "+JSON.stringify(json));
                        theadMatrix[(index + x)+","+(i + col)] = json;
                        $(e).addClass("hideColumn_"+(i + col));
                        $(e).addClass("hideRow_"+(index + x));
                        if($(e).attr("rowBeforCell") == undefined){
                            $(e).attr("rowBeforCell", (i + col - 1));
                        }
                        --rowspanlocal;
                    }else{
                        //console.log("duplicate key goRowSpan "+(index + x)+","+(i + col)+" : "+JSON.stringify(theadMatrix[(index + x)+","+(i + col)]));
                        ++col; --x;
                    }
                }
            }
            if(!isNaN(colspan) && parseInt(colspan) > 1){
                if(singleRowFlag){
                   --colspan;
                }
                //console.log("goColSpan Start avail");
                var colspanlocal = colspan;
                var col = 0;
                for(var x = 0; colspanlocal != 0; x++){
                    var json = {};
                    json['name'] = index +"."+ i;
                    json['text'] = $(e).html();
                    if(isNaN(rowspan)){
                        json['rowspan'] = 1;
                    }else{
                        json['rowspan'] = rowspan;
                    }
                    json['colspan'] = colspan;
                    json['object'] = e;
                    if(theadMatrix[index+","+(i + x + col)] == undefined){
                        //console.log("goColSpan "+index+","+(i + x + col)+" : "+JSON.stringify(json));
                        theadMatrix[index+","+(i + x + col)] = json;
                        $(e).addClass("hideColumn_"+(i + x + col));
                        $(e).addClass("hideRow_"+index);
                        if($(e).attr("rowBeforCell") == undefined){
                            $(e).attr("rowBeforCell", (i + x + col - 1));
                        }
                        --colspanlocal;
                    }else{
                        //console.log("duplicate key goColSpan "+index+","+(i + x + col)+" : "+JSON.stringify(theadMatrix[index+","+(i + x + col)]));
                        ++col; --x;
                    }
                }
            }else if(colflag){
                //console.log("goColSpan Start");
                var colspanlocal = 1;
                var col = 0;
                for(var x = 0; colspanlocal != 0; x++){
                    var json = {};
                    json['name'] = index +"."+ i;
                    json['text'] = $(e).html();
                    if(isNaN(rowspan)){
                        json['rowspan'] = 1;
                    }else{
                        json['rowspan'] = rowspan;
                    }
                    json['colspan'] = 1;   
                    json['object'] = e;
                    if(theadMatrix[index+","+(i + x + col)] == undefined){
                        //console.log("goColSpan "+index+","+(i + x + col)+" : "+JSON.stringify(json));
                        theadMatrix[index+","+(i + x + col)] = json;
                        $(e).addClass("hideColumn_"+(i + x + col));
                        $(e).addClass("hideRow_"+index);
                        if($(e).attr("rowBeforCell") == undefined){
                            $(e).attr("rowBeforCell", (i + x + col - 1));
                        }
                        --colspanlocal;
                    }else{
                        //console.log("duplicate key goColSpan "+index+","+(i + x + col)+" : "+JSON.stringify(theadMatrix[index+","+(i + x + col)]));
                        ++col; --x;
                    }
                }
            }
            //console.log("---th end---");
        });
    });
}
    
$(document).ready(function () {
    tableStack = {};
    $(window).on("tr_gone", function (event, hideObj) {
        var tableObj = $(hideObj).closest('table');
        var table_id = $(tableObj).attr('id');
        setTableStack(table_id,tableObj);
        var pattern = new RegExp('^hideRow_[0-9]+');
        var rowCellArray = [];
        var hideflag = false;
        $($(hideObj).attr('class').split(' ')).each(function(index,element){
           if(pattern.test(element)){
              $("."+element).each(function(i, e){
                  var rowspan = $(e).attr('rowspan');                  
                  if(!isNaN(rowspan) && rowspan > 1){                      
                      $(e).attr('rowspan',rowspan - 1);
                      rowCellArray.push(e);
                  }else{
                      $(e).hide();
                      hideflag = true;
                  }
              });
           }
        });
        if(hideflag){
            for(var i = 0; i < rowCellArray.length; i++){
                var nextTR = $(rowCellArray[i]).parent('tr').next('tr');
                var tdLength = $(nextTR).find('td:visible').length;
                if(!isNaN(tdLength) && tdLength > 0){
                    var index = $(rowCellArray[i]).attr('rowBeforCell');
                    if(index != -1){
                        $(nextTR).find('td').eq(index).after(rowCellArray[i]);
                    }else if(index == 0){
                        $(nextTR).find('td').eq(0).before(rowCellArray[i]);
                    }
                }
            }
        }
    });
    
    $(window).on("col_gone", function (event, hideObj) {
        var tableObj = $(hideObj).closest('table');
        var table_id = $(tableObj).attr('id');
        setTableStack(table_id,tableObj);
        
        var pattern = new RegExp('^hideColumn_[0-9]+');
        $($(hideObj).attr('class').split(' ')).each(function(index,element){
           if(pattern.test(element)){
              $("."+element).each(function(i, e){
                  var colspan = $(e).attr('colspan');
                  if(!isNaN(colspan) && colspan > 1){
                      $(e).attr('colspan',colspan - 1);
                  }else{
                      $(e).hide();
                  }
              });
           }
        });
    });
});

function setTableStack(table_id, obj){
    //tableStack[table_id].push(obj);
    //console.log(JSON.stringify(tableStack));
}

function initTableStack(table_id, obj){
    //tableStack[table_id] = [obj];
    //console.log(JSON.stringify(tableStack));
}

jQuery.fn.extend({
   hideRowColumn : function() {
       var table_id = "#"+$(this).attr('id');
       initTableStack(table_id, $(this));
       enableColumnHideMenu(table_id);
   }
});