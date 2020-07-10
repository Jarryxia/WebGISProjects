//判断IE浏览器，否则强制跳转
$(document).ready(function(){
	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
		document.location.href="../err/nosup.jsp";
	}
})

var _isPlaying=false;


$.playVoice=function(url,callback){
	if(_isPlaying){
		$.stopVoice();
	}
	_isPlaying=true;
	$("#jPlayerDiv").jPlayer({
		ready: function (event) {			
			$(this).jPlayer("setMedia", {
				mp3:url
			}).jPlayer("play")
		},
		ended:function(){
			$(this).jPlayer("destroy");
			callback();
			_isPlaying=false;
		},
		swfPath: "../common/js"
	});
	
}


$.stopVoice=function(){
	$("#jPlayerDiv").jPlayer("destroy");
	_isPlaying=false;
}


function Map() { 
     /** 存放键的数组(遍历用到) */ 
     this.keys = new Array(); 
     /** 存放数据 */ 
     this.data = new Object(); 
      
     /**
      * 放入一个键值对
      * @param {String} key
      * @param {Object} value
      */ 
     this.put = function(key, value) { 
         if(this.data[key] == null){ 
             this.keys.push(key); 
         } 
         this.data[key] = value; 
     }; 
      
     /**
     * 获取某键对应的值
     * @param {String} key
      * @return {Object} value
      */ 
     this.get = function(key) { 
         return this.data[key]; 
     }; 
      
     /**
      * 删除一个键值对
      * @param {String} key
      */ 
     this.remove = function(key) { 
    	 for (i = 0; i < this.keys.length; i++) {  
    		 if (this.keys[i] == key){
    			 this.keys.splice(i, 1);
    			 break;
    		 }
    	 }
    	 this.data[key] = null; 
     }; 
      
     /**
      * 遍历Map,执行处理函数
      * 
      * @param {Function} 回调函数 function(key,value,index){..}
      */ 
     this.each = function(fn){ 
         if(typeof fn != 'function'){ 
             return; 
         } 
         var len = this.keys.length; 
         for(var i=0;i<len;i++){ 
             var k = this.keys[i]; 
             fn(k,this.data[k],i); 
         } 
     }; 
      
     /**
      * 获取键值数组(类似Java的entrySet())
      * @return 键值对象{key,value}的数组
      */ 
     this.entrys = function() { 
         var len = this.keys.length; 
         var entrys = new Array(len); 
         for (var i = 0; i < len; i++) { 
             entrys[i] = { 
                 key : this.keys[i], 
                 value : this.data[i] 
             }; 
         } 
         return entrys; 
     }; 
      
     /**
      * 判断Map是否为空
      */ 
     this.isEmpty = function() { 
         return this.keys.length == 0; 
     }; 
      
     /**
      * 获取键值对数量
      */ 
     this.size = function(){ 
         return this.keys.length; 
     }; 
      
 } 

$.extend({
	include: function(file) {
		var files = typeof file == "string" ? [file]:file;
		for (var i = 0; i < files.length; i++) {
			var name = files[i].replace(/^\s|\s$/g, "");
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var tag = isCSS ? "link" : "script";
			var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
			var link = (isCSS ? "href" : "src") + "='" + name+"?random="+ new Date() + "'";
			if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
		}
	}
});

$.extend({
	alertJson:function(jsonObj){
		alert(JSON.stringify(jsonObj));
	}
})


$.setMenu=function(menuName){
	$(".menu_box").find("dd").removeClass("selected");
	$(".menu_box").find("a").each(function(i,a){
		if(menuName==$(a).text()){
			$(a).parent().addClass("selected")
		}
	})
	if(menuName=="开发者中心"){		
		$(".menu_box").find(".clickable").addClass("selected")
	}
}

$.initDom=function(dom,replaceKvs){
	var innerHTML=$(dom).html();	
	for(var i=0;i<replaceKvs.length;i++){
		if(i%2==0){
			var key=replaceKvs[i];
			if(typeof(key)=="string"){
				key=eval("/"+key.replace("{","\{").replace("}","\}")+"/g");
			}
			innerHTML=innerHTML.replace(key,replaceKvs[i+1]);
		}
	}	
	//判断属性中是否虚心含有值	
	$(dom).html(innerHTML);	
}

$.loadPage=function(param){
	var pageNav=$(param.dom);		
	var pageNo=param.data.pageNo;
	pageNav.html(param.data.pageHtml);
	//var pageCount=$(".pagination").attr("page_count");
	pageNav.find("#first_grid-pager-list").click(function(){
		if($(this).hasClass("ui-state-disabled")){
			return;
		}
		if(typeof(param.extra)=="undefined"){
			param.func(1);
		}else{
			param.func(param.extra,1);
		}
	})	
	
	pageNav.find("#prev_grid-pager-list").click(function(){
		if($(this).hasClass("ui-state-disabled")){
			return;
		}
		if(typeof(param.extra)=="undefined"){
			param.func(pageNo-1);
		}else{
			param.func(param.extra,pageNo-1);
		}
	})	
	
	pageNav.find("#next_grid-pager-list").click(function(){
		if($(this).hasClass("ui-state-disabled")){
			return;
		}
		if(typeof(param.extra)=="undefined"){
			param.func(pageNo+1);
		}else{
			param.func(param.extra,pageNo+1);
		}
	})	
	
	pageNav.find("#last_grid-pager-list").click(function(){
		if($(this).hasClass("ui-state-disabled")){
			return;
		}
		if(typeof(param.extra)=="undefined"){
			param.func(param.data.pageCount);
		}else{
			param.func(param.extra,param.data.pageCount);
		}
	})	
	
	pageNav.find(".page_go").click(function(){ 
		var pageTo=pageNav.find(".goto_area").find("input:text").val(); 
		if(isNaN(pageTo)){
			$.err("跳转页数必须为数字。")
			return;
		}
		if(pageTo<1 || pageTo>pageCount){
			$.err("跳转页数超过范围，请重新输入。")
			return;
		}	
		if(typeof(param.extra)=="undefined"){
			param.func(pageTo);
		}else{
			param.func(param.extra,pageTo);
		}
	});
}

$.datef=function(dateString,format){
	var result=dateString;
	try{
		var date=dateString;
		
		if(typeof(dateString)=="string"){
			date=StringToDate(dateString);
		}
		result=date.Format(format)
	}catch(e){}	
	return result;
}


function StringToDate(DateStr)  
{   

	var converted = Date.parse(DateStr);  
	var myDate = new Date(converted);  
	if (isNaN(myDate))  
	{   
//		var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
		var arys= DateStr.split('-');  
		myDate = new Date(arys[0],--arys[1],arys[2]);  
	}  
	return myDate;  
}  


//---------------------------------------------------  
//日期格式化  
//格式 YYYY/yyyy/YY/yy 表示年份  
//MM/M 月份  
//W/w 星期  
//dd/DD/d/D 日期  
//hh/HH/h/H 时间  
//mm/m 分钟  
//ss/SS/s/S 秒  
//---------------------------------------------------  
Date.prototype.Format = function(formatStr)     
{   
	var str = formatStr; 
	var Week = ['日','一','二','三','四','五','六'];  

	str=str.replace(/yyyy|YYYY/,this.getFullYear());   
	str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   

	str=str.replace(/MM/,this.getMonth()>8?(this.getMonth()+1):'0' + (this.getMonth()+1));   
	str=str.replace(/M/g,(this.getMonth()+1));   

	str=str.replace(/w|W/g,Week[this.getDay()]);   

	str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
	str=str.replace(/d|D/g,this.getDate());   

	str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
	str=str.replace(/h|H/g,this.getHours());   
	str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
	str=str.replace(/m/g,this.getMinutes());   

	str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
	str=str.replace(/s|S/g,this.getSeconds());   

	return str;   
}   

$.sizef=function(length){
	var formatString=null;
	if(length>=1024*1024){
		formatString=parseInt(length*10/(1024*1024))/10+"M";
	}else if(length>=1024){
		formatString=parseInt(length*10/1024)/10+"K";
	}else{
		formatString=length+"字节";
	}
	return formatString;
}

$.lenf=function(length){
	var formatString=null;
	if(length>=60){
		formatString=parseInt(length/60)+"'"+(length%60)+"\"";
	}else{
		formatString=length+"\"";
	}
	return formatString;
}


$.loading=function(param){
	//-------------------------
	if(typeof(param.css)=="undefined"){
		param.css="dialog_wrp media align_edge";
	}
	if(typeof(param.width)=="undefined"){
		param.width="960px";
	}
	if(typeof(param.height)=="undefined"){
		param.height="630px";
	}
	
	if(typeof(param.keepMask)=="undefined"){
		param.keepMask=false;
	}
	
	if(typeof(param.showButton)=="undefined"){
		param.showButton=true;
	}
	
	if(typeof(param.newInstance)=="undefined"){
		param.newInstance=false;
	}
	
	if(typeof(param.btnOkTitle)=="undefined"){
		param.btnOkTitle="确定";
	}
	
	if(typeof(param.hideButtons)=="undefined"){
		param.hideButtons=false;
	}
	
	if(typeof(param.hideBottom)=="undefined"){
		param.hideBottom=false;
	}
	
	
	
	
	var marginTop=(-parseInt(param.height)/2)+"px";
	var marginLeft=(-parseInt(param.width)/2)+"px";	
	
	if(!param.newInstance){
		$("#js_loadingDiv").remove();
	}else{
		$("#js_loadingDiv").hide();
	}
	
	
	
	var loadingDiv=$('<div class="js_loadingDiv #{css}" id="js_loadingDiv" style="z-index:9999;width: #{width};height:#{height};margin-left: #{marginLeft}; margin-top: #{marginTop};"><div class="dialog"><div class="dialog_hd"><h3 style="text-align:left;font-size:18px;line-height:50px">#{title}&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" class="delcls">-</a>&nbsp;&nbsp;<a href="javascript:;" class="addcls">+</a></h3><a href="javascript:;" onclick="return false" class="icon16_opr closed pop_closed">关闭</a></div><div class="dialog_bd" style="padding:0px"><div class="dialog_media_container "><i class="icon32_loading light">loading...</i></div></div><div class="dialog_ft"><span class="btn btn_primary btn_input js_btn_p btn_ok"><i></i><button type="button" class="js_btn " data-index="0">#{btnOkTitle}</button></span> <span class="btn btn_default btn_input js_btn_p "><button type="button" class="js_btn btn_cancel" >取消</button></span></div></div></div>'
				.replace("#{title}",param.title)
				.replace("#{css}",param.css)
				.replace("#{width}",param.width)
				.replace("#{height}",param.height)
				.replace("#{marginTop}",marginTop)
				.replace("#{marginLeft}",marginLeft)
				.replace("#{btnOkTitle}",param.btnOkTitle)
			 );
	
	loadingDiv.appendTo($("body"));
	
	if(param.hideButtons){
		loadingDiv.find(".dialog_ft span").css({"visibility":"hidden"});
		loadingDiv.find(".dialog_ft").css({"height":"20px"});
	}
	
	if(param.hideBottom){
		loadingDiv.find(".dialog_ft").hide();
	}
	
	
	if(typeof(param.nocancel)!="undefined"){
		if(param.nocancel==true){
			loadingDiv.find(".btn_default").hide();
		}		
	}
	
	if(!param.newInstance){
		$.showmask();//展示遮罩层
	}
	loadingDiv.find(".btn_cancel,.pop_closed").unbind("click").click(function(){
		if(param.newInstance){
			$(".js_loadingDiv").show();
			loadingDiv.remove();
		}else{			
			loadingDiv.remove();
			$.hideproc();
		}
	});
	
	var _wid = 0;
	var _hei = 0;
	loadingDiv.find(".addcls").click(function(){
		var _wid = parseInt(loadingDiv.width()) + 15;
		var _hei = parseInt(loadingDiv.height()) + 25;
		var _marTop=(-parseInt(_hei)/2)+"px";
		var _marLeft=(-parseInt(_wid)/2)+"px";	
		loadingDiv.css({"height":_hei,"width":_wid,"margin-left":_marLeft});
	});
	
	loadingDiv.find(".delcls").click(function(){
		var _wid = parseInt(loadingDiv.width()) - 15;
		var _hei = parseInt(loadingDiv.height()) - 25;
		var _marTop=(-parseInt(_hei)/2)+"px";
		var _marLeft=(-parseInt(_wid)/2)+"px";
		loadingDiv.css({"height":_hei,"width":_wid,"margin-left":_marLeft});
	});
	
	try{
		param.load(loadingDiv.find(".dialog_bd"));
	}catch(e){
		
	}	
	loadingDiv.find(".btn_ok").unbind("click").click(function(){
		if($(this).attr("locked")==1)return; 
		$(this).attr("locked","1").addClass("btn_loading");
		var result=param.submit(loadingDiv.find(".dialog_bd"));
		if(result==true){
			loadingDiv.find(".btn_cancel").trigger("click");			
		}	
		$(this).attr("locked","0").removeClass("btn_loading");
		if(typeof(param.keepMask)=="undefined"){
			$.showmask(); 
		}
	})	
}

$.confirm=function(param){
	$.loading({
		css:"dialog_wrp  ui-draggable",
		width:"720px",
		height:"335px",
		title:"温馨提示",
		keepMask:param.keepMask,
		load:function(parentDiv){					
			parentDiv.html(
					'<div class="page_msg large simple default"><div class="inner group"><span class="msg_icon_wrapper"><i class="icon_msg warn "></i></span><div class="msg_content "><h4>#{title}</h4><p>#{content}</p>  </div></div></div>'
					.replace("#{title}",param.title)
					.replace("#{content}", param.content)
			);			
		},
		submit:function(parentDiv){
			param.submit();
			return true;
		}
	});
}

$.showtip=function(param){	
	if(typeof(param.icon)=="undefined"){
		param.icon="success";
	}
	
	if(typeof(param.height)=="undefined"){
		param.height="335px";
	}
	
	$.loading({
		css:"dialog_wrp  ui-draggable",
		width:"720px",
		height:param.height,
		hideButtons:param.hideButtons,
		title:"温馨提示",
		nocancel:true,
		keepMask:param.keepMask,		
		load:function(parentDiv){					
			parentDiv.html(
					'<div class="page_msg large simple default"><div class="inner group"><span class="msg_icon_wrapper"><i class="icon_msg #{icon}"></i></span><div class="msg_content "><h4>#{title}</h4><p>#{content}</p>  </div></div></div>'
					.replace("#{title}",param.title)
					.replace("#{content}", param.content)
					.replace("#{icon}", param.icon)
			);		
			if(typeof(param.load)!="undefined"){
				param.load(parentDiv);
			}
		},
		submit:function(parentDiv){
			var result;
			try{
				result=param.submit();
			}catch(e){}
			if(result==null){
				result=true;
			}
			return result;
		}
	});
}

$.showproc=function(){
	$.showmask();
	$(".js_loading").remove();
	var processDiv=$("<div id='loading' class='js_loading' style='padding-left:40px;line-height:34px;border:0px solid #9A9A9A';><font color='#FFFFFF'></font></div>")
	processDiv.appendTo($("body"));
	
}

$.hideproc=function(){ 
	$(".js_loading").remove();	
	$.hidemask();
}


$.getRealLen=function(str){
	 return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了  
}


//快速提示
$.quickTip=function(content,callback){
	$.dialog({
		content :content,
		title:"提示信息",
		ok :"确 定",				
		modal :true,
		okCallback :function(){
			if(callback){
				callback();
			}
		}
	});			
}

//表单快速验证
//返回值说明： 返回null，说明表单校验成功，反之则返回值为错误提示信息
$.quickValidate=function(form){
	var errMsg=null;		
	$("input:text,input:password,textarea",form).each(function(i,o){
		$(o).val($.trim($(o).val()));					
		if($(o).attr("isNotNull")=="true"){
			if($(o).val().length==0){
				errMsg="["+$(o).attr("widgetName")+"]不能为空！";	
				$(o).focus();
				return false;//等价于break
			}					
		}
		
		//判断长度
		if(typeof($(o).attr("minLen")!="undefined")){
			var minLen=parseInt($(o).attr("minLen"));
			if($(o).val().length<minLen){
				errMsg="["+$(o).attr("widgetName")+"]长度至少为"+minLen+"位！";	
				$(o).focus();
				return false;
			}
		}	
		
		var keyword=$.keywordFilter($(o).val());
		if(keyword!=null){
			errMsg="["+$(o).attr("widgetName")+"]的值中包含以下非法关键词{<font color='#FF3434'>"+keyword+"</font>}，请修改。";
			$(o).focus(); 
			return false;
		}
		
		//判断数据类型	
		if($(o).val().length!=0){
			//如果类型为整数型
			if($(o).attr("dataType")=="int"){
				if(!$.isInt($(o).val())){								
					errMsg="["+$(o).attr("widgetName")+"]格式不正确，必须设置为整数！";
					$(o).focus();
					return false;//等价于break
				}
			//数值型 
			}else if($(o).attr("dataType")=="number"){
				if(isNaN($(o).val())){
					errMsg="["+$(o).attr("widgetName")+"]格式不正确，必须设置为数值型！";
					$(o).focus();
					return false;//等价于break
				}
			//手机号码
			}else if($(o).attr("dataType")=="mobile"){
				var reg0 =/\d{11}$/gi;	
				if (!reg0.test($(o).val())){	 
					errMsg="["+$(o).attr("widgetName")+"]格式不正确，必须设置为移动手机号码！";
					$(o).focus();
					return false;//等价于break
				}
			//邮件类型
			}else if($(o).attr("dataType")=="email"){
				var reg = /^(.+)@(\w+)\.((\w+)(\.{0,1}))*$/;
				var r = $(o).val().match(reg);
				if(r == null){
					errMsg="["+$(o).attr("widgetName")+"]必须符合电子邮件的规范输入！，如xxx@yahoo.com。";	
					$(o).focus();
					return false;
				}				
			//货币类型
			}else if($(o).attr("dataType")=="currency"){
				var reg = /^(\d+)\.(\d+)$/;
				var reg1 = /^(\d+)$/;
				var r = $(o).val().match(reg);
				var r1 = $(o).val().match(reg1);
				if(r == null && r1 == null)
				{
					errMsg="["+$(o).attr("widgetName")+"]必须是数字！";	
					$(o).focus();
					return false;
				}
				var t = $.trim($(o).val()).replace(/([-+]?[0-9]+\.?[0-9]{0,2})/,"");
				if(t.length != 0){
					errMsg="["+$(o).attr("widgetName")+"]的值必须是一个货币型的数值，\n 整数位最长9位，小数位最长2位！";
					$(o).focus();
					return false;
				}
			}						
		}		
		//关键词过滤
		var keyword=$.keywordFilter($(o).val());
		if(keyword!=null){
			errMsg="["+$(o).attr("widgetName")+"]的值中包含以下非法关键词{ "+keyword+" }，请修改。";
			$(o).focus();
			return false;
		}
	});
	
	
	return errMsg;
}

//是否整数型
$.isInt=function(val){
	var r = /^\+?[1-9][0-9]*$/;　　//正整数 	
	return r.test(val);
}

$.tips=function(msg){
	$(".JS_TIPS").remove();
	var tipDiv='<div class="JS_TIPS page_tips error" id="wxTips_' + (new Date).getTime() + '"><div class="inner">'+msg+'</div></div>'
	$(tipDiv).appendTo("body").fadeIn().delay(3000).fadeOut(3000);
}

$.err=function(msg){
	$(".JS_TIPS").remove();
	var tipDiv='<div class="JS_TIPS page_tips error" id="wxTips_' + (new Date).getTime() + '"><div class="inner">'+msg+'</div></div>'
	$(tipDiv).appendTo("body").fadeIn().delay(2000).fadeOut(900);
}

$.suc=function(msg){
	$(".JS_TIPS").remove();
	var tipDiv='<div class="JS_TIPS page_tips success" id="wxTips_' + (new Date).getTime() + '"><div class="inner">'+msg+'</div></div>'
	$(tipDiv).appendTo("body").fadeIn().delay(2000).fadeOut(900);
}

$.showmask=function(){
	$(".mask").remove();
	$("body").append("<div class=\"mask\"><iframe frameborder=\"0\" style=\"filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;top:0px;left:0px;width:100%;height:100%;\" src=\"about:blank\"></iframe></div>");
}

$.hidemask=function(){	
	$(".mask").remove();
}

$.keywordFilter=function(str){
	if(typeof(sensitiveKeywords)!="undefined"){
		for(var i=0;i<sensitiveKeywords.length;i++){
			if(str.indexOf(sensitiveKeywords[i])!=-1){
				return sensitiveKeywords[i];
			}
		}
	}	
	return null;
}

$.quickKeyword=function(str,target){
	var keyword=$.keywordFilter(str); 
	if(keyword!=null){
		$.showtip({
			icon:"warn",
			title:"非法关键字",
			content:target+"中含有非法关键字{<font color='#FF4545'>"+keyword+"</font>}，请修改。"
		})
		return false;
	}
	return true;
}


$.trimHtml=function(text){
	var result=text;
	try{
		result=result.replace(/<br>/g," ");
		result=result.replace(/<[^>]+>/g,"").replace(/&nbsp;/g,"");//去掉所有的html标记	
	}catch(e){
	}
	return result;
	//return text;
}