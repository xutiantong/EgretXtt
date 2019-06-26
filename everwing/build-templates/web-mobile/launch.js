(function(){
    window.socialType = 0;    
    window.appVersion ="1.0.5";
    //发布正式版还是测试版，正式版为true，上传realease分支，测试版为false，上传mini分支
    window.buildRelease = false;

    function getQueryString(name)
    {
        var url = window.location.search;
        var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)','i');
        var r = url.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }


    var account_id = getQueryString ('account_id');
    if(account_id!=null && account_id!=""){
        window.account_id = account_id;
    }
})();
