//---------------------------------------------------------------
//核心基础服务
//version: 1.0.0
//---------------------------------------------------------------
var d1 = require("deviceone");

//递归获取配置项内容
function getOptions(c, os, p){
	p=p||"dOption";
	var od=os[p];
	if (!od)return;
	if ("dOption"!=p && od.parent!=p) getOptions(c, os, od.parent);
	for(var k in od){
		if (od[k]!=null) c[k]=od[k];
	}
}
//输出调试信息
function print(o){
	if (!o){
		d1.print(o, __filename);
		return;
	}
	if ( typeof o === "object" ){
		d1.print(JSON.stringify(o), __filename);
	}
	return d1.print(o, __filename);
}
//---------------------------------------------------------------
/**
 * 引用js类库 （如果不存在，则打印错误提示）
 * @param o js的文件名称，不包括扩展名的部分
 * @returns 返回对象库的引用
 */
module.exports.require = function(o){
	var r=require(o);
	if (r==null && o!="deviceone") print("未找到js引用库：" + o + ".js");
	return r;	
};

//---------------------------------------------------------------
/**
 * 获取单例组件的对象 （如果不存在，则打印错误提示）
 * @param o 单例组件的ID，或者是单例组件的对象
 * @returns 返回单例组件的对象
 */
module.exports.sm = function(o){
	if (o && typeof(o) == "string" ){
		var r= d1.sm(o);
		if (r==null) print("未找到sm组件：" + o);
		return r;
	}
	return o;	
};

//---------------------------------------------------------------
/**
 * 创建多例组件的对象
 * @param type mm对象的类型;
 * @param id mm对象的实例id;(仅用于全局对象)
 * @returns 返回多例组件的对象
 */
module.exports.mm = function(type, id){
	if (type && typeof(type) == "string" ){
		var r;
		if (id==null){
			r= d1.mm(type);
		}
		else{
			r= d1.mm(type, id, "app");
		}
		if (r==null) print("未找到mm组件：" + type);
		return r;
	}
	return type;	
};

//---------------------------------------------------------------
/**
 * 获取ui对象 （如果不存在，则打印错误提示）
 * @param o ui对象的id（也可以是ui对象本身）
 * @returns 返回ui对象
 * 注：该函数只适用于当前页面下，第一次调用core.js的环境下；如果使用不当，可能会引起各种复杂的意外问题，所以不推荐用户直接使用该函数。
 */
module.exports.ui = function(o){
	if (o && typeof(o) == "string" ){
		var r= d1.ui(__address+"." + o);
		if (r==null) print("未找到ui控件：" + o);
		return r;
	}
	return o;
};

//---------------------------------------------------------------
/**
 * 调试状态下，在IDE中打印信息
 * @param info 要打印的内容，可以是字符串、数字、对象或数组对象等
 */
module.exports.p = function(data){
	print(data);
};

//---------------------------------------------------------------
/**
 * 判断值是否为空
 * @param data 判断的值
 */
module.exports.isNull = function(data){
	if (data ==null || data==undefined) return true;
	return false;
};

//---------------------------------------------------------------
/**
 * 获取选项的配置 (用于js配置项的获取)
 * @param options 传入的自定义选项内容(也可以是选项名称)
 * @param file 相关配置文件名称（ 不包括.js扩展名）
 */
module.exports.getOptions = function(options, file){
	options = options || {}
	if (typeof(options)=="string"){
		options={parent:options};
	}
	var st=require(file);
	if (st && st.options){
		var c={};
		getOptions(c, st.options, options.parent);
		for(var k in options){
			if (options[k]!=null) c[k]=options[k];
		}
		options=c;
	}
	return options;
};

