/**
 * Created by Jay on 7/15/15.
 */
//选项首页卡
var Tabs = function(){
    function tag(name,elem){
        return (elem||document).getElementsByTagName(name);
    }
    //获得相应ID的元素
    function id(name){
        return document.getElementById(name);
    }
    function first(elem){
        elem=elem.firstChild;
        return elem&&elem.nodeType==1? elem:next(elem);
    }
    function next(elem){
        do{
            elem=elem.nextSibling;
        }while(
            elem&&elem.nodeType!=1
            )
        return elem;
    }
    return {
        _elemId:null,
        _tabId:null,
        _onChange:null,
        select:function(index) {
            var elem=tag("li",id(this._elemId));
            //alert(this._elemId);
            elem[index].onclick(index);
        },
        set:function(elemId, tabId, onChange){
            this._elemId = elemId;
            this._tabId = tabId;
            this._onChange = onChange;
            var elem=tag("li",id(elemId));
            var tabs=tag("div",id(tabId));
            var listNum=elem.length;
            var tabNum=tabs.length;
            for(var i=0;i<listNum;i++){
                elem[i].onclick=(function(i){
                    return function(){
                        for(var j=0;j<tabNum;j++){
                            if(i==j){
                                tabs[j].style.display="block";
                                //alert(elem[j].firstChild);
                                elem[j].firstChild.className="selected";
                            }
                            else{
                                tabs[j].style.display="none";
                                elem[j].firstChild.className="";
                            }
                        }
                        if (onChange) onChange(i);
                    }
                })(i)
            }
        }
    }
}();