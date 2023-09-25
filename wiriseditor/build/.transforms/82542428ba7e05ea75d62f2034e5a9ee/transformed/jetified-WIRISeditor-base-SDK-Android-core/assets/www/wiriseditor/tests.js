var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = $hxClasses["Xml"] = function() {
};
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeValue: null
	,nodeName: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"setNodeName",get_nodeName:"getNodeName",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",get_parent:"getParent"}
}
var com = com || {}
if(!com.wiris) com.wiris = {}
if(!com.wiris.common) com.wiris.common = {}
com.wiris.common.WInteger = $hxClasses["com.wiris.common.WInteger"] = function() { }
com.wiris.common.WInteger.__name__ = ["com","wiris","common","WInteger"];
com.wiris.common.WInteger.max = function(x,y) {
	if(x > y) return x;
	return y;
}
com.wiris.common.WInteger.min = function(x,y) {
	if(x < y) return x;
	return y;
}
com.wiris.common.WInteger.toHex = function(x,digits) {
	var s = "";
	while(x != 0 && digits > 0) {
		digits--;
		var d = x & 15;
		s = com.wiris.system.Utf8.uchr(d + (d >= 10?55:48)) + s;
		x = x >> 4;
	}
	while(digits-- > 0) s = "0" + s;
	return s;
}
com.wiris.common.WInteger.parseHex = function(str) {
	return Std.parseInt("0x" + str);
}
com.wiris.common.WInteger.isInteger = function(str) {
	str = StringTools.trim(str);
	var i = 0;
	var n = str.length;
	if(StringTools.startsWith(str,"-")) i++;
	if(StringTools.startsWith(str,"+")) i++;
	var c;
	while(i < n) {
		c = HxOverrides.cca(str,i);
		if(c < 48 || c > 57) return false;
		i++;
	}
	return true;
}
if(!com.wiris.settings) com.wiris.settings = {}
com.wiris.settings.PlatformSettings = $hxClasses["com.wiris.settings.PlatformSettings"] = function() { }
com.wiris.settings.PlatformSettings.__name__ = ["com","wiris","settings","PlatformSettings"];
com.wiris.settings.PlatformSettings.evenTokensBoxWidth = function() {
	return true;
}
if(!com.wiris.system) com.wiris.system = {}
com.wiris.system.ArrayEx = $hxClasses["com.wiris.system.ArrayEx"] = function() { }
com.wiris.system.ArrayEx.__name__ = ["com","wiris","system","ArrayEx"];
com.wiris.system.ArrayEx.contains = function(a,b) {
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		if(x == b) return true;
	}
	return false;
}
com.wiris.system.ArrayEx.indexOf = function(a,b) {
	var idx = 0;
	while(idx < a.length) {
		if(a[idx] == b) return idx;
		++idx;
	}
	return -1;
}
com.wiris.system.Exception = $hxClasses["com.wiris.system.Exception"] = function(message,cause) {
	this.message = message;
};
com.wiris.system.Exception.__name__ = ["com","wiris","system","Exception"];
com.wiris.system.Exception.prototype = {
	getMessage: function() {
		return this.message;
	}
	,message: null
	,__class__: com.wiris.system.Exception
}
com.wiris.system.JsBrowserData = $hxClasses["com.wiris.system.JsBrowserData"] = function() {
};
com.wiris.system.JsBrowserData.__name__ = ["com","wiris","system","JsBrowserData"];
com.wiris.system.JsBrowserData.prototype = {
	identity: null
	,versionSearch: null
	,subString: null
	,prop: null
	,string: null
	,__class__: com.wiris.system.JsBrowserData
}
com.wiris.system.JsOSData = $hxClasses["com.wiris.system.JsOSData"] = function() {
};
com.wiris.system.JsOSData.__name__ = ["com","wiris","system","JsOSData"];
com.wiris.system.JsOSData.prototype = {
	identity: null
	,subString: null
	,string: null
	,__class__: com.wiris.system.JsOSData
}
com.wiris.system.JsBrowser = $hxClasses["com.wiris.system.JsBrowser"] = function() {
	this.dataBrowser = new Array();
	this.addBrowser("navigator.userAgent",null,"Edge",null,"Edge");
	this.addBrowser("navigator.userAgent",null,"Chrome",null,"Chrome");
	this.addBrowser("navigator.userAgent",null,"OmniWeb",null,"OmniWeb");
	this.addBrowser("navigator.vendor",null,"Apple","Version","Safari");
	this.addBrowser(null,"window.opera",null,"Version","Opera");
	this.addBrowser("navigator.vendor",null,"iCab",null,"iCab");
	this.addBrowser("navigator.vendor",null,"KDE",null,"Konkeror");
	this.addBrowser("navigator.userAgent",null,"Firefox",null,"Firefox");
	this.addBrowser("navigator.vendor",null,"Camino",null,"Camino");
	this.addBrowser("navigator.userAgent",null,"Netscape",null,"Netscape");
	this.addBrowser("navigator.userAgent",null,"MSIE","MSIE","Explorer");
	this.addBrowser("navigator.userAgent",null,"Trident","rv","Explorer");
	this.addBrowser("navigator.userAgent",null,"Gecko","rv","Mozilla");
	this.addBrowser("navigator.userAgent",null,"Mozilla","Mozilla","Netscape");
	this.dataOS = new Array();
	this.addOS("navigator.platform","Win","Windows");
	this.addOS("navigator.platform","Mac","Mac");
	this.addOS("navigator.userAgent","iPhone","iOS");
	this.addOS("navigator.userAgent","iPad","iOS");
	this.addOS("navigator.userAgent","Android","Android");
	this.addOS("navigator.platform","Linux","Linux");
	this.setBrowser();
	this.setOS();
	this.setTouchable();
};
com.wiris.system.JsBrowser.__name__ = ["com","wiris","system","JsBrowser"];
com.wiris.system.JsBrowser.prototype = {
	isTouchable: function() {
		return this.touchable;
	}
	,isAndroid: function() {
		return this.os == "Android";
	}
	,isMac: function() {
		return this.os == "Mac";
	}
	,isIOS: function() {
		return this.os == "iOS";
	}
	,isFF: function() {
		return this.browser == "Firefox";
	}
	,isSafari: function() {
		return this.browser == "Safari";
	}
	,isChrome: function() {
		return this.browser == "Chrome";
	}
	,isEdge: function() {
		return this.browser == "Edge";
	}
	,isIE: function() {
		return this.browser == "Explorer";
	}
	,getVersion: function() {
		return this.ver;
	}
	,getOS: function() {
		return this.os;
	}
	,getBrowser: function() {
		return this.browser;
	}
	,searchVersion: function(prop,search) {
		var str = js.Boot.__cast(eval(prop) , String);
		var index = str.indexOf(search);
		if(index == -1) return null;
		return "" + Std.parseFloat(HxOverrides.substr(str,index + search.length + 1,null));
	}
	,setTouchable: function() {
		if(this.isIOS() || this.isAndroid()) {
			this.touchable = true;
			return;
		}
		this.touchable = false;
	}
	,setOS: function() {
		var i = HxOverrides.iter(this.dataOS);
		while(i.hasNext()) {
			var s = i.next();
			var str = js.Boot.__cast(eval(s.string) , String);
			if(str.indexOf(s.subString) != -1) {
				this.os = s.identity;
				return;
			}
		}
	}
	,setBrowser: function() {
		var i = HxOverrides.iter(this.dataBrowser);
		while(i.hasNext()) {
			var b = i.next();
			if(b.string != null) {
				var obj = eval(b.string);
				if(obj != null) {
					var str = js.Boot.__cast(obj , String);
					if(str.indexOf(b.subString) != -1) {
						this.browser = b.identity;
						this.ver = this.searchVersion("navigator.userAgent",b.versionSearch);
						if(this.ver == null) this.ver = this.searchVersion("navigator.appVersion",b.versionSearch);
						return;
					}
				}
			}
		}
	}
	,addOS: function(string,subString,identity) {
		var s = new com.wiris.system.JsOSData();
		s.string = string;
		s.subString = subString;
		s.identity = identity;
		this.dataOS.push(s);
	}
	,addBrowser: function(string,prop,subString,versionSearch,identity) {
		var b = new com.wiris.system.JsBrowserData();
		b.string = string;
		b.prop = prop;
		b.subString = subString;
		b.versionSearch = versionSearch != null?versionSearch:identity;
		b.identity = identity;
		this.dataBrowser.push(b);
	}
	,touchable: null
	,os: null
	,ver: null
	,browser: null
	,dataOS: null
	,dataBrowser: null
	,__class__: com.wiris.system.JsBrowser
}
com.wiris.system.JsDOMUtils = $hxClasses["com.wiris.system.JsDOMUtils"] = function() { }
com.wiris.system.JsDOMUtils.__name__ = ["com","wiris","system","JsDOMUtils"];
com.wiris.system.JsDOMUtils.ieTouchEvents = null;
com.wiris.system.JsDOMUtils.init = function() {
	if(com.wiris.system.JsDOMUtils.initialized) return;
	com.wiris.system.JsDOMUtils.ieTouchEvents = new Hash();
	com.wiris.system.JsDOMUtils.ieTouchEvents.set("touchstart","MSPointerDown");
	com.wiris.system.JsDOMUtils.ieTouchEvents.set("touchmove","MSPointerMove");
	com.wiris.system.JsDOMUtils.ieTouchEvents.set("touchend","MSPointerUp");
	com.wiris.system.JsDOMUtils.initialized = true;
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"MSPointerDown",function(e) {
		com.wiris.system.JsDOMUtils.internetExplorerPointers.set("" + e.pointerId,e);
	});
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"MSPointerUp",function(e) {
		com.wiris.system.JsDOMUtils.internetExplorerPointers = new Hash();
	});
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"scroll",function(e) {
		com.wiris.system.JsDOMUtils.internetExplorerPointers = new Hash();
	});
	var touched = false;
	var triggerEvents = function(listeners) {
		var i = HxOverrides.iter(listeners);
		while(i.hasNext()) {
			var callbackFunction = i.next();
			callbackFunction();
		}
	};
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"touchstart",function(e) {
		if(!com.wiris.system.JsDOMUtils.browser.touchable) {
			com.wiris.system.JsDOMUtils.browser.touchable = true;
			triggerEvents(com.wiris.system.JsDOMUtils.touchDeviceListeners);
		}
		touched = true;
	});
	var onTouchEnd = function(e) {
		if(!com.wiris.system.JsDOMUtils.browser.touchable) {
			com.wiris.system.JsDOMUtils.browser.touchable = true;
			triggerEvents(com.wiris.system.JsDOMUtils.touchDeviceListeners);
		}
		touched = true;
		setTimeout(function() {
			touched = false;
		},500);
	};
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"touchend",onTouchEnd);
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"touchleave",onTouchEnd);
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"touchcancel",onTouchEnd);
	com.wiris.system.JsDOMUtils.addEventListener(js.Lib.document,"mousemove",function(e) {
		if(!touched) {
			if(com.wiris.system.JsDOMUtils.browser.touchable) {
				com.wiris.system.JsDOMUtils.browser.touchable = false;
				triggerEvents(com.wiris.system.JsDOMUtils.mouseDeviceListeners);
			}
		}
	});
}
com.wiris.system.JsDOMUtils.addEventListener = function(element,eventName,handler) {
	return com.wiris.system.JsDOMUtils.addEventListenerImpl(element,eventName,handler,false);
}
com.wiris.system.JsDOMUtils.addEventListenerImpl = function(element,eventName,handler,useCapture) {
	if(navigator.msPointerEnabled && com.wiris.system.JsDOMUtils.ieTouchEvents.exists(eventName)) {
		eventName = com.wiris.system.JsDOMUtils.ieTouchEvents.get(eventName);
		return com.wiris.system.JsDOMUtils.addEventListenerImpl(element,eventName,function(e) {
			if(e.pointerType == "touch") {
				if(eventName == "MSPointerUp") com.wiris.system.JsDOMUtils.internetExplorerPointers.remove("" + e.pointerId); else com.wiris.system.JsDOMUtils.internetExplorerPointers.set("" + e.pointerId,e);
				e.touches = new Array();
				var i = com.wiris.system.JsDOMUtils.internetExplorerPointers.iterator();
				while(i.hasNext()) e.touches.push(i.next());
				handler(e);
			}
		},useCapture);
	}
	if(eventName == "touchhold" && com.wiris.system.JsDOMUtils.browser.isTouchable()) {
		var timeout = null;
		var startX = -1;
		var startY = -1;
		var descriptor = com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchstart",function(e) {
			touching = true;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			timeout = setTimeout(function() {
				timeout = null;
				handler(e);
			},500);
		},useCapture);
		descriptor.subDescriptors.push(com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchmove",function(e) {
			if(timeout != null) {
				if(Math.abs(e.touches[0].clientX - startX) > com.wiris.system.JsDOMUtils.TOUCHHOLD_MOVE_MARGIN || Math.abs(e.touches[0].clientY - startY) > com.wiris.system.JsDOMUtils.TOUCHHOLD_MOVE_MARGIN) {
					clearTimeout(timeout);
					timeout = null;
				} else com.wiris.system.JsDOMUtils.cancelEvent(e);
			}
		},useCapture));
		descriptor.subDescriptors.push(com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchend",function(e) {
			if(timeout != null) {
				clearTimeout(timeout);
				timeout = null;
			}
		},useCapture));
		return descriptor;
	}
	var descriptor = { };
	descriptor.element = element;
	descriptor.eventName = eventName;
	descriptor.handler = handler;
	descriptor.useCapture = useCapture;
	descriptor.subDescriptors = new Array();
	if(eventName == "dblclick") {
		var event = null;
		var touching = false;
		var firstClickTimestamp = null;
		descriptor.subDescriptors.push(com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchstart",function(e) {
			touching = true;
			event = e;
		},useCapture));
		descriptor.subDescriptors.push(com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchmove",function(e) {
			touching = false;
		},useCapture));
		descriptor.subDescriptors.push(com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"touchend",function(e) {
			if(touching) {
				touching = false;
				var currentTimestamp = new Date().getTime();
				if(firstClickTimestamp == null || currentTimestamp > firstClickTimestamp + 500) firstClickTimestamp = currentTimestamp; else {
					event._wrs_dealAsTouch = true;
					handler(e);
				}
			}
		},useCapture));
	}
	if(eventName == "fullscreenchange") {
		com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"webkitfullscreenchange",handler,useCapture);
		com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"mozfullscreenchange",handler,useCapture);
		com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"MSFullscreenChange",handler,useCapture);
		com.wiris.system.JsDOMUtils.addEventListenerImpl(element,"wrs_fullscreenchange",handler,useCapture);
	}
	if(element.attachEvent) element.attachEvent("on" + eventName,function() {
		handler(window.event);
	}); else element.addEventListener(eventName,handler,useCapture);
	return descriptor;
}
com.wiris.system.JsDOMUtils.removeEventListener = function(descriptor) {
	if(com.wiris.system.JsDOMUtils.browser.isIE() && descriptor.element.detachEvent) descriptor.element.detachEvent("on" + Std.string(descriptor.eventName),descriptor.handler); else descriptor.element.removeEventListener(descriptor.eventName,descriptor.handler,descriptor.useCapture);
	var i = $iterator(descriptor.subDescriptors)();
	while(i.hasNext()) com.wiris.system.JsDOMUtils.removeEventListener(i.next());
}
com.wiris.system.JsDOMUtils.cancelEvent = function(e) {
	if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
}
com.wiris.system.JsDOMUtils.fireEvent = function(element,eventName) {
	var event;
	if(document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(eventName,true,true);
		event.eventName = eventName;
		element.dispatchEvent(event);
	} else {
		event = document.createEventObject();
		event.eventType = eventName;
		event.eventName = eventName;
		element.fireEvent("on" + eventName,event);
	}
}
com.wiris.system.JsDOMUtils.getComputedStyle = function(element) {
	if(element.currentStyle) return element.currentStyle;
	return document.defaultView.getComputedStyle(element,null);
}
com.wiris.system.JsDOMUtils.getComputedStyleProperty = function(element,name) {
	var value;
	if(document.defaultView && document.defaultView.getComputedStyle) value = document.defaultView.getComputedStyle(element,null).getPropertyValue(name); else if(com.wiris.system.JsDOMUtils.browser.isIE() && element.currentStyle) {
		var camelName = com.wiris.system.JsDOMUtils.camelize(name);
		value = element.currentStyle[camelName];
		if(value != null && value.length > 0 && camelName != "zoom") {
			var firstChar = HxOverrides.cca(value,0);
			if(firstChar >= 48 && firstChar <= 57 && !StringTools.endsWith(value,"px")) {
				var originalLeft = element.style.left;
				var originalRuntimeLeft = element.runtimeStyle?element.runtimeStyle.left:null;
				if(originalRuntimeLeft != null) element.runtimeStyle.left = element.currentStyle.left;
				element.style.left = camelName == "fontSize"?"1em":value;
				value = element.style.pixelLeft + "px";
				element.style.left = originalLeft;
				if(originalRuntimeLeft != null) element.runtimeStyle.left = originalRuntimeLeft;
			}
		}
	} else value = element.style[com.wiris.system.JsDOMUtils.camelize(name)];
	return value;
}
com.wiris.system.JsDOMUtils.camelize = function(str) {
	var start = 0;
	var pos;
	var sb = new StringBuf();
	while((pos = str.indexOf("-",start)) != -1) {
		sb.b += Std.string(HxOverrides.substr(str,start,pos - start));
		sb.b += Std.string(str.charAt(pos + 1).toUpperCase());
		start = pos + 2;
	}
	sb.b += Std.string(HxOverrides.substr(str,start,null));
	return sb.b;
}
com.wiris.system.JsDOMUtils.getElementsByClassName = function(parent,className,recursive) {
	var returnValue = new Array();
	var _g1 = 0, _g = parent.childNodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(com.wiris.system.JsDOMUtils.hasClass(parent.childNodes[i],className)) returnValue.push(parent.childNodes[i]);
		if(recursive) returnValue = returnValue.concat(com.wiris.system.JsDOMUtils.getElementsByClassName(parent.childNodes[i],className,true));
	}
	return returnValue;
}
com.wiris.system.JsDOMUtils.getEventTarget = function(event) {
	if(event.srcElement) return event.srcElement;
	return event.target;
}
com.wiris.system.JsDOMUtils.getLeft = function(element) {
	var left = 0;
	var scrollLeft = 0;
	var first = true;
	var isAndroidOrIOS = com.wiris.system.JsDOMUtils.browser.isAndroid() || com.wiris.system.JsDOMUtils.browser.isIOS();
	var isAbsolute = false;
	do {
		left += element.offsetLeft;
		var position = com.wiris.system.JsDOMUtils.getComputedStyleProperty(element,"position");
		if(position == "absolute") isAbsolute = true; else if(position == "relative" || position == "fixed") isAbsolute = false;
		if(first) first = false; else if((!isAndroidOrIOS || element != js.Lib.document.body) && element.scrollLeft != null) scrollLeft -= element.scrollLeft;
		var originalElement = element;
		if(position == "fixed") {
			if((!com.wiris.system.JsDOMUtils.browser.isChrome() || com.wiris.system.JsDOMUtils.browser.isAndroid()) && !com.wiris.system.JsDOMUtils.browser.isIE() && !com.wiris.system.JsDOMUtils.browser.isEdge() && !com.wiris.system.JsDOMUtils.browser.isIOS()) scrollLeft += com.wiris.system.JsDOMUtils.getWindowScroll()[0] | 0;
			element = null;
		} else if(element == js.Lib.document.body) {
			if(!isAbsolute && !com.wiris.system.JsDOMUtils.browser.isIE() && !com.wiris.system.JsDOMUtils.browser.isEdge()) left += Std.parseInt(com.wiris.system.JsDOMUtils.getComputedStyleProperty(element.parentNode,"margin-left"));
			element = null;
		} else {
			var scrollElement = element.parentNode;
			while(scrollElement != null && scrollElement != element.offsetParent) {
				if(scrollElement.scrollLeft != null) left -= scrollElement.scrollLeft;
				scrollElement = scrollElement.parentNode;
			}
			element = element.offsetParent;
		}
		var zoomElement = originalElement;
		while(zoomElement != null && zoomElement != originalElement.offsetParent && zoomElement.nodeType == 1) {
			var zoom = com.wiris.system.JsDOMUtils.getComputedStyleProperty(zoomElement,"zoom");
			if(zoom != null && zoom.length > 0 && zoom != "normal") {
				if(StringTools.endsWith(zoom,"%")) left = left * Std.parseFloat(zoom) / 100.0 | 0; else left = left * Std.parseFloat(zoom) | 0;
			}
			zoomElement = zoomElement.parentNode;
		}
	} while(element != null);
	return left + scrollLeft;
}
com.wiris.system.JsDOMUtils.getRelativeLeft = function(element,parent) {
	if(parent == null) return com.wiris.system.JsDOMUtils.getLeft(element);
	return com.wiris.system.JsDOMUtils.getLeft(element) - com.wiris.system.JsDOMUtils.getLeft(parent);
}
com.wiris.system.JsDOMUtils.getTop = function(element) {
	if(com.wiris.system.JsDOMUtils.getComputedStyleProperty(js.Lib.document.body,"position") == "relative") {
		if(Std.parseInt(com.wiris.system.JsDOMUtils.getComputedStyleProperty(js.Lib.document.body,"padding-top")) == 0) js.Lib.document.body.style.paddingTop = "0.1px";
	}
	var top = 0;
	var scrollTop = 0;
	var first = true;
	var isAndroidOrIOS = com.wiris.system.JsDOMUtils.browser.isAndroid() || com.wiris.system.JsDOMUtils.browser.isIOS();
	var isAbsolute = false;
	do {
		top += element.offsetTop;
		var position = com.wiris.system.JsDOMUtils.getComputedStyleProperty(element,"position");
		if(position == "absolute") isAbsolute = true; else if(position == "relative" || position == "fixed") isAbsolute = false;
		if(first) first = false; else if((!isAndroidOrIOS || element != js.Lib.document.body) && element.scrollTop != null) scrollTop -= element.scrollTop;
		var originalElement = element;
		if(position == "fixed") {
			if((!com.wiris.system.JsDOMUtils.browser.isChrome() || com.wiris.system.JsDOMUtils.browser.isAndroid()) && !com.wiris.system.JsDOMUtils.browser.isIE() && !com.wiris.system.JsDOMUtils.browser.isEdge() && !com.wiris.system.JsDOMUtils.browser.isIOS()) scrollTop += com.wiris.system.JsDOMUtils.getWindowScroll()[1] | 0;
			element = null;
		} else if(element == js.Lib.document.body) {
			if(!isAbsolute && !com.wiris.system.JsDOMUtils.browser.isIE() && !com.wiris.system.JsDOMUtils.browser.isEdge()) top += Std.parseInt(com.wiris.system.JsDOMUtils.getComputedStyleProperty(element.parentNode,"margin-top"));
			element = null;
		} else {
			var scrollElement = element.parentNode;
			while(scrollElement != null && scrollElement != element.offsetParent) {
				if(scrollElement.scrollTop != null) top -= scrollElement.scrollTop;
				scrollElement = scrollElement.parentNode;
			}
			element = element.offsetParent;
		}
		var zoomElement = originalElement;
		while(zoomElement != null && zoomElement != originalElement.offsetParent && zoomElement.nodeType == 1) {
			var zoom = com.wiris.system.JsDOMUtils.getComputedStyleProperty(zoomElement,"zoom");
			if(zoom != null && zoom.length > 0 && zoom != "normal") {
				if(StringTools.endsWith(zoom,"%")) top = top * Std.parseFloat(zoom) / 100.0 | 0; else top = top * Std.parseFloat(zoom) | 0;
			}
			zoomElement = zoomElement.parentNode;
		}
	} while(element != null);
	return top + scrollTop;
}
com.wiris.system.JsDOMUtils.getRelativeTop = function(element,parent) {
	if(parent == null) return com.wiris.system.JsDOMUtils.getTop(element);
	return com.wiris.system.JsDOMUtils.getTop(element) - com.wiris.system.JsDOMUtils.getTop(parent);
}
com.wiris.system.JsDOMUtils.getWindowScroll = function() {
	var scroll = new Array();
	if(js.Lib.window.pageYOffset == undefined) {
		scroll[0] = js.Lib.document.documentElement.scrollLeft;
		scroll[1] = js.Lib.document.documentElement.scrollTop;
	} else {
		scroll[0] = js.Lib.window.pageXOffset;
		scroll[1] = js.Lib.window.pageYOffset;
	}
	return scroll;
}
com.wiris.system.JsDOMUtils.isDescendant = function(parent,possibleDescendant) {
	if(possibleDescendant.parentNode == null) return false;
	if(possibleDescendant.parentNode == parent) return true;
	return com.wiris.system.JsDOMUtils.isDescendant(parent,possibleDescendant.parentNode);
}
com.wiris.system.JsDOMUtils.parseDimension = function(x) {
	return x < 0 || x == null?0:x;
}
com.wiris.system.JsDOMUtils.removeChildren = function(element) {
	while(element.firstChild != null) element.removeChild(element.firstChild);
}
com.wiris.system.JsDOMUtils.hasClass = function(element,className) {
	if(element == null || element.className == null || !(element.className.split)) return false;
	var classes = element.className.split(" ");
	var i = HxOverrides.iter(classes);
	while(i.hasNext()) if(i.next() == className) return true;
	return false;
}
com.wiris.system.JsDOMUtils.addClass = function(element,className) {
	if(element == null) return;
	if(element.className == "") element.className = className; else if(!com.wiris.system.JsDOMUtils.hasClass(element,className)) element.className += " " + className;
}
com.wiris.system.JsDOMUtils.removeClass = function(element,className) {
	if(element == null || element.className == null || !(element.className.split)) return;
	var classes = element.className.split(" ");
	HxOverrides.remove(classes,className);
	element.className = classes.join(" ");
}
com.wiris.system.JsDOMUtils.activateClass = function(element,className) {
	if(!com.wiris.system.JsDOMUtils.hasClass(element,className)) com.wiris.system.JsDOMUtils.addClass(element,className);
}
com.wiris.system.JsDOMUtils.setCaretPosition = function(element,position,end) {
	if(element.setSelectionRange) element.setSelectionRange(position,end); else if(element.createTextRange) {
		var range = element.createTextRange();
		range.collapse(true);
		range.moveStart("character",position);
		range.moveEnd("character",end);
		range.select();
	}
}
com.wiris.system.JsDOMUtils.getSelectionBounds = function(element) {
	var bounds = new Array();
	if(element.selectionStart != null) {
		bounds[0] = element.selectionStart;
		bounds[1] = element.selectionEnd;
		return bounds;
	}
	var range = document.selection.createRange();
	if(range && range.parentElement() == element) {
		var length = element.value.length;
		var normalizedValue = element.value.split("\r\n").join("\n");
		var textInputRange = element.createTextRange();
		textInputRange.moveToBookmark(range.getBookmark());
		var endRange = element.createTextRange();
		endRange.collapse(false);
		if(textInputRange.compareEndPoints("StartToEnd",endRange) > -1) bounds[0] = bounds[1] = length; else {
			bounds[0] = -textInputRange.moveStart("character",-length);
			bounds[0] += normalizedValue.slice(0,bounds[0]).split("\n").length - 1;
			if(textInputRange.compareEndPoints("EndToEnd",endRange) > -1) bounds[1] = length; else {
				bounds[1] = -textInputRange.moveEnd("character",-length);
				bounds[1] += normalizedValue.slice(0,bounds[1]).split("\n").length - 1;
			}
		}
		return bounds;
	}
	return null;
}
com.wiris.system.JsDOMUtils.getMousePosition = function(target,e) {
	if(e._wrs_dealAsTouch) return com.wiris.system.JsDOMUtils.getTouchPosition(target,e.touches[0]);
	var elementScroll = new Array();
	elementScroll[0] = target.scrollLeft;
	elementScroll[1] = target.scrollTop;
	return com.wiris.system.JsDOMUtils.getMousePositionImpl(target,e,elementScroll,0);
}
com.wiris.system.JsDOMUtils.getMousePositionImpl = function(target,e,elementScroll,border) {
	var position = new Array();
	position[0] = e.clientX - com.wiris.system.JsDOMUtils.getLeft(target) - border + elementScroll[0];
	position[1] = e.clientY - com.wiris.system.JsDOMUtils.getTop(target) - border + elementScroll[1];
	if(com.wiris.system.JsDOMUtils.browser.isChrome() && !com.wiris.system.JsDOMUtils.browser.isAndroid()) return position;
	if(com.wiris.system.JsDOMUtils.browser.isEdge()) return position;
	if(com.wiris.system.JsDOMUtils.browser.isIE() && com.wiris.system.JsDOMUtils.inFixedParent(target)) return position;
	if(com.wiris.system.JsDOMUtils.browser.isSafari() && !com.wiris.system.JsDOMUtils.inFixedParent(target)) return position;
	var windowScroll = com.wiris.system.JsDOMUtils.getWindowScroll();
	position[0] += windowScroll[0];
	position[1] += windowScroll[1];
	return position;
}
com.wiris.system.JsDOMUtils.inFixedParent = function(element) {
	while(element != null) {
		if(com.wiris.system.JsDOMUtils.getComputedStyleProperty(element,"position") == "fixed") return true;
		element = element.offsetParent;
	}
	return false;
}
com.wiris.system.JsDOMUtils.getTouchPosition = function(target,touch) {
	var elementScroll = new Array();
	elementScroll[0] = target.scrollLeft;
	elementScroll[1] = target.scrollTop;
	return com.wiris.system.JsDOMUtils.getTouchPositionImpl(target,touch,elementScroll,0);
}
com.wiris.system.JsDOMUtils.getTouchPositionImpl = function(target,touch,elementScroll,border) {
	var position = new Array();
	position[0] = touch.pageX - com.wiris.system.JsDOMUtils.getLeft(target) - border + elementScroll[0];
	position[1] = touch.pageY - com.wiris.system.JsDOMUtils.getTop(target) - border + elementScroll[1];
	if(com.wiris.system.JsDOMUtils.browser.isChrome() && !com.wiris.system.JsDOMUtils.browser.isAndroid()) {
		var windowScroll = com.wiris.system.JsDOMUtils.getWindowScroll();
		position[0] -= windowScroll[0] | 0;
		position[1] -= windowScroll[1] | 0;
	}
	return position;
}
com.wiris.system.JsDOMUtils.getStandardButton = function(e) {
	if(com.wiris.system.JsDOMUtils.browser.isTouchable()) return 0;
	var button = e.button;
	if(com.wiris.system.JsDOMUtils.browser.isIE()) {
		if(button == 1) button = 0; else if(button == 4) button = 1;
	}
	return button;
}
com.wiris.system.JsDOMUtils.vibrate = function(milliseconds) {
	if(navigator.vibrate) navigator.vibrate(milliseconds);
}
com.wiris.system.JsDOMUtils.onTouchDeviceDetected = function(callbackFunction) {
	com.wiris.system.JsDOMUtils.init();
	com.wiris.system.JsDOMUtils.touchDeviceListeners.push(callbackFunction);
}
com.wiris.system.JsDOMUtils.onMouseDeviceDetected = function(callbackFunction) {
	com.wiris.system.JsDOMUtils.init();
	com.wiris.system.JsDOMUtils.mouseDeviceListeners.push(callbackFunction);
}
com.wiris.system.JsDOMUtils.findScriptElement = function(reg) {
	var scripts = js.Lib.document.getElementsByTagName("script");
	var n = scripts.length;
	var i = 0;
	while(i < n) {
		var src = scripts[i].getAttribute("src");
		if(reg.match(src)) return scripts[i];
		++i;
	}
	return null;
}
com.wiris.system.JsDOMUtils.rewriteDefaultPaths = function(contextPath) {
	if(window.com.wiris.js.defaultServicePath != null && StringTools.startsWith(window.com.wiris.js.defaultServicePath,"http://")) {
		var protocol = js.Lib.window.location.protocol;
		var defaultServicePathWithoutProtocol = window.com.wiris.js.defaultServicePath.substr("http:".length);
		var reg = new EReg("(http:|https:)" + defaultServicePathWithoutProtocol + "/" + contextPath,"");
		if(com.wiris.system.JsDOMUtils.findScriptElement(reg) != null) protocol = reg.matched(1);
		if(protocol == "https:") {
			window.com.wiris.js.defaultServicePath = "https:" + defaultServicePathWithoutProtocol;
			if(window.com.wiris.js.defaultBasePath != null) window.com.wiris.js.defaultBasePath = "https:" + window.com.wiris.js.defaultBasePath.substr("http:".length);
		}
	}
}
com.wiris.system.JsDOMUtils.createCSSRules = function(selector,rules) {
	var style = js.Lib.document.createElement("style");
	style.type = "text/css";
	js.Lib.document.getElementsByTagName("head")[0].appendChild(style);
	if(style.sheet != null && style.sheet.insertRule != null) style.sheet.insertRule(selector + "{" + rules + "}",0); else if(style.styleSheet != null) style.styleSheet.addRule(selector,rules); else if(style.sheet != null) style.sheet.addRule(selector,rules);
}
com.wiris.system.JsDOMUtils.enterFullscreen = function(element) {
	document.wrs_fullscreen = true;
	document.wrs_fullscreenElement = element;
	com.wiris.system.JsDOMUtils.addClass(element,"wrs_fullscreen");
	com.wiris.system.JsDOMUtils.fireEvent(document,"wrs_fullscreenchange");
}
com.wiris.system.JsDOMUtils.exitFullscreen = function() {
	if(document.wrs_fullscreenElement != null) com.wiris.system.JsDOMUtils.removeClass(document.wrs_fullscreenElement,"wrs_fullscreen");
	document.wrs_fullscreenElement = null;
	document.wrs_fullscreen = false;
	com.wiris.system.JsDOMUtils.fireEvent(document,"wrs_fullscreenchange");
}
com.wiris.system.JsDOMUtils.isFullscreen = function(element) {
	if(element == null) return document.wrs_fullscreen || document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
	return document.wrs_fullscreenElement == element || document.fullscreenElement == element || document.mozFullScreenElement == element || document.webkitFullscreenElement || document.msFullscreenElement == element;
}
com.wiris.system.ResourceLoader = $hxClasses["com.wiris.system.ResourceLoader"] = function() {
	com.wiris.system.ResourceLoader.initialize();
	this.basePath = "";
};
com.wiris.system.ResourceLoader.__name__ = ["com","wiris","system","ResourceLoader"];
com.wiris.system.ResourceLoader.resourcesCache = null;
com.wiris.system.ResourceLoader.initialize = function() {
	if(com.wiris.system.ResourceLoader.resourcesCache == null) com.wiris.system.ResourceLoader.resourcesCache = new Hash();
	com.wiris.system.ResourceLoader.createObject(window,"com.wiris.system.ResourceLoader.translations".split("."));
}
com.wiris.system.ResourceLoader.createObject = function(parent,objectNames) {
	if(objectNames.length == 0) return;
	var next = objectNames.shift();
	if(!parent[next]) parent[next] = { };
	com.wiris.system.ResourceLoader.createObject(parent[next],objectNames);
}
com.wiris.system.ResourceLoader.newInstance = function(basePath) {
	var resourceLoader = new com.wiris.system.ResourceLoader();
	if(basePath.length > 0 && !StringTools.endsWith(basePath,"/")) basePath += "/";
	resourceLoader.basePath = basePath;
	return resourceLoader;
}
com.wiris.system.ResourceLoader.prototype = {
	getPath: function(path) {
		path += (path.indexOf("?") >= 0?"&":"?") + "v=" + this.loadResource("version.txt");
		if(StringTools.startsWith(path,"http://") || StringTools.startsWith(path,"https://")) return path;
		return this.basePath + path;
	}
	,loadStaticResource: function(path) {
		if(path == "editor_definition.xml") return com.wiris.system.ResourceLoader.editorDefinition;
		if(path == "image_definition.xml") return com.wiris.system.ResourceLoader.imageDefinition;
		if(path == "image_definition_1_5.xml") return com.wiris.system.ResourceLoader.imageDefinition1_5;
		if(path == "image_definition_2.xml") return com.wiris.system.ResourceLoader.imageDefinition2;
		if(path == "characters.xml") return com.wiris.system.ResourceLoader.charactersDefinition;
		if(path == "version.txt") {
			if(com.wiris.system.ResourceLoader.version == null) {
			}
			return com.wiris.system.ResourceLoader.version;
		}
		if(path == "font_adjust.xml") return com.wiris.system.ResourceLoader.fontAdjust;
		if(StringTools.startsWith(path,"lang/")) {
			var lang = HxOverrides.substr(path,5,path.lastIndexOf(".") - 5);
			if(com.wiris.system.ResourceLoader.translations[lang]) return com.wiris.system.ResourceLoader.translations[lang];
			lang = lang.toLowerCase();
			lang = lang.split("-").join("_");
			if(com.wiris.system.ResourceLoader.translations[lang]) return com.wiris.system.ResourceLoader.translations[lang];
			lang = HxOverrides.substr(lang,0,2);
			if(com.wiris.system.ResourceLoader.translations[lang]) return com.wiris.system.ResourceLoader.translations[lang];
		}
		return null;
	}
	,loadResource: function(path) {
		var staticResource = this.loadStaticResource(path);
		if(staticResource != null) return staticResource;
		staticResource = haxe.Resource.getString(path);
		if(staticResource != null) return staticResource;
		return null;
	}
	,basePath: null
	,__class__: com.wiris.system.ResourceLoader
}
com.wiris.system.StringEx = $hxClasses["com.wiris.system.StringEx"] = function() { }
com.wiris.system.StringEx.__name__ = ["com","wiris","system","StringEx"];
com.wiris.system.StringEx.substring = function(s,start,end) {
	if(end == null) return HxOverrides.substr(s,start,null);
	return HxOverrides.substr(s,start,end - start);
}
com.wiris.system.StringEx.compareTo = function(s1,s2) {
	if(s1 > s2) return 1;
	if(s1 < s2) return -1;
	return 0;
}
com.wiris.system.System = $hxClasses["com.wiris.system.System"] = function() { }
com.wiris.system.System.__name__ = ["com","wiris","system","System"];
com.wiris.system.System.arraycopy = function(src,srcPos,dest,destPos,n) {
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		dest[destPos + i] = src[srcPos + i];
	}
}
com.wiris.system.Utf8 = $hxClasses["com.wiris.system.Utf8"] = function() {
};
com.wiris.system.Utf8.__name__ = ["com","wiris","system","Utf8"];
com.wiris.system.Utf8.findUTF8Position = function(s,position,carry8,carry16) {
	if(carry16 == null) carry16 = 0;
	if(carry8 == null) carry8 = 0;
	var i8 = carry8;
	var i16 = carry16;
	var n8 = s.length;
	while(i8 < n8 && i16 < position) {
		var charCode = HxOverrides.cca(s,i8);
		if(charCode < 55296 || charCode > 56319) ++i16;
		++i8;
	}
	return i8;
}
com.wiris.system.Utf8.getLength = function(s) {
	var i8 = 0;
	var n8 = s.length;
	var counter16 = 0;
	while(i8 < n8) {
		var charCode = HxOverrides.cca(s,i8);
		if(charCode < 55296 || charCode > 56319) ++counter16;
		++i8;
	}
	return counter16;
}
com.wiris.system.Utf8.charCodeAt = function(s,i) {
	var i8 = com.wiris.system.Utf8.findUTF8Position(s,i,null,null);
	var charCode = HxOverrides.cca(s,i8);
	return charCode < 55296 || charCode > 56319?charCode:(charCode - 55296) * 1024 + HxOverrides.cca(s,i8 + 1) - 56320 + 65536;
}
com.wiris.system.Utf8.charAt = function(s,i) {
	return com.wiris.system.Utf8.uchr(com.wiris.system.Utf8.charCodeAt(s,i));
}
com.wiris.system.Utf8.uchr = function(i) {
	var s = new haxe.Utf8();
	if(i < 65536) s.__b += String.fromCharCode(i); else if(i <= 1114111) {
		s.__b += String.fromCharCode((i >> 10) + 55232);
		s.__b += String.fromCharCode((i & 1023) + 56320);
	} else throw "Invalid code point.";
	return s.__b;
}
com.wiris.system.Utf8.sub = function(s,pos,len) {
	var start = com.wiris.system.Utf8.findUTF8Position(s,pos,null,null);
	var end = com.wiris.system.Utf8.findUTF8Position(s,pos + len,start,pos);
	return HxOverrides.substr(s,start,end - start);
}
com.wiris.system.Utf8.toBytes = function(s) {
	return haxe.io.Bytes.ofString(s).b;
}
com.wiris.system.Utf8.fromBytes = function(s) {
	var bs = haxe.io.Bytes.ofData(s);
	return bs.toString();
}
com.wiris.system.Utf8.getIterator = function(s) {
	return new com.wiris.system._Utf8.StringIterator(s);
}
com.wiris.system.Utf8.prototype = {
	__class__: com.wiris.system.Utf8
}
if(!com.wiris.system._Utf8) com.wiris.system._Utf8 = {}
com.wiris.system._Utf8.StringIterator = $hxClasses["com.wiris.system._Utf8.StringIterator"] = function(s) {
	this.source = s;
	this.n = this.source.length;
	this.offset = 0;
};
com.wiris.system._Utf8.StringIterator.__name__ = ["com","wiris","system","_Utf8","StringIterator"];
com.wiris.system._Utf8.StringIterator.prototype = {
	next: function() {
		var c = HxOverrides.cca(this.source,this.offset++);
		if(c >= 55296 && c < 57344) {
			var c2 = HxOverrides.cca(this.source,this.offset++);
			c = ((c & 1023) << 10 | c2 & 1023) + 65536;
		}
		return c;
	}
	,nextByte: function() {
		return HxOverrides.cca(this.source,this.offset++);
	}
	,hasNext: function() {
		return this.offset < this.n;
	}
	,source: null
	,n: null
	,offset: null
	,__class__: com.wiris.system._Utf8.StringIterator
}
if(!com.wiris.util) com.wiris.util = {}
if(!com.wiris.util.graphics) com.wiris.util.graphics = {}
com.wiris.util.graphics.ClientGraphicsContext = $hxClasses["com.wiris.util.graphics.ClientGraphicsContext"] = function() { }
com.wiris.util.graphics.ClientGraphicsContext.__name__ = ["com","wiris","util","graphics","ClientGraphicsContext"];
com.wiris.util.graphics.ClientGraphicsContext.prototype = {
	getIdentifier: null
	,selects: null
	,fontExists: null
	,fillRect: null
	,drawArc: null
	,getLineWidth: null
	,drawPolyline: null
	,getFonts: null
	,canDisplay: null
	,setStyle: null
	,getMetrics: null
	,endTranslate: null
	,drawLine: null
	,drawVerticalLineWithType: null
	,drawHorizontalLineWithType: null
	,drawVerticalLine: null
	,drawHorizontalLine: null
	,drawText: null
	,beginTranslate: null
	,__class__: com.wiris.util.graphics.ClientGraphicsContext
}
if(!com.wiris.system.graphics) com.wiris.system.graphics = {}
com.wiris.system.graphics.JsClientGraphicsContext = $hxClasses["com.wiris.system.graphics.JsClientGraphicsContext"] = function(container,resourceLoader,removeChildren) {
	if(removeChildren == null) removeChildren = true;
	com.wiris.system.graphics.JsClientGraphicsContext.initialize(resourceLoader);
	this.container = container;
	this.metricsCache = new Hash();
	this.originalStyle = com.wiris.util.graphics.BoxStyle.newFontSizeP(100);
	this.repaintNeeded = false;
	this.resourceLoader = resourceLoader;
	this.smallBrackets = false;
	this.style = this.originalStyle;
	this.styleClass = "";
	this.styleClassWithoutFontFamily = "";
	this.textDimensionsSuffix = "";
	this.x = 0;
	this.y = 0;
	this.firstTranslate = true;
	if(removeChildren) com.wiris.system.JsDOMUtils.removeChildren(this.container);
	var metricsParent = com.wiris.system.JsDOMUtils.getElementsByClassName(this.container,"wrs_metrics",false)[0];
	if(metricsParent == null) {
		var metricsParent1 = js.Lib.document.createElement("span");
		metricsParent1.className = "wrs_metrics";
		metricsParent1.style.position = "absolute";
		metricsParent1.style.top = com.wiris.system.graphics.JsClientGraphicsContext.HIDDEN_TOP;
		metricsParent1.style.whiteSpace = "nowrap";
		this.metricsElement = js.Lib.document.createElement("span");
		this.metricsElement.style.position = "fixed";
		this.metricsElement.style.top = com.wiris.system.graphics.JsClientGraphicsContext.HIDDEN_TOP;
		this.metricsElement.style.left = "0";
		this.metricsElement.style.margin = "0";
		this.metricsElement.style.padding = "0";
		this.metricsElement.appendChild(js.Lib.document.createTextNode("x"));
		var metricsImgNode = js.Lib.document.createElement("img");
		metricsImgNode.setAttribute("src",this.resourceLoader.getPath("decoration/baseline_mark.png"));
		metricsImgNode.style.height = "0";
		metricsImgNode.style.width = "0";
		this.metricsElement.appendChild(metricsImgNode);
		metricsParent1.appendChild(this.metricsElement);
		this.container.appendChild(metricsParent1);
	} else this.metricsElement = metricsParent.firstChild;
	this.setColor(com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_COLOR);
	this.setFontFamily(com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_FONT_FAMILY);
	this.setFontSize(com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_FONT_SIZE);
};
com.wiris.system.graphics.JsClientGraphicsContext.__name__ = ["com","wiris","system","graphics","JsClientGraphicsContext"];
com.wiris.system.graphics.JsClientGraphicsContext.__interfaces__ = [com.wiris.util.graphics.ClientGraphicsContext];
com.wiris.system.graphics.JsClientGraphicsContext.fontList = null;
com.wiris.system.graphics.JsClientGraphicsContext.fontClasses = null;
com.wiris.system.graphics.JsClientGraphicsContext.specialChars = null;
com.wiris.system.graphics.JsClientGraphicsContext.initialize = function(resourceLoader) {
	if(com.wiris.system.graphics.JsClientGraphicsContext.specialChars == null) {
		com.wiris.system.graphics.JsClientGraphicsContext.specialChars = new Hash();
		com.wiris.system.graphics.JsClientGraphicsContext.parseSpecialChars(Xml.parse(resourceLoader.loadResource("characters.xml")));
		com.wiris.system.graphics.JsClientGraphicsContext.fontList = new Array();
		com.wiris.system.graphics.JsClientGraphicsContext.fontClasses = new Hash();
		com.wiris.system.graphics.JsClientGraphicsContext.fontList.push("drawFont");
		com.wiris.system.graphics.JsClientGraphicsContext.fontList.push("rootFont");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("horizontal","wrs_horizontalChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("brack_sm","wrs_specialSmallChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("brackets","wrs_specialChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("math1_rtl","wrs_mathRTLChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("script","wrs_scriptChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("fraktur","wrs_frakturChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("double-struck","wrs_doubleStruckChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("stix","wrs_font_stix");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("math1","wrs_mathChar");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("round_brackets1854","wrs_roundBrackets1854Char");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("round_brackets2254","wrs_roundBrackets2254Char");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("round_brackets2654","wrs_roundBrackets2654Char");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("round_brackets3054","wrs_roundBrackets3054Char");
		com.wiris.system.graphics.JsClientGraphicsContext.addFont("round_brackets3454","wrs_roundBrackets3454Char");
		com.wiris.system.graphics.JsClientGraphicsContext.fontList.push("negationFont");
		com.wiris.system.graphics.JsClientGraphicsContext.fontList.push("Arial");
	}
}
com.wiris.system.graphics.JsClientGraphicsContext.addFont = function(name,className) {
	com.wiris.system.graphics.JsClientGraphicsContext.fontList.push(name);
	com.wiris.system.graphics.JsClientGraphicsContext.fontClasses.set(name,className);
}
com.wiris.system.graphics.JsClientGraphicsContext.colorToRgb = function(color) {
	var red = color >> 16 & 255;
	var green = color >> 8 & 255;
	var blue = color & 255;
	return "rgb(" + red + "," + green + "," + blue + ")";
}
com.wiris.system.graphics.JsClientGraphicsContext.getStandardFontClassName = function(fontFamily) {
	var i = HxOverrides.iter(fontFamily.toLowerCase().split(" "));
	fontFamily = i.next();
	while(i.hasNext()) {
		var part = i.next();
		if(part.length > 0) {
			fontFamily += part.toUpperCase().charAt(0);
			if(part.length > 1) fontFamily += HxOverrides.substr(part,1,part.length - 1);
		}
	}
	return "wrs_font_" + fontFamily;
}
com.wiris.system.graphics.JsClientGraphicsContext.parseSpecialChars = function(node) {
	if("" + Std.string(node.nodeType) == "element" && node.getNodeName() == "char") {
		var charCode = Std.parseInt(node.get("c"));
		var type = node.get("t");
		var key = String.fromCharCode(charCode);
		if(type != null && type.length > 0) key += ":" + type;
		com.wiris.system.graphics.JsClientGraphicsContext.specialChars.set(key,true);
	}
	if("" + Std.string(node.nodeType) == "element" || "" + Std.string(node.nodeType) == "document") {
		var i = node.iterator();
		while(i.hasNext()) com.wiris.system.graphics.JsClientGraphicsContext.parseSpecialChars(i.next());
	}
}
com.wiris.system.graphics.JsClientGraphicsContext.compare = function(s,min) {
	if(s.length == 0) return 0;
	var i = HxOverrides.iter(s);
	var x = i.next();
	while(i.hasNext()) {
		var candidate = i.next();
		if(min) {
			if(candidate < x) x = candidate;
		} else if(candidate > x) x = candidate;
	}
	return x;
}
com.wiris.system.graphics.JsClientGraphicsContext.prototype = {
	getIdentifier: function() {
		return "js";
	}
	,selects: function(selector) {
		if(selector.length == 0) return true;
		var parts = selector.split("@");
		if(parts.length == 0) return true;
		if(parts[0] != "js") return false;
		if(parts.length > 1) {
			if("@windows@osx@ios@android@linux@*@".indexOf("@" + parts[1] + "@") < 0) return false;
			if(parts[1] == "windows" && com.wiris.system.JsDOMUtils.browser.getOS() != "Windows") return false;
			if(parts[1] == "osx" && com.wiris.system.JsDOMUtils.browser.getOS() != "Mac") return false;
			if(parts[1] == "ios" && com.wiris.system.JsDOMUtils.browser.getOS() != "iOS") return false;
			if(parts[1] == "android" && com.wiris.system.JsDOMUtils.browser.getOS() != "Android") return false;
			if(parts[1] == "linux" && com.wiris.system.JsDOMUtils.browser.getOS() != "Linux") return false;
			if(parts.length > 2) {
				if(com.wiris.system.JsDOMUtils.browser.isIE()) {
					if("@ie@ie7@ie8@ie9@ie10@ie11@".indexOf("@" + parts[2] + "@") < 0) return false;
					if(parts[2] == "ie7" && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) != 7) return false;
					if(parts[2] == "ie8" && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) != 8) return false;
					if(parts[2] == "ie9" && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) != 9) return false;
					if(parts[2] == "ie10" && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) != 10) return false;
					if(parts[2] == "ie11" && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) != 11) return false;
				}
				if(com.wiris.system.JsDOMUtils.browser.isChrome() && parts[2] != "chrome") return false;
				if(com.wiris.system.JsDOMUtils.browser.isFF() && parts[2] != "firefox") return false;
				if(com.wiris.system.JsDOMUtils.browser.isEdge() && parts[2] != "edge") return false;
				if(com.wiris.system.JsDOMUtils.browser.isSafari() && parts[3] != "safari") return false;
			}
		}
		return true;
	}
	,fontExists: function(fontFamily) {
		return "@Arial@Times New Roman@Courier New@Stix@Tahoma@Verdana@".indexOf("@" + fontFamily + "@") >= 0;
	}
	,fillRect: function(x,y,width,height) {
		x += this.x;
		y += this.y;
		var div = js.Lib.document.createElement("span");
		div.style.top = y + "px";
		div.style.left = x + "px";
		div.style.width = width + "px";
		div.style.height = height + "px";
		div.style.background = this.rgbColor;
		div.style.position = "absolute";
		div.style.zIndex = 0;
		this.container.appendChild(div);
	}
	,getCustomFontClassName: function(fontName) {
		if(!com.wiris.system.graphics.JsClientGraphicsContext.fontClasses.exists(fontName)) return null;
		return com.wiris.system.graphics.JsClientGraphicsContext.fontClasses.get(fontName);
	}
	,getFonts: function() {
		return com.wiris.system.graphics.JsClientGraphicsContext.fontList;
	}
	,canDisplay: function(fontName,character) {
		if(fontName == null) fontName = this.fontFamily;
		var text = String.fromCharCode(character);
		if(fontName == "jsRootFont") return character >= com.wiris.util.xml.WCharacterBase.ROOT && character <= com.wiris.util.xml.WCharacterBase.ROOT_VERTICAL_LINE;
		if(fontName == "a") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":a") != null;
		if(fontName == "math1") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":m") != null;
		if(fontName == "math1_rtl") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r") != null;
		if(fontName == "horizontal") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":h") != null;
		if(fontName == "brackets") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":b") != null;
		if(fontName == "brack_sm") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":s") != null;
		if(fontName == "script") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":c") != null;
		if(fontName == "fraktur") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":f") != null;
		if(fontName == "double-struck") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":d") != null;
		if(fontName == "round_brackets1854") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r1854") != null;
		if(fontName == "round_brackets2254") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r2254") != null;
		if(fontName == "round_brackets2654") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r2654") != null;
		if(fontName == "round_brackets3054") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r3054") != null;
		if(fontName == "round_brackets3454") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":r3454") != null;
		if(fontName == "stix") return com.wiris.system.graphics.JsClientGraphicsContext.specialChars.get(text + ":sx") != null;
		return this.fontFamily.toLowerCase() == fontName.toLowerCase();
	}
	,getMetrics: function(fontName,text) {
		if(fontName == null) fontName = this.fontFamily;
		return this.getTextDimensions(fontName,text,false,true);
	}
	,drawVML: function(x,y,width,height,code) {
		if(this.rtl && Std.parseInt(com.wiris.system.JsDOMUtils.browser.getVersion()) == 7) x -= width;
		var div = js.Lib.document.createElement("span");
		div.className = "wrs_vml";
		div.style.left = x - 1 + "px";
		div.style.top = y - 1 + "px";
		div.style.width = width + "px";
		div.style.height = height + "px";
		div.style.position = "absolute";
		div.style.zIndex = 2;
		this.container.appendChild(div);
		div.innerHTML = code;
	}
	,drawSVG: function(x,y,width,height,code) {
		if(this.rtl && !com.wiris.system.JsDOMUtils.browser.isIE()) x -= width;
		var div = js.Lib.document.createElement("span");
		div.style.left = x + "px";
		div.style.top = y + "px";
		div.style.width = width + "px";
		div.style.height = height + "px";
		div.style.position = "absolute";
		div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"position:absolute;z-index:2;\" width=\"" + width + "px\" height=\"" + height + "px\">" + code + "</svg>";
		this.container.appendChild(div);
	}
	,getLineWidth: function() {
		return Math.max(this.style.getLineWidth() * this.style.getZoom() * this.style.getP() / 100,1) | 0;
	}
	,drawArcVML: function(x,y,width,height,startAngle,arcAngle) {
		var code;
		var lineWidth = this.getLineWidth();
		var ceiledHalfLineWidth = Math.ceil(lineWidth / 2) | 0;
		if(this.rtl) x -= width - ceiledHalfLineWidth;
		width -= lineWidth;
		height -= lineWidth;
		x += ceiledHalfLineWidth;
		y += ceiledHalfLineWidth;
		startAngle = 90 - (360 + startAngle) % 360;
		var endAngle = startAngle - arcAngle;
		code = "<arc xmlns=\"urn:schemas-microsoft-com:vml\" style=\"behavior: url(#default#VML);margin:0;padding:0;display:inline-block;z-index:2;position:absolute;";
		code += "width:" + width + "px;";
		code += "height:" + height + "px;\" ";
		code += "startangle=\"" + startAngle + "\" endangle=\"" + endAngle + "\" filled=\"false\" stroke=\"true\" strokecolor=\"" + this.rgbColor + "\" strokeweight=\"" + lineWidth + "px\" />";
		this.drawVML(this.x + x,this.y + y,width,height,code);
	}
	,drawArcSVG: function(x,y,width,height,startAngle,arcAngle) {
		var code;
		if(arcAngle == 360) {
			var midX = width / 2;
			var midY = height / 2;
			var parsedWidth = width - this.getLineWidth();
			var parsedHeight = height - this.getLineWidth();
			var rx = parsedWidth / 2;
			var ry = parsedHeight / 2;
			code = "<ellipse cx=\"" + midX + "\" cy=\"" + midY + "\" rx=\"" + rx + "\" ry=\"" + ry + "\" style=\"fill:none;stroke:" + this.rgbColor + ";stroke-width:" + this.getLineWidth() + "\" />";
		} else {
			var midX = width / 2;
			var midY = height / 2;
			var parsedWidth = width - this.getLineWidth();
			var parsedHeight = height - this.getLineWidth();
			var rx = parsedWidth / 2;
			var ry = parsedHeight / 2;
			var startX = midX + Math.cos(startAngle * Math.PI / 180.0) * rx;
			var startY = midY + -Math.sin(startAngle * Math.PI / 180.0) * ry;
			var endX = midX + Math.cos((startAngle + arcAngle) * Math.PI / 180.0) * rx;
			var endY = midY + -Math.sin((startAngle + arcAngle) * Math.PI / 180.0) * ry;
			var largeArcFlag = arcAngle > 180?1:0;
			var path = "M" + startX + "," + startY + " ";
			path += "A" + rx + "," + ry + " ";
			path += "0 ";
			path += largeArcFlag + ",";
			path += "0 ";
			path += endX + "," + endY;
			code = "<path d=\"" + path + "\" style=\"stroke:" + this.rgbColor + ";stroke-width:" + this.getLineWidth() + ";fill:none\" />";
		}
		this.drawSVG(this.x + x,this.y + y,width,height,code);
	}
	,drawArc: function(x,y,width,height,startAngle,arcAngle) {
		if(!com.wiris.system.JsDOMUtils.browser.isIE() || Std.parseFloat(com.wiris.system.JsDOMUtils.browser.getVersion()) >= 9) this.drawArcSVG(x,y,width,height,startAngle,arcAngle); else this.drawArcVML(x,y,width,height,startAngle,arcAngle);
	}
	,setComponentColor: function(c) {
		c.style.color = this.rgbColor;
	}
	,standardHeightAndBaseline: function(fontName,text,dim) {
		if(text == "x") return dim;
		var oldStyle = this.getStyle();
		var newStyle = com.wiris.util.graphics.BoxStyle.newFontSizeP(oldStyle.getP());
		if(oldStyle.isFlagMask(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG)) newStyle.setFontSize(oldStyle.getFontSize());
		if(oldStyle.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) newStyle.setFontFamily(oldStyle.getFontFamily());
		if(oldStyle.isFlagMask(com.wiris.util.graphics.BoxStyle.ZOOM_FLAG)) newStyle.setZoom(oldStyle.getZoom());
		this.setStyle(newStyle,newStyle);
		var xDim = this.getTextDimensions(fontName,"x",true,true);
		this.setStyle(oldStyle,oldStyle);
		return [dim[0],xDim[1],xDim[2]];
	}
	,setStyle: function(style,changed) {
		this.style = style;
		if(changed.isFlagMask(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG)) this.setFontSize(changed.getFontSize());
		if(changed.isFlagMask(com.wiris.util.graphics.BoxStyle.COLOR_FLAG)) this.setColor(changed.getColor());
		if(changed.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) this.setFontFamily(changed.getFontFamily());
		var classes = new Array();
		this.textDimensionsSuffix = "";
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG)) {
			if(style.isFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG)) {
				classes.push("wrs_italic");
				this.textDimensionsSuffix += ":italic";
			} else {
				classes.push("wrs_notItalic");
				this.textDimensionsSuffix += ":notItalic";
			}
		}
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.BOLD_FLAG)) {
			if(style.isFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG)) {
				classes.push("wrs_bold");
				this.textDimensionsSuffix += ":bold";
			} else {
				classes.push("wrs_notBold");
				this.textDimensionsSuffix += ":notBold";
			}
		}
		this.styleClassWithoutFontFamily = classes.join(" ");
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) {
			var className = com.wiris.system.graphics.JsClientGraphicsContext.getStandardFontClassName(style.getFontFamily());
			if(className != null) classes.push(className);
			this.textDimensionsSuffix += ":" + style.getFontFamily();
		}
		this.styleClass = classes.join(" ");
	}
	,setMetricsCache: function(metricsCache) {
		if(metricsCache != null) this.metricsCache = metricsCache;
	}
	,getFontSize: function() {
		return this.fontSize;
	}
	,setFontSize: function(fontSize) {
		this.fontSize = fontSize;
	}
	,setFontFamily: function(fontFamily) {
		this.fontFamily = fontFamily;
	}
	,setColor: function(color) {
		this.rgbColor = com.wiris.system.graphics.JsClientGraphicsContext.colorToRgb(color);
		this.color = color;
	}
	,setBracketsSmaller: function(b) {
		this.smallBrackets = b;
	}
	,needsRepaint: function() {
		return this.repaintNeeded || !this.areMetricsWellCalculated();
	}
	,loadFonts: function() {
		var fontContainer = js.Lib.document.createElement("span");
		fontContainer.style.position = "absolute";
		fontContainer.style.top = com.wiris.system.graphics.JsClientGraphicsContext.HIDDEN_TOP;
		fontContainer.style.overflow = "hidden";
		fontContainer.style.width = "1px";
		fontContainer.className = "wrs_fontContainer";
		var i = com.wiris.system.graphics.JsClientGraphicsContext.fontClasses.iterator();
		while(i.hasNext()) {
			var className = i.next();
			if(className != "wrs_font_stix") {
				var font = js.Lib.document.createElement("span");
				font.className = className;
				font.appendChild(js.Lib.document.createTextNode(String.fromCharCode(61442)));
				fontContainer.appendChild(font);
			}
		}
		this.container.parentNode.insertBefore(fontContainer,this.container);
	}
	,isFontLoaded: function(fontName,text) {
		if(text == null) text = "";
		if(fontName == "stix" && text != null && text.length > 0) {
			var italic = this.style.isFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG);
			var sample = null;
			var unicode = com.wiris.system.Utf8.charCodeAt(text,0);
			var i = HxOverrides.iter(com.wiris.system.graphics.JsClientGraphicsContext.STIX_SETS);
			while(i.hasNext()) {
				var set = i.next();
				if(this.unicodeIsContained(unicode,italic,set)) {
					sample = this.generateUnicodeSample(set);
					break;
				}
			}
			if(sample != null) return this.getTextDimensions(fontName,sample,false,false)[0] != this.getTextDimensions("Arial",sample,false,false)[0];
		}
		return this.getTextDimensions(fontName,String.fromCharCode(61442),false,false)[0] > this.getTextDimensions("Arial","x",false,false)[0] * 2;
	}
	,generateUnicodeSample: function(set) {
		var sample = "";
		var i = HxOverrides.iter(js.Boot.__cast(set[1] , Array));
		while(sample.length < com.wiris.system.graphics.JsClientGraphicsContext.STIX_SAMPLE_SIZE && i.hasNext()) {
			var parts = i.next().split("-");
			if(parts.length == 1) {
				var charCode = Std.parseInt("0x" + parts[0]);
				if(charCode != 61442) sample += com.wiris.system.Utf8.uchr(charCode);
			} else {
				var from = Std.parseInt("0x" + parts[0]);
				var to = Std.parseInt("0x" + parts[1]);
				while(from <= to && sample.length < com.wiris.system.graphics.JsClientGraphicsContext.STIX_SAMPLE_SIZE) {
					if(from != 61442) sample += com.wiris.system.Utf8.uchr(from);
					++from;
				}
			}
		}
		return sample;
	}
	,unicodeIsContained: function(unicode,italic,set) {
		if(italic != set[0]) return false;
		var i = HxOverrides.iter(js.Boot.__cast(set[1] , Array));
		while(i.hasNext()) {
			var parts = i.next().split("-");
			if(parts.length == 1) {
				if(unicode == Std.parseInt("0x" + parts[0])) return true;
			} else if(unicode >= Std.parseInt("0x" + parts[0]) && unicode <= Std.parseInt("0x" + parts[1])) return true;
		}
		return false;
	}
	,getTextDimensions: function(fontName,text,drawing,checkIfFontIsLoaded) {
		var cacheKey = text + ":" + fontName + ":" + this.style.getP() * this.style.getZoom() + ":" + this.style.getFontSize() + this.textDimensionsSuffix;
		if(fontName == "brackets") cacheKey += ":b";
		if(fontName == "brack_sm") cacheKey += ":s";
		if(drawing) cacheKey += ":d";
		var cachedDimensions = this.metricsCache.get(cacheKey);
		if(cachedDimensions != null) return cachedDimensions;
		var insertInCache = true;
		var needsFont = false;
		var fontClassName = this.getCustomFontClassName(fontName);
		if(fontClassName != null) needsFont = true; else fontClassName = com.wiris.system.graphics.JsClientGraphicsContext.getStandardFontClassName(fontName);
		if(!checkIfFontIsLoaded) insertInCache = false; else if(needsFont && !this.isFontLoaded(fontName,text)) {
			this.repaintNeeded = true;
			insertInCache = false;
		}
		this.metricsElement.className = "";
		while(this.metricsElement.childNodes.length > 1) this.metricsElement.removeChild(this.metricsElement.firstChild);
		this.metricsElement.insertBefore(js.Lib.document.createTextNode(text),this.metricsElement.firstChild);
		this.metricsElement.className = this.styleClassWithoutFontFamily + " " + fontClassName;
		this.metricsElement.style.fontSize = this.fontSize * (this.style.getP() * this.style.getZoom()) / 100 + "px";
		var baseline = this.metricsElement.lastChild.offsetTop;
		if(this.metricsElement.lastChild.offsetHeight > 0) {
			insertInCache = false;
			this.repaintNeeded = true;
			baseline = this.metricsElement.lastChild.offsetHeight;
		}
		var drawingCacheKey = drawing?cacheKey:cacheKey + ":d";
		var noDrawingCacheKey = !drawing?cacheKey:HxOverrides.substr(cacheKey,0,cacheKey.length - 2);
		var dimensions = [this.metricsElement.offsetWidth,this.metricsElement.offsetHeight,baseline];
		var standardDimensions;
		if(needsFont) {
			var fontSizePx = com.wiris.system.JsDOMUtils.getComputedStyleProperty(this.metricsElement,"font-size");
			var fontSize = Std.parseInt(HxOverrides.substr(fontSizePx,0,fontSizePx.length - 2));
			standardDimensions = [dimensions[0],dimensions[1],dimensions[2]];
			if(com.wiris.system.JsDOMUtils.hasClass(this.metricsElement,"wrs_specialSmallChar")) {
				standardDimensions[1] = Math.round(fontSize * 340.0 / 1024.0);
				standardDimensions[2] = standardDimensions[1];
			} else if(com.wiris.system.JsDOMUtils.hasClass(this.metricsElement,"wrs_specialChar")) {
				standardDimensions[1] = Math.round(fontSize * 896.0 / 1024.0);
				standardDimensions[2] = standardDimensions[1];
			}
		} else standardDimensions = this.standardHeightAndBaseline(fontName,text,dimensions);
		if(insertInCache) {
			this.metricsCache.set(drawingCacheKey,dimensions);
			this.metricsCache.set(noDrawingCacheKey,standardDimensions);
		} else {
		}
		if(drawing) return dimensions;
		return standardDimensions;
	}
	,getStyle: function() {
		return this.style;
	}
	,getMetricsCache: function() {
		if(!this.areMetricsWellCalculated()) return null;
		return this.metricsCache;
	}
	,getColor: function() {
		return this.color;
	}
	,endTranslate: function(x,y,width,height) {
		this.x -= x;
		this.y -= y;
	}
	,drawVerticalLineWithType: function(id,x,y,height,type) {
		x += this.x;
		y += this.y;
		var lineWidth = this.getLineWidth();
		var halfLineWidth = lineWidth / 2 | 0;
		var line = js.Lib.document.createElement("span");
		if(type == "dotted") {
			line.style.borderLeftStyle = "dotted";
			line.style.borderLeftColor = this.rgbColor;
			line.style.borderLeftWidth = lineWidth + "px";
		} else if(type == "dashed") {
			line.style.borderLeftStyle = "dashed";
			line.style.borderLeftColor = this.rgbColor;
			line.style.borderLeftWidth = lineWidth + "px";
		} else {
			line.style.background = this.rgbColor;
			line.style.width = lineWidth + "px";
		}
		line.style.position = "absolute";
		line.style.zIndex = 2;
		line.style.top = y - halfLineWidth + "px";
		line.style.left = x - halfLineWidth + "px";
		line.style.height = com.wiris.system.JsDOMUtils.parseDimension(height + 2 * halfLineWidth) + "px";
		line.innerHTML = "&nbsp;";
		this.container.appendChild(line);
	}
	,drawVerticalLine: function(id,x,y,height) {
		x += this.x;
		y += this.y;
		var lineWidth = this.getLineWidth();
		var halfLineWidth = lineWidth / 2 | 0;
		var line = js.Lib.document.createElement("span");
		line.style.position = "absolute";
		line.style.zIndex = 2;
		line.style.borderLeft = lineWidth + "px solid " + this.rgbColor;
		line.style.top = y - halfLineWidth + "px";
		line.style.left = x - halfLineWidth + "px";
		line.style.width = "0";
		line.style.height = com.wiris.system.JsDOMUtils.parseDimension(height + 2 * halfLineWidth) + "px";
		line.innerHTML = "&nbsp;";
		this.container.appendChild(line);
	}
	,drawTextSub: function(text,x,y,baseline,fontName) {
		var textContainer = js.Lib.document.createElement("span");
		this.setComponentColor(textContainer);
		var fontClassName = this.getCustomFontClassName(fontName);
		if(fontClassName != null) com.wiris.system.JsDOMUtils.addClass(textContainer,fontClassName);
		com.wiris.system.JsDOMUtils.addClass(textContainer,this.styleClass);
		var dimensions = this.getTextDimensions(fontName,text,true,true);
		textContainer.style.position = "absolute";
		textContainer.style.left = x + "px";
		textContainer.style.top = y + baseline - dimensions[2] + "px";
		textContainer.style.zIndex = 2;
		textContainer.style.fontSize = this.fontSize * (this.style.getP() * this.style.getZoom()) / 100 + "px";
		textContainer.appendChild(js.Lib.document.createTextNode(text));
		this.container.appendChild(textContainer);
		return dimensions[0];
	}
	,drawText: function(id,fontName,text,x,y,baseline) {
		if(fontName == null) fontName = this.fontFamily;
		x += this.x;
		y += this.y;
		if(com.wiris.util.xml.WCharacterBase.isLTRNumber(text)) {
			var charOffset = 0;
			var _g1 = 0, _g = text.length;
			while(_g1 < _g) {
				var i = _g1++;
				var charWidth = this.drawTextSub(text.charAt(i),x + charOffset,y,baseline,fontName);
				charOffset += charWidth;
			}
		} else this.drawTextSub(text,x,y,baseline,fontName);
	}
	,drawPolylineVML: function(x0,y0,px,py,length) {
		px = px.slice();
		py = py.slice();
		var i = 0;
		while(i < length) {
			px[i] += x0;
			py[i] += y0;
			++i;
		}
		var minX = px[0];
		var minY = py[0];
		var maxX = px[0];
		var maxY = py[0];
		i = 1;
		while(i < length) {
			if(px[i] < minX) minX = px[i];
			if(py[i] < minY) minY = py[i];
			if(px[i] > maxX) maxX = px[i];
			if(py[i] > maxY) maxY = py[i];
			++i;
		}
		i = 0;
		while(i < length) {
			px[i] -= minX;
			py[i] -= minY;
			++i;
		}
		var flooredHalfLineWidth = this.getLineWidth() / 2 | 0;
		var points = "";
		i = 0;
		while(i < length) {
			points += px[i] + "," + py[i] + " ";
			++i;
		}
		this.drawVML(this.x + minX + 1,this.y + minY + 1,maxX - minX + this.getLineWidth(),maxY - minY + this.getLineWidth(),"<polyline xmlns=\"urn:schemas-microsoft-com:vml\" " + "style=\"behavior: url(#default#VML);display:inline-block;margin:0;padding:0;position:absolute;\" " + "filled=\"f\" " + "strokecolor=\"" + this.rgbColor + "\" " + "points=\"" + points + "\" strokeweight=\"" + this.getLineWidth() + "px\"></polyline>");
	}
	,drawPolylineSVG: function(x0,y0,px,py,length) {
		px = px.slice();
		py = py.slice();
		var i = 0;
		while(i < length) {
			px[i] += x0;
			py[i] += y0;
			++i;
		}
		var minX = px[0];
		var minY = py[0];
		var maxX = px[0];
		var maxY = py[0];
		i = 1;
		while(i < length) {
			if(px[i] < minX) minX = px[i];
			if(py[i] < minY) minY = py[i];
			if(px[i] > maxX) maxX = px[i];
			if(py[i] > maxY) maxY = py[i];
			++i;
		}
		i = 0;
		while(i < length) {
			px[i] -= minX;
			py[i] -= minY;
			++i;
		}
		var points = "";
		i = 0;
		while(i < length) {
			points += px[i] + "," + py[i] + " ";
			++i;
		}
		this.drawSVG(this.x + minX + 0.5,this.y + minY + 0.5,maxX - minX + this.getLineWidth(),maxY - minY + this.getLineWidth(),"<polyline points=\"" + points + "\" style=\"stroke:" + this.rgbColor + ";stroke-width:" + this.getLineWidth() + ";\" fill=\"none\"/>");
	}
	,drawLineVML: function(x1,y1,x2,y2) {
		var minX;
		var minY;
		var maxX;
		var maxY;
		if(x1 < x2) {
			minX = x1;
			maxX = x2;
		} else {
			minX = x2;
			maxX = x1;
		}
		if(y1 < y2) {
			minY = y1;
			maxY = y2;
		} else {
			minY = y2;
			maxY = y1;
		}
		x1 = x1 - minX;
		x2 = x2 - minX;
		y1 = y1 - minY;
		y2 = y2 - minY;
		var flooredHalfLineWidth = this.getLineWidth() / 2 | 0;
		this.drawVML(this.x + minX,this.y + minY,maxX - minX + this.getLineWidth(),maxY - minY + this.getLineWidth(),"<line xmlns=\"urn:schemas-microsoft-com:vml\" " + "style=\"behavior: url(#default#VML);display:inline-block;margin:0;padding:0;position:absolute;\" " + "strokecolor=\"" + this.rgbColor + "\" " + "from=\"" + x1 + "," + y1 + "\" to=\"" + x2 + "," + y2 + "\" strokeweight=\"" + this.getLineWidth() + "px\"></line>");
	}
	,drawLineSVG: function(x1,y1,x2,y2) {
		var minX;
		var minY;
		var maxX;
		var maxY;
		if(x1 < x2) {
			minX = x1;
			maxX = x2;
		} else {
			minX = x2;
			maxX = x1;
		}
		if(y1 < y2) {
			minY = y1;
			maxY = y2;
		} else {
			minY = y2;
			maxY = y1;
		}
		x1 = x1 - minX;
		x2 = x2 - minX;
		y1 = y1 - minY;
		y2 = y2 - minY;
		this.drawSVG(this.x + minX,this.y + minY,maxX - minX + this.getLineWidth(),maxY - minY + this.getLineWidth(),"<line x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" style=\"stroke:" + this.rgbColor + ";stroke-width:" + this.getLineWidth() + ";\"/>");
	}
	,drawPolyline: function(x0,y0,px,py,length) {
		if(!com.wiris.system.JsDOMUtils.browser.isIE() || Std.parseFloat(com.wiris.system.JsDOMUtils.browser.getVersion()) >= 9) this.drawPolylineSVG(x0,y0,px,py,length); else this.drawPolylineVML(x0,y0,px,py,length);
	}
	,drawLine: function(x1,y1,x2,y2) {
		if(!com.wiris.system.JsDOMUtils.browser.isIE() || Std.parseFloat(com.wiris.system.JsDOMUtils.browser.getVersion()) >= 9) this.drawLineSVG(x1,y1,x2,y2); else this.drawLineVML(x1,y1,x2,y2);
	}
	,drawHorizontalLineWithType: function(id,x,y,width,type) {
		x += this.x;
		y += this.y;
		var lineWidth = this.getLineWidth();
		var halfLineWidth = lineWidth / 2 | 0;
		var line = js.Lib.document.createElement("span");
		if(type == "dotted") {
			line.style.borderTopStyle = "dotted";
			line.style.borderTopColor = this.rgbColor;
			line.style.borderTopWidth = lineWidth + "px";
		} else if(type == "dashed") {
			line.style.borderTopStyle = "dashed";
			line.style.borderTopColor = this.rgbColor;
			line.style.borderTopWidth = lineWidth + "px";
		} else {
			line.style.background = this.rgbColor;
			line.style.height = lineWidth + "px";
		}
		line.style.position = "absolute";
		line.style.zIndex = 2;
		line.style.top = y - halfLineWidth + "px";
		line.style.left = x - halfLineWidth + "px";
		line.style.width = com.wiris.system.JsDOMUtils.parseDimension(width + 2 * halfLineWidth) + "px";
		line.innerHTML = "&nbsp;";
		this.container.appendChild(line);
	}
	,drawHorizontalLine: function(id,x,y,width) {
		x += this.x;
		y += this.y;
		var lineWidth = this.getLineWidth();
		var halfLineWidth = lineWidth / 2 | 0;
		var line = js.Lib.document.createElement("span");
		line.style.position = "absolute";
		line.style.zIndex = 2;
		line.style.borderTop = lineWidth + "px solid " + this.rgbColor;
		line.style.top = y - halfLineWidth + "px";
		line.style.left = x - halfLineWidth + "px";
		line.style.width = com.wiris.system.JsDOMUtils.parseDimension(width + 2 * halfLineWidth) + "px";
		line.style.height = "0";
		line.innerHTML = "&nbsp;";
		this.container.appendChild(line);
	}
	,beginTranslate: function(x,y,width,height) {
		if(this.firstTranslate) {
			this.rtl = this.style.isFlag(com.wiris.util.graphics.BoxStyle.RTL_FLAG);
			this.firstTranslate = false;
		}
		this.x += x;
		this.y += y;
	}
	,areMetricsWellCalculated: function() {
		return this.isFontLoaded("brackets") && com.wiris.system.JsDOMUtils.isDescendant(js.Lib.document.body,this.container);
	}
	,rtl: null
	,firstTranslate: null
	,y: null
	,x: null
	,textDimensionsSuffix: null
	,styleClassWithoutFontFamily: null
	,styleClass: null
	,style: null
	,smallBrackets: null
	,rgbColor: null
	,resourceLoader: null
	,repaintNeeded: null
	,originalStyle: null
	,metricsElement: null
	,metricsCache: null
	,fontSize: null
	,fontFamily: null
	,container: null
	,color: null
	,__class__: com.wiris.system.graphics.JsClientGraphicsContext
}
if(!com.wiris.test) com.wiris.test = {}
com.wiris.test.FontTest = $hxClasses["com.wiris.test.FontTest"] = function(basePath) {
	this.resourceLoader = com.wiris.system.ResourceLoader.newInstance(basePath);
};
com.wiris.test.FontTest.__name__ = ["com","wiris","test","FontTest"];
com.wiris.test.FontTest.prototype = {
	doTest: function(container,fontFamily,fontSize,fontStyle,text,smallBrackets) {
		this.container = container;
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.fontStyle = fontStyle;
		this.text = text;
		this.smallBrackets = smallBrackets;
		this.doTestImpl();
	}
	,doTestImpl: function() {
		while(this.container.hasChildNodes()) this.container.removeChild(this.container.firstChild);
		var divMetrics = js.Lib.document.createElement("div");
		this.container.appendChild(divMetrics);
		var divText = js.Lib.document.createElement("div");
		this.container.appendChild(divText);
		com.wiris.system.JsDOMUtils.addClass(divText,"wrs_viewer");
		divText.style.height = "200px";
		divText.style.width = "600px";
		var gc = new com.wiris.system.graphics.JsClientGraphicsContext(divText,this.resourceLoader);
		var oldstyle = gc.getStyle();
		var newstyle = com.wiris.util.graphics.BoxStyle.newBoxStyle(oldstyle);
		newstyle.setFontFamily(this.fontFamily);
		newstyle.setFontSize(this.fontSize);
		if(this.fontStyle == "normal") {
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,false);
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG,false);
		} else if(this.fontStyle == "italic") {
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,true);
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG,false);
		} else if(this.fontStyle == "bold") {
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,false);
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG,true);
		} else if(this.fontStyle == "bold-italic") {
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG,true);
			newstyle.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,true);
		}
		gc.setStyle(newstyle,null);
		gc.setBracketsSmaller(this.smallBrackets);
		var minwidth = 10000000;
		var maxwidth = -10000000;
		var minheight = 10000000;
		var maxheight = -10000000;
		var minbaseline = 10000000;
		var maxbaseline = -10000000;
		var i;
		var _g1 = 0, _g = this.text.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var c = HxOverrides.substr(this.text,i1,1);
			var width = 0;
			var height = 0;
			var baseline = 0;
			if(width < minwidth) minwidth = width;
			if(width > maxwidth) maxwidth = width;
			if(height < minheight) minheight = height;
			if(height > maxheight) maxheight = height;
			if(baseline < minbaseline) minbaseline = baseline;
			if(baseline > maxbaseline) maxbaseline = baseline;
		}
		var metricsText;
		metricsText = "Height: " + minheight;
		if(maxheight != minheight) metricsText += "-" + maxheight;
		metricsText += "px, Baseline: " + minbaseline;
		if(maxbaseline != minbaseline) metricsText += "-" + maxbaseline;
		metricsText += "px, Width: " + minwidth;
		if(maxwidth != minwidth) metricsText += "-" + maxwidth;
		metricsText += "px.";
		divMetrics.style.fontSize = "small";
		divMetrics.appendChild(js.Lib.document.createTextNode(metricsText));
		var x = 0;
		var _g1 = 0, _g = this.text.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var c = HxOverrides.substr(this.text,i1,1);
			var width = 0;
			var height = 0;
			var baseline = 0;
			var y = maxbaseline - baseline;
			gc.drawHorizontalLine(0,x,y + baseline,width);
			var span = divText.lastChild;
			var realWidth = span.offsetWidth;
			var realHeight = span.offsetHeight;
			var realTop = span.style.top;
			realTop = HxOverrides.substr(realTop,0,realTop.length - 2);
			var realBaseline = y + baseline - Std.parseInt(realTop);
			span.title = "calc(w:" + width + " h:" + height + " b:" + baseline + "); real(w:" + realWidth + " h:" + realHeight + " b:" + realBaseline + ")";
			x += width;
		}
		divText.style.height = maxheight + "px";
		divText.style.width = x + "px";
		if(gc.needsRepaint()) {
			if(this.repaintTimer == null) {
				this.repaintTimer = new haxe.Timer(100);
				this.repaintTimer.run = $bind(this,this.doTestImpl);
			}
		} else if(this.repaintTimer != null) {
			this.repaintTimer.stop();
			this.repaintTimer = null;
		}
	}
	,smallBrackets: null
	,text: null
	,fontStyle: null
	,fontSize: null
	,fontFamily: null
	,container: null
	,repaintTimer: null
	,resourceLoader: null
	,__class__: com.wiris.test.FontTest
}
if(!com.wiris.util.css) com.wiris.util.css = {}
com.wiris.util.css.CSSUtils = $hxClasses["com.wiris.util.css.CSSUtils"] = function() { }
com.wiris.util.css.CSSUtils.__name__ = ["com","wiris","util","css","CSSUtils"];
com.wiris.util.css.CSSUtils.conversion = null;
com.wiris.util.css.CSSUtils.initConversion = function() {
	com.wiris.util.css.CSSUtils.conversion = new Hash();
	com.wiris.util.css.CSSUtils.conversion.set("black","#000000");
	com.wiris.util.css.CSSUtils.conversion.set("silver","#c0c0c0");
	com.wiris.util.css.CSSUtils.conversion.set("gray","#808080");
	com.wiris.util.css.CSSUtils.conversion.set("white","#ffffff");
	com.wiris.util.css.CSSUtils.conversion.set("maroon","#800000");
	com.wiris.util.css.CSSUtils.conversion.set("red","#ff0000");
	com.wiris.util.css.CSSUtils.conversion.set("purple","#800080");
	com.wiris.util.css.CSSUtils.conversion.set("fuchsia","#ff00ff");
	com.wiris.util.css.CSSUtils.conversion.set("green","#008000");
	com.wiris.util.css.CSSUtils.conversion.set("lime","#00ff00");
	com.wiris.util.css.CSSUtils.conversion.set("olive","#808000");
	com.wiris.util.css.CSSUtils.conversion.set("yellow","#ffff00");
	com.wiris.util.css.CSSUtils.conversion.set("navy","#000080");
	com.wiris.util.css.CSSUtils.conversion.set("blue","#0000ff");
	com.wiris.util.css.CSSUtils.conversion.set("teal","#008080");
	com.wiris.util.css.CSSUtils.conversion.set("aqua","#00ffff");
	com.wiris.util.css.CSSUtils.conversion.set("orange","#ffa500");
	com.wiris.util.css.CSSUtils.conversion.set("aliceblue","#f0f8ff");
	com.wiris.util.css.CSSUtils.conversion.set("antiquewhite","#faebd7");
	com.wiris.util.css.CSSUtils.conversion.set("aquamarine","#7fffd4");
	com.wiris.util.css.CSSUtils.conversion.set("azure","#f0ffff");
	com.wiris.util.css.CSSUtils.conversion.set("beige","#f5f5dc");
	com.wiris.util.css.CSSUtils.conversion.set("bisque","#ffe4c4");
	com.wiris.util.css.CSSUtils.conversion.set("blanchedalmond","#ffe4c4");
	com.wiris.util.css.CSSUtils.conversion.set("blueviolet","#8a2be2");
	com.wiris.util.css.CSSUtils.conversion.set("brown","#a52a2a");
	com.wiris.util.css.CSSUtils.conversion.set("burlywood","#deb887");
	com.wiris.util.css.CSSUtils.conversion.set("cadetblue","#5f9ea0");
	com.wiris.util.css.CSSUtils.conversion.set("chartreuse","#7fff00");
	com.wiris.util.css.CSSUtils.conversion.set("chocolate","#d2691e");
	com.wiris.util.css.CSSUtils.conversion.set("coral","#ff7f50");
	com.wiris.util.css.CSSUtils.conversion.set("cornflowerblue","#6495ed");
	com.wiris.util.css.CSSUtils.conversion.set("cornsilk","#fff8dc");
	com.wiris.util.css.CSSUtils.conversion.set("crimson","#dc143c");
	com.wiris.util.css.CSSUtils.conversion.set("darkblue","#00008b");
	com.wiris.util.css.CSSUtils.conversion.set("darkcyan","#008b8b");
	com.wiris.util.css.CSSUtils.conversion.set("darkgoldenrod","#b8860b");
	com.wiris.util.css.CSSUtils.conversion.set("darkgray","#a9a9a9");
	com.wiris.util.css.CSSUtils.conversion.set("darkgreen","#006400");
	com.wiris.util.css.CSSUtils.conversion.set("darkgrey","#a9a9a9");
	com.wiris.util.css.CSSUtils.conversion.set("darkkhaki","#bdb76b");
	com.wiris.util.css.CSSUtils.conversion.set("darkmagenta","#8b008b");
	com.wiris.util.css.CSSUtils.conversion.set("darkolivegreen","#556b2f");
	com.wiris.util.css.CSSUtils.conversion.set("darkorange","#ff8c00");
	com.wiris.util.css.CSSUtils.conversion.set("darkorchid","#9932cc");
	com.wiris.util.css.CSSUtils.conversion.set("darkred","#8b0000");
	com.wiris.util.css.CSSUtils.conversion.set("darksalmon","#e9967a");
	com.wiris.util.css.CSSUtils.conversion.set("darkseagreen","#8fbc8f");
	com.wiris.util.css.CSSUtils.conversion.set("darkslateblue","#483d8b");
	com.wiris.util.css.CSSUtils.conversion.set("darkslategray","#2f4f4f");
	com.wiris.util.css.CSSUtils.conversion.set("darkslategrey","#2f4f4f");
	com.wiris.util.css.CSSUtils.conversion.set("darkturquoise","#00ced1");
	com.wiris.util.css.CSSUtils.conversion.set("darkviolet","#9400d3");
	com.wiris.util.css.CSSUtils.conversion.set("deeppink","#ff1493");
	com.wiris.util.css.CSSUtils.conversion.set("deepskyblue","#00bfff");
	com.wiris.util.css.CSSUtils.conversion.set("dimgray","#696969");
	com.wiris.util.css.CSSUtils.conversion.set("dimgrey","#696969");
	com.wiris.util.css.CSSUtils.conversion.set("dodgerblue","#1e90ff");
	com.wiris.util.css.CSSUtils.conversion.set("firebrick","#b22222");
	com.wiris.util.css.CSSUtils.conversion.set("floralwhite","#fffaf0");
	com.wiris.util.css.CSSUtils.conversion.set("forestgreen","#228b22");
	com.wiris.util.css.CSSUtils.conversion.set("gainsboro","#dcdcdc");
	com.wiris.util.css.CSSUtils.conversion.set("ghostwhite","#f8f8ff");
	com.wiris.util.css.CSSUtils.conversion.set("gold","#ffd700");
	com.wiris.util.css.CSSUtils.conversion.set("goldenrod","#daa520");
	com.wiris.util.css.CSSUtils.conversion.set("greenyellow","#adff2f");
	com.wiris.util.css.CSSUtils.conversion.set("grey","#808080");
	com.wiris.util.css.CSSUtils.conversion.set("honeydew","#f0fff0");
	com.wiris.util.css.CSSUtils.conversion.set("hotpink","#ff69b4");
	com.wiris.util.css.CSSUtils.conversion.set("indianred","#cd5c5c");
	com.wiris.util.css.CSSUtils.conversion.set("indigo","#4b0082");
	com.wiris.util.css.CSSUtils.conversion.set("ivory","#fffff0");
	com.wiris.util.css.CSSUtils.conversion.set("khaki","#f0e68c");
	com.wiris.util.css.CSSUtils.conversion.set("lavender","#e6e6fa");
	com.wiris.util.css.CSSUtils.conversion.set("lavenderblush","#fff0f5");
	com.wiris.util.css.CSSUtils.conversion.set("lawngreen","#7cfc00");
	com.wiris.util.css.CSSUtils.conversion.set("lemonchiffon","#fffacd");
	com.wiris.util.css.CSSUtils.conversion.set("lightblue","#add8e6");
	com.wiris.util.css.CSSUtils.conversion.set("lightcoral","#f08080");
	com.wiris.util.css.CSSUtils.conversion.set("lightcyan","#e0ffff");
	com.wiris.util.css.CSSUtils.conversion.set("lightgoldenrodyellow","#fafad2");
	com.wiris.util.css.CSSUtils.conversion.set("lightgray","#d3d3d3");
	com.wiris.util.css.CSSUtils.conversion.set("lightgreen","#90ee90");
	com.wiris.util.css.CSSUtils.conversion.set("lightgrey","#d3d3d3");
	com.wiris.util.css.CSSUtils.conversion.set("lightpink","#ffb6c1");
	com.wiris.util.css.CSSUtils.conversion.set("lightsalmon","#ffa07a");
	com.wiris.util.css.CSSUtils.conversion.set("lightseagreen","#20b2aa");
	com.wiris.util.css.CSSUtils.conversion.set("lightskyblue","#87cefa");
	com.wiris.util.css.CSSUtils.conversion.set("lightslategray","#778899");
	com.wiris.util.css.CSSUtils.conversion.set("lightslategrey","#778899");
	com.wiris.util.css.CSSUtils.conversion.set("lightsteelblue","#b0c4de");
	com.wiris.util.css.CSSUtils.conversion.set("lightyellow","#ffffe0");
	com.wiris.util.css.CSSUtils.conversion.set("limegreen","#32cd32");
	com.wiris.util.css.CSSUtils.conversion.set("linen","#faf0e6");
	com.wiris.util.css.CSSUtils.conversion.set("mediumaquamarine","#66cdaa");
	com.wiris.util.css.CSSUtils.conversion.set("mediumblue","#0000cd");
	com.wiris.util.css.CSSUtils.conversion.set("mediumorchid","#ba55d3");
	com.wiris.util.css.CSSUtils.conversion.set("mediumpurple","#9370db");
	com.wiris.util.css.CSSUtils.conversion.set("mediumseagreen","#3cb371");
	com.wiris.util.css.CSSUtils.conversion.set("mediumslateblue","#7b68ee");
	com.wiris.util.css.CSSUtils.conversion.set("mediumspringgreen","#00fa9a");
	com.wiris.util.css.CSSUtils.conversion.set("mediumturquoise","#48d1cc");
	com.wiris.util.css.CSSUtils.conversion.set("mediumvioletred","#c71585");
	com.wiris.util.css.CSSUtils.conversion.set("midnightblue","#191970");
	com.wiris.util.css.CSSUtils.conversion.set("mintcream","#f5fffa");
	com.wiris.util.css.CSSUtils.conversion.set("mistyrose","#ffe4e1");
	com.wiris.util.css.CSSUtils.conversion.set("moccasin","#ffe4b5");
	com.wiris.util.css.CSSUtils.conversion.set("navajowhite","#ffdead");
	com.wiris.util.css.CSSUtils.conversion.set("oldlace","#fdf5e6");
	com.wiris.util.css.CSSUtils.conversion.set("olivedrab","#6b8e23");
	com.wiris.util.css.CSSUtils.conversion.set("orangered","#ff4500");
	com.wiris.util.css.CSSUtils.conversion.set("orchid","#da70d6");
	com.wiris.util.css.CSSUtils.conversion.set("palegoldenrod","#eee8aa");
	com.wiris.util.css.CSSUtils.conversion.set("palegreen","#98fb98");
	com.wiris.util.css.CSSUtils.conversion.set("paleturquoise","#afeeee");
	com.wiris.util.css.CSSUtils.conversion.set("palevioletred","#db7093");
	com.wiris.util.css.CSSUtils.conversion.set("papayawhip","#ffefd5");
	com.wiris.util.css.CSSUtils.conversion.set("peachpuff","#ffdab9");
	com.wiris.util.css.CSSUtils.conversion.set("peru","#cd853f");
	com.wiris.util.css.CSSUtils.conversion.set("pink","#ffc0cb");
	com.wiris.util.css.CSSUtils.conversion.set("plum","#dda0dd");
	com.wiris.util.css.CSSUtils.conversion.set("powderblue","#b0e0e6");
	com.wiris.util.css.CSSUtils.conversion.set("rosybrown","#bc8f8f");
	com.wiris.util.css.CSSUtils.conversion.set("royalblue","#4169e1");
	com.wiris.util.css.CSSUtils.conversion.set("saddlebrown","#8b4513");
	com.wiris.util.css.CSSUtils.conversion.set("salmon","#fa8072");
	com.wiris.util.css.CSSUtils.conversion.set("sandybrown","#f4a460");
	com.wiris.util.css.CSSUtils.conversion.set("seagreen","#2e8b57");
	com.wiris.util.css.CSSUtils.conversion.set("seashell","#fff5ee");
	com.wiris.util.css.CSSUtils.conversion.set("sienna","#a0522d");
	com.wiris.util.css.CSSUtils.conversion.set("skyblue","#87ceeb");
	com.wiris.util.css.CSSUtils.conversion.set("slateblue","#6a5acd");
	com.wiris.util.css.CSSUtils.conversion.set("slategray","#708090");
	com.wiris.util.css.CSSUtils.conversion.set("slategrey","#708090");
	com.wiris.util.css.CSSUtils.conversion.set("snow","#fffafa");
	com.wiris.util.css.CSSUtils.conversion.set("springgreen","#00ff7f");
	com.wiris.util.css.CSSUtils.conversion.set("steelblue","#4682b4");
	com.wiris.util.css.CSSUtils.conversion.set("tan","#d2b48c");
	com.wiris.util.css.CSSUtils.conversion.set("thistle","#d8bfd8");
	com.wiris.util.css.CSSUtils.conversion.set("tomato","#ff6347");
	com.wiris.util.css.CSSUtils.conversion.set("turquoise","#40e0d0");
	com.wiris.util.css.CSSUtils.conversion.set("violet","#ee82ee");
	com.wiris.util.css.CSSUtils.conversion.set("wheat","#f5deb3");
	com.wiris.util.css.CSSUtils.conversion.set("whitesmoke","#f5f5f5");
	com.wiris.util.css.CSSUtils.conversion.set("yellowgreen","#9acd32");
	com.wiris.util.css.CSSUtils.conversion.set("rebeccapurple","#663399");
}
com.wiris.util.css.CSSUtils.colorToInt = function(color) {
	if(color == null) return 0;
	color = StringTools.trim(color);
	var colorLength = color.length;
	if(colorLength == 0) return 0;
	if(color.charAt(0) != "#") {
		color = com.wiris.util.css.CSSUtils.nameToColor(color);
		colorLength = color.length;
	}
	if(colorLength == 4) color = "" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3); else if(colorLength == 7) color = HxOverrides.substr(color,1,6); else return 0;
	return com.wiris.common.WInteger.parseHex(color);
}
com.wiris.util.css.CSSUtils.intToColor = function(color) {
	return "#" + com.wiris.common.WInteger.toHex(color,6);
}
com.wiris.util.css.CSSUtils.pixelsToInt = function(pixels) {
	if(pixels == null) return 0;
	pixels = StringTools.trim(pixels);
	if(StringTools.endsWith(pixels,"px")) return Std.parseInt(HxOverrides.substr(pixels,0,pixels.length - 2));
	if(StringTools.endsWith(pixels,"pt")) return Math.floor(com.wiris.util.css.CSSUtils.PT_TO_PX * Std.parseInt(HxOverrides.substr(pixels,0,pixels.length - 2)));
	var parsedPixels = Std.parseInt(pixels);
	if(pixels == "" + parsedPixels) return parsedPixels;
	return 0;
}
com.wiris.util.css.CSSUtils.percentageToFloat = function(percentage) {
	if(percentage == null) return 0;
	percentage = StringTools.trim(percentage);
	if(StringTools.endsWith(percentage,"%")) return Std.parseFloat(HxOverrides.substr(percentage,0,percentage.length - 1));
	return 0;
}
com.wiris.util.css.CSSUtils.hashToCss = function(p0) {
	if(p0 == null) return "";
	var sb = new StringBuf();
	var keys = p0.keys();
	var skeys = new Array();
	while(keys.hasNext()) skeys.push(keys.next());
	com.wiris.util.css.CSSUtils.sort(skeys);
	var i;
	var _g1 = 0, _g = skeys.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		var key = skeys[i1];
		if(i1 > 0) sb.b += Std.string(";");
		sb.b += Std.string(com.wiris.util.css.CSSUtils.camelCaseToHyphenDelimited(key));
		sb.b += Std.string(":");
		var value = p0.get(key);
		if(key == "fontFamily" && value.indexOf(" ") != -1) value = "'" + value + "'";
		sb.b += Std.string(value);
	}
	return sb.b;
}
com.wiris.util.css.CSSUtils.cssToHash = function(p0) {
	var ss = p0.split(";");
	var h = new Hash();
	var i;
	var _g1 = 0, _g = ss.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		var kv = ss[i1].split(":");
		if(kv.length >= 2) {
			var input = kv[1];
			kv[0] = com.wiris.util.css.CSSUtils.hyphenDelimitedToCamelCase(StringTools.trim(kv[0]));
			kv[1] = StringTools.trim(kv[1]);
			if(kv[0] == "fontFamily" && com.wiris.util.css.CSSUtils.isMultipleWordValue(kv[1])) kv[1] = HxOverrides.substr(kv[1],1,kv[1].length - 2);
			h.set(kv[0],kv[1]);
		}
	}
	return h;
}
com.wiris.util.css.CSSUtils.isMultipleWordValue = function(value) {
	if(StringTools.startsWith(value,"\"") && StringTools.endsWith(value,"\"")) return true;
	return StringTools.startsWith(value,"'") && StringTools.endsWith(value,"'");
}
com.wiris.util.css.CSSUtils.camelCaseToHyphenDelimited = function(camel) {
	var upperACode = HxOverrides.cca("A",0);
	var upperZCode = HxOverrides.cca("Z",0);
	var i = 0;
	var hyphen = "";
	while(i < camel.length) {
		var code = HxOverrides.cca(camel,i);
		var character = HxOverrides.substr(camel,i,1);
		if(upperACode <= code && code <= upperZCode) hyphen += "-" + character.toLowerCase(); else hyphen += character;
		++i;
	}
	return hyphen;
}
com.wiris.util.css.CSSUtils.hyphenDelimitedToCamelCase = function(hyphen) {
	var i = HxOverrides.iter(hyphen.split("-"));
	if(!i.hasNext()) return "";
	var camel = i.next();
	while(i.hasNext()) {
		var word = i.next();
		if(word.length > 0) camel += HxOverrides.substr(word,0,1).toUpperCase() + HxOverrides.substr(word,1,null).toLowerCase();
	}
	return camel;
}
com.wiris.util.css.CSSUtils.sort = function(a) {
	var i;
	var j;
	var n = a.length;
	var _g = 0;
	while(_g < n) {
		var i1 = _g++;
		var _g1 = i1 + 1;
		while(_g1 < n) {
			var j1 = _g1++;
			var s1 = a[i1];
			var s2 = a[j1];
			if(com.wiris.system.StringEx.compareTo(s1,s2) > 0) {
				a[i1] = s2;
				a[j1] = s1;
			}
		}
	}
}
com.wiris.util.css.CSSUtils.colorToName = function(color) {
	if(com.wiris.util.css.CSSUtils.conversion == null) com.wiris.util.css.CSSUtils.initConversion();
	var i = com.wiris.util.css.CSSUtils.conversion.keys();
	while(i.hasNext()) {
		var colorName = i.next();
		if(com.wiris.util.css.CSSUtils.conversion.get(colorName) == color) return colorName;
	}
	return color;
}
com.wiris.util.css.CSSUtils.nameToColor = function(name) {
	if(com.wiris.util.css.CSSUtils.conversion == null) com.wiris.util.css.CSSUtils.initConversion();
	if(com.wiris.util.css.CSSUtils.conversion.exists(name)) return com.wiris.util.css.CSSUtils.conversion.get(name);
	return "#000";
}
com.wiris.util.graphics.BoxStyleInterface = $hxClasses["com.wiris.util.graphics.BoxStyleInterface"] = function() { }
com.wiris.util.graphics.BoxStyleInterface.__name__ = ["com","wiris","util","graphics","BoxStyleInterface"];
com.wiris.util.graphics.BoxStyleInterface.prototype = {
	getMathVariantFont: null
	,hasClassType: null
	,getClassType: null
	,getAlign: null
	,getMaxWidth: null
	,getWidth: null
	,getFlagsMask: null
	,getFlags: null
	,getScriptLevel: null
	,getFontSize: null
	,getFontFamily: null
	,getZoom: null
	,getP: null
	,getLineWidth: null
	,getBackgroundColor: null
	,getColor: null
	,isFlag: null
	,isFlagMask: null
	,__class__: com.wiris.util.graphics.BoxStyleInterface
}
com.wiris.util.graphics.BoxStyle = $hxClasses["com.wiris.util.graphics.BoxStyle"] = function() {
	this.p = 0;
	this.scriptLevel = 0;
	this.color = 0;
	this.backgroundColor = 16777215;
	this.fontFamily = "inherit";
	this.flags = 0;
	this.flagsMask = 0;
	this.fontSize = 0;
	this.lineWidth = 0;
	this.zoom = 1.0;
	this.align = com.wiris.util.graphics.BoxStyle.AUTO_ALIGN;
	this.classType = "";
	this.mathvariantFont = "";
};
com.wiris.util.graphics.BoxStyle.__name__ = ["com","wiris","util","graphics","BoxStyle"];
com.wiris.util.graphics.BoxStyle.__interfaces__ = [com.wiris.util.graphics.BoxStyleInterface];
com.wiris.util.graphics.BoxStyle.newFontSizeP = function(p) {
	var s = new com.wiris.util.graphics.BoxStyle();
	s.setP(p);
	return s;
}
com.wiris.util.graphics.BoxStyle.newBoxStyle = function(b0) {
	var b = new com.wiris.util.graphics.BoxStyle();
	b.copyStyles(b0);
	return b;
}
com.wiris.util.graphics.BoxStyle.join = function(a1,a2) {
	var a = com.wiris.util.graphics.BoxStyle.newBoxStyle(a1);
	a.joinMe(a2);
	return a;
}
com.wiris.util.graphics.BoxStyle.remove = function(a1,a2) {
	var a = com.wiris.util.graphics.BoxStyle.newBoxStyle(a1);
	a.restrict(a2,true);
	return a;
}
com.wiris.util.graphics.BoxStyle.removeEqual = function(a1,a2) {
	var a = com.wiris.util.graphics.BoxStyle.newBoxStyle(a1);
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.COLOR_FLAG) && a1.getColor() == a2.getColor()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.COLOR_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG) && a1.getBackgroundColor() == a2.getBackgroundColor()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG) && a1.getScriptLevel() == a2.getScriptLevel()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG) && a1.getP() == a2.getP()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.ZOOM_FLAG) && a1.getZoom() == a2.getZoom()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.ZOOM_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.WIDTH_FLAG) && com.wiris.util.graphics.BoxStyle.equalStrings(a1.getWidth(),a2.getWidth())) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.WIDTH_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG) && a1.getLineWidth() == a2.getLineWidth()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG) && a1.getFontSize() == a2.getFontSize()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG) && com.wiris.util.graphics.BoxStyle.equalStrings(a1.getMaxWidth(),a2.getMaxWidth())) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.ALIGN_FLAG) && a1.getAlign() == a2.getAlign()) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.ALIGN_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG) && com.wiris.util.graphics.BoxStyle.equalStrings(a1.getFontFamily(),a2.getFontFamily())) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG) && com.wiris.util.graphics.BoxStyle.equalStrings(a1.getMathVariantFont(),a2.getMathVariantFont())) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG;
	if(a2.isFlagMask(com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG) && com.wiris.util.graphics.BoxStyle.equalStrings(a1.getClassType(),a2.getClassType())) a.flagsMask &= ~com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG;
	a.flagsMask &= ~(a2.getFlagsMask() & ~(a1.getFlags() ^ a2.getFlags()) & (com.wiris.util.graphics.BoxStyle.ITALIC_FLAG | com.wiris.util.graphics.BoxStyle.BOLD_FLAG | com.wiris.util.graphics.BoxStyle.MTEXT_FLAG | com.wiris.util.graphics.BoxStyle.INVISIBLE_FLAG | com.wiris.util.graphics.BoxStyle.RTL_FLAG | com.wiris.util.graphics.BoxStyle.FORCED_LIGATURE_FLAG | com.wiris.util.graphics.BoxStyle.POSITIONABLE_FLAG));
	a.normalizeMask();
	return a;
}
com.wiris.util.graphics.BoxStyle.copyFlags = function(flagsDest,flagsSrc,flagsMask) {
	flagsDest &= ~flagsMask;
	flagsDest |= flagsSrc;
	return flagsDest;
}
com.wiris.util.graphics.BoxStyle.getParams = function(style) {
	var h = new Hash();
	if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) h.set("fontFamily",style.getFontFamily());
	if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.WIDTH_FLAG)) h.set("width",style.getWidth());
	if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG)) h.set("maxWidth",style.getMaxWidth());
	return h;
}
com.wiris.util.graphics.BoxStyle.equalStrings = function(s1,s2) {
	return s1 == s2 || s1 != null && s1 == s2;
}
com.wiris.util.graphics.BoxStyle.alignToString = function(align) {
	if(align == com.wiris.util.graphics.BoxStyle.RIGHT_ALIGN) return "right";
	if(align == com.wiris.util.graphics.BoxStyle.LEFT_ALIGN) return "left";
	if(align == com.wiris.util.graphics.BoxStyle.CENTER_ALIGN) return "center";
	if(align == com.wiris.util.graphics.BoxStyle.DECIMAL_ALIGN) return "wrs_decimal";
	if(align == com.wiris.util.graphics.BoxStyle.RELATION_ALIGN) return "wrs_relation";
	return "auto";
}
com.wiris.util.graphics.BoxStyle.stringToAlign = function(s) {
	if(s == "right") return com.wiris.util.graphics.BoxStyle.RIGHT_ALIGN;
	if(s == "left") return com.wiris.util.graphics.BoxStyle.LEFT_ALIGN;
	if(s == "center") return com.wiris.util.graphics.BoxStyle.CENTER_ALIGN;
	if(s == "wrs_decimal") return com.wiris.util.graphics.BoxStyle.DECIMAL_ALIGN;
	if(s == "wrs_relation") return com.wiris.util.graphics.BoxStyle.RELATION_ALIGN;
	return com.wiris.util.graphics.BoxStyle.AUTO_ALIGN;
}
com.wiris.util.graphics.BoxStyle.prototype = {
	hasClassType: function(c) {
		var currentClass = this.getClassType();
		if(currentClass == null) return false;
		var i = HxOverrides.iter(currentClass.split(" "));
		while(i.hasNext()) if(i.next() == c) return true;
		return false;
	}
	,setParams: function(parameters) {
		var i = parameters.keys();
		while(i.hasNext()) {
			var key = i.next();
			var value = parameters.get(key);
			this.setParam(key,value);
		}
	}
	,setParam: function(key,value) {
		key = key.toLowerCase();
		if("color" == key) this.setColor(com.wiris.util.css.CSSUtils.colorToInt(value)); else if("fontfamily" == key) this.setFontFamily(value); else if("fontsize" == key) {
			if(value.indexOf("%") >= 0) {
				this.setP(com.wiris.util.css.CSSUtils.percentageToFloat(value));
				this.removeFromFlag(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG);
			} else {
				var pixels = com.wiris.util.css.CSSUtils.pixelsToInt(value);
				if(pixels > 0) this.setFontSize(pixels);
			}
		} else if("zoom" == key) this.setZoom(Std.parseFloat(value)); else if("width" == key) this.setWidth(value); else if("maxwidth" == key) this.setMaxWidth(value); else if("fontstyle" == key) {
			if(value == "italic") {
				this.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,true);
				this.setFlag(com.wiris.util.graphics.BoxStyle.REMOVE_ITALIC_FLAG,false);
			} else if(value == "initial") {
				this.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,false);
				this.setFlag(com.wiris.util.graphics.BoxStyle.REMOVE_ITALIC_FLAG,false);
				this.removeFromFlag(com.wiris.util.graphics.BoxStyle.REMOVE_ITALIC_FLAG);
			} else {
				this.setFlag(com.wiris.util.graphics.BoxStyle.ITALIC_FLAG,false);
				this.setFlag(com.wiris.util.graphics.BoxStyle.REMOVE_ITALIC_FLAG,true);
			}
		} else if("fontweight" == key) this.setFlag(com.wiris.util.graphics.BoxStyle.BOLD_FLAG,value == "bold"); else if("classtype" == key) this.setClassType(value); else if("textalign" == key) this.setAlign(com.wiris.util.graphics.BoxStyle.stringToAlign(value));
	}
	,getFlagsMask: function() {
		return this.flagsMask;
	}
	,getFlags: function() {
		return this.flags;
	}
	,getAlign: function() {
		return this.align;
	}
	,getMaxWidth: function() {
		return this.maxWidth;
	}
	,setAlign: function(align) {
		this.align = align;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.ALIGN_FLAG;
	}
	,setMaxWidth: function(maxWidth) {
		this.maxWidth = maxWidth;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG;
	}
	,setWidth: function(width) {
		this.width = width;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.WIDTH_FLAG;
	}
	,getWidth: function() {
		return this.width;
	}
	,setFontSize: function(size) {
		this.fontSize = size;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG;
		this.setFlag(com.wiris.util.graphics.BoxStyle.IGNORE_PROPORTIONAL_SIZE_FLAG,true);
	}
	,getFontSize: function() {
		return this.fontSize;
	}
	,setMathVariantFont: function(mathvariantFont) {
		this.mathvariantFont = mathvariantFont;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG;
	}
	,getMathVariantFont: function() {
		return this.mathvariantFont;
	}
	,setFontFamily: function(fontFamily) {
		this.fontFamily = fontFamily;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG;
	}
	,getFontFamily: function() {
		return this.fontFamily;
	}
	,isFlag: function(flag) {
		return (this.flags & flag & this.flagsMask) != 0;
	}
	,setFlag: function(flag,state) {
		if(state) this.flags |= flag; else this.flags &= ~flag;
		this.flagsMask |= flag;
	}
	,setClassType: function(classType) {
		this.classType = classType;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG;
	}
	,getClassType: function() {
		return this.classType;
	}
	,setBackgroundColor: function(backgroundColor) {
		this.backgroundColor = backgroundColor;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG;
	}
	,setColor: function(color) {
		this.color = color;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.COLOR_FLAG;
	}
	,getBackgroundColor: function() {
		return this.backgroundColor;
	}
	,getColor: function() {
		return this.color;
	}
	,setScriptLevel: function(scriptLevel) {
		this.scriptLevel = scriptLevel;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG;
	}
	,getScriptLevel: function() {
		return this.scriptLevel;
	}
	,setLineWidth: function(lw) {
		this.lineWidth = lw;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG;
	}
	,getLineWidth: function() {
		return this.lineWidth;
	}
	,setZoom: function(zoom) {
		this.zoom = zoom;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.ZOOM_FLAG;
	}
	,getZoom: function() {
		return this.zoom;
	}
	,setP: function(p) {
		this.p = p;
		this.flagsMask |= com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG;
	}
	,getP: function() {
		return this.p;
	}
	,isFlagMask: function(flag) {
		return (this.flagsMask & flag) != 0;
	}
	,removeFromFlag: function(flag) {
		this.flagsMask &= ~flag;
		this.normalizeMask();
	}
	,normalizeMask: function() {
		this.flags = this.flags & this.flagsMask;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.COLOR_FLAG)) this.color = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG)) this.backgroundColor = 16777215;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG)) this.scriptLevel = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG)) this.p = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.ZOOM_FLAG)) this.zoom = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.WIDTH_FLAG)) this.width = null;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG)) this.lineWidth = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG)) this.fontSize = 0;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG)) this.maxWidth = null;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.ALIGN_FLAG)) this.align = com.wiris.util.graphics.BoxStyle.AUTO_ALIGN;
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) this.fontFamily = "inherit";
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG)) this.mathvariantFont = "";
		if(!this.isFlagMask(com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG)) this.classType = "";
	}
	,restrictMask: function(mask) {
		this.flagsMask &= mask;
		this.normalizeMask();
	}
	,restrict: function(a2,inverse) {
		if(inverse) this.flagsMask &= ~a2.getFlagsMask(); else this.flagsMask &= a2.getFlagsMask();
		this.normalizeMask();
	}
	,joinMe: function(style) {
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG)) this.mathvariantFont = style.getMathVariantFont();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.COLOR_FLAG)) this.color = style.getColor();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG)) this.backgroundColor = style.getBackgroundColor();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG)) this.scriptLevel = style.getScriptLevel();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG)) this.p = style.getP();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.ZOOM_FLAG)) this.zoom = style.getZoom();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.WIDTH_FLAG)) this.width = style.getWidth();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG)) this.lineWidth = style.getLineWidth();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG)) this.fontSize = style.getFontSize();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG)) this.fontFamily = style.getFontFamily();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG)) this.maxWidth = style.getMaxWidth();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.ALIGN_FLAG)) this.align = style.getAlign();
		if(style.isFlagMask(com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG)) this.classType = style.getClassType();
		this.flagsMask |= style.getFlagsMask();
		this.flags = com.wiris.util.graphics.BoxStyle.copyFlags(this.flags,style.getFlags(),style.getFlagsMask());
		var n = (style.getFlagsMask() & style.getFlags()) >> com.wiris.util.graphics.BoxStyle.BIT_REMOVE_FLAG;
		if(n != 0) {
			this.flagsMask &= ~n;
			this.flags &= ~n;
			this.flagsMask &= com.wiris.util.graphics.BoxStyle.FIRST_REMOVE_FLAG - 1;
		}
	}
	,cloneStyle: function() {
		return com.wiris.util.graphics.BoxStyle.newBoxStyle(this);
	}
	,equalStyleIgnoringFlags: function(style,ignoredFlags,ignoreFlagMasks) {
		if(!ignoreFlagMasks && style.flagsMask != this.flagsMask) return false;
		var flagXor = style.flags ^ this.flags;
		return style.p == this.p && style.scriptLevel == this.scriptLevel && com.wiris.util.graphics.BoxStyle.equalStrings(style.fontFamily,this.fontFamily) && com.wiris.util.graphics.BoxStyle.equalStrings(style.mathvariantFont,this.mathvariantFont) && style.fontSize == this.fontSize && style.color == this.color && style.backgroundColor == this.backgroundColor && (flagXor | ignoredFlags) == ignoredFlags && style.lineWidth == this.lineWidth && style.zoom == this.zoom && com.wiris.util.graphics.BoxStyle.equalStrings(style.width,this.width) && com.wiris.util.graphics.BoxStyle.equalStrings(style.maxWidth,this.maxWidth) && style.align == this.align && com.wiris.util.graphics.BoxStyle.equalStrings(style.classType,this.classType);
	}
	,equivalentStyle: function(style) {
		return this.equalStyleIgnoringFlags(style,0,true);
	}
	,equalStyle: function(style) {
		return this.equalStyleIgnoringFlags(style,0,false);
	}
	,copyStyles: function(b0) {
		this.p = b0.getP();
		this.scriptLevel = b0.getScriptLevel();
		this.fontFamily = b0.getFontFamily();
		this.fontSize = b0.getFontSize();
		this.color = b0.getColor();
		this.backgroundColor = b0.getBackgroundColor();
		this.flags = b0.getFlags();
		this.flagsMask = b0.getFlagsMask();
		this.lineWidth = b0.getLineWidth();
		this.zoom = b0.getZoom();
		this.width = b0.getWidth();
		this.maxWidth = b0.getMaxWidth();
		this.align = b0.getAlign();
		this.classType = b0.getClassType();
		this.mathvariantFont = b0.getMathVariantFont();
	}
	,classType: null
	,align: null
	,maxWidth: null
	,width: null
	,zoom: null
	,flagsMask: null
	,flags: null
	,mathvariantFont: null
	,fontFamily: null
	,fontSize: null
	,lineWidth: null
	,backgroundColor: null
	,color: null
	,scriptLevel: null
	,p: null
	,__class__: com.wiris.util.graphics.BoxStyle
}
if(!com.wiris.util.xml) com.wiris.util.xml = {}
com.wiris.util.xml.WCharacterBase = $hxClasses["com.wiris.util.xml.WCharacterBase"] = function() { }
com.wiris.util.xml.WCharacterBase.__name__ = ["com","wiris","util","xml","WCharacterBase"];
com.wiris.util.xml.WCharacterBase.isDigit = function(c) {
	if(48 <= c && c <= 57) return true;
	if(1632 <= c && c <= 1641) return true;
	if(1776 <= c && c <= 1785) return true;
	if(2790 <= c && c <= 2799) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isIdentifier = function(c) {
	return com.wiris.util.xml.WCharacterBase.isLetter(c) || com.wiris.util.xml.WCharacterBase.isCombiningCharacter(c) || c == 95;
}
com.wiris.util.xml.WCharacterBase.isLarge = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.largeOps,c);
}
com.wiris.util.xml.WCharacterBase.isVeryLarge = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.veryLargeOps,c);
}
com.wiris.util.xml.WCharacterBase.isBinaryOp = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.binaryOps,c);
}
com.wiris.util.xml.WCharacterBase.isRelation = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.relations,c);
}
com.wiris.util.xml.WCharacterBase.binarySearch = function(v,c) {
	var min = 0;
	var max = v.length - 1;
	do {
		var mid = Math.floor((min + max) / 2);
		var cc = v[mid];
		if(c == cc) return true; else if(c < cc) max = mid - 1; else min = mid + 1;
	} while(min <= max);
	return false;
}
com.wiris.util.xml.WCharacterBase.getCategoriesUnicode = function() {
	var categoriesUnicode = new Hash();
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.SYMBOL_CATEGORY,"SymbolUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.PUNCTUATION_CATEGORY,"PunctuationUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.LETTER_CATEGORY,"LetterUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.MARK_CATEGORY,"MarkUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.NUMBER_CATEGORY,"NumberUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.PHONETICAL_CATEGORY,"PhoneticalUnicodeCategory");
	categoriesUnicode.set(com.wiris.util.xml.WCharacterBase.OTHER_CATEGORY,"OtherUnicodeCategory");
	return categoriesUnicode;
}
com.wiris.util.xml.WCharacterBase.getUnicodeCategoryList = function(category) {
	var indexStart = com.wiris.util.xml.WCharacterBase.UNICODES_WITH_CATEGORIES.indexOf("@" + category + ":");
	var unicodes = HxOverrides.substr(com.wiris.util.xml.WCharacterBase.UNICODES_WITH_CATEGORIES,indexStart + 3,null);
	var indexEnd = unicodes.indexOf("@");
	unicodes = HxOverrides.substr(unicodes,0,indexEnd);
	return com.wiris.util.xml.WCharacterBase.getUnicodesRangedStringList(unicodes);
}
com.wiris.util.xml.WCharacterBase.getUnicodesRangedStringList = function(unicodesRangedList) {
	var inputList = unicodesRangedList.split(",");
	var unicodeList = new Array();
	var i = 0;
	while(i < inputList.length) {
		var actual_range = inputList[i];
		actual_range = StringTools.replace(actual_range," ","");
		if(actual_range.indexOf("-") != -1) {
			var firstRangeValueHex = com.wiris.util.xml.WCharacterBase.hexStringToUnicode(actual_range.split("-")[0]);
			var lastRangeValueHex = com.wiris.util.xml.WCharacterBase.hexStringToUnicode(actual_range.split("-")[1]);
			var actualValue = firstRangeValueHex;
			while(actualValue <= lastRangeValueHex) {
				unicodeList.push(com.wiris.system.Utf8.uchr(actualValue));
				actualValue++;
			}
		} else {
			var actualValue = com.wiris.util.xml.WCharacterBase.hexStringToUnicode(actual_range);
			unicodeList.push(com.wiris.system.Utf8.uchr(actualValue));
		}
		i++;
	}
	return unicodeList;
}
com.wiris.util.xml.WCharacterBase.hexStringToUnicode = function(unicode) {
	return Std.parseInt("0x" + unicode);
}
com.wiris.util.xml.WCharacterBase.getMirror = function(str) {
	var mirroredStr = "";
	var i = 0;
	while(i < str.length) {
		var c = HxOverrides.cca(str,i);
		var j = 0;
		while(j < com.wiris.util.xml.WCharacterBase.mirrorDictionary.length) {
			if(c == com.wiris.util.xml.WCharacterBase.mirrorDictionary[j]) {
				c = com.wiris.util.xml.WCharacterBase.mirrorDictionary[j + 1];
				break;
			}
			j += 2;
		}
		mirroredStr += com.wiris.system.Utf8.uchr(c);
		++i;
	}
	return mirroredStr;
}
com.wiris.util.xml.WCharacterBase.isStretchyLTR = function(c) {
	var i = 0;
	while(i < com.wiris.util.xml.WCharacterBase.horizontalLTRStretchyChars.length) {
		if(c == com.wiris.util.xml.WCharacterBase.horizontalLTRStretchyChars[i]) return true;
		++i;
	}
	return false;
}
com.wiris.util.xml.WCharacterBase.getNegated = function(c) {
	var i = 0;
	while(i < com.wiris.util.xml.WCharacterBase.negations.length) {
		if(com.wiris.util.xml.WCharacterBase.negations[i] == c) return com.wiris.util.xml.WCharacterBase.negations[i + 1];
		i += 2;
	}
	return -1;
}
com.wiris.util.xml.WCharacterBase.getNotNegated = function(c) {
	var i = 1;
	while(i < com.wiris.util.xml.WCharacterBase.negations.length) {
		if(com.wiris.util.xml.WCharacterBase.negations[i] == c) return com.wiris.util.xml.WCharacterBase.negations[i - 1];
		i += 2;
	}
	return -1;
}
com.wiris.util.xml.WCharacterBase.isCombining = function(s) {
	var it = com.wiris.system.Utf8.getIterator(s);
	while(it.hasNext()) if(!com.wiris.util.xml.WCharacterBase.isCombiningCharacter(it.next())) return false;
	return true;
}
com.wiris.util.xml.WCharacterBase.isCombiningCharacter = function(c) {
	return c >= 768 && c <= 879 || c >= 6832 && c <= 6911 || c >= 7616 && c <= 7679 && (c >= 8400 && c <= 8447) && (c >= 65056 && c <= 65071);
}
com.wiris.util.xml.WCharacterBase.isLetter = function(c) {
	if(com.wiris.util.xml.WCharacterBase.isDigit(c)) return false;
	if(65 <= c && c <= 90) return true;
	if(97 <= c && c <= 122) return true;
	if(192 <= c && c <= 696 && c != 215 && c != 247) return true;
	if(867 <= c && c <= 1521) return true;
	if(1552 <= c && c <= 8188) return true;
	if(c == 8472 || c == 8467 || com.wiris.util.xml.WCharacterBase.isDoubleStruck(c) || com.wiris.util.xml.WCharacterBase.isFraktur(c) || com.wiris.util.xml.WCharacterBase.isScript(c)) return true;
	if(com.wiris.util.xml.WCharacterBase.isChinese(c)) return true;
	if(com.wiris.util.xml.WCharacterBase.isKorean(c)) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isUnicodeMathvariant = function(c) {
	return com.wiris.util.xml.WCharacterBase.isDoubleStruck(c) || com.wiris.util.xml.WCharacterBase.isFraktur(c) || com.wiris.util.xml.WCharacterBase.isScript(c);
}
com.wiris.util.xml.WCharacterBase.isRequiredByQuizzes = function(c) {
	return c == 120128 || c == 8450 || c == 8461 || c == 8469 || c == 8473 || c == 8474 || c == 8477 || c == 8484;
}
com.wiris.util.xml.WCharacterBase.isDoubleStruck = function(c) {
	return c >= 120120 && c <= 120171 || c == 8450 || c == 8461 || c == 8469 || c == 8473 || c == 8474 || c == 8477 || c == 8484;
}
com.wiris.util.xml.WCharacterBase.isFraktur = function(c) {
	return c >= 120068 && c <= 120119 || c == 8493 || c == 8460 || c == 8465 || c == 8476 || c == 8488;
}
com.wiris.util.xml.WCharacterBase.isScript = function(c) {
	return c >= 119964 && c <= 120015 || c == 8458 || c == 8459 || c == 8466 || c == 8464 || c == 8499 || c == 8500 || c == 8492 || c == 8495 || c == 8496 || c == 8497 || c == 8475;
}
com.wiris.util.xml.WCharacterBase.isLowerCase = function(c) {
	return c >= 97 && c <= 122 || c >= 224 && c <= 255 || c >= 591 && c >= 659 || c >= 661 && c <= 687 || c >= 940 && c <= 974;
}
com.wiris.util.xml.WCharacterBase.isWord = function(c) {
	if(com.wiris.util.xml.WCharacterBase.isDevanagari(c) || com.wiris.util.xml.WCharacterBase.isChinese(c) || com.wiris.util.xml.WCharacterBase.isHebrew(c) || com.wiris.util.xml.WCharacterBase.isThai(c) || com.wiris.util.xml.WCharacterBase.isGujarati(c) || com.wiris.util.xml.WCharacterBase.isKorean(c)) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isArabianString = function(s) {
	var i = s.length - 1;
	while(i >= 0) {
		if(!com.wiris.util.xml.WCharacterBase.isArabian(HxOverrides.cca(s,i))) return false;
		--i;
	}
	return true;
}
com.wiris.util.xml.WCharacterBase.isArabian = function(c) {
	if(c >= 1536 && c <= 1791 && !com.wiris.util.xml.WCharacterBase.isDigit(c)) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isHebrew = function(c) {
	if(c >= 1424 && c <= 1535) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isChinese = function(c) {
	if(c >= 13312 && c <= 40959) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isKorean = function(c) {
	if(c >= 12593 && c <= 52044) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isGreek = function(c) {
	if(c >= 945 && c <= 969) return true; else if(c >= 913 && c <= 937 && c != 930) return true; else if(c == 977 || c == 981 || c == 982) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isDevanagari = function(c) {
	if(c >= 2304 && c < 2431) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isGujarati = function(c) {
	if(c >= 2689 && c < 2788 || c == 2800 || c == 2801) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isThai = function(c) {
	if(3585 <= c && c < 3676) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isDevanagariString = function(s) {
	var i = s.length - 1;
	while(i >= 0) {
		if(!com.wiris.util.xml.WCharacterBase.isDevanagari(HxOverrides.cca(s,i))) return false;
		--i;
	}
	return true;
}
com.wiris.util.xml.WCharacterBase.isRTL = function(c) {
	if(com.wiris.util.xml.WCharacterBase.isHebrew(c) || com.wiris.util.xml.WCharacterBase.isArabian(c)) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.isTallLetter = function(c) {
	if(97 <= c && c <= 122 || 945 <= c && c <= 969) return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.tallLetters,c);
	return true;
}
com.wiris.util.xml.WCharacterBase.isLongLetter = function(c) {
	if(97 <= c && c <= 122 || 945 <= c && c <= 969) return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.longLetters,c); else if(65 <= c && c <= 90) return false;
	return true;
}
com.wiris.util.xml.WCharacterBase.isLTRNumber = function(text) {
	var i = 0;
	var n = com.wiris.system.Utf8.getLength(text);
	while(i < n) {
		if(!com.wiris.util.xml.WCharacterBase.isDigit(com.wiris.system.Utf8.charCodeAt(text,i))) return false;
		++i;
	}
	return true;
}
com.wiris.util.xml.WCharacterBase.isSuperscript = function(c) {
	return c == 178 || c == 179 || c == 185 || c >= 8304 && c <= 8319 && c != 8306 && c != 8307;
}
com.wiris.util.xml.WCharacterBase.isSubscript = function(c) {
	return c >= 8320 && c <= 8348 && c != 8335;
}
com.wiris.util.xml.WCharacterBase.isSuperscriptOrSubscript = function(c) {
	return com.wiris.util.xml.WCharacterBase.isSuperscript(c) || com.wiris.util.xml.WCharacterBase.isSubscript(c);
}
com.wiris.util.xml.WCharacterBase.normalizeSubSuperScript = function(c) {
	var i = 0;
	var n = com.wiris.util.xml.WCharacterBase.subSuperScriptDictionary.length;
	while(i < n) {
		if(com.wiris.util.xml.WCharacterBase.subSuperScriptDictionary[i] == c) return com.wiris.util.xml.WCharacterBase.subSuperScriptDictionary[i + 1];
		i += 2;
	}
	return c;
}
com.wiris.util.xml.WCharacterBase.isInvisible = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.invisible,c);
}
com.wiris.util.xml.WCharacterBase.isHorizontalOperator = function(c) {
	return com.wiris.util.xml.WCharacterBase.binarySearch(com.wiris.util.xml.WCharacterBase.horizontalOperators,c);
}
com.wiris.util.xml.WCharacterBase.latin2Greek = function(l) {
	var index = -1;
	if(l < 100) index = com.wiris.util.xml.WCharacterBase.latinLetters.indexOf("@00" + l + "@"); else if(l < 1000) index = com.wiris.util.xml.WCharacterBase.latinLetters.indexOf("@0" + l + "@"); else index = com.wiris.util.xml.WCharacterBase.latinLetters.indexOf("@" + l + "@");
	if(index != -1) {
		var s = HxOverrides.substr(com.wiris.util.xml.WCharacterBase.greekLetters,index + 1,4);
		return Std.parseInt(s);
	}
	return l;
}
com.wiris.util.xml.WCharacterBase.greek2Latin = function(g) {
	var index = -1;
	if(g < 100) index = com.wiris.util.xml.WCharacterBase.greekLetters.indexOf("@00" + g + "@"); else if(g < 1000) index = com.wiris.util.xml.WCharacterBase.greekLetters.indexOf("@0" + g + "@"); else index = com.wiris.util.xml.WCharacterBase.greekLetters.indexOf("@" + g + "@");
	if(index != -1) {
		var s = HxOverrides.substr(com.wiris.util.xml.WCharacterBase.latinLetters,index + 1,4);
		return Std.parseInt(s);
	}
	return g;
}
com.wiris.util.xml.WCharacterBase.isOp = function(c) {
	return com.wiris.util.xml.WCharacterBase.isLarge(c) || com.wiris.util.xml.WCharacterBase.isVeryLarge(c) || com.wiris.util.xml.WCharacterBase.isBinaryOp(c) || com.wiris.util.xml.WCharacterBase.isRelation(c) || c == HxOverrides.cca(".",0) || c == HxOverrides.cca(",",0) || c == HxOverrides.cca(":",0);
}
com.wiris.util.xml.WCharacterBase.isTallAccent = function(c) {
	var i = 0;
	while(i < com.wiris.util.xml.WCharacterBase.tallAccents.length) {
		if(c == com.wiris.util.xml.WCharacterBase.tallAccents[i]) return true;
		++i;
	}
	return false;
}
com.wiris.util.xml.WCharacterBase.isDisplayedWithStix = function(c) {
	if(c >= 592 && c <= 687) return true;
	if(c >= 688 && c <= 767) return true;
	if(c >= 8215 && c <= 8233 || c >= 8241 && c <= 8303) return true;
	if(c >= 8304 && c <= 8351) return true;
	if(c >= 8400 && c <= 8447) return true;
	if(c >= 8448 && c <= 8527) return true;
	if(c >= 8528 && c <= 8591) return true;
	if(c >= 8592 && c <= 8703) return true;
	if(c >= 8704 && c <= 8959) return true;
	if(c >= 8960 && c <= 9215) return true;
	if(c >= 9312 && c <= 9471) return true;
	if(c >= 9472 && c <= 9599) return true;
	if(c >= 9600 && c <= 9631) return true;
	if(c >= 9632 && c <= 9727) return true;
	if(c >= 9728 && c <= 9983) return true;
	if(c >= 9984 && c <= 10175) return true;
	if(c >= 10176 && c <= 10223) return true;
	if(c >= 10224 && c <= 10239) return true;
	if(c >= 10240 && c <= 10495) return true;
	if(c >= 10496 && c <= 10623) return true;
	if(c >= 10624 && c <= 10751) return true;
	if(c >= 10752 && c <= 11007) return true;
	if(c >= 11008 && c <= 11263) return true;
	if(c >= 12288 && c <= 12351) return true;
	if(c >= 57344 && c <= 65535) return true;
	if(c >= 119808 && c <= 119963 || c >= 120224 && c <= 120831) return true;
	if(c == 12398 || c == 42791 || c == 42898) return true;
	return false;
}
com.wiris.util.xml.WCharacterBase.latinToDoublestruck = function(codepoint) {
	if(codepoint == 67) return 8450; else if(codepoint == 72) return 8461; else if(codepoint == 78) return 8469; else if(codepoint == 80) return 8473; else if(codepoint == 81) return 8474; else if(codepoint == 82) return 8477; else if(codepoint == 90) return 8484; else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_CAPITAL_A - com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A); else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_SMALL_A - com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A); else if(codepoint >= com.wiris.util.xml.WCharacterBase.DIGIT_ZERO && codepoint <= com.wiris.util.xml.WCharacterBase.DIGIT_NINE) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_DIGIT_ZERO - com.wiris.util.xml.WCharacterBase.DIGIT_ZERO); else return codepoint;
}
com.wiris.util.xml.WCharacterBase.latinToScript = function(codepoint) {
	if(codepoint == 66) return 8492; else if(codepoint == 69) return 8496; else if(codepoint == 70) return 8497; else if(codepoint == 72) return 8459; else if(codepoint == 73) return 8464; else if(codepoint == 76) return 8466; else if(codepoint == 77) return 8499; else if(codepoint == 82) return 8475; else if(codepoint == 101) return 8495; else if(codepoint == 103) return 8458; else if(codepoint == 111) return 8500; else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_SCRIPT_CAPITAL_A - com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A); else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_SCRIPT_SMALL_A - com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A); else return codepoint;
}
com.wiris.util.xml.WCharacterBase.latinToFraktur = function(codepoint) {
	if(codepoint == 67) return 8493; else if(codepoint == 72) return 8460; else if(codepoint == 73) return 8465; else if(codepoint == 82) return 8476; else if(codepoint == 90) return 8488; else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_FRAKTUR_CAPITAL_A - com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A); else if(codepoint >= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A && codepoint <= com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_Z) return codepoint + (com.wiris.util.xml.WCharacterBase.MATHEMATICAL_FRAKTUR_SMALL_A - com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A); else return codepoint;
}
com.wiris.util.xml.WEntities = $hxClasses["com.wiris.util.xml.WEntities"] = function() { }
com.wiris.util.xml.WEntities.__name__ = ["com","wiris","util","xml","WEntities"];
com.wiris.util.xml.WXmlUtils = $hxClasses["com.wiris.util.xml.WXmlUtils"] = function() { }
com.wiris.util.xml.WXmlUtils.__name__ = ["com","wiris","util","xml","WXmlUtils"];
com.wiris.util.xml.WXmlUtils.getElementContent = function(element) {
	var sb = new StringBuf();
	if(element.nodeType == Xml.Document || element.nodeType == Xml.Element) {
		var i = element.iterator();
		while(i.hasNext()) sb.b += Std.string(i.next().toString());
	}
	return sb.b;
}
com.wiris.util.xml.WXmlUtils.hasSameAttributes = function(a,b) {
	if(a == null && b == null) return true; else if(a == null || b == null) return false;
	var iteratorA = a.attributes();
	var iteratorB = b.attributes();
	while(iteratorA.hasNext()) {
		if(!iteratorB.hasNext()) return false;
		iteratorB.next();
		var attr = iteratorA.next();
		if(!(com.wiris.util.xml.WXmlUtils.getAttribute(a,attr) == com.wiris.util.xml.WXmlUtils.getAttribute(b,attr))) return false;
	}
	return !iteratorB.hasNext();
}
com.wiris.util.xml.WXmlUtils.getElementsByAttributeValue = function(nodeList,attributeName,attributeValue) {
	var nodes = new Array();
	while(nodeList.hasNext()) {
		var node = nodeList.next();
		if(node.nodeType == Xml.Element && attributeValue == com.wiris.util.xml.WXmlUtils.getAttribute(node,attributeName)) nodes.push(node);
	}
	return nodes;
}
com.wiris.util.xml.WXmlUtils.getElementsByTagName = function(nodeList,tagName) {
	var nodes = new Array();
	while(nodeList.hasNext()) {
		var node = nodeList.next();
		if(node.nodeType == Xml.Element && node.getNodeName() == tagName) nodes.push(node);
	}
	return nodes;
}
com.wiris.util.xml.WXmlUtils.getElements = function(node) {
	var nodes = new Array();
	var nodeList = node.iterator();
	while(nodeList.hasNext()) {
		var item = nodeList.next();
		if(item.nodeType == Xml.Element) nodes.push(item);
	}
	return nodes;
}
com.wiris.util.xml.WXmlUtils.getDocumentElement = function(doc) {
	var nodeList = doc.iterator();
	while(nodeList.hasNext()) {
		var node = nodeList.next();
		if(node.nodeType == Xml.Element) return node;
	}
	return null;
}
com.wiris.util.xml.WXmlUtils.getAttribute = function(node,attributeName) {
	var value = node.get(attributeName);
	if(value == null) return null;
	if(com.wiris.settings.PlatformSettings.PARSE_XML_ENTITIES) return com.wiris.util.xml.WXmlUtils.htmlUnescape(value);
	return value;
}
com.wiris.util.xml.WXmlUtils.setAttribute = function(node,name,value) {
	if(value != null && com.wiris.settings.PlatformSettings.PARSE_XML_ENTITIES) value = com.wiris.util.xml.WXmlUtils.htmlEscape(value);
	node.set(name,value);
}
com.wiris.util.xml.WXmlUtils.getNodeValue = function(node) {
	var value = node.getNodeValue();
	if(value == null) return null;
	if(com.wiris.settings.PlatformSettings.PARSE_XML_ENTITIES && node.nodeType == Xml.PCData) return com.wiris.util.xml.WXmlUtils.htmlUnescape(value);
	return value;
}
com.wiris.util.xml.WXmlUtils.createPCData = function(node,text) {
	if(com.wiris.settings.PlatformSettings.PARSE_XML_ENTITIES) text = com.wiris.util.xml.WXmlUtils.htmlEscape(text);
	return Xml.createPCData(text);
}
com.wiris.util.xml.WXmlUtils.htmlEscape = function(input) {
	var output = StringTools.replace(input,"&","&amp;");
	output = StringTools.replace(output,"<","&lt;");
	output = StringTools.replace(output,">","&gt;");
	output = StringTools.replace(output,"\"","&quot;");
	output = StringTools.replace(output,"&apos;","'");
	return output;
}
com.wiris.util.xml.WXmlUtils.htmlUnescape = function(input) {
	var output = "";
	var start = 0;
	var position = input.indexOf("&",start);
	while(position != -1) {
		output += HxOverrides.substr(input,start,position - start);
		if(input.charAt(position + 1) == "#") {
			var startPosition = position + 2;
			var endPosition = input.indexOf(";",startPosition);
			if(endPosition != -1) {
				var number = HxOverrides.substr(input,startPosition,endPosition - startPosition);
				if(StringTools.startsWith(number,"x")) number = "0" + number;
				var charCode = Std.parseInt(number);
				output += com.wiris.system.Utf8.uchr(charCode);
				start = endPosition + 1;
			} else {
				output += "&";
				start = position + 1;
			}
		} else {
			output += "&";
			start = position + 1;
		}
		position = input.indexOf("&",start);
	}
	output += HxOverrides.substr(input,start,input.length - start);
	output = StringTools.replace(output,"&lt;","<");
	output = StringTools.replace(output,"&gt;",">");
	output = StringTools.replace(output,"&quot;","\"");
	output = StringTools.replace(output,"&apos;","'");
	output = StringTools.replace(output,"&amp;","&");
	return output;
}
com.wiris.util.xml.WXmlUtils.parseXML = function(xml) {
	xml = com.wiris.util.xml.WXmlUtils.filterMathMLEntities(xml);
	var x = Xml.parse(xml);
	return x;
}
com.wiris.util.xml.WXmlUtils.serializeXML = function(xml) {
	var s = xml.toString();
	s = com.wiris.util.xml.WXmlUtils.filterMathMLEntities(s);
	return s;
}
com.wiris.util.xml.WXmlUtils.resolveEntities = function(text) {
	com.wiris.util.xml.WXmlUtils.initEntities();
	var sb = new StringBuf();
	var i = 0;
	var n = text.length;
	while(i < n) {
		var c = com.wiris.util.xml.WXmlUtils.getUtf8Char(text,i);
		if(c == 60 && i + 12 < n && HxOverrides.cca(text,i + 1) == 33) {
			if(HxOverrides.substr(text,i,9) == "<![CDATA[") {
				var e = text.indexOf("]]>",i);
				if(e != -1) {
					sb.b += Std.string(HxOverrides.substr(text,i,e - i + 3));
					i = e + 3;
					continue;
				}
			}
		}
		if(c > 127) {
			var special = com.wiris.system.Utf8.uchr(c);
			sb.b += Std.string(special);
			i += special.length - 1;
		} else if(c == 38) {
			i++;
			c = HxOverrides.cca(text,i);
			if(com.wiris.util.xml.WXmlUtils.isNameStart(c)) {
				var name = new StringBuf();
				name.b += String.fromCharCode(c);
				i++;
				c = HxOverrides.cca(text,i);
				while(com.wiris.util.xml.WXmlUtils.isNameChar(c)) {
					name.b += String.fromCharCode(c);
					i++;
					c = HxOverrides.cca(text,i);
				}
				var ent = name.b;
				if(c == 59 && com.wiris.util.xml.WXmlUtils.entities.exists(ent) && !com.wiris.util.xml.WXmlUtils.isXmlEntity(ent)) {
					var val = com.wiris.util.xml.WXmlUtils.entities.get(ent);
					sb.b += Std.string(com.wiris.system.Utf8.uchr(Std.parseInt(val)));
				} else {
					sb.b += Std.string("&");
					sb.b += Std.string(name);
					sb.b += String.fromCharCode(c);
				}
			} else if(c == 35) {
				i++;
				c = HxOverrides.cca(text,i);
				if(c == 120) {
					var hex = new StringBuf();
					i++;
					c = HxOverrides.cca(text,i);
					while(com.wiris.util.xml.WXmlUtils.isHexDigit(c)) {
						hex.b += String.fromCharCode(c);
						i++;
						c = HxOverrides.cca(text,i);
					}
					var hent = hex.b;
					if(c == 59 && !com.wiris.util.xml.WXmlUtils.isXmlEntity("#x" + hent)) {
						var dec = Std.parseInt("0x" + hent);
						sb.b += Std.string(com.wiris.system.Utf8.uchr(dec));
					} else {
						sb.b += Std.string("&#x");
						sb.b += Std.string(hent);
						sb.b += String.fromCharCode(c);
					}
				} else if(48 <= c && c <= 57) {
					var dec = new StringBuf();
					while(48 <= c && c <= 57) {
						dec.b += String.fromCharCode(c);
						i++;
						c = HxOverrides.cca(text,i);
					}
					if(c == 59 && !com.wiris.util.xml.WXmlUtils.isXmlEntity("#" + Std.string(dec))) sb.b += Std.string(com.wiris.system.Utf8.uchr(Std.parseInt(dec.b))); else {
						sb.b += Std.string("&#" + dec.b);
						sb.b += String.fromCharCode(c);
					}
				}
			}
		} else sb.b += String.fromCharCode(c);
		i++;
	}
	return sb.b;
}
com.wiris.util.xml.WXmlUtils.filterMathMLEntities = function(text) {
	text = com.wiris.util.xml.WXmlUtils.resolveEntities(text);
	text = com.wiris.util.xml.WXmlUtils.nonAsciiToEntities(text);
	return text;
}
com.wiris.util.xml.WXmlUtils.getUtf8Char = function(text,i) {
	var c = HxOverrides.cca(text,i);
	var d = c;
	if(com.wiris.settings.PlatformSettings.UTF8_CONVERSION) {
		if(d > 127) {
			var j = 0;
			c = 128;
			do {
				c = c >> 1;
				j++;
			} while((d & c) != 0);
			d = c - 1 & d;
			while(--j > 0) {
				i++;
				c = HxOverrides.cca(text,i);
				d = (d << 6) + (c & 63);
			}
		}
	} else if(d >= 55296 && d <= 56319) {
		c = HxOverrides.cca(text,i + 1);
		d = (d - 55296 << 10) + (c - 56320) + 65536;
	}
	return d;
}
com.wiris.util.xml.WXmlUtils.nonAsciiToEntities = function(s) {
	var sb = new StringBuf();
	var i = 0;
	var n = s.length;
	while(i < n) {
		var c = com.wiris.util.xml.WXmlUtils.getUtf8Char(s,i);
		if(c > 127) {
			var hex = com.wiris.common.WInteger.toHex(c,5);
			var j = 0;
			while(j < hex.length) {
				if(!(HxOverrides.substr(hex,j,1) == "0")) {
					hex = HxOverrides.substr(hex,j,null);
					break;
				}
				++j;
			}
			sb.b += Std.string("&#x" + hex + ";");
			i += com.wiris.system.Utf8.uchr(c).length;
		} else {
			sb.b += String.fromCharCode(c);
			i++;
		}
	}
	return sb.b;
}
com.wiris.util.xml.WXmlUtils.isNameStart = function(c) {
	if(65 <= c && c <= 90) return true;
	if(97 <= c && c <= 122) return true;
	if(c == 95 || c == 58) return true;
	return false;
}
com.wiris.util.xml.WXmlUtils.isNameChar = function(c) {
	if(com.wiris.util.xml.WXmlUtils.isNameStart(c)) return true;
	if(48 <= c && c <= 57) return true;
	if(c == 46 || c == 45) return true;
	return false;
}
com.wiris.util.xml.WXmlUtils.isHexDigit = function(c) {
	if(c >= 48 && c <= 57) return true;
	if(c >= 65 && c <= 70) return true;
	if(c >= 97 && c <= 102) return true;
	return false;
}
com.wiris.util.xml.WXmlUtils.resolveMathMLEntity = function(name) {
	com.wiris.util.xml.WXmlUtils.initEntities();
	if(com.wiris.util.xml.WXmlUtils.entities.exists(name)) {
		var code = com.wiris.util.xml.WXmlUtils.entities.get(name);
		return Std.parseInt(code);
	}
	return -1;
}
com.wiris.util.xml.WXmlUtils.initEntities = function() {
	if(com.wiris.util.xml.WXmlUtils.entities == null) {
		var e = com.wiris.util.xml.WEntities.MATHML_ENTITIES;
		com.wiris.util.xml.WXmlUtils.entities = new Hash();
		var start = 0;
		var mid;
		while((mid = e.indexOf("@",start)) != -1) {
			var name = HxOverrides.substr(e,start,mid - start);
			mid++;
			start = e.indexOf("@",mid);
			if(start == -1) break;
			var value = HxOverrides.substr(e,mid,start - mid);
			var num = Std.parseInt("0x" + value);
			com.wiris.util.xml.WXmlUtils.entities.set(name,"" + num);
			start++;
		}
	}
}
com.wiris.util.xml.WXmlUtils.getText = function(xml) {
	if(xml.nodeType == Xml.PCData) return xml.getNodeValue();
	var r = "";
	var iter = xml.iterator();
	while(iter.hasNext()) r += com.wiris.util.xml.WXmlUtils.getText(iter.next());
	return r;
}
com.wiris.util.xml.WXmlUtils.setText = function(xml,text) {
	if(xml.nodeType != Xml.Element) return;
	var it = xml.iterator();
	if(it.hasNext()) {
		var child = it.next();
		if(child.nodeType == Xml.PCData) xml.removeChild(child);
	}
	xml.addChild(Xml.createPCData(text));
}
com.wiris.util.xml.WXmlUtils.copyXml = function(elem) {
	return com.wiris.util.xml.WXmlUtils.importXml(elem,elem);
}
com.wiris.util.xml.WXmlUtils.importXml = function(elem,model) {
	var n = null;
	if(elem.nodeType == Xml.Element) {
		n = Xml.createElement(elem.getNodeName());
		var keys = elem.attributes();
		while(keys.hasNext()) {
			var key = keys.next();
			n.set(key,elem.get(key));
		}
		var children = elem.iterator();
		while(children.hasNext()) n.addChild(com.wiris.util.xml.WXmlUtils.importXml(children.next(),model));
	} else if(elem.nodeType == Xml.Document) n = com.wiris.util.xml.WXmlUtils.importXml(elem.firstElement(),model); else if(elem.nodeType == Xml.CData) n = Xml.createCData(elem.getNodeValue()); else if(elem.nodeType == Xml.PCData) n = Xml.createPCData(elem.getNodeValue()); else throw "Unsupported node type: " + Std.string(elem.nodeType);
	return n;
}
com.wiris.util.xml.WXmlUtils.copyXmlNamespace = function(elem,customNamespace,prefixAttributes) {
	return com.wiris.util.xml.WXmlUtils.importXmlNamespace(elem,elem,customNamespace,prefixAttributes);
}
com.wiris.util.xml.WXmlUtils.importXmlNamespace = function(elem,model,customNamespace,prefixAttributes) {
	var n = null;
	if(elem.nodeType == Xml.Element) {
		n = Xml.createElement(customNamespace + ":" + elem.getNodeName());
		var keys = elem.attributes();
		while(keys.hasNext()) {
			var key = keys.next();
			var keyNamespaced = key;
			if(prefixAttributes && key.indexOf(":") == -1 && key.indexOf("xmlns") == -1) keyNamespaced = customNamespace + ":" + key;
			n.set(keyNamespaced,elem.get(key));
		}
		var children = elem.iterator();
		while(children.hasNext()) n.addChild(com.wiris.util.xml.WXmlUtils.importXmlNamespace(children.next(),model,customNamespace,prefixAttributes));
	} else if(elem.nodeType == Xml.Document) n = com.wiris.util.xml.WXmlUtils.importXmlNamespace(elem.firstElement(),model,customNamespace,prefixAttributes); else if(elem.nodeType == Xml.CData) n = Xml.createCData(elem.getNodeValue()); else if(elem.nodeType == Xml.PCData) n = Xml.createPCData(elem.getNodeValue()); else throw "Unsupported node type: " + Std.string(elem.nodeType);
	return n;
}
com.wiris.util.xml.WXmlUtils.indentXml = function(xml,space) {
	var depth = 0;
	var opentag = new EReg("^<([\\w-_]+)[^>]*>$","");
	var autotag = new EReg("^<([\\w-_]+)[^>]*/>$","");
	var closetag = new EReg("^</([\\w-_]+)>$","");
	var cdata = new EReg("^<!\\[CDATA\\[[^\\]]*\\]\\]>$","");
	var res = new StringBuf();
	var end = 0;
	var start;
	var text;
	while(end < xml.length && (start = xml.indexOf("<",end)) != -1) {
		text = start > end;
		if(text) res.b += Std.string(HxOverrides.substr(xml,end,start - end));
		end = xml.indexOf(">",start) + 1;
		var aux = HxOverrides.substr(xml,start,end - start);
		if(autotag.match(aux)) {
			res.b += Std.string("\n");
			var i;
			var _g = 0;
			while(_g < depth) {
				var i1 = _g++;
				res.b += Std.string(space);
			}
			res.b += Std.string(aux);
		} else if(opentag.match(aux)) {
			res.b += Std.string("\n");
			var i;
			var _g = 0;
			while(_g < depth) {
				var i1 = _g++;
				res.b += Std.string(space);
			}
			res.b += Std.string(aux);
			depth++;
		} else if(closetag.match(aux)) {
			depth--;
			if(!text) {
				res.b += Std.string("\n");
				var i;
				var _g = 0;
				while(_g < depth) {
					var i1 = _g++;
					res.b += Std.string(space);
				}
			}
			res.b += Std.string(aux);
		} else if(cdata.match(aux)) res.b += Std.string(aux); else {
			haxe.Log.trace("WARNING! malformed XML at character " + end + ":" + xml,{ fileName : "WXmlUtils.hx", lineNumber : 662, className : "com.wiris.util.xml.WXmlUtils", methodName : "indentXml"});
			res.b += Std.string(aux);
		}
	}
	return StringTools.trim(res.b);
}
com.wiris.util.xml.WXmlUtils.isXmlEntity = function(ent) {
	if(HxOverrides.cca(ent,0) == 35) {
		var c;
		if(HxOverrides.cca(ent,1) == 120) c = Std.parseInt("0x" + HxOverrides.substr(ent,2,null)); else c = Std.parseInt(HxOverrides.substr(ent,1,null));
		return c == 34 || c == 38 || c == 39 || c == 60 || c == 62;
	} else return ent == "amp" || ent == "lt" || ent == "gt" || ent == "quot" || ent == "apos";
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Resource = $hxClasses["haxe.Resource"] = function() { }
haxe.Resource.__name__ = ["haxe","Resource"];
haxe.Resource.content = null;
haxe.Resource.listNames = function() {
	var names = new Array();
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		names.push(x.name);
	}
	return names;
}
haxe.Resource.getString = function(name) {
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.Unserializer.run(x.data);
			return b.toString();
		}
	}
	return null;
}
haxe.Resource.getBytes = function(name) {
	var _g = 0, _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return haxe.io.Bytes.ofString(x.str);
			return haxe.Unserializer.run(x.data);
		}
	}
	return null;
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = $hxClasses["haxe.Unserializer"] = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.Utf8 = $hxClasses["haxe.Utf8"] = function(size) {
	this.__b = "";
};
haxe.Utf8.__name__ = ["haxe","Utf8"];
haxe.Utf8.iter = function(s,chars) {
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		chars(HxOverrides.cca(s,i));
	}
}
haxe.Utf8.encode = function(s) {
	throw "Not implemented";
	return s;
}
haxe.Utf8.decode = function(s) {
	throw "Not implemented";
	return s;
}
haxe.Utf8.charCodeAt = function(s,index) {
	return HxOverrides.cca(s,index);
}
haxe.Utf8.validate = function(s) {
	return true;
}
haxe.Utf8.compare = function(a,b) {
	return a > b?1:a == b?0:-1;
}
haxe.Utf8.sub = function(s,pos,len) {
	return HxOverrides.substr(s,pos,len);
}
haxe.Utf8.prototype = {
	toString: function() {
		return this.__b;
	}
	,addChar: function(c) {
		this.__b += String.fromCharCode(c);
	}
	,__b: null
	,__class__: haxe.Utf8
}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
if(!haxe.xml) haxe.xml = {}
haxe.xml.Parser = $hxClasses["haxe.xml.Parser"] = function() { }
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
haxe.Resource.content = [];
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
com.wiris.settings.PlatformSettings.IS_JAVA = false;
com.wiris.settings.PlatformSettings.IS_CSHARP = false;
com.wiris.settings.PlatformSettings.PARSE_XML_ENTITIES = true;
com.wiris.settings.PlatformSettings.UTF8_CONVERSION = false;
com.wiris.settings.PlatformSettings.IS_JAVASCRIPT = true;
com.wiris.settings.PlatformSettings.IS_FLASH = false;
com.wiris.system.JsDOMUtils.TOUCHHOLD_MOVE_MARGIN = 10;
com.wiris.system.JsDOMUtils.browser = new com.wiris.system.JsBrowser();
com.wiris.system.JsDOMUtils.initialized = false;
com.wiris.system.JsDOMUtils.touchDeviceListeners = new Array();
com.wiris.system.JsDOMUtils.mouseDeviceListeners = new Array();
com.wiris.system.JsDOMUtils.internetExplorerPointers = new Hash();
com.wiris.system.ResourceLoader.editorDefinition = null;
com.wiris.system.ResourceLoader.imageDefinition = null;
com.wiris.system.ResourceLoader.imageDefinition1_5 = null;
com.wiris.system.ResourceLoader.imageDefinition2 = null;
com.wiris.system.ResourceLoader.charactersDefinition = null;
com.wiris.system.ResourceLoader.translations = { };
com.wiris.system.ResourceLoader.version = null;
com.wiris.system.ResourceLoader.fontAdjust = null;
com.wiris.system.graphics.JsClientGraphicsContext.HIDDEN_TOP = "-9999px";
com.wiris.system.graphics.JsClientGraphicsContext.STIX_SETS = [[true,StringTools.replace("U+0041-005a,U+0061-007a","U+","").split(",")],[false,StringTools.replace("U+0030-0039,U+0041-005a,U+0061-007a","U+","").split(",")],[false,StringTools.replace("U+00A1-00AB,U+00AD-00AF,U+00B2-00B6,U+00B8-00D6,U+00D8-00F6,U+00F8-01B4,U+01B6-02D8,U+02DA-03BF,U+1001-169A,U+169D-2008,U+2011-2013,U+2015-2019,U+201B-201D,U+201F-2024,U+2027-2034,U+2036-2044,U+2047-207C,U+207F-208C,U+208F-2101,U+2103-2110,U+2114,U+2116-2117,U+211B,U+211E-2123,U+2125-2130,U+2132-2134,U+2136-2189,U+219A-21A3,U+21A5,U+21A7-21A8,U+21AB-21B4,U+21B6-21BB,U+21BE-21BF,U+21C2-21C3,U+21C7-21CA,U+21CD-21CF,U+21D6-21F4,U+21F6-21FF,U+2201,U+220A,U+220D-220E,U+2214-2215,U+221A-221C,U+221F,U+2223-2224,U+2231-2233,U+2236-223B,U+223E-2240,U+2242,U+2244,U+2246-2247,U+2249-225F,U+2263,U+2266-2269,U+226C-226F,U+227C-2281,U+2284-2285,U+2288-228E,U+2296,U+2298,U+229A,U+229C,U+229E-22A4,U+22A6-22B1,U+22B4-22C3,U+22C6-22CC,U+22CE-22ED,U+22F2-2328,U+232B-239A,U+23AE,U+23B2-23B3,U+23B7-23DB,U+23E2-25A0,U+25A2-25AC,U+25AE-25B0,U+25B2,U+25B4-25CA,U+25CC-2767,U+2776-27E5,U+27F0-2920,U+2923-2941,U+2943,U+2945-2969,U+296B-296C,U+2970-2982,U+2999-29D7,U+29DC-29FB,U+29FE-2A37,U+2A39-2A7C,U+2A7F-2A86,U+2A89-2FFF,U+3002-E00D,U+E010-F001,U+F004,U+1D53F,U+1D541-FFFFF","U+","").split(",")],[true,StringTools.replace("U+0001-0040,U+005B-0060,U+007B-0FFFFF","U+","").split(",")],[false,StringTools.replace("U+0001-002F,U+003A-0040,U+005B-0060,U+007B-007E,U+00A0,U+00AC,U+00B0-00B1,U+00B7,U+00D7,U+00F7,U+01B5,U+02D9,U+03C0,U+1000,U+169B-169C,U+2009-2010,U+2014,U+201A,U+201E,U+2025-2026,U+2035,U+2045-2046,U+207D-207E,U+208D-208E,U+2102,U+2111-2113,U+2115,U+2118-211A,U+211C-211D,U+2124,U+2131,U+2135,U+2190-2199,U+21A4,U+21A6,U+21A9-21AA,U+21B5,U+21BC-21BD,U+21C0-21C1,U+21C4-21C6,U+21CB-21CC,U+21D0-21D5,U+21F5,U+2200,U+2202-2209,U+220B-220C,U+220F-2213,U+2216-2219,U+221D-221E,U+2220-2222,U+2225-2230,U+2234-2235,U+223C-223D,U+2241,U+2243,U+2245,U+2248,U+2260-2262,U+2264-2265,U+226A-226B,U+227A-227B,U+2282-2283,U+2286-2287,U+228F-2295,U+2297,U+2299,U+229B,U+229D,U+22A5,U+22B2-22B3,U+22C4,U+22CD,U+22EE-22F1,U+2329-232A,U+239B-23AD,U+23AF-23B1,U+23B4-23B6,U+23DC-23E1,U+25A1,U+25AD,U+25B1,U+25B3,U+25CB,U+2768-2775,U+27E6-27EF,U+2921-2922,U+2942,U+2944,U+296A,U+296D-296F,U+2983-2998,U+29D8-29DB,U+29FC-29FD,U+2A38,U+2A7D-2A7E,U+2A87-2A88,U+3000-3001,U+E00E-E00F,U+F002-F003,U+1D540","U+","").split(",")]];
com.wiris.system.graphics.JsClientGraphicsContext.STIX_SAMPLE_SIZE = 200;
com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_COLOR = 0;
com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_FONT_FAMILY = "Arial";
com.wiris.system.graphics.JsClientGraphicsContext.DEFAULT_FONT_SIZE = 16;
com.wiris.util.css.CSSUtils.PT_TO_PX = 1.34;
com.wiris.util.graphics.BoxStyle.MTEXT_FLAG = 1;
com.wiris.util.graphics.BoxStyle.MATHVARIANT_FONT_FLAG = 2;
com.wiris.util.graphics.BoxStyle.FONT_FAMILY_FLAG = 4;
com.wiris.util.graphics.BoxStyle.ITALIC_FLAG = 8;
com.wiris.util.graphics.BoxStyle.BOLD_FLAG = 16;
com.wiris.util.graphics.BoxStyle.PIXELS_SIZE_FLAG = 32;
com.wiris.util.graphics.BoxStyle.DISPLAY_STYLE_FLAG = 64;
com.wiris.util.graphics.BoxStyle.PROPORTIONAL_SIZE_FLAG = 128;
com.wiris.util.graphics.BoxStyle.COLOR_FLAG = 256;
com.wiris.util.graphics.BoxStyle.LINE_WIDTH_FLAG = 512;
com.wiris.util.graphics.BoxStyle.ZOOM_FLAG = 1024;
com.wiris.util.graphics.BoxStyle.WIDTH_FLAG = 2048;
com.wiris.util.graphics.BoxStyle.INVISIBLE_FLAG = 4096;
com.wiris.util.graphics.BoxStyle.RTL_FLAG = 8192;
com.wiris.util.graphics.BoxStyle.MAX_WIDTH_FLAG = 16384;
com.wiris.util.graphics.BoxStyle.ALIGN_FLAG = 32768;
com.wiris.util.graphics.BoxStyle.CLASSTYPE_FLAG = 65536;
com.wiris.util.graphics.BoxStyle.FORCED_LIGATURE_FLAG = 131072;
com.wiris.util.graphics.BoxStyle.IGNORE_PROPORTIONAL_SIZE_FLAG = 262144;
com.wiris.util.graphics.BoxStyle.POSITIONABLE_FLAG = 524288;
com.wiris.util.graphics.BoxStyle.SCRIPT_LEVEL_FLAG = 1048576;
com.wiris.util.graphics.BoxStyle.BACKGROUNDCOLOR_FLAG = 2097152;
com.wiris.util.graphics.BoxStyle.BIT_REMOVE_FLAG = 24;
com.wiris.util.graphics.BoxStyle.FIRST_REMOVE_FLAG = 16777216;
com.wiris.util.graphics.BoxStyle.REMOVE_MTEXT_FLAG = 16777216;
com.wiris.util.graphics.BoxStyle.REMOVE_MATHVARIANT_FONT_FLAG = 33554432;
com.wiris.util.graphics.BoxStyle.REMOVE_FONT_FAMILY_FLAG = 67108864;
com.wiris.util.graphics.BoxStyle.REMOVE_ITALIC_FLAG = 134217728;
com.wiris.util.graphics.BoxStyle.REMOVE_BOLD_FLAG = 268435456;
com.wiris.util.graphics.BoxStyle.REMOVE_PIXELS_SIZE_FLAG = 536870912;
com.wiris.util.graphics.BoxStyle.LEFT_ALIGN = 1;
com.wiris.util.graphics.BoxStyle.RIGHT_ALIGN = 2;
com.wiris.util.graphics.BoxStyle.CENTER_ALIGN = 3;
com.wiris.util.graphics.BoxStyle.DECIMAL_ALIGN = 4;
com.wiris.util.graphics.BoxStyle.RELATION_ALIGN = 5;
com.wiris.util.graphics.BoxStyle.AUTO_ALIGN = 6;
com.wiris.util.xml.WCharacterBase.NEGATIVE_THIN_SPACE = 57344;
com.wiris.util.xml.WCharacterBase.ROOT = 61696;
com.wiris.util.xml.WCharacterBase.ROOT_VERTICAL = 61727;
com.wiris.util.xml.WCharacterBase.ROOT_NO_TAIL = 61728;
com.wiris.util.xml.WCharacterBase.ROOT_NO_TAIL_VERTICAL = 61759;
com.wiris.util.xml.WCharacterBase.ROOT_LEFT_TAIL = 61760;
com.wiris.util.xml.WCharacterBase.ROOT_VERTICAL_LINE = 61761;
com.wiris.util.xml.WCharacterBase.ROUND_BRACKET_LEFT = 40;
com.wiris.util.xml.WCharacterBase.ROUND_BRACKET_RIGHT = 41;
com.wiris.util.xml.WCharacterBase.COMMA = 44;
com.wiris.util.xml.WCharacterBase.FULL_STOP = 46;
com.wiris.util.xml.WCharacterBase.SQUARE_BRACKET_LEFT = 91;
com.wiris.util.xml.WCharacterBase.SQUARE_BRACKET_RIGHT = 93;
com.wiris.util.xml.WCharacterBase.CIRCUMFLEX_ACCENT = 94;
com.wiris.util.xml.WCharacterBase.LOW_LINE = 95;
com.wiris.util.xml.WCharacterBase.CURLY_BRACKET_LEFT = 123;
com.wiris.util.xml.WCharacterBase.VERTICAL_BAR = 124;
com.wiris.util.xml.WCharacterBase.CURLY_BRACKET_RIGHT = 125;
com.wiris.util.xml.WCharacterBase.TILDE = 126;
com.wiris.util.xml.WCharacterBase.MACRON = 175;
com.wiris.util.xml.WCharacterBase.COMBINING_LOW_LINE = 818;
com.wiris.util.xml.WCharacterBase.MODIFIER_LETTER_CIRCUMFLEX_ACCENT = 710;
com.wiris.util.xml.WCharacterBase.CARON = 711;
com.wiris.util.xml.WCharacterBase.EN_QUAD = 8192;
com.wiris.util.xml.WCharacterBase.EM_QUAD = 8193;
com.wiris.util.xml.WCharacterBase.EN_SPACE = 8194;
com.wiris.util.xml.WCharacterBase.EM_SPACE = 8195;
com.wiris.util.xml.WCharacterBase.THICK_SPACE = 8196;
com.wiris.util.xml.WCharacterBase.MID_SPACE = 8197;
com.wiris.util.xml.WCharacterBase.SIX_PER_EM_SPACE = 8198;
com.wiris.util.xml.WCharacterBase.FIGIRE_SPACE = 8199;
com.wiris.util.xml.WCharacterBase.PUNCTUATION_SPACE = 8200;
com.wiris.util.xml.WCharacterBase.THIN_SPACE = 8201;
com.wiris.util.xml.WCharacterBase.HAIR_SPACE = 8202;
com.wiris.util.xml.WCharacterBase.ZERO_WIDTH_SPACE = 8203;
com.wiris.util.xml.WCharacterBase.ZERO_WIDTH_NON_JOINER = 8204;
com.wiris.util.xml.WCharacterBase.ZERO_WIDTH_JOINER = 8205;
com.wiris.util.xml.WCharacterBase.DOUBLE_VERTICAL_BAR = 8214;
com.wiris.util.xml.WCharacterBase.DOUBLE_HORIZONTAL_BAR = 9552;
com.wiris.util.xml.WCharacterBase.NARROW_NO_BREAK_SPACE = 8239;
com.wiris.util.xml.WCharacterBase.MEDIUM_MATHEMATICAL_SPACE = 8287;
com.wiris.util.xml.WCharacterBase.WORD_JOINER = 8288;
com.wiris.util.xml.WCharacterBase.PLANCKOVER2PI = 8463;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW = 8592;
com.wiris.util.xml.WCharacterBase.UPWARDS_ARROW = 8593;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW = 8594;
com.wiris.util.xml.WCharacterBase.DOWNWARDS_ARROW = 8595;
com.wiris.util.xml.WCharacterBase.LEFTRIGHT_ARROW = 8596;
com.wiris.util.xml.WCharacterBase.UP_DOWN_ARROW = 8597;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_FROM_BAR = 8612;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_FROM_BAR = 8614;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_WITH_HOOK = 8617;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_WITH_HOOK = 8618;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_HARPOON_WITH_BARB_UPWARDS = 8636;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_HARPOON_WITH_BARB_UPWARDS = 8640;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_DOUBLE_ARROW = 8656;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_DOUBLE_ARROW = 8658;
com.wiris.util.xml.WCharacterBase.LEFT_RIGHT_DOUBLE_ARROW = 8660;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_OVER_RIGHTWARDS_ARROW = 8646;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_OVER_LEFTWARDS_ARROW = 8644;
com.wiris.util.xml.WCharacterBase.LEFTWARDS_HARPOON_OVER_RIGHTWARDS_HARPOON = 8651;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_HARPOON_OVER_LEFTWARDS_HARPOON = 8652;
com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_ABOVE_SHORT_LEFTWARDS_ARROW = 10562;
com.wiris.util.xml.WCharacterBase.SHORT_RIGHTWARDS_ARROW_ABOVE_LEFTWARDS_ARROW = 10564;
com.wiris.util.xml.WCharacterBase.LONG_RIGHTWARDS_ARROW = 10230;
com.wiris.util.xml.WCharacterBase.LONG_LEFTWARDS_ARROW = 10229;
com.wiris.util.xml.WCharacterBase.LONG_LEFT_RIGHT_ARROW = 10231;
com.wiris.util.xml.WCharacterBase.LONG_LEFTWARDS_DOUBLE_ARROW = 10232;
com.wiris.util.xml.WCharacterBase.LONG_RIGHTWARDS_DOUBLE_ARROW = 10233;
com.wiris.util.xml.WCharacterBase.LONG_LEFT_RIGHT_DOUBLE_ARROW = 10234;
com.wiris.util.xml.WCharacterBase.TILDE_OPERATOR = 8764;
com.wiris.util.xml.WCharacterBase.LEFT_CEILING = 8968;
com.wiris.util.xml.WCharacterBase.RIGHT_CEILING = 8969;
com.wiris.util.xml.WCharacterBase.LEFT_FLOOR = 8970;
com.wiris.util.xml.WCharacterBase.RIGHT_FLOOR = 8971;
com.wiris.util.xml.WCharacterBase.TOP_PARENTHESIS = 9180;
com.wiris.util.xml.WCharacterBase.BOTTOM_PARENTHESIS = 9181;
com.wiris.util.xml.WCharacterBase.TOP_SQUARE_BRACKET = 9140;
com.wiris.util.xml.WCharacterBase.BOTTOM_SQUARE_BRACKET = 9141;
com.wiris.util.xml.WCharacterBase.TOP_CURLY_BRACKET = 9182;
com.wiris.util.xml.WCharacterBase.BOTTOM_CURLY_BRACKET = 9183;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_LEFT_ANGLE_BRACKET = 10216;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_RIGHT_ANGLE_BRACKET = 10217;
com.wiris.util.xml.WCharacterBase.DOUBLE_STRUCK_ITALIC_CAPITAL_D = 8517;
com.wiris.util.xml.WCharacterBase.DOUBLE_STRUCK_ITALIC_SMALL_D = 8518;
com.wiris.util.xml.WCharacterBase.DOUBLE_STRUCK_ITALIC_SMALL_E = 8519;
com.wiris.util.xml.WCharacterBase.DOUBLE_STRUCK_ITALIC_SMALL_I = 8520;
com.wiris.util.xml.WCharacterBase.EPSILON = 949;
com.wiris.util.xml.WCharacterBase.VAREPSILON = 1013;
com.wiris.util.xml.WCharacterBase.DIGIT_ZERO = 48;
com.wiris.util.xml.WCharacterBase.DIGIT_NINE = 57;
com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_A = 65;
com.wiris.util.xml.WCharacterBase.LATIN_CAPITAL_LETTER_Z = 90;
com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_A = 97;
com.wiris.util.xml.WCharacterBase.LATIN_SMALL_LETTER_Z = 122;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_SCRIPT_CAPITAL_A = 119964;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_SCRIPT_SMALL_A = 119990;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_FRAKTUR_CAPITAL_A = 120068;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_FRAKTUR_SMALL_A = 120094;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_CAPITAL_A = 120120;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_SMALL_A = 120146;
com.wiris.util.xml.WCharacterBase.MATHEMATICAL_DOUBLE_STRUCK_DIGIT_ZERO = 120792;
com.wiris.util.xml.WCharacterBase.binaryOps = [43,45,47,177,183,215,247,8226,8722,8723,8724,8726,8727,8728,8743,8744,8745,8746,8760,8768,8846,8851,8852,8853,8854,8855,8856,8857,8858,8859,8861,8862,8863,8864,8865,8890,8891,8900,8901,8902,8903,8905,8906,8907,8908,8910,8911,8914,8915,8966,9021,9675,10678,10789,10794,10797,10798,10799,10804,10805,10812,10815,10835,10836,10837,10838,10846,10847,10851];
com.wiris.util.xml.WCharacterBase.relations = [60,61,62,8592,8593,8594,8595,8596,8597,8598,8599,8600,8601,8602,8603,8604,8605,8606,8608,8610,8611,8614,8617,8618,8619,8620,8621,8622,8624,8625,8627,8630,8631,8636,8637,8638,8639,8640,8641,8642,8643,8644,8645,8646,8647,8648,8649,8650,8651,8652,8653,8654,8655,8656,8657,8658,8659,8660,8661,8666,8667,8669,8693,8712,8713,8715,8716,8733,8739,8740,8741,8742,8764,8765,8769,8770,8771,8772,8773,8774,8775,8776,8777,8778,8779,8781,8782,8783,8784,8785,8786,8787,8788,8789,8790,8791,8793,8794,8795,8796,8799,8800,8801,8802,8804,8805,8806,8807,8808,8809,8810,8811,8812,8814,8815,8816,8817,8818,8819,8820,8821,8822,8823,8824,8825,8826,8827,8828,8829,8830,8831,8832,8833,8834,8835,8836,8837,8838,8839,8840,8841,8842,8843,8847,8848,8849,8850,8866,8867,8869,8871,8872,8873,8874,8875,8876,8877,8878,8879,8882,8883,8884,8885,8886,8887,8888,8904,8909,8912,8913,8918,8919,8920,8921,8922,8923,8926,8927,8930,8931,8934,8935,8936,8937,8938,8939,8940,8941,8994,8995,9123,10229,10230,10231,10232,10233,10234,10236,10239,10501,10514,10515,10531,10532,10533,10534,10535,10536,10537,10538,10547,10550,10551,10560,10561,10562,10564,10567,10574,10575,10576,10577,10578,10579,10580,10581,10582,10583,10584,10585,10586,10587,10588,10589,10590,10591,10592,10593,10606,10607,10608,10620,10621,10869,10877,10878,10885,10886,10887,10888,10889,10890,10891,10892,10901,10902,10909,10910,10913,10914,10927,10928,10933,10934,10935,10936,10937,10938,10949,10950,10955,10956,10987,11005];
com.wiris.util.xml.WCharacterBase.largeOps = [8719,8720,8721,8896,8897,8898,8899,10756,10757,10758,10759,10760];
com.wiris.util.xml.WCharacterBase.veryLargeOps = [8747,8748,8749,8750,8751,8752,8753,8754,8755,10763,10764,10765,10766,10767,10768,10774,10775,10776,10777,10778,10779,10780];
com.wiris.util.xml.WCharacterBase.tallLetters = [98,100,102,104,105,106,107,108,116,946,948,950,952,955,958];
com.wiris.util.xml.WCharacterBase.longLetters = [103,106,112,113,121,946,947,950,951,956,958,961,962,966,967,968];
com.wiris.util.xml.WCharacterBase.negations = [61,8800,8801,8802,8764,8769,8712,8713,8715,8716,8834,8836,8835,8837,8838,8840,8839,8841,62,8815,60,8814,8805,8817,8804,8816,10878,8817,10877,8816,8776,8777,8771,8772,8773,8775,8849,8930,8850,8931,8707,8708,8741,8742];
com.wiris.util.xml.WCharacterBase.mirrorDictionary = [40,41,41,40,60,62,62,60,91,93,93,91,123,125,125,123,171,187,187,171,3898,3899,3899,3898,3900,3901,3901,3900,5787,5788,5788,5787,8249,8250,8250,8249,8261,8262,8262,8261,8317,8318,8318,8317,8333,8334,8334,8333,8712,8715,8713,8716,8714,8717,8715,8712,8716,8713,8717,8714,8725,10741,8764,8765,8765,8764,8771,8909,8786,8787,8787,8786,8788,8789,8789,8788,8804,8805,8805,8804,8806,8807,8807,8806,8808,8809,8809,8808,8810,8811,8811,8810,8814,8815,8815,8814,8816,8817,8817,8816,8818,8819,8819,8818,8820,8821,8821,8820,8822,8823,8823,8822,8824,8825,8825,8824,8826,8827,8827,8826,8828,8829,8829,8828,8830,8831,8831,8830,8832,8833,8833,8832,8834,8835,8835,8834,8836,8837,8837,8836,8838,8839,8839,8838,8840,8841,8841,8840,8842,8843,8843,8842,8847,8848,8848,8847,8849,8850,8850,8849,8856,10680,8866,8867,8867,8866,8870,10974,8872,10980,8873,10979,8875,10981,8880,8881,8881,8880,8882,8883,8883,8882,8884,8885,8885,8884,8886,8887,8887,8886,8905,8906,8906,8905,8907,8908,8908,8907,8909,8771,8912,8913,8913,8912,8918,8919,8919,8918,8920,8921,8921,8920,8922,8923,8923,8922,8924,8925,8925,8924,8926,8927,8927,8926,8928,8929,8929,8928,8930,8931,8931,8930,8932,8933,8933,8932,8934,8935,8935,8934,8936,8937,8937,8936,8938,8939,8939,8938,8940,8941,8941,8940,8944,8945,8945,8944,8946,8954,8947,8955,8948,8956,8950,8957,8951,8958,8954,8946,8955,8947,8956,8948,8957,8950,8958,8951,8968,8969,8969,8968,8970,8971,8971,8970,9001,9002,9002,9001,10088,10089,10089,10088,10090,10091,10091,10090,10092,10093,10093,10092,10094,10095,10095,10094,10096,10097,10097,10096,10098,10099,10099,10098,10100,10101,10101,10100,10179,10180,10180,10179,10181,10182,10182,10181,10184,10185,10185,10184,10187,10189,10189,10187,10197,10198,10198,10197,10205,10206,10206,10205,10210,10211,10211,10210,10212,10213,10213,10212,10214,10215,10215,10214,10216,10217,10217,10216,10218,10219,10219,10218,10220,10221,10221,10220,10222,10223,10223,10222,10627,10628,10628,10627,10629,10630,10630,10629,10631,10632,10632,10631,10633,10634,10634,10633,10635,10636,10636,10635,10637,10640,10638,10639,10639,10638,10640,10637,10641,10642,10642,10641,10643,10644,10644,10643,10645,10646,10646,10645,10647,10648,10648,10647,10680,8856,10688,10689,10689,10688,10692,10693,10693,10692,10703,10704,10704,10703,10705,10706,10706,10705,10708,10709,10709,10708,10712,10713,10713,10712,10714,10715,10715,10714,10741,8725,10744,10745,10745,10744,10748,10749,10749,10748,10795,10796,10796,10795,10797,10798,10798,10797,10804,10805,10805,10804,10812,10813,10813,10812,10852,10853,10853,10852,10873,10874,10874,10873,10877,10878,10878,10877,10879,10880,10880,10879,10881,10882,10882,10881,10883,10884,10884,10883,10891,10892,10892,10891,10897,10898,10898,10897,10899,10900,10900,10899,10901,10902,10902,10901,10903,10904,10904,10903,10905,10906,10906,10905,10907,10908,10908,10907,10913,10914,10914,10913,10918,10919,10919,10918,10920,10921,10921,10920,10922,10923,10923,10922,10924,10925,10925,10924,10927,10928,10928,10927,10931,10932,10932,10931,10939,10940,10940,10939,10941,10942,10942,10941,10943,10944,10944,10943,10945,10946,10946,10945,10947,10948,10948,10947,10949,10950,10950,10949,10957,10958,10958,10957,10959,10960,10960,10959,10961,10962,10962,10961,10963,10964,10964,10963,10965,10966,10966,10965,10974,8870,10979,8873,10980,8872,10981,8875,10988,10989,10989,10988,10999,11000,11000,10999,11001,11002,11002,11001,11778,11779,11779,11778,11780,11781,11781,11780,11785,11786,11786,11785,11788,11789,11789,11788,11804,11805,11805,11804,11808,11809,11809,11808,11810,11811,11811,11810,11812,11813,11813,11812,11814,11815,11815,11814,11816,11817,11817,11816,12296,12297,12297,12296,12298,12299,12299,12298,12300,12301,12301,12300,12302,12303,12303,12302,12304,12305,12305,12304,12308,12309,12309,12308,12310,12311,12311,12310,12312,12313,12313,12312,12314,12315,12315,12314,65113,65114,65114,65113,65115,65116,65116,65115,65117,65118,65118,65117,65124,65125,65125,65124,65288,65289,65289,65288,65308,65310,65310,65308,65339,65341,65341,65339,65371,65373,65373,65371,65375,65376,65376,65375,65378,65379,65379,65378,9115,9118,9116,9119,9117,9120,9118,9115,9119,9116,9120,9117,9121,9124,9122,9125,9123,9126,9124,9121,9125,9122,9126,9123,9127,9131,9130,9134,9129,9133,9131,9127,9134,9130,9133,9129,9128,9132,9132,9128];
com.wiris.util.xml.WCharacterBase.subSuperScriptDictionary = [178,50,179,51,185,49,8304,48,8305,105,8308,52,8309,53,8310,54,8311,55,8312,56,8313,57,8314,43,8315,45,8316,61,8317,40,8318,41,8319,110,8320,48,8321,49,8322,50,8323,51,8324,52,8325,53,8326,54,8327,55,8328,56,8329,57,8330,43,8331,45,8332,61,8333,40,8334,41,8336,97,8337,101,8338,111,8339,120,8340,601,8341,104,8342,107,8343,108,8344,109,8345,110,8346,112,8347,115,8348,116];
com.wiris.util.xml.WCharacterBase.horizontalLTRStretchyChars = [com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.LEFTRIGHT_ARROW,com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_FROM_BAR,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_FROM_BAR,com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_WITH_HOOK,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_WITH_HOOK,com.wiris.util.xml.WCharacterBase.LEFTWARDS_HARPOON_WITH_BARB_UPWARDS,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_HARPOON_WITH_BARB_UPWARDS,com.wiris.util.xml.WCharacterBase.LEFTWARDS_DOUBLE_ARROW,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_DOUBLE_ARROW,com.wiris.util.xml.WCharacterBase.TOP_CURLY_BRACKET,com.wiris.util.xml.WCharacterBase.BOTTOM_CURLY_BRACKET,com.wiris.util.xml.WCharacterBase.TOP_PARENTHESIS,com.wiris.util.xml.WCharacterBase.BOTTOM_PARENTHESIS,com.wiris.util.xml.WCharacterBase.TOP_SQUARE_BRACKET,com.wiris.util.xml.WCharacterBase.BOTTOM_SQUARE_BRACKET,com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_OVER_RIGHTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_OVER_LEFTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.LEFTWARDS_HARPOON_OVER_RIGHTWARDS_HARPOON,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_HARPOON_OVER_LEFTWARDS_HARPOON];
com.wiris.util.xml.WCharacterBase.tallAccents = [com.wiris.util.xml.WCharacterBase.LEFTWARDS_ARROW_OVER_RIGHTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_ARROW_OVER_LEFTWARDS_ARROW,com.wiris.util.xml.WCharacterBase.LEFTWARDS_HARPOON_OVER_RIGHTWARDS_HARPOON,com.wiris.util.xml.WCharacterBase.RIGHTWARDS_HARPOON_OVER_LEFTWARDS_HARPOON];
com.wiris.util.xml.WCharacterBase.PUNCTUATION_CATEGORY = "P";
com.wiris.util.xml.WCharacterBase.OTHER_CATEGORY = "C";
com.wiris.util.xml.WCharacterBase.LETTER_CATEGORY = "L";
com.wiris.util.xml.WCharacterBase.MARK_CATEGORY = "M";
com.wiris.util.xml.WCharacterBase.NUMBER_CATEGORY = "N";
com.wiris.util.xml.WCharacterBase.SYMBOL_CATEGORY = "S";
com.wiris.util.xml.WCharacterBase.PHONETICAL_CATEGORY = "F";
com.wiris.util.xml.WCharacterBase.UNICODES_WITH_CATEGORIES = "@P:21-23,25-2A,2C-2F,3A-3B,3F-40,5B-5D,5F,7B,7D,A1,A7,AB,B6-B7,BB,BF,37E,387,55A-55F,589-58A,5BE,5C0,5C3,5C6,5F3-5F4,609-60A,60C-60D,61B,61E-61F,66A-66D,6D4,E4F,E5A-E5B,2010-2022,2025-2026,2030-203E,2040,2043,2047,204E-2051,2057,205E,2308-230B,2329-232A,2772-2773,27C5-27C6,27E6-27EF,2983-2998,29D8-29DB,29FC-29FD,2E17,3030,FD3E-FD3F@C:AD,600-603,6DD,200B-200F,202A-202E,206A-206F@L:41-5A,61-7A,AA,B5,BA,C0-D6,D8-F6,F8-2C1,2C6-2D1,2E0-2E4,2EC,2EE,370-374,376-377,37A-37D,386,388-38A,38C,38E-3A1,3A3-3F5,3F7-481,48A-527,531-556,559,561-587,5D0-5EA,5F0-5F2,620-64A,66E-66F,671-6D3,6D5,6E5-6E6,6EE-6EF,6FA-6FC,6FF,750-77F,E01-E30,E32-E33,E40-E46,1D00-1DBF,1E00-1F15,1F18-1F1D,1F20-1F45,1F48-1F4D,1F50-1F57,1F59,1F5B,1F5D,1F5F-1F7D,1F80-1FB4,1FB6-1FBC,1FBE,1FC2-1FC4,1FC6-1FCC,1FD0-1FD3,1FD6-1FDB,1FE0-1FEC,1FF2-1FF4,1FF6-1FFC,207F,2090-2094,2102,2107,210A-2113,2115,2119-211D,2124,2126,2128,212B-212D,212F-2138,213C-213F,2145-2149,214E,2184,2C60-2C7F,306E,A717-A71F,A727,A788,A78B-A78C,A792,FB00-FB04,FB13-FB17,FB1D,FB1F-FB28,FB2A-FB36,FB38-FB3C,FB3E,FB40-FB41,FB43-FB44,FB46-FBB1,FBD3-FBE9,FBFC-FBFF,FC5E-FC63,FC6A,FC6D,FC70,FC73,FC91,FC94,FDF2,FE70-FE74,FE76-FEFC,1D400-1D454,1D456-1D49C,1D49E-1D49F,1D4A2,1D4A5-1D4A6,1D4A9-1D4AC,1D4AE-1D4B9,1D4BB,1D4BD-1D4C3,1D4C5-1D505,1D507-1D50A,1D50D-1D514,1D516-1D51C,1D51E-1D539,1D53B-1D53E,1D540-1D544,1D546,1D54A-1D550,1D552-1D6A5,1D6A8-1D6C0,1D6C2-1D6DA,1D6DC-1D6FA,1D6FC-1D714,1D716-1D734,1D736-1D74E,1D750-1D76E,1D770-1D788,1D78A-1D7A8,1D7AA-1D7C2,1D7C4-1D7C9@M:300-36F,483-489,591-5BD,5BF,5C1-5C2,5C4-5C5,5C7,610-61A,64B-65F,670,6D6-6DC,6DF-6E4,6E7-6E8,6EA-6ED,E31,E34-E3A,E47-E4E,1DC0-1DC1,1DC3,1DCA,1DFE-1DFF,20D0-20D2,20D6-20D7,20DB-20DF,20E1,20E4-20F0,FB1E,FE20-FE23@N:30-39,B2-B3,B9,BC-BE,660-669,6F0-6F9,E50-E59,2070,2074-2079,2080-2089,2153-215E,2460-2468,24EA,2780-2793,1D7CE-1D7FF@S:24,2B,3C-3E,5E,60,7C,7E,A2-A6,A8-A9,AC,AE-B1,B4,B8,D7,F7,2C2-2C5,2D2-2DF,2E5-2EB,2ED,2EF-2FF,375,384-385,3F6,482,58F,606-608,60B,60E-60F,6DE,6E9,6FD-6FE,E3F,1FBD,1FBF-1FC1,1FCD-1FCF,1FDD-1FDF,1FED-1FEF,1FFD-1FFE,2044,2052,20A0-20BA,2105,2116-2118,211E,2120,2122,2125,2127,2129,212E,2140-2144,214A-214B,214D,2190-21EA,21F4-2300,2302,2305-2306,230C-2313,2315-231A,231C-2323,232C-232E,2332,2336,233D,233F-2340,2353,2370,237C,2393-2394,23AF,23B4-23B6,23CE,23D0,23DC-23E7,2423,24B6-24E9,2500,2502,2506,2508,250A,250C,2510,2514,2518,251C,2524,252C,2534,253C,2550-256C,2571-2572,2580,2584,2588,258C,2590-2593,25A0-25FF,2605-2606,2609,260C,260E,2612,2621,2639-2644,2646-2649,2660-2667,2669-266B,266D-266F,267E,2680-2689,26A0,26A5,26AA-26AC,26B2,26E2,2702,2709,2713,2720,272A,2736,273D,279B,27C0-27C4,27C7-27C9,27CB-27CD,27D0-27E5,27F0-27FF,2900-2982,2999-29D7,29DC-29FB,29FE-2AFF,2B12-2B4C,2B50-2B54,3012,A720-A721,A789-A78A,FB29,FBB2-FBC1,FDFC,FFFC-FFFD,1D6C1,1D6DB,1D6FB,1D715,1D735,1D74F,1D76F,1D789,1D7A9,1D7C3@F:70,62,74,64,288,256,63,25F,6B,261,71,262,294,6D,271,6E,273,272,14B,274,72,280,27E,27D,278,3B2,66,76,3B8,F0,73,7A,283,292,282,290,E7,29D,78,263,3C7,281,127,295,68,266,26C,26E,28B,279,27B,6A,270,6C,26D,28E,29F,1A5,253,1AD,257,188,284,199,260,2A0,29B,28D,77,265,29C,2A1-2A2,267,298,1C0,1C3,1C2,1C1,27A,255,291,2C71,287,297,296,286,293,27C,2E2,1AB,26B,67,2A6,2A3,2A7,2A4,2A8,2A5,1DBF,1D4A,1D91,1BB,29E,2E3,19E,19B,3BB,17E,161,1F0,10D,69,65,25B,61,251,254,6F,75,79,F8,153,276,252,28C,264,26F,268,289,26A,28F,28A,259,275,250,E6,25C,25A,131,25E,29A,258,277,269,2BC,325,30A,32C,2B0,324,330,33C,32A,33A-33B,339,31C,31F-320,308,33D,318-319,2DE,2B7,2B2,2E0,2E4,303,207F,2E1,31A,334,31D,2D4,31E,2D5,329,32F,361,35C,322,2F9,2C,2BB,307,2D7,2D6,2B8,323,321,32B,2C8,2CC,2D0-2D1,306,2E,7C,2016,203F,2197-2198,30B,301,304,300,30F,A71B-A71C,2E5-2E9,30C,302,1DC4-1DC5,1DC8,311,2C7,2C6,316,2CE,317,2CF,2AD,2A9-2AB,274D,2A,56,46,57,43,4C,4A,152,398,1D191,1D18F,31-33,346,34D,34A-34C,348-349,5C,34E,2193,2191,2EC,1DB9,362,347,2B6,2ED,2F1-2F2,2F7,41-42,44-45,47-49,4B,4D-55,58-5B,5D,2F,28-29,7B,7D@";
com.wiris.util.xml.WCharacterBase.invisible = [8289,8290,8291];
com.wiris.util.xml.WCharacterBase.horizontalOperators = [175,818,8592,8594,8596,8612,8614,8617,8618,8636,8637,8640,8641,8644,8646,8651,8652,8656,8658,8660,8764,9140,9141,9180,9181,9182,9183,9552,10562,10564,10602,10605];
com.wiris.util.xml.WCharacterBase.latinLetters = "@0065@0066@0067@0068@0069@0070@0071@0072@0073@0074@0075@0076@0077@0078@0079@0080@0081@0082@0083@0084@0085@0086@0087@0088@0089@0090" + "@0097@0098@0099@0100@0101@0102@0103@0104@0105@0106@0107@0108@0109@0110@0111@0112@0113@0114@0115@0116@0117@0118@0119@0120@0121@0122@";
com.wiris.util.xml.WCharacterBase.greekLetters = "@0913@0914@0935@0916@0917@0934@0915@0919@0921@0977@0922@0923@0924@0925@0927@0928@0920@0929@0931@0932@0933@0962@0937@0926@0936@0918" + "@0945@0946@0967@0948@0949@0966@0947@0951@0953@0966@0954@0955@0956@0957@0959@0960@0952@0961@0963@0964@0965@0982@0969@0958@0968@0950@";
com.wiris.util.xml.WEntities.s1 = "boxDL@02557@boxDl@02556@boxdL@02555@boxdl@02510@boxDR@02554@boxDr@02553@boxdR@02552@boxdr@0250C@boxH@02550@boxh@02500@boxHD@02566@boxHd@02564@boxhD@02565@boxhd@0252C@boxHU@02569@boxHu@02567@boxhU@02568@boxhu@02534@boxUL@0255D@boxUl@0255C@boxuL@0255B@boxul@02518@boxUR@0255A@boxUr@02559@boxuR@02558@boxur@02514@boxV@02551@boxv@02502@boxVH@0256C@boxVh@0256B@boxvH@0256A@boxvh@0253C@boxVL@02563@boxVl@02562@boxvL@02561@boxvl@02524@boxVR@02560@boxVr@0255F@boxvR@0255E@boxvr@0251C@Acy@00410@acy@00430@Bcy@00411@bcy@00431@CHcy@00427@chcy@00447@Dcy@00414@dcy@00434@Ecy@0042D@ecy@0044D@Fcy@00424@fcy@00444@Gcy@00413@gcy@00433@HARDcy@0042A@hardcy@0044A@Icy@00418@icy@00438@IEcy@00415@iecy@00435@IOcy@00401@iocy@00451@Jcy@00419@jcy@00439@Kcy@0041A@kcy@0043A@KHcy@00425@khcy@00445@Lcy@0041B@lcy@0043B@Mcy@0041C@mcy@0043C@Ncy@0041D@ncy@0043D@numero@02116@Ocy@0041E@ocy@0043E@Pcy@0041F@pcy@0043F@Rcy@00420@rcy@00440@Scy@00421@scy@00441@SHCHcy@00429@shchcy@00449@SHcy@00428@shcy@00448@SOFTcy@0042C@softcy@0044C@Tcy@00422@tcy@00442@TScy@00426@tscy@00446@Ucy@00423@ucy@00443@Vcy@00412@vcy@00432@YAcy@0042F@yacy@0044F@Ycy@0042B@ycy@0044B@YUcy@0042E@yucy@0044E@Zcy@00417@zcy@00437@ZHcy@00416@zhcy@00436@DJcy@00402@djcy@00452@DScy@00405@dscy@00455@DZcy@0040F@dzcy@0045F@GJcy@00403@gjcy@00453@Iukcy@00406@iukcy@00456@Jsercy@00408@jsercy@00458@Jukcy@00404@jukcy@00454@KJcy@0040C@kjcy@0045C@LJcy@00409@ljcy@00459@NJcy@0040A@njcy@0045A@TSHcy@0040B@tshcy@0045B@Ubrcy@0040E@ubrcy@0045E@YIcy@00407@yicy@00457@acute@000B4@breve@002D8@caron@002C7@cedil@000B8@circ@002C6@dblac@002DD@die@000A8@dot@002D9@grave@00060@macr@000AF@ogon@002DB@ring@002DA@tilde@002DC@uml@000A8@Aacute@000C1@aacute@000E1@Acirc@000C2@acirc@000E2@AElig@000C6@aelig@000E6@Agrave@000C0@agrave@000E0@Aring@000C5@aring@000E5@Atilde@000C3@atilde@000E3@Auml@000C4@auml@000E4@Ccedil@000C7@ccedil@000E7@Eacute@000C9@eacute@000E9@Ecirc@000CA@ecirc@000EA@Egrave@000C8@egrave@000E8@ETH@000D0@eth@000F0@Euml@000CB@euml@000EB@Iacute@000CD@iacute@000ED@Icirc@000CE@icirc@000EE@Igrave@000CC@igrave@000EC@Iuml@000CF@iuml@000EF@Ntilde@000D1@ntilde@000F1@Oacute@000D3@oacute@000F3@Ocirc@000D4@ocirc@000F4@Ograve@000D2@ograve@000F2@Oslash@000D8@oslash@000F8@Otilde@000D5@otilde@000F5@Ouml@000D6@ouml@000F6@szlig@000DF@THORN@000DE@thorn@000FE@Uacute@000DA@uacute@000FA@Ucirc@000DB@ucirc@000FB@Ugrave@000D9@ugrave@000F9@Uuml@000DC@uuml@000FC@Yacute@000DD@yacute@000FD@yuml@000FF@Abreve@00102@abreve@00103@Amacr@00100@amacr@00101@Aogon@00104@aogon@00105@Cacute@00106@cacute@00107@Ccaron@0010C@ccaron@0010D@Ccirc@00108@ccirc@00109@Cdot@0010A@cdot@0010B@Dcaron@0010E@dcaron@0010F@Dstrok@00110@dstrok@00111@Ecaron@0011A@ecaron@0011B@Edot@00116@edot@00117@Emacr@00112@emacr@00113@ENG@0014A@eng@0014B@Eogon@00118@eogon@00119@gacute@001F5@Gbreve@0011E@gbreve@0011F@Gcedil@00122@Gcirc@0011C@gcirc@0011D@Gdot@00120@gdot@00121@Hcirc@00124@hcirc@00125@Hstrok@00126@hstrok@00127@Idot@00130@IJlig@00132@ijlig@00133@Imacr@0012A@imacr@0012B@inodot@00131@Iogon@0012E@iogon@0012F@Itilde@00128@itilde@00129@Jcirc@00134@jcirc@00135@Kcedil@00136@kcedil@00137@kgreen@00138@Lacute@00139@lacute@0013A@Lcaron@0013D@lcaron@0013E@Lcedil@0013B@lcedil@0013C@Lmidot@0013F@lmidot@00140@Lstrok@00141@lstrok@00142@Nacute@00143@nacute@00144@napos@00149@Ncaron@00147@ncaron@00148@Ncedil@00145@ncedil@00146@Odblac@00150@odblac@00151@OElig@00152@oelig@00153@Omacr@0014C@omacr@0014D@Racute@00154@racute@00155@Rcaron@00158@rcaron@00159@Rcedil@00156@rcedil@00157@Sacute@0015A@sacute@0015B@Scaron@00160@scaron@00161@Scedil@0015E@scedil@0015F@Scirc@0015C@scirc@0015D@Tcaron@00164@tcaron@00165@Tcedil@00162@tcedil@00163@Tstrok@00166@tstrok@00167@Ubreve@0016C@ubreve@0016D@Udblac@00170@udblac@00171@Umacr@0016A@umacr@0016B@Uogon@00172@uogon@00173@Uring@0016E@uring@0016F@Utilde@00168@utilde@00169@Wcirc@00174@wcirc@00175@Ycirc@00176@ycirc@00177@Yuml@00178@Zacute@00179@zacute@0017A@Zcaron@0017D@zcaron@0017E@Zdot@0017B@zdot@0017C@apos@00027@ast@0002A@brvbar@000A6@bsol@0005C@cent@000A2@colon@0003A@comma@0002C@commat@00040@copy@000A9@curren@000A4@darr@02193@deg@000B0@divide@000F7@dollar@00024@equals@0003D@excl@00021@frac12@000BD@frac14@000BC@frac18@0215B@frac34@000BE@frac38@0215C@frac58@0215D@frac78@0215E@gt@0003E@half@000BD@horbar@02015@hyphen@02010@iexcl@000A1@iquest@000BF@laquo@000AB@larr@02190@lcub@0007B@ldquo@0201C@lowbar@0005F@lpar@00028@lsqb@0005B@lsquo@02018@micro@000B5@middot@000B7@nbsp@000A0@not@000AC@num@00023@ohm@02126@ordf@000AA@ordm@000BA@para@000B6@percnt@00025@period@0002E@plus@0002B@plusmn@000B1@pound@000A3@quest@0003F@quot@00022@raquo@000BB@rarr@02192@rcub@0007D@rdquo@0201D@reg@000AE@rpar@00029@rsqb@0005D@rsquo@02019@sect@000A7@semi@0003B@shy@000AD@sol@0002F@sung@0266A@sup1@000B9@sup2@000B2@sup3@000B3@times@000D7@trade@02122@uarr@02191@verbar@0007C@yen@000A5@blank@02423@blk12@02592@blk14@02591@blk34@02593@block@02588@bull@02022@caret@02041@check@02713@cir@025CB@clubs@02663@copysr@02117@cross@02717@Dagger@02021@dagger@02020@dash@02010@diams@02666@dlcrop@0230D@drcrop@0230C@dtri@025BF@dtrif@025BE@emsp@02003@emsp13@02004@emsp14@02005@ensp@02002@female@02640@ffilig@0FB03@fflig@0FB00@ffllig@0FB04@filig@0FB01@flat@0266D@fllig@0FB02@frac13@02153@frac15@02155@frac16@02159@frac23@02154@frac25@02156@frac35@02157@frac45@02158@frac56@0215A@hairsp@0200A@hearts@02665@hellip@02026@hybull@02043@incare@02105@ldquor@0201E@lhblk@02584@loz@025CA@lozf@029EB@lsquor@0201A@ltri@025C3@ltrif@025C2@male@02642@malt@02720@marker@025AE@mdash@02014@mldr@02026@natur@0266E@ndash@02013@nldr@02025@numsp@02007@phone@0260E@puncsp@02008@rdquor@0201D@rect@025AD@rsquor@02019@rtri@025B9@rtrif@025B8@rx@0211E@sext@02736@sharp@0266F@spades@02660@squ@025A1@squf@025AA@star@02606@starf@02605@target@02316@telrec@02315@thinsp@02009@uhblk@02580@ulcrop@0230F@urcrop@0230E@utri@025B5@utrif@025B4@vellip@022EE@angzarr@0237C@cirmid@02AEF@cudarrl@02938@cudarrr@02935@cularr@021B6@cularrp@0293D@curarr@021B7@curarrm@0293C@Darr@021A1@dArr@021D3@ddarr@021CA@DDotrahd@02911@dfisht@0297F@dHar@02965@dharl@021C3@dharr@021C2@duarr@021F5@duhar@0296F@dzigrarr@027FF@erarr@02971@hArr@021D4@harr@02194@harrcir@02948@harrw@021AD@hoarr@021FF@imof@022B7@lAarr@021DA@Larr@0219E@larrbfs@0291F@larrfs@0291D@larrhk@021A9@larrlp@021AB@larrpl@02939@larrsim@02973@larrtl@021A2@lAtail@0291B@latail@02919@lBarr@0290E@lbarr@0290C@ldca@02936@ldrdhar@02967@ldrushar@0294B@ldsh@021B2@lfisht@0297C@lHar@02962@lhard@021BD@lharu@021BC@lharul@0296A@llarr@021C7@llhard@0296B@loarr@021FD@lrarr@021C6@lrhar@021CB@lrhard@0296D@lsh@021B0@lurdshar@0294A@luruhar@02966@Map@02905@map@021A6@midcir@02AF0@mumap@022B8@nearhk@02924@neArr@021D7@nearr@02197@nesear@02928@nhArr@021CE@nharr@021AE@nlArr@021CD@nlarr@0219A@nrArr@021CF@nrarr@0219B@nvHarr@02904@nvlArr@02902@nvrArr@02903@nwarhk@02923@nwArr@021D6@nwarr@02196@nwnear@02927@olarr@021BA@orarr@021BB@origof@022B6@rAarr@021DB@Rarr@021A0@rarrap@02975@rarrbfs@02920@rarrc@02933@rarrfs@0291E@rarrhk@021AA@rarrlp@021AC@rarrpl@02945@rarrsim@02974@Rarrtl@02916@rarrtl@021A3@rarrw@0219D@rAtail@0291C@ratail@0291A@RBarr@02910@rBarr@0290F@rbarr@0290D@rdca@02937@rdldhar@02969@rdsh@021B3@rfisht@0297D@rHar@02964@rhard@021C1@rharu@021C0@rharul@0296C@rlarr@021C4@rlhar@021CC@roarr@021FE@rrarr@021C9@rsh@021B1@ruluhar@02968@searhk@02925@seArr@021D8@searr@02198@seswar@02929@simrarr@02972@slarr@02190@srarr@02192@swarhk@02926@swArr@021D9@swarr@02199@swnwar@0292A@Uarr@0219F@uArr@021D1@Uarrocir@02949@udarr@021C5@udhar@0296E@ufisht@0297E@uHar@02963@uharl@021BF@uharr@021BE@uuarr@021C8@vArr@021D5@varr@02195@xhArr@027FA@xharr@027F7@xlArr@027F8@xlarr@027F5@xmap@027FC@xrArr@027F9@xrarr@027F6@zigrarr@021DD@ac@0223E@amalg@02A3F@barvee@022BD@Barwed@02306@barwed@02305@bsolb@029C5@Cap@022D2@capand@02A44@capbrcup@02A49@capcap@02A4B@capcup@02A47@capdot@02A40@ccaps@02A4D@ccups@02A4C@ccupssm@02A50@coprod@02210@Cup@022D3@cupbrcap@02A48@cupcap@02A46@cupcup@02A4A@cupdot@0228D@cupor@02A45@cuvee@022CE@cuwed@022CF@Dagger@02021@dagger@02020@diam@022C4@divonx@022C7@eplus@02A71@hercon@022B9@intcal@022BA@iprod@02A3C@loplus@02A2D@lotimes@02A34@lthree@022CB@ltimes@022C9@midast@0002A@minusb@0229F@minusd@02238@minusdu@02A2A@ncap@02A43@ncup@02A42@oast@0229B@ocir@0229A@odash@0229D@odiv@02A38@odot@02299@odsold@029BC@ofcir@029BF@ogt@029C1@ohbar@029B5@olcir@029BE@olt@029C0@omid@029B6@ominus@02296@opar@029B7@operp@029B9@oplus@02295@osol@02298@Otimes@02A37@otimes@02297@otimesas@02A36@ovbar@0233D@plusacir@02A23@plusb@0229E@pluscir@02A22@plusdo@02214@plusdu@02A25@pluse@02A72@plussim@02A26@plustwo@02A27@prod@0220F@race@029DA@roplus@02A2E@rotimes@02A35@rthree@022CC@rtimes@022CA@sdot@022C5@sdotb@022A1@setmn@02216@simplus@02A24@smashp@02A33@solb@029C4@sqcap@02293@sqcup@02294@ssetmn@02216@sstarf@022C6@subdot@02ABD@sum@02211@supdot@02ABE@timesb@022A0@timesbar@02A31@timesd@02A30@tridot@025EC@triminus@02A3A@triplus@02A39@trisb@029CD@tritime@02A3B@uplus@0228E@veebar@022BB@wedbar@02A5F@wreath@02240@xcap@022C2@xcirc@025EF@xcup@022C3@xdtri@025BD@xodot@02A00@xoplus@02A01@xotime@02A02@xsqcup@02A06@xuplus@02A04@xutri@025B3@xvee@022C1@xwedge@022C0@dlcorn@0231E@drcorn@0231F@gtlPar@02995@langd@02991@lbrke@0298B@lbrksld@0298F@lbrkslu@0298D@lceil@02308@lfloor@0230A@lmoust@023B0@lparlt@02993@ltrPar@02996@rangd@02992@rbrke@0298C@rbrksld@0298E@rbrkslu@02990@rceil@02309@rfloor@0230B@rmoust@023B1@rpargt@02994@ulcorn@0231C@urcorn@0231D@gnap@02A8A@gnE@02269@gne@02A88@gnsim@022E7@lnap@02A89@lnE@02268@lne@02A87@lnsim@022E6@nap@02249@ncong@02247@nequiv@02262@nge@02271@ngsim@02275@ngt@0226F@nle@02270@nlsim@02274@nlt@0226E@nltri@022EA@nltrie@022EC@nmid@02224@npar@02226@npr@02280@nprcue@022E0@nrtri@022EB@nrtrie@022ED@nsc@02281@nsccue@022E1@nsim@02241@nsime@02244@nsmid@02224@nspar@02226@nsqsube@022E2@nsqsupe@022E3@nsub@02284@nsube@02288@nsup@02285@nsupe@02289@ntgl@02279@ntlg@02278@nVDash@022AF@nVdash@022AE@nvDash@022AD@nvdash@022AC@parsim@02AF3@prnap@02AB9@prnE@02AB5@prnsim@022E8@rnmid@02AEE@scnap@02ABA@scnE@02AB6@scnsim@022E9@simne@02246@solbar@0233F@subnE@02ACB@subne@0228A@supnE@02ACC@supne@0228B@ang@02220@ange@029A4@angmsd@02221@angmsdaa@029A8@angmsdab@029A9@angmsdac@029AA@angmsdad@029AB@angmsdae@029AC@angmsdaf@029AD@angmsdag@029AE@angmsdah@029AF@angrtvb@022BE@angrtvbd@0299D@bbrk@023B5@bbrktbrk@023B6@bemptyv@029B0@beth@02136@boxbox@029C9@";
com.wiris.util.xml.WEntities.s2 = "bprime@02035@bsemi@0204F@cemptyv@029B2@cirE@029C3@cirscir@029C2@comp@02201@daleth@02138@demptyv@029B1@ell@02113@empty@02205@emptyv@02205@gimel@02137@iiota@02129@image@02111@imath@00131@jmath@0006A@laemptyv@029B4@lltri@025FA@lrtri@022BF@mho@02127@nexist@02204@oS@024C8@planck@0210F@plankv@0210F@raemptyv@029B3@range@029A5@real@0211C@tbrk@023B4@trpezium@0FFFD@ultri@025F8@urtri@025F9@vzigzag@0299A@weierp@02118@apE@02A70@ape@0224A@apid@0224B@asymp@02248@Barv@02AE7@bcong@0224C@bepsi@003F6@bowtie@022C8@bsim@0223D@bsime@022CD@bump@0224E@bumpE@02AAE@bumpe@0224F@cire@02257@Colon@02237@Colone@02A74@colone@02254@congdot@02A6D@csub@02ACF@csube@02AD1@csup@02AD0@csupe@02AD2@cuepr@022DE@cuesc@022DF@Dashv@02AE4@dashv@022A3@easter@02A6E@ecir@02256@ecolon@02255@eDDot@02A77@eDot@02251@efDot@02252@eg@02A9A@egs@02A96@egsdot@02A98@el@02A99@els@02A95@elsdot@02A97@equest@0225F@equivDD@02A78@erDot@02253@esdot@02250@Esim@02A73@esim@02242@fork@022D4@forkv@02AD9@frown@02322@gap@02A86@gE@02267@gEl@02A8C@gel@022DB@ges@02A7E@gescc@02AA9@gesdot@02A80@gesdoto@02A82@gesdotol@02A84@gesles@02A94@Gg@022D9@gl@02277@gla@02AA5@glE@02A92@glj@02AA4@gsim@02273@gsime@02A8E@gsiml@02A90@Gt@0226B@gtcc@02AA7@gtcir@02A7A@gtdot@022D7@gtquest@02A7C@gtrarr@02978@homtht@0223B@lap@02A85@lat@02AAB@late@02AAD@lE@02266@lEg@02A8B@leg@022DA@les@02A7D@lescc@02AA8@lesdot@02A7F@lesdoto@02A81@lesdotor@02A83@lesges@02A93@lg@02276@lgE@02A91@Ll@022D8@lsim@02272@lsime@02A8D@lsimg@02A8F@Lt@0226A@ltcc@02AA6@ltcir@02A79@ltdot@022D6@ltlarr@02976@ltquest@02A7B@ltrie@022B4@mcomma@02A29@mDDot@0223A@mid@02223@mlcp@02ADB@models@022A7@mstpos@0223E@Pr@02ABB@pr@0227A@prap@02AB7@prcue@0227C@prE@02AB3@pre@02AAF@prsim@0227E@prurel@022B0@ratio@02236@rtrie@022B5@rtriltri@029CE@Sc@02ABC@sc@0227B@scap@02AB8@sccue@0227D@scE@02AB4@sce@02AB0@scsim@0227F@sdote@02A66@sfrown@02322@simg@02A9E@simgE@02AA0@siml@02A9D@simlE@02A9F@smid@02223@smile@02323@smt@02AAA@smte@02AAC@spar@02225@sqsub@0228F@sqsube@02291@sqsup@02290@sqsupe@02292@ssmile@02323@Sub@022D0@subE@02AC5@subedot@02AC3@submult@02AC1@subplus@02ABF@subrarr@02979@subsim@02AC7@subsub@02AD5@subsup@02AD3@Sup@022D1@supdsub@02AD8@supE@02AC6@supedot@02AC4@suphsub@02AD7@suplarr@0297B@supmult@02AC2@supplus@02AC0@supsim@02AC8@supsub@02AD4@supsup@02AD6@thkap@02248@thksim@0223C@topfork@02ADA@trie@0225C@twixt@0226C@Vbar@02AEB@vBar@02AE8@vBarv@02AE9@VDash@022AB@Vdash@022A9@vDash@022A8@vdash@022A2@Vdashl@02AE6@vltri@022B2@vprop@0221D@vrtri@022B3@Vvdash@022AA@alpha@003B1@beta@003B2@chi@003C7@Delta@00394@delta@003B4@epsi@003B5@epsiv@003F5@eta@003B7@Gamma@00393@gamma@003B3@Gammad@003DC@gammad@003DD@iota@003B9@kappa@003BA@kappav@003F0@Lambda@0039B@lambda@003BB@mu@003BC@nu@003BD@Omega@003A9@omega@003C9@Phi@003A6@phi@003C6@phiv@003D5@Pi@003A0@pi@003C0@piv@003D6@Psi@003A8@psi@003C8@rho@003C1@rhov@003F1@Sigma@003A3@sigma@003C3@sigmav@003C2@tau@003C4@Theta@00398@theta@003B8@thetav@003D1@Upsi@003D2@upsi@003C5@Xi@0039E@xi@003BE@zeta@003B6@Cfr@0212D@Hfr@0210C@Ifr@02111@Rfr@0211C@Zfr@02128@Copf@02102@Hopf@0210D@Nopf@02115@Popf@02119@Qopf@0211A@Ropf@0211D@Zopf@02124@acd@0223F@aleph@02135@And@02A53@and@02227@andand@02A55@andd@02A5C@andslope@02A58@andv@02A5A@angrt@0221F@angsph@02222@angst@0212B@ap@02248@apacir@02A6F@awconint@02233@awint@02A11@becaus@02235@bernou@0212C@bNot@02AED@bnot@02310@bottom@022A5@cap@02229@Cconint@02230@cirfnint@02A10@compfn@02218@cong@02245@Conint@0222F@conint@0222E@ctdot@022EF@cup@0222A@cwconint@02232@cwint@02231@cylcty@0232D@disin@022F2@Dot@000A8@DotDot@020DC@dsol@029F6@dtdot@022F1@dwangle@029A6@elinters@0FFFD@epar@022D5@eparsl@029E3@equiv@02261@eqvparsl@029E5@exist@02203@fltns@025B1@fnof@00192@forall@02200@fpartint@02A0D@ge@02265@hamilt@0210B@iff@021D4@iinfin@029DC@imped@001B5@infin@0221E@infintie@029DD@Int@0222C@int@0222B@intlarhk@02A17@isin@02208@isindot@022F5@isinE@022F9@isins@022F4@isinsv@022F3@isinv@02208@lagran@02112@Lang@0300A@lang@027e8@lArr@021D0@lbbrk@03014@le@02264@loang@03018@lobrk@0301A@lopar@02985@lowast@02217@minus@02212@mnplus@02213@nabla@02207@ne@02260@nhpar@02AF2@ni@0220B@nis@022FC@nisd@022FA@niv@0220B@Not@02AEC@notin@02209@notinva@02209@notinvb@022F7@notinvc@022F6@notni@0220C@notniva@0220C@notnivb@022FE@notnivc@022FD@npolint@02A14@nvinfin@029DE@olcross@029BB@Or@02A54@or@02228@ord@02A5D@order@02134@oror@02A56@orslope@02A57@orv@02A5B@par@02225@parsl@02AFD@part@02202@permil@02030@perp@022A5@pertenk@02031@phmmat@02133@pointint@02A15@Prime@02033@prime@02032@profalar@0232E@profline@02312@profsurf@02313@prop@0221D@qint@02A0C@qprime@02057@quatint@02A16@radic@0221A@Rang@0300B@rang@027e9@rArr@021D2@rbbrk@03015@roang@03019@robrk@0301B@ropar@02986@rppolint@02A12@scpolint@02A13@sim@0223C@simdot@02A6A@sime@02243@smeparsl@029E4@square@025A1@squarf@025AA@strns@000AF@sub@02282@sube@02286@sup@02283@supe@02287@tdot@020DB@there4@02234@tint@0222D@top@022A4@topbot@02336@topcir@02AF1@tprime@02034@utdot@022F0@uwangle@029A7@vangrt@0299C@veeeq@0225A@Verbar@02016@wedgeq@02259@xnis@022FB@angle@02220@ApplyFunction@02061@approx@02248@approxeq@0224A@Assign@02254@backcong@0224C@backepsilon@003F6@backprime@02035@backsim@0223D@backsimeq@022CD@Backslash@02216@barwedge@02305@Because@02235@because@02235@Bernoullis@0212C@between@0226C@bigcap@022C2@bigcirc@025EF@bigcup@022C3@bigodot@02A00@bigoplus@02A01@bigotimes@02A02@bigsqcup@02A06@bigstar@02605@bigtriangledown@025BD@bigtriangleup@025B3@biguplus@02A04@bigvee@022C1@bigwedge@022C0@bkarow@0290D@blacklozenge@029EB@blacksquare@025AA@blacktriangle@025B4@blacktriangledown@025BE@blacktriangleleft@025C2@blacktriangleright@025B8@bot@022A5@boxminus@0229F@boxplus@0229E@boxtimes@022A0@Breve@002D8@bullet@02022@Bumpeq@0224E@bumpeq@0224F@CapitalDifferentialD@02145@Cayleys@0212D@Cedilla@000B8@CenterDot@000B7@centerdot@000B7@checkmark@02713@circeq@02257@circlearrowleft@021BA@circlearrowright@021BB@circledast@0229B@circledcirc@0229A@circleddash@0229D@CircleDot@02299@circledR@000AE@circledS@024C8@CircleMinus@02296@CirclePlus@02295@CircleTimes@02297@ClockwiseContourIntegral@02232@CloseCurlyDoubleQuote@0201D@CloseCurlyQuote@02019@clubsuit@02663@coloneq@02254@complement@02201@complexes@02102@Congruent@02261@ContourIntegral@0222E@Coproduct@02210@CounterClockwiseContourIntegral@02233@CupCap@0224D@curlyeqprec@022DE@curlyeqsucc@022DF@curlyvee@022CE@curlywedge@022CF@curvearrowleft@021B6@curvearrowright@021B7@dbkarow@0290F@ddagger@02021@ddotseq@02A77@Del@02207@DiacriticalAcute@000B4@DiacriticalDot@002D9@DiacriticalDoubleAcute@002DD@DiacriticalGrave@00060@DiacriticalTilde@002DC@Diamond@022C4@diamond@022C4@diamondsuit@02666@DifferentialD@02146@digamma@003DD@div@000F7@divideontimes@022C7@doteq@02250@doteqdot@02251@DotEqual@02250@dotminus@02238@dotplus@02214@dotsquare@022A1@doublebarwedge@02306@DoubleContourIntegral@0222F@DoubleDot@000A8@DoubleDownArrow@021D3@DoubleLeftArrow@021D0@DoubleLeftRightArrow@021D4@DoubleLeftTee@02AE4@DoubleLongLeftArrow@027F8@DoubleLongLeftRightArrow@027FA@DoubleLongRightArrow@027F9@DoubleRightArrow@021D2@DoubleRightTee@022A8@DoubleUpArrow@021D1@DoubleUpDownArrow@021D5@DoubleVerticalBar@02225@DownArrow@02193@Downarrow@021D3@downarrow@02193@DownArrowUpArrow@021F5@downdownarrows@021CA@downharpoonleft@021C3@downharpoonright@021C2@DownLeftVector@021BD@DownRightVector@021C1@DownTee@022A4@DownTeeArrow@021A7@drbkarow@02910@Element@02208@emptyset@02205@eqcirc@02256@eqcolon@02255@eqsim@02242@eqslantgtr@02A96@eqslantless@02A95@EqualTilde@02242@Equilibrium@021CC@Exists@02203@expectation@02130@ExponentialE@02147@exponentiale@02147@fallingdotseq@02252@ForAll@02200@Fouriertrf@02131@geq@02265@geqq@02267@geqslant@02A7E@gg@0226B@ggg@022D9@gnapprox@02A8A@gneq@02A88@gneqq@02269@GreaterEqual@02265@GreaterEqualLess@022DB@GreaterFullEqual@02267@GreaterLess@02277@GreaterSlantEqual@02A7E@GreaterTilde@02273@gtrapprox@02A86@gtrdot@022D7@gtreqless@022DB@gtreqqless@02A8C@gtrless@02277@gtrsim@02273@Hacek@002C7@hbar@0210F@heartsuit@02665@HilbertSpace@0210B@hksearow@02925@hkswarow@02926@hookleftarrow@021A9@hookrightarrow@021AA@hslash@0210F@HumpDownHump@0224E@HumpEqual@0224F@iiiint@02A0C@iiint@0222D@Im@02111@ImaginaryI@02148@imagline@02110@imagpart@02111@Implies@021D2@in@02208@integers@02124@Integral@0222B@intercal@022BA@Intersection@022C2@intprod@02A3C@InvisibleComma@02063@InvisibleTimes@02062@langle@027e8@Laplacetrf@02112@lbrace@0007B@lbrack@0005B@LeftAngleBracket@027e8@LeftArrow@02190@Leftarrow@021D0@leftarrow@02190@LeftArrowBar@021E4@LeftArrowRightArrow@021C6@leftarrowtail@021A2@LeftCeiling@02308@LeftDoubleBracket@0301A@LeftDownVector@021C3@LeftFloor@0230A@leftharpoondown@021BD@leftharpoonup@021BC@leftleftarrows@021C7@LeftRightArrow@02194@Leftrightarrow@021D4@leftrightarrow@02194@leftrightarrows@021C6@leftrightharpoons@021CB@leftrightsquigarrow@021AD@LeftTee@022A3@LeftTeeArrow@021A4@leftthreetimes@022CB@LeftTriangle@022B2@LeftTriangleEqual@022B4@LeftUpVector@021BF@LeftVector@021BC@leq@02264@leqq@02266@leqslant@02A7D@lessapprox@02A85@lessdot@022D6@lesseqgtr@022DA@lesseqqgtr@02A8B@LessEqualGreater@022DA@LessFullEqual@02266@LessGreater@02276@lessgtr@02276@lesssim@02272@LessSlantEqual@02A7D@LessTilde@02272@ll@0226A@llcorner@0231E@Lleftarrow@021DA@lmoustache@023B0@lnapprox@02A89@lneq@02A87@lneqq@02268@LongLeftArrow@027F5@Longleftarrow@027F8@longleftarrow@027F5@LongLeftRightArrow@027F7@Longleftrightarrow@027FA@longleftrightarrow@027F7@longmapsto@027FC@LongRightArrow@027F6@Longrightarrow@027F9@longrightarrow@027F6@looparrowleft@021AB@looparrowright@021AC@LowerLeftArrow@02199@LowerRightArrow@02198@lozenge@025CA@lrcorner@0231F@Lsh@021B0@maltese@02720@mapsto@021A6@measuredangle@02221@Mellintrf@02133@MinusPlus@02213@mp@02213@multimap@022B8@napprox@02249@natural@0266E@naturals@02115@nearrow@02197@NegativeMediumSpace@0200B@NegativeThickSpace@0200B@NegativeThinSpace@0200B@NegativeVeryThinSpace@0200B@NestedGreaterGreater@0226B@NestedLessLess@0226A@nexists@02204@ngeq@02271@ngtr@0226F@nLeftarrow@021CD@nleftarrow@0219A@nLeftrightarrow@021CE@nleftrightarrow@021AE@nleq@02270@nless@0226E@NonBreakingSpace@000A0@NotCongruent@02262@NotDoubleVerticalBar@02226@NotElement@02209@NotEqual@02260@NotExists@02204@NotGreater@0226F@NotGreaterEqual@02271@NotGreaterLess@02279@NotGreaterTilde@02275@NotLeftTriangle@022EA@NotLeftTriangleEqual@022EC@NotLess@0226E@NotLessEqual@02270@NotLessGreater@02278@NotLessTilde@02274@NotPrecedes@02280@NotPrecedesSlantEqual@022E0@NotReverseElement@0220C@NotRightTriangle@022EB@NotRightTriangleEqual@022ED@NotSquareSubsetEqual@022E2@NotSquareSupersetEqual@022E3@NotSubsetEqual@02288@NotSucceeds@02281@NotSucceedsSlantEqual@022E1@NotSupersetEqual@02289@NotTilde@02241@NotTildeEqual@02244@NotTildeFullEqual@02247@NotTildeTilde@02249@NotVerticalBar@02224@nparallel@02226@nprec@02280@nRightarrow@021CF@nrightarrow@0219B@nshortmid@02224@nshortparallel@02226@nsimeq@02244@nsubseteq@02288@nsucc@02281@nsupseteq@02289@ntriangleleft@022EA@ntrianglelefteq@022EC@ntriangleright@022EB@ntrianglerighteq@022ED@nwarrow@02196@oint@0222E@OpenCurlyDoubleQuote@0201C@OpenCurlyQuote@02018@orderof@02134@parallel@02225@PartialD@02202@pitchfork@022D4@PlusMinus@000B1@pm@000B1@Poincareplane@0210C@prec@0227A@precapprox@02AB7@preccurlyeq@0227C@Precedes@0227A@PrecedesEqual@02AAF@PrecedesSlantEqual@0227C@PrecedesTilde@0227E@preceq@02AAF@precnapprox@02AB9@precneqq@02AB5@precnsim@022E8@precsim@0227E@primes@02119@Proportion@02237@Proportional@0221D@propto@0221D@quaternions@0210D@questeq@0225F@rangle@027e9@rationals@0211A@rbrace@0007D@rbrack@0005D@Re@0211C@realine@0211B@realpart@0211C@reals@0211D@ReverseElement@0220B@ReverseEquilibrium@021CB@ReverseUpEquilibrium@0296F@RightAngleBracket@027e9@RightArrow@02192@Rightarrow@021D2@rightarrow@02192@RightArrowBar@021E5@RightArrowLeftArrow@021C4@rightarrowtail@021A3@RightCeiling@02309@RightDoubleBracket@0301B@RightDownVector@021C2@RightFloor@0230B@rightharpoondown@021C1@rightharpoonup@021C0@rightleftarrows@021C4@rightleftharpoons@021CC@rightrightarrows@021C9@rightsquigarrow@0219D@RightTee@022A2@RightTeeArrow@021A6@rightthreetimes@022CC@RightTriangle@022B3@RightTriangleEqual@022B5@RightUpVector@021BE@RightVector@021C0@risingdotseq@02253@rmoustache@023B1@Rrightarrow@021DB@Rsh@021B1@searrow@02198@setminus@02216@ShortDownArrow@02193@ShortLeftArrow@02190@shortmid@02223@shortparallel@02225@ShortRightArrow@02192@ShortUpArrow@02191@simeq@02243@SmallCircle@02218@smallsetminus@02216@spadesuit@02660@Sqrt@0221A@sqsubset@0228F@sqsubseteq@02291@sqsupset@02290@sqsupseteq@02292@Square@025A1@SquareIntersection@02293@SquareSubset@0228F@SquareSubsetEqual@02291@SquareSuperset@02290@SquareSupersetEqual@02292@SquareUnion@02294@Star@022C6@straightepsilon@003F5@straightphi@003D5@Subset@022D0@subset@02282@subseteq@02286@subseteqq@02AC5@SubsetEqual@02286@subsetneq@0228A@subsetneqq@02ACB@succ@0227B@succapprox@02AB8@succcurlyeq@0227D@Succeeds@0227B@SucceedsEqual@02AB0@SucceedsSlantEqual@0227D@SucceedsTilde@0227F@succeq@02AB0@succnapprox@02ABA@succneqq@02AB6@succnsim@022E9@succsim@0227F@SuchThat@0220B@Sum@02211@Superset@02283@SupersetEqual@02287@Supset@022D1@supset@02283@supseteq@02287@supseteqq@02AC6@supsetneq@0228B@supsetneqq@02ACC@swarrow@02199@Therefore@02234@therefore@02234@thickapprox@02248@thicksim@0223C@ThinSpace@02009@Tilde@0223C@TildeEqual@02243@TildeFullEqual@02245@TildeTilde@02248@toea@02928@tosa@02929@triangle@025B5@triangledown@025BF@triangleleft@025C3@trianglelefteq@022B4@triangleq@0225C@triangleright@025B9@trianglerighteq@022B5@TripleDot@020DB@twoheadleftarrow@0219E@twoheadrightarrow@021A0@ulcorner@0231C@Union@022C3@UnionPlus@0228E@UpArrow@02191@Uparrow@021D1@uparrow@02191@UpArrowDownArrow@021C5@UpDownArrow@02195@Updownarrow@021D5@updownarrow@02195@UpEquilibrium@0296E@upharpoonleft@021BF@upharpoonright@021BE@UpperLeftArrow@02196@UpperRightArrow@02197@upsilon@003C5@UpTee@022A5@UpTeeArrow@021A5@upuparrows@021C8@urcorner@0231D@varepsilon@003F5@varkappa@003F0@varnothing@02205@varphi@003C6@varpi@003D6@varpropto@0221D@varrho@003F1@varsigma@003C2@vartheta@003D1@vartriangleleft@022B2@vartriangleright@022B3@Vee@022C1@vee@02228@Vert@02016@vert@0007C@VerticalBar@02223@VerticalTilde@02240@VeryThinSpace@0200A@Wedge@022C0@wedge@02227@wp@02118@wr@02240@zeetrf@02128@af@02061@asympeq@0224D@Cross@02A2F@DD@02145@dd@02146@DownArrowBar@02913@DownBreve@00311@DownLeftRightVector@02950@DownLeftTeeVector@0295E@DownLeftVectorBar@02956@DownRightTeeVector@0295F@DownRightVectorBar@02957@ee@02147@EmptySmallSquare@025FB@EmptyVerySmallSquare@025AB@Equal@02A75@FilledSmallSquare@025FC@FilledVerySmallSquare@025AA@GreaterGreater@02AA2@Hat@0005E@HorizontalLine@02500@ic@02063@ii@02148@it@02062@larrb@021E4@LeftDownTeeVector@02961@LeftDownVectorBar@02959@LeftRightVector@0294E@LeftTeeVector@0295A@LeftTriangleBar@029CF@LeftUpDownVector@02951@LeftUpTeeVector@02960@LeftUpVectorBar@02958@LeftVectorBar@02952@LessLess@02AA1@mapstodown@021A7@mapstoleft@021A4@mapstoup@021A5@MediumSpace@0205F@NewLine@0000A@NoBreak@02060@NotCupCap@0226D@OverBar@000AF@OverBrace@023DE@OverBracket@023B4@OverParenthesis@023DC@planckh@0210E@Product@0220F@rarrb@021E5@RightDownTeeVector@0295D@RightDownVectorBar@02955@RightTeeVector@0295B@RightTriangleBar@029D0@RightUpDownVector@0294F@RightUpTeeVector@0295C@RightUpVectorBar@02954@RightVectorBar@02953@RoundImplies@02970@RuleDelayed@029F4@Tab@00009@UnderBar@00332@UnderBrace@023DF@UnderBracket@023B5@UnderParenthesis@023DD@UpArrowBar@02912@Upsilon@003A5@VerticalLine@0007C@VerticalSeparator@02758@ZeroWidthSpace@0200B@omicron@003BF@amalg@02210@NegativeThinSpace@0E000@Iopf@1d540@";
com.wiris.util.xml.WEntities.oldWebeq = "infty@221e@partial@2202@iint@222c@neq@2260@nsubset@2284@nsupset@2285@exists@2203@ldots@2026@vdots@22ee@cdots@22ef@ddots@22f1@bar@00af@hat@005e@vec@21c0@ddot@00A8@";
com.wiris.util.xml.WEntities.MATHML_ENTITIES = com.wiris.util.xml.WEntities.s1 + com.wiris.util.xml.WEntities.s2 + com.wiris.util.xml.WEntities.oldWebeq;
com.wiris.util.xml.WXmlUtils.entities = null;
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
js.Lib.onerror = null;

com.wiris.system.ResourceLoader.charactersDefinition = '<characters><char c="65535" t="b"/><char c="32" t="b"/><char c="9115" t="b"/><char c="9117" t="b"/><char c="9118" t="b"/><char c="9120" t="b"/><char c="9121" t="b"/><char c="9122" t="b"/><char c="9123" t="b"/><char c="9124" t="b"/><char c="9125" t="b"/><char c="9126" t="b"/><char c="61442" t="b"/><char c="62466" t="b"/><char c="62467" t="b"/><char c="65535" t="s"/><char c="32" t="s"/><char c="9116" t="s"/><char c="9119" t="s"/><char c="9121" t="s"/><char c="9122" t="s"/><char c="9123" t="s"/><char c="9124" t="s"/><char c="9125" t="s"/><char c="9126" t="s"/><char c="9127" t="s"/><char c="9128" t="s"/><char c="9129" t="s"/><char c="9130" t="s"/><char c="9131" t="s"/><char c="9132" t="s"/><char c="9133" t="s"/><char c="9134" t="s"/><char c="9168" t="s"/><char c="61442" t="s"/><char c="62464" t="s"/><char c="62465" t="s"/><char c="62466" t="s"/><char c="62467" t="s"/><char c="65535" t="m"/><char c="32" t="m"/><char c="39" t="m"/><char c="43" t="m"/><char c="44" t="m"/><char c="45" t="m"/><char c="46" t="m"/><char c="47" t="m"/><char c="59" t="m"/><char c="60" t="m"/><char c="61" t="m"/><char c="62" t="m"/><char c="124" t="m"/><char c="160" t="m"/><char c="172" t="m"/><char c="176" t="m"/><char c="177" t="m"/><char c="183" t="m"/><char c="215" t="m"/><char c="247" t="m"/><char c="437" t="m"/><char c="729" t="m"/><char c="960" t="m"/><char c="4096" t="m"/><char c="8201" t="m"/><char c="8208" t="m"/><char c="8212" t="m"/><char c="8229" t="m"/><char c="8230" t="m"/><char c="8245" t="m"/><char c="8289" t="m"/><char c="8290" t="m"/><char c="8291" t="m"/><char c="8292" t="m"/><char c="8450" t="m"/><char c="8465" t="m"/><char c="8466" t="m"/><char c="8467" t="m"/><char c="8469" t="m"/><char c="8472" t="m"/><char c="8473" t="m"/><char c="8474" t="m"/><char c="8476" t="m"/><char c="8477" t="m"/><char c="8484" t="m"/><char c="8497" t="m"/><char c="8501" t="m"/><char c="8592" t="m"/><char c="8593" t="m"/><char c="8594" t="m"/><char c="8595" t="m"/><char c="8596" t="m"/><char c="8597" t="m"/><char c="8598" t="m"/><char c="8599" t="m"/><char c="8600" t="m"/><char c="8601" t="m"/><char c="8612" t="m"/><char c="8614" t="m"/><char c="8617" t="m"/><char c="8618" t="m"/><char c="8629" t="m"/><char c="8636" t="m"/><char c="8637" t="m"/><char c="8640" t="m"/><char c="8641" t="m"/><char c="8644" t="m"/><char c="8645" t="m"/><char c="8646" t="m"/><char c="8651" t="m"/><char c="8652" t="m"/><char c="8656" t="m"/><char c="8657" t="m"/><char c="8658" t="m"/><char c="8659" t="m"/><char c="8660" t="m"/><char c="8661" t="m"/><char c="8693" t="m"/><char c="8704" t="m"/><char c="8706" t="m"/><char c="8707" t="m"/><char c="8708" t="m"/><char c="8709" t="m"/><char c="8710" t="m"/><char c="8711" t="m"/><char c="8712" t="m"/><char c="8713" t="m"/><char c="8715" t="m"/><char c="8716" t="m"/><char c="8719" t="m"/><char c="8720" t="m"/><char c="8721" t="m"/><char c="8722" t="m"/><char c="8723" t="m"/><char c="8726" t="m"/><char c="8727" t="m"/><char c="8728" t="m"/><char c="8729" t="m"/><char c="8733" t="m"/><char c="8734" t="m"/><char c="8736" t="m"/><char c="8737" t="m"/><char c="8738" t="m"/><char c="8741" t="m"/><char c="8742" t="m"/><char c="8743" t="m"/><char c="8744" t="m"/><char c="8745" t="m"/><char c="8746" t="m"/><char c="8747" t="m"/><char c="8748" t="m"/><char c="8749" t="m"/><char c="8750" t="m"/><char c="8751" t="m"/><char c="8752" t="m"/><char c="8756" t="m"/><char c="8757" t="m"/><char c="8764" t="m"/><char c="8765" t="m"/><char c="8769" t="m"/><char c="8771" t="m"/><char c="8773" t="m"/><char c="8776" t="m"/><char c="8800" t="m"/><char c="8801" t="m"/><char c="8802" t="m"/><char c="8804" t="m"/><char c="8805" t="m"/><char c="8810" t="m"/><char c="8811" t="m"/><char c="8826" t="m"/><char c="8827" t="m"/><char c="8834" t="m"/><char c="8835" t="m"/><char c="8838" t="m"/><char c="8839" t="m"/><char c="8847" t="m"/><char c="8848" t="m"/><char c="8849" t="m"/><char c="8850" t="m"/><char c="8851" t="m"/><char c="8852" t="m"/><char c="8853" t="m"/><char c="8855" t="m"/><char c="8857" t="m"/><char c="8859" t="m"/><char c="8861" t="m"/><char c="8869" t="m"/><char c="8882" t="m"/><char c="8883" t="m"/><char c="8900" t="m"/><char c="8909" t="m"/><char c="8942" t="m"/><char c="8943" t="m"/><char c="8944" t="m"/><char c="8945" t="m"/><char c="9135" t="m"/><char c="9633" t="m"/><char c="9645" t="m"/><char c="9649" t="m"/><char c="9651" t="m"/><char c="9675" t="m"/><char c="10529" t="m"/><char c="10530" t="m"/><char c="10562" t="m"/><char c="10564" t="m"/><char c="10602" t="m"/><char c="10605" t="m"/><char c="10606" t="m"/><char c="10607" t="m"/><char c="10808" t="m"/><char c="10877" t="m"/><char c="10878" t="m"/><char c="10887" t="m"/><char c="10888" t="m"/><char c="12288" t="m"/><char c="12289" t="m"/><char c="57358" t="m"/><char c="57359" t="m"/><char c="61442" t="m"/><char c="61443" t="m"/><char c="120128" t="m"/><char c="65535" t="r"/><char c="32" t="r"/><char c="8706" t="r"/><char c="8707" t="r"/><char c="8708" t="r"/><char c="8721" t="r"/><char c="8726" t="r"/><char c="8733" t="r"/><char c="8736" t="r"/><char c="8737" t="r"/><char c="8738" t="r"/><char c="8742" t="r"/><char c="8747" t="r"/><char c="8748" t="r"/><char c="8749" t="r"/><char c="8750" t="r"/><char c="8751" t="r"/><char c="8752" t="r"/><char c="8769" t="r"/><char c="8773" t="r"/><char c="8776" t="r"/><char c="8800" t="r"/><char c="8802" t="r"/><char c="10887" t="r"/><char c="10888" t="r"/><char c="61442" t="r"/><char c="61443" t="r"/><char c="65535" t="h"/><char c="9135" t="h"/><char c="61442" t="h"/><char c="61443" t="h"/><char c="61952" t="h"/><char c="61953" t="h"/><char c="61954" t="h"/><char c="61955" t="h"/><char c="61956" t="h"/><char c="61957" t="h"/><char c="61958" t="h"/><char c="61959" t="h"/><char c="61960" t="h"/><char c="61961" t="h"/><char c="61962" t="h"/><char c="61963" t="h"/><char c="61964" t="h"/><char c="61965" t="h"/><char c="61966" t="h"/><char c="61967" t="h"/><char c="61968" t="h"/><char c="61969" t="h"/><char c="61970" t="h"/><char c="61971" t="h"/><char c="61972" t="h"/><char c="61973" t="h"/><char c="61974" t="h"/><char c="61975" t="h"/><char c="62208" t="h"/><char c="62209" t="h"/><char c="62210" t="h"/><char c="62211" t="h"/><char c="62212" t="h"/><char c="62213" t="h"/><char c="62214" t="h"/><char c="62215" t="h"/><char c="62216" t="h"/><char c="62217" t="h"/><char c="62218" t="h"/><char c="62219" t="h"/><char c="62220" t="h"/><char c="62221" t="h"/><char c="62222" t="h"/><char c="62223" t="h"/><char c="62224" t="h"/><char c="62225" t="h"/><char c="65535" t="a"/><char c="32" t="a"/><char c="97" t="a"/><char c="102" t="a"/><char c="61442" t="a"/><char c="61443" t="a"/><char c="65535" t="c"/><char c="8458" t="c"/><char c="8459" t="c"/><char c="8464" t="c"/><char c="8475" t="c"/><char c="8492" t="c"/><char c="8495" t="c"/><char c="8496" t="c"/><char c="8499" t="c"/><char c="8500" t="c"/><char c="9724" t="c"/><char c="61442" t="c"/><char c="61443" t="c"/><char c="119964" t="c"/><char c="119966" t="c"/><char c="119967" t="c"/><char c="119970" t="c"/><char c="119973" t="c"/><char c="119974" t="c"/><char c="119977" t="c"/><char c="119978" t="c"/><char c="119979" t="c"/><char c="119980" t="c"/><char c="119982" t="c"/><char c="119983" t="c"/><char c="119984" t="c"/><char c="119985" t="c"/><char c="119986" t="c"/><char c="119987" t="c"/><char c="119988" t="c"/><char c="119989" t="c"/><char c="119990" t="c"/><char c="119991" t="c"/><char c="119992" t="c"/><char c="119993" t="c"/><char c="119995" t="c"/><char c="119997" t="c"/><char c="119998" t="c"/><char c="119999" t="c"/><char c="120000" t="c"/><char c="120001" t="c"/><char c="120002" t="c"/><char c="120003" t="c"/><char c="120005" t="c"/><char c="120006" t="c"/><char c="120007" t="c"/><char c="120008" t="c"/><char c="120009" t="c"/><char c="120010" t="c"/><char c="120011" t="c"/><char c="120012" t="c"/><char c="120013" t="c"/><char c="120014" t="c"/><char c="120015" t="c"/><char c="65535" t="f"/><char c="8460" t="f"/><char c="8488" t="f"/><char c="8493" t="f"/><char c="61442" t="f"/><char c="61443" t="f"/><char c="120068" t="f"/><char c="120069" t="f"/><char c="120071" t="f"/><char c="120072" t="f"/><char c="120073" t="f"/><char c="120074" t="f"/><char c="120077" t="f"/><char c="120078" t="f"/><char c="120079" t="f"/><char c="120080" t="f"/><char c="120081" t="f"/><char c="120082" t="f"/><char c="120083" t="f"/><char c="120084" t="f"/><char c="120086" t="f"/><char c="120087" t="f"/><char c="120088" t="f"/><char c="120089" t="f"/><char c="120090" t="f"/><char c="120091" t="f"/><char c="120092" t="f"/><char c="120094" t="f"/><char c="120095" t="f"/><char c="120096" t="f"/><char c="120097" t="f"/><char c="120098" t="f"/><char c="120099" t="f"/><char c="120100" t="f"/><char c="120101" t="f"/><char c="120102" t="f"/><char c="120103" t="f"/><char c="120104" t="f"/><char c="120105" t="f"/><char c="120106" t="f"/><char c="120107" t="f"/><char c="120108" t="f"/><char c="120109" t="f"/><char c="120110" t="f"/><char c="120111" t="f"/><char c="120112" t="f"/><char c="120113" t="f"/><char c="120114" t="f"/><char c="120115" t="f"/><char c="120116" t="f"/><char c="120117" t="f"/><char c="120118" t="f"/><char c="120119" t="f"/><char c="65535" t="d"/><char c="8461" t="d"/><char c="61442" t="d"/><char c="61443" t="d"/><char c="120120" t="d"/><char c="120121" t="d"/><char c="120123" t="d"/><char c="120124" t="d"/><char c="120125" t="d"/><char c="120126" t="d"/><char c="120129" t="d"/><char c="120130" t="d"/><char c="120131" t="d"/><char c="120132" t="d"/><char c="120134" t="d"/><char c="120138" t="d"/><char c="120139" t="d"/><char c="120140" t="d"/><char c="120141" t="d"/><char c="120142" t="d"/><char c="120143" t="d"/><char c="120144" t="d"/><char c="120146" t="d"/><char c="120147" t="d"/><char c="120148" t="d"/><char c="120149" t="d"/><char c="120150" t="d"/><char c="120151" t="d"/><char c="120152" t="d"/><char c="120153" t="d"/><char c="120154" t="d"/><char c="120155" t="d"/><char c="120156" t="d"/><char c="120157" t="d"/><char c="120158" t="d"/><char c="120159" t="d"/><char c="120160" t="d"/><char c="120161" t="d"/><char c="120162" t="d"/><char c="120163" t="d"/><char c="120164" t="d"/><char c="120165" t="d"/><char c="120166" t="d"/><char c="120167" t="d"/><char c="120168" t="d"/><char c="120169" t="d"/><char c="120170" t="d"/><char c="120171" t="d"/><char c="65535" t="r1854"/><char c="40" t="r1854"/><char c="41" t="r1854"/><char c="61442" t="r1854"/><char c="61443" t="r1854"/><char c="65535" t="r2254"/><char c="40" t="r2254"/><char c="41" t="r2254"/><char c="61442" t="r2254"/><char c="61443" t="r2254"/><char c="65535" t="r2654"/><char c="40" t="r2654"/><char c="41" t="r2654"/><char c="61442" t="r2654"/><char c="61443" t="r2654"/><char c="65535" t="r3054"/><char c="40" t="r3054"/><char c="41" t="r3054"/><char c="61442" t="r3054"/><char c="61443" t="r3054"/><char c="65535" t="r3454"/><char c="40" t="r3454"/><char c="41" t="r3454"/><char c="61442" t="r3454"/><char c="61443" t="r3454"/><char c="65535" t="sx"/><char c="32" t="sx"/><char c="33" t="sx"/><char c="34" t="sx"/><char c="35" t="sx"/><char c="36" t="sx"/><char c="37" t="sx"/><char c="38" t="sx"/><char c="39" t="sx"/><char c="40" t="sx"/><char c="41" t="sx"/><char c="42" t="sx"/><char c="43" t="sx"/><char c="44" t="sx"/><char c="45" t="sx"/><char c="46" t="sx"/><char c="47" t="sx"/><char c="48" t="sx"/><char c="49" t="sx"/><char c="50" t="sx"/><char c="51" t="sx"/><char c="52" t="sx"/><char c="53" t="sx"/><char c="54" t="sx"/><char c="55" t="sx"/><char c="56" t="sx"/><char c="57" t="sx"/><char c="58" t="sx"/><char c="59" t="sx"/><char c="60" t="sx"/><char c="61" t="sx"/><char c="62" t="sx"/><char c="63" t="sx"/><char c="64" t="sx"/><char c="65" t="sx"/><char c="66" t="sx"/><char c="67" t="sx"/><char c="68" t="sx"/><char c="69" t="sx"/><char c="70" t="sx"/><char c="71" t="sx"/><char c="72" t="sx"/><char c="73" t="sx"/><char c="74" t="sx"/><char c="75" t="sx"/><char c="76" t="sx"/><char c="77" t="sx"/><char c="78" t="sx"/><char c="79" t="sx"/><char c="80" t="sx"/><char c="81" t="sx"/><char c="82" t="sx"/><char c="83" t="sx"/><char c="84" t="sx"/><char c="85" t="sx"/><char c="86" t="sx"/><char c="87" t="sx"/><char c="88" t="sx"/><char c="89" t="sx"/><char c="90" t="sx"/><char c="91" t="sx"/><char c="92" t="sx"/><char c="93" t="sx"/><char c="94" t="sx"/><char c="95" t="sx"/><char c="96" t="sx"/><char c="97" t="sx"/><char c="98" t="sx"/><char c="99" t="sx"/><char c="100" t="sx"/><char c="101" t="sx"/><char c="102" t="sx"/><char c="103" t="sx"/><char c="104" t="sx"/><char c="105" t="sx"/><char c="106" t="sx"/><char c="107" t="sx"/><char c="108" t="sx"/><char c="109" t="sx"/><char c="110" t="sx"/><char c="111" t="sx"/><char c="112" t="sx"/><char c="113" t="sx"/><char c="114" t="sx"/><char c="115" t="sx"/><char c="116" t="sx"/><char c="117" t="sx"/><char c="118" t="sx"/><char c="119" t="sx"/><char c="120" t="sx"/><char c="121" t="sx"/><char c="122" t="sx"/><char c="123" t="sx"/><char c="124" t="sx"/><char c="125" t="sx"/><char c="126" t="sx"/><char c="160" t="sx"/><char c="161" t="sx"/><char c="162" t="sx"/><char c="163" t="sx"/><char c="164" t="sx"/><char c="165" t="sx"/><char c="166" t="sx"/><char c="167" t="sx"/><char c="168" t="sx"/><char c="169" t="sx"/><char c="170" t="sx"/><char c="171" t="sx"/><char c="172" t="sx"/><char c="173" t="sx"/><char c="174" t="sx"/><char c="175" t="sx"/><char c="176" t="sx"/><char c="177" t="sx"/><char c="178" t="sx"/><char c="179" t="sx"/><char c="180" t="sx"/><char c="181" t="sx"/><char c="182" t="sx"/><char c="183" t="sx"/><char c="184" t="sx"/><char c="185" t="sx"/><char c="186" t="sx"/><char c="187" t="sx"/><char c="188" t="sx"/><char c="189" t="sx"/><char c="190" t="sx"/><char c="191" t="sx"/><char c="192" t="sx"/><char c="193" t="sx"/><char c="194" t="sx"/><char c="195" t="sx"/><char c="196" t="sx"/><char c="197" t="sx"/><char c="198" t="sx"/><char c="199" t="sx"/><char c="200" t="sx"/><char c="201" t="sx"/><char c="202" t="sx"/><char c="203" t="sx"/><char c="204" t="sx"/><char c="205" t="sx"/><char c="206" t="sx"/><char c="207" t="sx"/><char c="208" t="sx"/><char c="209" t="sx"/><char c="210" t="sx"/><char c="211" t="sx"/><char c="212" t="sx"/><char c="213" t="sx"/><char c="214" t="sx"/><char c="215" t="sx"/><char c="216" t="sx"/><char c="217" t="sx"/><char c="218" t="sx"/><char c="219" t="sx"/><char c="220" t="sx"/><char c="221" t="sx"/><char c="222" t="sx"/><char c="223" t="sx"/><char c="224" t="sx"/><char c="225" t="sx"/><char c="226" t="sx"/><char c="227" t="sx"/><char c="228" t="sx"/><char c="229" t="sx"/><char c="230" t="sx"/><char c="231" t="sx"/><char c="232" t="sx"/><char c="233" t="sx"/><char c="234" t="sx"/><char c="235" t="sx"/><char c="236" t="sx"/><char c="237" t="sx"/><char c="238" t="sx"/><char c="239" t="sx"/><char c="240" t="sx"/><char c="241" t="sx"/><char c="242" t="sx"/><char c="243" t="sx"/><char c="244" t="sx"/><char c="245" t="sx"/><char c="246" t="sx"/><char c="247" t="sx"/><char c="248" t="sx"/><char c="249" t="sx"/><char c="250" t="sx"/><char c="251" t="sx"/><char c="252" t="sx"/><char c="253" t="sx"/><char c="254" t="sx"/><char c="255" t="sx"/><char c="256" t="sx"/><char c="257" t="sx"/><char c="258" t="sx"/><char c="259" t="sx"/><char c="260" t="sx"/><char c="261" t="sx"/><char c="262" t="sx"/><char c="263" t="sx"/><char c="264" t="sx"/><char c="265" t="sx"/><char c="266" t="sx"/><char c="267" t="sx"/><char c="268" t="sx"/><char c="269" t="sx"/><char c="270" t="sx"/><char c="271" t="sx"/><char c="272" t="sx"/><char c="273" t="sx"/><char c="274" t="sx"/><char c="275" t="sx"/><char c="276" t="sx"/><char c="277" t="sx"/><char c="278" t="sx"/><char c="279" t="sx"/><char c="280" t="sx"/><char c="281" t="sx"/><char c="282" t="sx"/><char c="283" t="sx"/><char c="284" t="sx"/><char c="285" t="sx"/><char c="286" t="sx"/><char c="287" t="sx"/><char c="288" t="sx"/><char c="289" t="sx"/><char c="290" t="sx"/><char c="291" t="sx"/><char c="292" t="sx"/><char c="293" t="sx"/><char c="294" t="sx"/><char c="295" t="sx"/><char c="296" t="sx"/><char c="297" t="sx"/><char c="298" t="sx"/><char c="299" t="sx"/><char c="300" t="sx"/><char c="301" t="sx"/><char c="302" t="sx"/><char c="303" t="sx"/><char c="304" t="sx"/><char c="305" t="sx"/><char c="306" t="sx"/><char c="307" t="sx"/><char c="308" t="sx"/><char c="309" t="sx"/><char c="310" t="sx"/><char c="311" t="sx"/><char c="312" t="sx"/><char c="313" t="sx"/><char c="314" t="sx"/><char c="315" t="sx"/><char c="316" t="sx"/><char c="317" t="sx"/><char c="318" t="sx"/><char c="319" t="sx"/><char c="320" t="sx"/><char c="321" t="sx"/><char c="322" t="sx"/><char c="323" t="sx"/><char c="324" t="sx"/><char c="325" t="sx"/><char c="326" t="sx"/><char c="327" t="sx"/><char c="328" t="sx"/><char c="329" t="sx"/><char c="330" t="sx"/><char c="331" t="sx"/><char c="332" t="sx"/><char c="333" t="sx"/><char c="334" t="sx"/><char c="335" t="sx"/><char c="336" t="sx"/><char c="337" t="sx"/><char c="338" t="sx"/><char c="339" t="sx"/><char c="340" t="sx"/><char c="341" t="sx"/><char c="342" t="sx"/><char c="343" t="sx"/><char c="344" t="sx"/><char c="345" t="sx"/><char c="346" t="sx"/><char c="347" t="sx"/><char c="348" t="sx"/><char c="349" t="sx"/><char c="350" t="sx"/><char c="351" t="sx"/><char c="352" t="sx"/><char c="353" t="sx"/><char c="354" t="sx"/><char c="355" t="sx"/><char c="356" t="sx"/><char c="357" t="sx"/><char c="358" t="sx"/><char c="359" t="sx"/><char c="360" t="sx"/><char c="361" t="sx"/><char c="362" t="sx"/><char c="363" t="sx"/><char c="364" t="sx"/><char c="365" t="sx"/><char c="366" t="sx"/><char c="367" t="sx"/><char c="368" t="sx"/><char c="369" t="sx"/><char c="370" t="sx"/><char c="371" t="sx"/><char c="372" t="sx"/><char c="373" t="sx"/><char c="374" t="sx"/><char c="375" t="sx"/><char c="376" t="sx"/><char c="377" t="sx"/><char c="378" t="sx"/><char c="379" t="sx"/><char c="380" t="sx"/><char c="381" t="sx"/><char c="382" t="sx"/><char c="383" t="sx"/><char c="384" t="sx"/><char c="392" t="sx"/><char c="400" t="sx"/><char c="402" t="sx"/><char c="405" t="sx"/><char c="409" t="sx"/><char c="410" t="sx"/><char c="411" t="sx"/><char c="414" t="sx"/><char c="416" t="sx"/><char c="417" t="sx"/><char c="421" t="sx"/><char c="426" t="sx"/><char c="427" t="sx"/><char c="429" t="sx"/><char c="431" t="sx"/><char c="432" t="sx"/><char c="437" t="sx"/><char c="442" t="sx"/><char c="443" t="sx"/><char c="446" t="sx"/><char c="448" t="sx"/><char c="449" t="sx"/><char c="450" t="sx"/><char c="451" t="sx"/><char c="496" t="sx"/><char c="506" t="sx"/><char c="507" t="sx"/><char c="508" t="sx"/><char c="509" t="sx"/><char c="510" t="sx"/><char c="511" t="sx"/><char c="545" t="sx"/><char c="564" t="sx"/><char c="565" t="sx"/><char c="566" t="sx"/><char c="567" t="sx"/><char c="592" t="sx"/><char c="593" t="sx"/><char c="594" t="sx"/><char c="595" t="sx"/><char c="596" t="sx"/><char c="597" t="sx"/><char c="598" t="sx"/><char c="599" t="sx"/><char c="600" t="sx"/><char c="601" t="sx"/><char c="602" t="sx"/><char c="603" t="sx"/><char c="604" t="sx"/><char c="605" t="sx"/><char c="606" t="sx"/><char c="607" t="sx"/><char c="608" t="sx"/><char c="609" t="sx"/><char c="610" t="sx"/><char c="611" t="sx"/><char c="612" t="sx"/><char c="613" t="sx"/><char c="614" t="sx"/><char c="615" t="sx"/><char c="616" t="sx"/><char c="617" t="sx"/><char c="618" t="sx"/><char c="619" t="sx"/><char c="620" t="sx"/><char c="621" t="sx"/><char c="622" t="sx"/><char c="623" t="sx"/><char c="624" t="sx"/><char c="625" t="sx"/><char c="626" t="sx"/><char c="627" t="sx"/><char c="628" t="sx"/><char c="629" t="sx"/><char c="630" t="sx"/><char c="631" t="sx"/><char c="632" t="sx"/><char c="633" t="sx"/><char c="634" t="sx"/><char c="635" t="sx"/><char c="636" t="sx"/><char c="637" t="sx"/><char c="638" t="sx"/><char c="639" t="sx"/><char c="640" t="sx"/><char c="641" t="sx"/><char c="642" t="sx"/><char c="643" t="sx"/><char c="644" t="sx"/><char c="645" t="sx"/><char c="646" t="sx"/><char c="647" t="sx"/><char c="648" t="sx"/><char c="649" t="sx"/><char c="650" t="sx"/><char c="651" t="sx"/><char c="652" t="sx"/><char c="653" t="sx"/><char c="654" t="sx"/><char c="655" t="sx"/><char c="656" t="sx"/><char c="657" t="sx"/><char c="658" t="sx"/><char c="659" t="sx"/><char c="660" t="sx"/><char c="661" t="sx"/><char c="662" t="sx"/><char c="663" t="sx"/><char c="664" t="sx"/><char c="665" t="sx"/><char c="666" t="sx"/><char c="667" t="sx"/><char c="668" t="sx"/><char c="669" t="sx"/><char c="670" t="sx"/><char c="671" t="sx"/><char c="672" t="sx"/><char c="673" t="sx"/><char c="674" t="sx"/><char c="675" t="sx"/><char c="676" t="sx"/><char c="677" t="sx"/><char c="678" t="sx"/><char c="679" t="sx"/><char c="680" t="sx"/><char c="686" t="sx"/><char c="687" t="sx"/><char c="688" t="sx"/><char c="689" t="sx"/><char c="690" t="sx"/><char c="691" t="sx"/><char c="692" t="sx"/><char c="693" t="sx"/><char c="694" t="sx"/><char c="695" t="sx"/><char c="696" t="sx"/><char c="697" t="sx"/><char c="698" t="sx"/><char c="699" t="sx"/><char c="700" t="sx"/><char c="701" t="sx"/><char c="702" t="sx"/><char c="703" t="sx"/><char c="704" t="sx"/><char c="705" t="sx"/><char c="706" t="sx"/><char c="707" t="sx"/><char c="708" t="sx"/><char c="709" t="sx"/><char c="710" t="sx"/><char c="711" t="sx"/><char c="712" t="sx"/><char c="713" t="sx"/><char c="714" t="sx"/><char c="715" t="sx"/><char c="716" t="sx"/><char c="717" t="sx"/><char c="718" t="sx"/><char c="719" t="sx"/><char c="720" t="sx"/><char c="721" t="sx"/><char c="722" t="sx"/><char c="723" t="sx"/><char c="724" t="sx"/><char c="725" t="sx"/><char c="726" t="sx"/><char c="727" t="sx"/><char c="728" t="sx"/><char c="729" t="sx"/><char c="730" t="sx"/><char c="731" t="sx"/><char c="732" t="sx"/><char c="733" t="sx"/><char c="734" t="sx"/><char c="735" t="sx"/><char c="736" t="sx"/><char c="737" t="sx"/><char c="738" t="sx"/><char c="739" t="sx"/><char c="740" t="sx"/><char c="741" t="sx"/><char c="742" t="sx"/><char c="743" t="sx"/><char c="744" t="sx"/><char c="745" t="sx"/><char c="748" t="sx"/><char c="749" t="sx"/><char c="759" t="sx"/><char c="768" t="sx"/><char c="769" t="sx"/><char c="770" t="sx"/><char c="771" t="sx"/><char c="772" t="sx"/><char c="773" t="sx"/><char c="774" t="sx"/><char c="775" t="sx"/><char c="776" t="sx"/><char c="777" t="sx"/><char c="778" t="sx"/><char c="779" t="sx"/><char c="780" t="sx"/><char c="781" t="sx"/><char c="782" t="sx"/><char c="783" t="sx"/><char c="784" t="sx"/><char c="785" t="sx"/><char c="786" t="sx"/><char c="787" t="sx"/><char c="788" t="sx"/><char c="789" t="sx"/><char c="790" t="sx"/><char c="791" t="sx"/><char c="792" t="sx"/><char c="793" t="sx"/><char c="794" t="sx"/><char c="795" t="sx"/><char c="796" t="sx"/><char c="797" t="sx"/><char c="798" t="sx"/><char c="799" t="sx"/><char c="800" t="sx"/><char c="801" t="sx"/><char c="802" t="sx"/><char c="803" t="sx"/><char c="804" t="sx"/><char c="805" t="sx"/><char c="806" t="sx"/><char c="807" t="sx"/><char c="808" t="sx"/><char c="809" t="sx"/><char c="810" t="sx"/><char c="811" t="sx"/><char c="812" t="sx"/><char c="813" t="sx"/><char c="814" t="sx"/><char c="815" t="sx"/><char c="816" t="sx"/><char c="817" t="sx"/><char c="818" t="sx"/><char c="819" t="sx"/><char c="820" t="sx"/><char c="821" t="sx"/><char c="822" t="sx"/><char c="823" t="sx"/><char c="824" t="sx"/><char c="825" t="sx"/><char c="826" t="sx"/><char c="827" t="sx"/><char c="828" t="sx"/><char c="829" t="sx"/><char c="830" t="sx"/><char c="831" t="sx"/><char c="838" t="sx"/><char c="839" t="sx"/><char c="844" t="sx"/><char c="857" t="sx"/><char c="860" t="sx"/><char c="864" t="sx"/><char c="865" t="sx"/><char c="866" t="sx"/><char c="894" t="sx"/><char c="900" t="sx"/><char c="901" t="sx"/><char c="902" t="sx"/><char c="903" t="sx"/><char c="904" t="sx"/><char c="905" t="sx"/><char c="906" t="sx"/><char c="908" t="sx"/><char c="910" t="sx"/><char c="911" t="sx"/><char c="912" t="sx"/><char c="913" t="sx"/><char c="914" t="sx"/><char c="915" t="sx"/><char c="916" t="sx"/><char c="917" t="sx"/><char c="918" t="sx"/><char c="919" t="sx"/><char c="920" t="sx"/><char c="921" t="sx"/><char c="922" t="sx"/><char c="923" t="sx"/><char c="924" t="sx"/><char c="925" t="sx"/><char c="926" t="sx"/><char c="927" t="sx"/><char c="928" t="sx"/><char c="929" t="sx"/><char c="931" t="sx"/><char c="932" t="sx"/><char c="933" t="sx"/><char c="934" t="sx"/><char c="935" t="sx"/><char c="936" t="sx"/><char c="937" t="sx"/><char c="938" t="sx"/><char c="939" t="sx"/><char c="940" t="sx"/><char c="941" t="sx"/><char c="942" t="sx"/><char c="943" t="sx"/><char c="944" t="sx"/><char c="945" t="sx"/><char c="946" t="sx"/><char c="947" t="sx"/><char c="948" t="sx"/><char c="949" t="sx"/><char c="950" t="sx"/><char c="951" t="sx"/><char c="952" t="sx"/><char c="953" t="sx"/><char c="954" t="sx"/><char c="955" t="sx"/><char c="956" t="sx"/><char c="957" t="sx"/><char c="958" t="sx"/><char c="959" t="sx"/><char c="960" t="sx"/><char c="961" t="sx"/><char c="962" t="sx"/><char c="963" t="sx"/><char c="964" t="sx"/><char c="965" t="sx"/><char c="966" t="sx"/><char c="967" t="sx"/><char c="968" t="sx"/><char c="969" t="sx"/><char c="970" t="sx"/><char c="971" t="sx"/><char c="972" t="sx"/><char c="973" t="sx"/><char c="974" t="sx"/><char c="976" t="sx"/><char c="977" t="sx"/><char c="978" t="sx"/><char c="981" t="sx"/><char c="982" t="sx"/><char c="984" t="sx"/><char c="985" t="sx"/><char c="986" t="sx"/><char c="987" t="sx"/><char c="988" t="sx"/><char c="989" t="sx"/><char c="990" t="sx"/><char c="991" t="sx"/><char c="992" t="sx"/><char c="993" t="sx"/><char c="1008" t="sx"/><char c="1009" t="sx"/><char c="1012" t="sx"/><char c="1013" t="sx"/><char c="1014" t="sx"/><char c="1025" t="sx"/><char c="1026" t="sx"/><char c="1027" t="sx"/><char c="1028" t="sx"/><char c="1029" t="sx"/><char c="1030" t="sx"/><char c="1031" t="sx"/><char c="1032" t="sx"/><char c="1033" t="sx"/><char c="1034" t="sx"/><char c="1035" t="sx"/><char c="1036" t="sx"/><char c="1038" t="sx"/><char c="1039" t="sx"/><char c="1040" t="sx"/><char c="1041" t="sx"/><char c="1042" t="sx"/><char c="1043" t="sx"/><char c="1044" t="sx"/><char c="1045" t="sx"/><char c="1046" t="sx"/><char c="1047" t="sx"/><char c="1048" t="sx"/><char c="1049" t="sx"/><char c="1050" t="sx"/><char c="1051" t="sx"/><char c="1052" t="sx"/><char c="1053" t="sx"/><char c="1054" t="sx"/><char c="1055" t="sx"/><char c="1056" t="sx"/><char c="1057" t="sx"/><char c="1058" t="sx"/><char c="1059" t="sx"/><char c="1060" t="sx"/><char c="1061" t="sx"/><char c="1062" t="sx"/><char c="1063" t="sx"/><char c="1064" t="sx"/><char c="1065" t="sx"/><char c="1066" t="sx"/><char c="1067" t="sx"/><char c="1068" t="sx"/><char c="1069" t="sx"/><char c="1070" t="sx"/><char c="1071" t="sx"/><char c="1072" t="sx"/><char c="1073" t="sx"/><char c="1074" t="sx"/><char c="1075" t="sx"/><char c="1076" t="sx"/><char c="1077" t="sx"/><char c="1078" t="sx"/><char c="1079" t="sx"/><char c="1080" t="sx"/><char c="1081" t="sx"/><char c="1082" t="sx"/><char c="1083" t="sx"/><char c="1084" t="sx"/><char c="1085" t="sx"/><char c="1086" t="sx"/><char c="1087" t="sx"/><char c="1088" t="sx"/><char c="1089" t="sx"/><char c="1090" t="sx"/><char c="1091" t="sx"/><char c="1092" t="sx"/><char c="1093" t="sx"/><char c="1094" t="sx"/><char c="1095" t="sx"/><char c="1096" t="sx"/><char c="1097" t="sx"/><char c="1098" t="sx"/><char c="1099" t="sx"/><char c="1100" t="sx"/><char c="1101" t="sx"/><char c="1102" t="sx"/><char c="1103" t="sx"/><char c="1105" t="sx"/><char c="1106" t="sx"/><char c="1107" t="sx"/><char c="1108" t="sx"/><char c="1109" t="sx"/><char c="1110" t="sx"/><char c="1111" t="sx"/><char c="1112" t="sx"/><char c="1113" t="sx"/><char c="1114" t="sx"/><char c="1115" t="sx"/><char c="1116" t="sx"/><char c="1118" t="sx"/><char c="1119" t="sx"/><char c="1122" t="sx"/><char c="1123" t="sx"/><char c="1130" t="sx"/><char c="1131" t="sx"/><char c="1138" t="sx"/><char c="1139" t="sx"/><char c="1140" t="sx"/><char c="1141" t="sx"/><char c="1168" t="sx"/><char c="1169" t="sx"/><char c="7424" t="sx"/><char c="7431" t="sx"/><char c="7452" t="sx"/><char c="7553" t="sx"/><char c="7556" t="sx"/><char c="7557" t="sx"/><char c="7562" t="sx"/><char c="7565" t="sx"/><char c="7566" t="sx"/><char c="7576" t="sx"/><char c="7587" t="sx"/><char c="7808" t="sx"/><char c="7809" t="sx"/><char c="7810" t="sx"/><char c="7811" t="sx"/><char c="7812" t="sx"/><char c="7813" t="sx"/><char c="7922" t="sx"/><char c="7923" t="sx"/><char c="8208" t="sx"/><char c="8209" t="sx"/><char c="8210" t="sx"/><char c="8211" t="sx"/><char c="8212" t="sx"/><char c="8213" t="sx"/><char c="8214" t="sx"/><char c="8215" t="sx"/><char c="8216" t="sx"/><char c="8217" t="sx"/><char c="8218" t="sx"/><char c="8219" t="sx"/><char c="8220" t="sx"/><char c="8221" t="sx"/><char c="8222" t="sx"/><char c="8223" t="sx"/><char c="8224" t="sx"/><char c="8225" t="sx"/><char c="8226" t="sx"/><char c="8229" t="sx"/><char c="8230" t="sx"/><char c="8240" t="sx"/><char c="8241" t="sx"/><char c="8242" t="sx"/><char c="8243" t="sx"/><char c="8244" t="sx"/><char c="8245" t="sx"/><char c="8246" t="sx"/><char c="8247" t="sx"/><char c="8248" t="sx"/><char c="8249" t="sx"/><char c="8250" t="sx"/><char c="8251" t="sx"/><char c="8252" t="sx"/><char c="8254" t="sx"/><char c="8256" t="sx"/><char c="8259" t="sx"/><char c="8260" t="sx"/><char c="8263" t="sx"/><char c="8270" t="sx"/><char c="8271" t="sx"/><char c="8272" t="sx"/><char c="8273" t="sx"/><char c="8274" t="sx"/><char c="8279" t="sx"/><char c="8287" t="sx"/><char c="8319" t="sx"/><char c="8355" t="sx"/><char c="8356" t="sx"/><char c="8359" t="sx"/><char c="8364" t="sx"/><char c="8400" t="sx"/><char c="8401" t="sx"/><char c="8402" t="sx"/><char c="8406" t="sx"/><char c="8407" t="sx"/><char c="8411" t="sx"/><char c="8412" t="sx"/><char c="8413" t="sx"/><char c="8414" t="sx"/><char c="8415" t="sx"/><char c="8417" t="sx"/><char c="8420" t="sx"/><char c="8421" t="sx"/><char c="8422" t="sx"/><char c="8423" t="sx"/><char c="8424" t="sx"/><char c="8425" t="sx"/><char c="8426" t="sx"/><char c="8427" t="sx"/><char c="8428" t="sx"/><char c="8429" t="sx"/><char c="8430" t="sx"/><char c="8431" t="sx"/><char c="8432" t="sx"/><char c="8450" t="sx"/><char c="8453" t="sx"/><char c="8455" t="sx"/><char c="8458" t="sx"/><char c="8459" t="sx"/><char c="8460" t="sx"/><char c="8461" t="sx"/><char c="8462" t="sx"/><char c="8463" t="sx"/><char c="8464" t="sx"/><char c="8465" t="sx"/><char c="8466" t="sx"/><char c="8467" t="sx"/><char c="8469" t="sx"/><char c="8470" t="sx"/><char c="8471" t="sx"/><char c="8472" t="sx"/><char c="8473" t="sx"/><char c="8474" t="sx"/><char c="8475" t="sx"/><char c="8476" t="sx"/><char c="8477" t="sx"/><char c="8478" t="sx"/><char c="8482" t="sx"/><char c="8484" t="sx"/><char c="8485" t="sx"/><char c="8486" t="sx"/><char c="8487" t="sx"/><char c="8488" t="sx"/><char c="8489" t="sx"/><char c="8491" t="sx"/><char c="8492" t="sx"/><char c="8493" t="sx"/><char c="8494" t="sx"/><char c="8495" t="sx"/><char c="8496" t="sx"/><char c="8497" t="sx"/><char c="8498" t="sx"/><char c="8499" t="sx"/><char c="8500" t="sx"/><char c="8501" t="sx"/><char c="8502" t="sx"/><char c="8503" t="sx"/><char c="8504" t="sx"/><char c="8508" t="sx"/><char c="8509" t="sx"/><char c="8510" t="sx"/><char c="8511" t="sx"/><char c="8512" t="sx"/><char c="8513" t="sx"/><char c="8514" t="sx"/><char c="8515" t="sx"/><char c="8516" t="sx"/><char c="8517" t="sx"/><char c="8518" t="sx"/><char c="8519" t="sx"/><char c="8520" t="sx"/><char c="8521" t="sx"/><char c="8522" t="sx"/><char c="8523" t="sx"/><char c="8531" t="sx"/><char c="8532" t="sx"/><char c="8533" t="sx"/><char c="8534" t="sx"/><char c="8535" t="sx"/><char c="8536" t="sx"/><char c="8537" t="sx"/><char c="8538" t="sx"/><char c="8539" t="sx"/><char c="8540" t="sx"/><char c="8541" t="sx"/><char c="8542" t="sx"/><char c="8592" t="sx"/><char c="8593" t="sx"/><char c="8594" t="sx"/><char c="8595" t="sx"/><char c="8596" t="sx"/><char c="8597" t="sx"/><char c="8598" t="sx"/><char c="8599" t="sx"/><char c="8600" t="sx"/><char c="8601" t="sx"/><char c="8602" t="sx"/><char c="8603" t="sx"/><char c="8604" t="sx"/><char c="8605" t="sx"/><char c="8606" t="sx"/><char c="8607" t="sx"/><char c="8608" t="sx"/><char c="8609" t="sx"/><char c="8610" t="sx"/><char c="8611" t="sx"/><char c="8612" t="sx"/><char c="8613" t="sx"/><char c="8614" t="sx"/><char c="8615" t="sx"/><char c="8616" t="sx"/><char c="8617" t="sx"/><char c="8618" t="sx"/><char c="8619" t="sx"/><char c="8620" t="sx"/><char c="8621" t="sx"/><char c="8622" t="sx"/><char c="8623" t="sx"/><char c="8624" t="sx"/><char c="8625" t="sx"/><char c="8626" t="sx"/><char c="8627" t="sx"/><char c="8628" t="sx"/><char c="8629" t="sx"/><char c="8630" t="sx"/><char c="8631" t="sx"/><char c="8632" t="sx"/><char c="8633" t="sx"/><char c="8634" t="sx"/><char c="8635" t="sx"/><char c="8636" t="sx"/><char c="8637" t="sx"/><char c="8638" t="sx"/><char c="8639" t="sx"/><char c="8640" t="sx"/><char c="8641" t="sx"/><char c="8642" t="sx"/><char c="8643" t="sx"/><char c="8644" t="sx"/><char c="8645" t="sx"/><char c="8646" t="sx"/><char c="8647" t="sx"/><char c="8648" t="sx"/><char c="8649" t="sx"/><char c="8650" t="sx"/><char c="8651" t="sx"/><char c="8652" t="sx"/><char c="8653" t="sx"/><char c="8654" t="sx"/><char c="8655" t="sx"/><char c="8656" t="sx"/><char c="8657" t="sx"/><char c="8658" t="sx"/><char c="8659" t="sx"/><char c="8660" t="sx"/><char c="8661" t="sx"/><char c="8662" t="sx"/><char c="8663" t="sx"/><char c="8664" t="sx"/><char c="8665" t="sx"/><char c="8666" t="sx"/><char c="8667" t="sx"/><char c="8668" t="sx"/><char c="8669" t="sx"/><char c="8670" t="sx"/><char c="8671" t="sx"/><char c="8672" t="sx"/><char c="8673" t="sx"/><char c="8674" t="sx"/><char c="8675" t="sx"/><char c="8676" t="sx"/><char c="8677" t="sx"/><char c="8678" t="sx"/><char c="8679" t="sx"/><char c="8680" t="sx"/><char c="8681" t="sx"/><char c="8682" t="sx"/><char c="8692" t="sx"/><char c="8693" t="sx"/><char c="8694" t="sx"/><char c="8695" t="sx"/><char c="8696" t="sx"/><char c="8697" t="sx"/><char c="8698" t="sx"/><char c="8699" t="sx"/><char c="8700" t="sx"/><char c="8701" t="sx"/><char c="8702" t="sx"/><char c="8703" t="sx"/><char c="8704" t="sx"/><char c="8705" t="sx"/><char c="8706" t="sx"/><char c="8707" t="sx"/><char c="8708" t="sx"/><char c="8709" t="sx"/><char c="8710" t="sx"/><char c="8711" t="sx"/><char c="8712" t="sx"/><char c="8713" t="sx"/><char c="8714" t="sx"/><char c="8715" t="sx"/><char c="8716" t="sx"/><char c="8717" t="sx"/><char c="8718" t="sx"/><char c="8719" t="sx"/><char c="8720" t="sx"/><char c="8721" t="sx"/><char c="8722" t="sx"/><char c="8723" t="sx"/><char c="8724" t="sx"/><char c="8725" t="sx"/><char c="8726" t="sx"/><char c="8727" t="sx"/><char c="8728" t="sx"/><char c="8729" t="sx"/><char c="8730" t="sx"/><char c="8731" t="sx"/><char c="8732" t="sx"/><char c="8733" t="sx"/><char c="8734" t="sx"/><char c="8735" t="sx"/><char c="8736" t="sx"/><char c="8737" t="sx"/><char c="8738" t="sx"/><char c="8739" t="sx"/><char c="8740" t="sx"/><char c="8741" t="sx"/><char c="8742" t="sx"/><char c="8743" t="sx"/><char c="8744" t="sx"/><char c="8745" t="sx"/><char c="8746" t="sx"/><char c="8747" t="sx"/><char c="8748" t="sx"/><char c="8749" t="sx"/><char c="8750" t="sx"/><char c="8751" t="sx"/><char c="8752" t="sx"/><char c="8753" t="sx"/><char c="8754" t="sx"/><char c="8755" t="sx"/><char c="8756" t="sx"/><char c="8757" t="sx"/><char c="8758" t="sx"/><char c="8759" t="sx"/><char c="8760" t="sx"/><char c="8761" t="sx"/><char c="8762" t="sx"/><char c="8763" t="sx"/><char c="8764" t="sx"/><char c="8765" t="sx"/><char c="8766" t="sx"/><char c="8767" t="sx"/><char c="8768" t="sx"/><char c="8769" t="sx"/><char c="8770" t="sx"/><char c="8771" t="sx"/><char c="8772" t="sx"/><char c="8773" t="sx"/><char c="8774" t="sx"/><char c="8775" t="sx"/><char c="8776" t="sx"/><char c="8777" t="sx"/><char c="8778" t="sx"/><char c="8779" t="sx"/><char c="8780" t="sx"/><char c="8781" t="sx"/><char c="8782" t="sx"/><char c="8783" t="sx"/><char c="8784" t="sx"/><char c="8785" t="sx"/><char c="8786" t="sx"/><char c="8787" t="sx"/><char c="8788" t="sx"/><char c="8789" t="sx"/><char c="8790" t="sx"/><char c="8791" t="sx"/><char c="8792" t="sx"/><char c="8793" t="sx"/><char c="8794" t="sx"/><char c="8795" t="sx"/><char c="8796" t="sx"/><char c="8797" t="sx"/><char c="8798" t="sx"/><char c="8799" t="sx"/><char c="8800" t="sx"/><char c="8801" t="sx"/><char c="8802" t="sx"/><char c="8803" t="sx"/><char c="8804" t="sx"/><char c="8805" t="sx"/><char c="8806" t="sx"/><char c="8807" t="sx"/><char c="8808" t="sx"/><char c="8809" t="sx"/><char c="8810" t="sx"/><char c="8811" t="sx"/><char c="8812" t="sx"/><char c="8813" t="sx"/><char c="8814" t="sx"/><char c="8815" t="sx"/><char c="8816" t="sx"/><char c="8817" t="sx"/><char c="8818" t="sx"/><char c="8819" t="sx"/><char c="8820" t="sx"/><char c="8821" t="sx"/><char c="8822" t="sx"/><char c="8823" t="sx"/><char c="8824" t="sx"/><char c="8825" t="sx"/><char c="8826" t="sx"/><char c="8827" t="sx"/><char c="8828" t="sx"/><char c="8829" t="sx"/><char c="8830" t="sx"/><char c="8831" t="sx"/><char c="8832" t="sx"/><char c="8833" t="sx"/><char c="8834" t="sx"/><char c="8835" t="sx"/><char c="8836" t="sx"/><char c="8837" t="sx"/><char c="8838" t="sx"/><char c="8839" t="sx"/><char c="8840" t="sx"/><char c="8841" t="sx"/><char c="8842" t="sx"/><char c="8843" t="sx"/><char c="8844" t="sx"/><char c="8845" t="sx"/><char c="8846" t="sx"/><char c="8847" t="sx"/><char c="8848" t="sx"/><char c="8849" t="sx"/><char c="8850" t="sx"/><char c="8851" t="sx"/><char c="8852" t="sx"/><char c="8853" t="sx"/><char c="8854" t="sx"/><char c="8855" t="sx"/><char c="8856" t="sx"/><char c="8857" t="sx"/><char c="8858" t="sx"/><char c="8859" t="sx"/><char c="8860" t="sx"/><char c="8861" t="sx"/><char c="8862" t="sx"/><char c="8863" t="sx"/><char c="8864" t="sx"/><char c="8865" t="sx"/><char c="8866" t="sx"/><char c="8867" t="sx"/><char c="8868" t="sx"/><char c="8869" t="sx"/><char c="8870" t="sx"/><char c="8871" t="sx"/><char c="8872" t="sx"/><char c="8873" t="sx"/><char c="8874" t="sx"/><char c="8875" t="sx"/><char c="8876" t="sx"/><char c="8877" t="sx"/><char c="8878" t="sx"/><char c="8879" t="sx"/><char c="8880" t="sx"/><char c="8881" t="sx"/><char c="8882" t="sx"/><char c="8883" t="sx"/><char c="8884" t="sx"/><char c="8885" t="sx"/><char c="8886" t="sx"/><char c="8887" t="sx"/><char c="8888" t="sx"/><char c="8889" t="sx"/><char c="8890" t="sx"/><char c="8891" t="sx"/><char c="8892" t="sx"/><char c="8893" t="sx"/><char c="8894" t="sx"/><char c="8895" t="sx"/><char c="8896" t="sx"/><char c="8897" t="sx"/><char c="8898" t="sx"/><char c="8899" t="sx"/><char c="8900" t="sx"/><char c="8901" t="sx"/><char c="8902" t="sx"/><char c="8903" t="sx"/><char c="8904" t="sx"/><char c="8905" t="sx"/><char c="8906" t="sx"/><char c="8907" t="sx"/><char c="8908" t="sx"/><char c="8909" t="sx"/><char c="8910" t="sx"/><char c="8911" t="sx"/><char c="8912" t="sx"/><char c="8913" t="sx"/><char c="8914" t="sx"/><char c="8915" t="sx"/><char c="8916" t="sx"/><char c="8917" t="sx"/><char c="8918" t="sx"/><char c="8919" t="sx"/><char c="8920" t="sx"/><char c="8921" t="sx"/><char c="8922" t="sx"/><char c="8923" t="sx"/><char c="8924" t="sx"/><char c="8925" t="sx"/><char c="8926" t="sx"/><char c="8927" t="sx"/><char c="8928" t="sx"/><char c="8929" t="sx"/><char c="8930" t="sx"/><char c="8931" t="sx"/><char c="8932" t="sx"/><char c="8933" t="sx"/><char c="8934" t="sx"/><char c="8935" t="sx"/><char c="8936" t="sx"/><char c="8937" t="sx"/><char c="8938" t="sx"/><char c="8939" t="sx"/><char c="8940" t="sx"/><char c="8941" t="sx"/><char c="8942" t="sx"/><char c="8943" t="sx"/><char c="8944" t="sx"/><char c="8945" t="sx"/><char c="8946" t="sx"/><char c="8947" t="sx"/><char c="8948" t="sx"/><char c="8949" t="sx"/><char c="8950" t="sx"/><char c="8951" t="sx"/><char c="8952" t="sx"/><char c="8953" t="sx"/><char c="8954" t="sx"/><char c="8955" t="sx"/><char c="8956" t="sx"/><char c="8957" t="sx"/><char c="8958" t="sx"/><char c="8959" t="sx"/><char c="8960" t="sx"/><char c="8962" t="sx"/><char c="8965" t="sx"/><char c="8966" t="sx"/><char c="8968" t="sx"/><char c="8969" t="sx"/><char c="8970" t="sx"/><char c="8971" t="sx"/><char c="8972" t="sx"/><char c="8973" t="sx"/><char c="8974" t="sx"/><char c="8975" t="sx"/><char c="8976" t="sx"/><char c="8977" t="sx"/><char c="8978" t="sx"/><char c="8979" t="sx"/><char c="8981" t="sx"/><char c="8982" t="sx"/><char c="8983" t="sx"/><char c="8984" t="sx"/><char c="8985" t="sx"/><char c="8986" t="sx"/><char c="8988" t="sx"/><char c="8989" t="sx"/><char c="8990" t="sx"/><char c="8991" t="sx"/><char c="8994" t="sx"/><char c="8995" t="sx"/><char c="9001" t="sx"/><char c="9002" t="sx"/><char c="9004" t="sx"/><char c="9005" t="sx"/><char c="9006" t="sx"/><char c="9010" t="sx"/><char c="9014" t="sx"/><char c="9021" t="sx"/><char c="9023" t="sx"/><char c="9024" t="sx"/><char c="9043" t="sx"/><char c="9072" t="sx"/><char c="9084" t="sx"/><char c="9107" t="sx"/><char c="9108" t="sx"/><char c="9135" t="sx"/><char c="9140" t="sx"/><char c="9141" t="sx"/><char c="9142" t="sx"/><char c="9166" t="sx"/><char c="9168" t="sx"/><char c="9180" t="sx"/><char c="9181" t="sx"/><char c="9182" t="sx"/><char c="9183" t="sx"/><char c="9184" t="sx"/><char c="9185" t="sx"/><char c="9186" t="sx"/><char c="9187" t="sx"/><char c="9188" t="sx"/><char c="9189" t="sx"/><char c="9190" t="sx"/><char c="9191" t="sx"/><char c="9251" t="sx"/><char c="9312" t="sx"/><char c="9313" t="sx"/><char c="9314" t="sx"/><char c="9315" t="sx"/><char c="9316" t="sx"/><char c="9317" t="sx"/><char c="9318" t="sx"/><char c="9319" t="sx"/><char c="9320" t="sx"/><char c="9398" t="sx"/><char c="9399" t="sx"/><char c="9400" t="sx"/><char c="9401" t="sx"/><char c="9402" t="sx"/><char c="9403" t="sx"/><char c="9404" t="sx"/><char c="9405" t="sx"/><char c="9406" t="sx"/><char c="9407" t="sx"/><char c="9408" t="sx"/><char c="9409" t="sx"/><char c="9410" t="sx"/><char c="9411" t="sx"/><char c="9412" t="sx"/><char c="9413" t="sx"/><char c="9414" t="sx"/><char c="9415" t="sx"/><char c="9416" t="sx"/><char c="9417" t="sx"/><char c="9418" t="sx"/><char c="9419" t="sx"/><char c="9420" t="sx"/><char c="9421" t="sx"/><char c="9422" t="sx"/><char c="9423" t="sx"/><char c="9424" t="sx"/><char c="9425" t="sx"/><char c="9426" t="sx"/><char c="9427" t="sx"/><char c="9428" t="sx"/><char c="9429" t="sx"/><char c="9430" t="sx"/><char c="9431" t="sx"/><char c="9432" t="sx"/><char c="9433" t="sx"/><char c="9434" t="sx"/><char c="9435" t="sx"/><char c="9436" t="sx"/><char c="9437" t="sx"/><char c="9438" t="sx"/><char c="9439" t="sx"/><char c="9440" t="sx"/><char c="9441" t="sx"/><char c="9442" t="sx"/><char c="9443" t="sx"/><char c="9444" t="sx"/><char c="9445" t="sx"/><char c="9446" t="sx"/><char c="9447" t="sx"/><char c="9448" t="sx"/><char c="9449" t="sx"/><char c="9450" t="sx"/><char c="9472" t="sx"/><char c="9474" t="sx"/><char c="9478" t="sx"/><char c="9480" t="sx"/><char c="9482" t="sx"/><char c="9484" t="sx"/><char c="9488" t="sx"/><char c="9492" t="sx"/><char c="9496" t="sx"/><char c="9500" t="sx"/><char c="9508" t="sx"/><char c="9516" t="sx"/><char c="9524" t="sx"/><char c="9532" t="sx"/><char c="9552" t="sx"/><char c="9553" t="sx"/><char c="9554" t="sx"/><char c="9555" t="sx"/><char c="9556" t="sx"/><char c="9557" t="sx"/><char c="9558" t="sx"/><char c="9559" t="sx"/><char c="9560" t="sx"/><char c="9561" t="sx"/><char c="9562" t="sx"/><char c="9563" t="sx"/><char c="9564" t="sx"/><char c="9565" t="sx"/><char c="9566" t="sx"/><char c="9567" t="sx"/><char c="9568" t="sx"/><char c="9569" t="sx"/><char c="9570" t="sx"/><char c="9571" t="sx"/><char c="9572" t="sx"/><char c="9573" t="sx"/><char c="9574" t="sx"/><char c="9575" t="sx"/><char c="9576" t="sx"/><char c="9577" t="sx"/><char c="9578" t="sx"/><char c="9579" t="sx"/><char c="9580" t="sx"/><char c="9585" t="sx"/><char c="9586" t="sx"/><char c="9600" t="sx"/><char c="9604" t="sx"/><char c="9608" t="sx"/><char c="9612" t="sx"/><char c="9616" t="sx"/><char c="9617" t="sx"/><char c="9618" t="sx"/><char c="9619" t="sx"/><char c="9632" t="sx"/><char c="9633" t="sx"/><char c="9634" t="sx"/><char c="9635" t="sx"/><char c="9636" t="sx"/><char c="9637" t="sx"/><char c="9638" t="sx"/><char c="9639" t="sx"/><char c="9640" t="sx"/><char c="9641" t="sx"/><char c="9642" t="sx"/><char c="9643" t="sx"/><char c="9644" t="sx"/><char c="9645" t="sx"/><char c="9646" t="sx"/><char c="9647" t="sx"/><char c="9648" t="sx"/><char c="9649" t="sx"/><char c="9650" t="sx"/><char c="9651" t="sx"/><char c="9652" t="sx"/><char c="9653" t="sx"/><char c="9654" t="sx"/><char c="9655" t="sx"/><char c="9656" t="sx"/><char c="9657" t="sx"/><char c="9658" t="sx"/><char c="9659" t="sx"/><char c="9660" t="sx"/><char c="9661" t="sx"/><char c="9662" t="sx"/><char c="9663" t="sx"/><char c="9664" t="sx"/><char c="9665" t="sx"/><char c="9666" t="sx"/><char c="9667" t="sx"/><char c="9668" t="sx"/><char c="9669" t="sx"/><char c="9670" t="sx"/><char c="9671" t="sx"/><char c="9672" t="sx"/><char c="9673" t="sx"/><char c="9674" t="sx"/><char c="9675" t="sx"/><char c="9676" t="sx"/><char c="9677" t="sx"/><char c="9678" t="sx"/><char c="9679" t="sx"/><char c="9680" t="sx"/><char c="9681" t="sx"/><char c="9682" t="sx"/><char c="9683" t="sx"/><char c="9684" t="sx"/><char c="9685" t="sx"/><char c="9686" t="sx"/><char c="9687" t="sx"/><char c="9688" t="sx"/><char c="9689" t="sx"/><char c="9690" t="sx"/><char c="9691" t="sx"/><char c="9692" t="sx"/><char c="9693" t="sx"/><char c="9694" t="sx"/><char c="9695" t="sx"/><char c="9696" t="sx"/><char c="9697" t="sx"/><char c="9698" t="sx"/><char c="9699" t="sx"/><char c="9700" t="sx"/><char c="9701" t="sx"/><char c="9702" t="sx"/><char c="9703" t="sx"/><char c="9704" t="sx"/><char c="9705" t="sx"/><char c="9706" t="sx"/><char c="9707" t="sx"/><char c="9708" t="sx"/><char c="9709" t="sx"/><char c="9710" t="sx"/><char c="9711" t="sx"/><char c="9712" t="sx"/><char c="9713" t="sx"/><char c="9714" t="sx"/><char c="9715" t="sx"/><char c="9716" t="sx"/><char c="9717" t="sx"/><char c="9718" t="sx"/><char c="9719" t="sx"/><char c="9720" t="sx"/><char c="9721" t="sx"/><char c="9722" t="sx"/><char c="9723" t="sx"/><char c="9724" t="sx"/><char c="9725" t="sx"/><char c="9726" t="sx"/><char c="9727" t="sx"/><char c="9733" t="sx"/><char c="9734" t="sx"/><char c="9737" t="sx"/><char c="9740" t="sx"/><char c="9742" t="sx"/><char c="9746" t="sx"/><char c="9761" t="sx"/><char c="9785" t="sx"/><char c="9786" t="sx"/><char c="9787" t="sx"/><char c="9788" t="sx"/><char c="9789" t="sx"/><char c="9790" t="sx"/><char c="9791" t="sx"/><char c="9792" t="sx"/><char c="9793" t="sx"/><char c="9794" t="sx"/><char c="9795" t="sx"/><char c="9796" t="sx"/><char c="9798" t="sx"/><char c="9799" t="sx"/><char c="9800" t="sx"/><char c="9801" t="sx"/><char c="9824" t="sx"/><char c="9825" t="sx"/><char c="9826" t="sx"/><char c="9827" t="sx"/><char c="9828" t="sx"/><char c="9829" t="sx"/><char c="9830" t="sx"/><char c="9831" t="sx"/><char c="9833" t="sx"/><char c="9834" t="sx"/><char c="9835" t="sx"/><char c="9837" t="sx"/><char c="9838" t="sx"/><char c="9839" t="sx"/><char c="9854" t="sx"/><char c="9856" t="sx"/><char c="9857" t="sx"/><char c="9858" t="sx"/><char c="9859" t="sx"/><char c="9860" t="sx"/><char c="9861" t="sx"/><char c="9862" t="sx"/><char c="9863" t="sx"/><char c="9864" t="sx"/><char c="9865" t="sx"/><char c="9888" t="sx"/><char c="9893" t="sx"/><char c="9898" t="sx"/><char c="9899" t="sx"/><char c="9900" t="sx"/><char c="9906" t="sx"/><char c="9954" t="sx"/><char c="9986" t="sx"/><char c="9993" t="sx"/><char c="10003" t="sx"/><char c="10016" t="sx"/><char c="10026" t="sx"/><char c="10038" t="sx"/><char c="10045" t="sx"/><char c="10098" t="sx"/><char c="10099" t="sx"/><char c="10112" t="sx"/><char c="10113" t="sx"/><char c="10114" t="sx"/><char c="10115" t="sx"/><char c="10116" t="sx"/><char c="10117" t="sx"/><char c="10118" t="sx"/><char c="10119" t="sx"/><char c="10120" t="sx"/><char c="10121" t="sx"/><char c="10122" t="sx"/><char c="10123" t="sx"/><char c="10124" t="sx"/><char c="10125" t="sx"/><char c="10126" t="sx"/><char c="10127" t="sx"/><char c="10128" t="sx"/><char c="10129" t="sx"/><char c="10130" t="sx"/><char c="10131" t="sx"/><char c="10139" t="sx"/><char c="10176" t="sx"/><char c="10177" t="sx"/><char c="10178" t="sx"/><char c="10179" t="sx"/><char c="10180" t="sx"/><char c="10181" t="sx"/><char c="10182" t="sx"/><char c="10183" t="sx"/><char c="10184" t="sx"/><char c="10185" t="sx"/><char c="10187" t="sx"/><char c="10188" t="sx"/><char c="10189" t="sx"/><char c="10192" t="sx"/><char c="10193" t="sx"/><char c="10194" t="sx"/><char c="10195" t="sx"/><char c="10196" t="sx"/><char c="10197" t="sx"/><char c="10198" t="sx"/><char c="10199" t="sx"/><char c="10200" t="sx"/><char c="10201" t="sx"/><char c="10202" t="sx"/><char c="10203" t="sx"/><char c="10204" t="sx"/><char c="10205" t="sx"/><char c="10206" t="sx"/><char c="10207" t="sx"/><char c="10208" t="sx"/><char c="10209" t="sx"/><char c="10210" t="sx"/><char c="10211" t="sx"/><char c="10212" t="sx"/><char c="10213" t="sx"/><char c="10214" t="sx"/><char c="10215" t="sx"/><char c="10216" t="sx"/><char c="10217" t="sx"/><char c="10218" t="sx"/><char c="10219" t="sx"/><char c="10220" t="sx"/><char c="10221" t="sx"/><char c="10222" t="sx"/><char c="10223" t="sx"/><char c="10224" t="sx"/><char c="10225" t="sx"/><char c="10226" t="sx"/><char c="10227" t="sx"/><char c="10228" t="sx"/><char c="10229" t="sx"/><char c="10230" t="sx"/><char c="10231" t="sx"/><char c="10232" t="sx"/><char c="10233" t="sx"/><char c="10234" t="sx"/><char c="10235" t="sx"/><char c="10236" t="sx"/><char c="10237" t="sx"/><char c="10238" t="sx"/><char c="10239" t="sx"/><char c="10496" t="sx"/><char c="10497" t="sx"/><char c="10498" t="sx"/><char c="10499" t="sx"/><char c="10500" t="sx"/><char c="10501" t="sx"/><char c="10502" t="sx"/><char c="10503" t="sx"/><char c="10504" t="sx"/><char c="10505" t="sx"/><char c="10506" t="sx"/><char c="10507" t="sx"/><char c="10508" t="sx"/><char c="10509" t="sx"/><char c="10510" t="sx"/><char c="10511" t="sx"/><char c="10512" t="sx"/><char c="10513" t="sx"/><char c="10514" t="sx"/><char c="10515" t="sx"/><char c="10516" t="sx"/><char c="10517" t="sx"/><char c="10518" t="sx"/><char c="10519" t="sx"/><char c="10520" t="sx"/><char c="10521" t="sx"/><char c="10522" t="sx"/><char c="10523" t="sx"/><char c="10524" t="sx"/><char c="10525" t="sx"/><char c="10526" t="sx"/><char c="10527" t="sx"/><char c="10528" t="sx"/><char c="10529" t="sx"/><char c="10530" t="sx"/><char c="10531" t="sx"/><char c="10532" t="sx"/><char c="10533" t="sx"/><char c="10534" t="sx"/><char c="10535" t="sx"/><char c="10536" t="sx"/><char c="10537" t="sx"/><char c="10538" t="sx"/><char c="10539" t="sx"/><char c="10540" t="sx"/><char c="10541" t="sx"/><char c="10542" t="sx"/><char c="10543" t="sx"/><char c="10544" t="sx"/><char c="10545" t="sx"/><char c="10546" t="sx"/><char c="10547" t="sx"/><char c="10548" t="sx"/><char c="10549" t="sx"/><char c="10550" t="sx"/><char c="10551" t="sx"/><char c="10552" t="sx"/><char c="10553" t="sx"/><char c="10554" t="sx"/><char c="10555" t="sx"/><char c="10556" t="sx"/><char c="10557" t="sx"/><char c="10558" t="sx"/><char c="10559" t="sx"/><char c="10560" t="sx"/><char c="10561" t="sx"/><char c="10562" t="sx"/><char c="10563" t="sx"/><char c="10564" t="sx"/><char c="10565" t="sx"/><char c="10566" t="sx"/><char c="10567" t="sx"/><char c="10568" t="sx"/><char c="10569" t="sx"/><char c="10570" t="sx"/><char c="10571" t="sx"/><char c="10572" t="sx"/><char c="10573" t="sx"/><char c="10574" t="sx"/><char c="10575" t="sx"/><char c="10576" t="sx"/><char c="10577" t="sx"/><char c="10578" t="sx"/><char c="10579" t="sx"/><char c="10580" t="sx"/><char c="10581" t="sx"/><char c="10582" t="sx"/><char c="10583" t="sx"/><char c="10584" t="sx"/><char c="10585" t="sx"/><char c="10586" t="sx"/><char c="10587" t="sx"/><char c="10588" t="sx"/><char c="10589" t="sx"/><char c="10590" t="sx"/><char c="10591" t="sx"/><char c="10592" t="sx"/><char c="10593" t="sx"/><char c="10594" t="sx"/><char c="10595" t="sx"/><char c="10596" t="sx"/><char c="10597" t="sx"/><char c="10598" t="sx"/><char c="10599" t="sx"/><char c="10600" t="sx"/><char c="10601" t="sx"/><char c="10602" t="sx"/><char c="10603" t="sx"/><char c="10604" t="sx"/><char c="10605" t="sx"/><char c="10606" t="sx"/><char c="10607" t="sx"/><char c="10608" t="sx"/><char c="10609" t="sx"/><char c="10610" t="sx"/><char c="10611" t="sx"/><char c="10612" t="sx"/><char c="10613" t="sx"/><char c="10614" t="sx"/><char c="10615" t="sx"/><char c="10616" t="sx"/><char c="10617" t="sx"/><char c="10618" t="sx"/><char c="10619" t="sx"/><char c="10620" t="sx"/><char c="10621" t="sx"/><char c="10622" t="sx"/><char c="10623" t="sx"/><char c="10624" t="sx"/><char c="10625" t="sx"/><char c="10626" t="sx"/><char c="10627" t="sx"/><char c="10628" t="sx"/><char c="10629" t="sx"/><char c="10630" t="sx"/><char c="10631" t="sx"/><char c="10632" t="sx"/><char c="10633" t="sx"/><char c="10634" t="sx"/><char c="10635" t="sx"/><char c="10636" t="sx"/><char c="10637" t="sx"/><char c="10638" t="sx"/><char c="10639" t="sx"/><char c="10640" t="sx"/><char c="10641" t="sx"/><char c="10642" t="sx"/><char c="10643" t="sx"/><char c="10644" t="sx"/><char c="10645" t="sx"/><char c="10646" t="sx"/><char c="10647" t="sx"/><char c="10648" t="sx"/><char c="10649" t="sx"/><char c="10650" t="sx"/><char c="10651" t="sx"/><char c="10652" t="sx"/><char c="10653" t="sx"/><char c="10654" t="sx"/><char c="10655" t="sx"/><char c="10656" t="sx"/><char c="10657" t="sx"/><char c="10658" t="sx"/><char c="10659" t="sx"/><char c="10660" t="sx"/><char c="10661" t="sx"/><char c="10662" t="sx"/><char c="10663" t="sx"/><char c="10664" t="sx"/><char c="10665" t="sx"/><char c="10666" t="sx"/><char c="10667" t="sx"/><char c="10668" t="sx"/><char c="10669" t="sx"/><char c="10670" t="sx"/><char c="10671" t="sx"/><char c="10672" t="sx"/><char c="10673" t="sx"/><char c="10674" t="sx"/><char c="10675" t="sx"/><char c="10676" t="sx"/><char c="10677" t="sx"/><char c="10678" t="sx"/><char c="10679" t="sx"/><char c="10680" t="sx"/><char c="10681" t="sx"/><char c="10682" t="sx"/><char c="10683" t="sx"/><char c="10684" t="sx"/><char c="10685" t="sx"/><char c="10686" t="sx"/><char c="10687" t="sx"/><char c="10688" t="sx"/><char c="10689" t="sx"/><char c="10690" t="sx"/><char c="10691" t="sx"/><char c="10692" t="sx"/><char c="10693" t="sx"/><char c="10694" t="sx"/><char c="10695" t="sx"/><char c="10696" t="sx"/><char c="10697" t="sx"/><char c="10698" t="sx"/><char c="10699" t="sx"/><char c="10700" t="sx"/><char c="10701" t="sx"/><char c="10702" t="sx"/><char c="10703" t="sx"/><char c="10704" t="sx"/><char c="10705" t="sx"/><char c="10706" t="sx"/><char c="10707" t="sx"/><char c="10708" t="sx"/><char c="10709" t="sx"/><char c="10710" t="sx"/><char c="10711" t="sx"/><char c="10712" t="sx"/><char c="10713" t="sx"/><char c="10714" t="sx"/><char c="10715" t="sx"/><char c="10716" t="sx"/><char c="10717" t="sx"/><char c="10718" t="sx"/><char c="10719" t="sx"/><char c="10720" t="sx"/><char c="10721" t="sx"/><char c="10722" t="sx"/><char c="10723" t="sx"/><char c="10724" t="sx"/><char c="10725" t="sx"/><char c="10726" t="sx"/><char c="10727" t="sx"/><char c="10728" t="sx"/><char c="10729" t="sx"/><char c="10730" t="sx"/><char c="10731" t="sx"/><char c="10732" t="sx"/><char c="10733" t="sx"/><char c="10734" t="sx"/><char c="10735" t="sx"/><char c="10736" t="sx"/><char c="10737" t="sx"/><char c="10738" t="sx"/><char c="10739" t="sx"/><char c="10740" t="sx"/><char c="10741" t="sx"/><char c="10742" t="sx"/><char c="10743" t="sx"/><char c="10744" t="sx"/><char c="10745" t="sx"/><char c="10746" t="sx"/><char c="10747" t="sx"/><char c="10748" t="sx"/><char c="10749" t="sx"/><char c="10750" t="sx"/><char c="10751" t="sx"/><char c="10752" t="sx"/><char c="10753" t="sx"/><char c="10754" t="sx"/><char c="10755" t="sx"/><char c="10756" t="sx"/><char c="10757" t="sx"/><char c="10758" t="sx"/><char c="10759" t="sx"/><char c="10760" t="sx"/><char c="10761" t="sx"/><char c="10762" t="sx"/><char c="10763" t="sx"/><char c="10764" t="sx"/><char c="10765" t="sx"/><char c="10766" t="sx"/><char c="10767" t="sx"/><char c="10768" t="sx"/><char c="10769" t="sx"/><char c="10770" t="sx"/><char c="10771" t="sx"/><char c="10772" t="sx"/><char c="10773" t="sx"/><char c="10774" t="sx"/><char c="10775" t="sx"/><char c="10776" t="sx"/><char c="10777" t="sx"/><char c="10778" t="sx"/><char c="10779" t="sx"/><char c="10780" t="sx"/><char c="10781" t="sx"/><char c="10782" t="sx"/><char c="10783" t="sx"/><char c="10784" t="sx"/><char c="10785" t="sx"/><char c="10786" t="sx"/><char c="10787" t="sx"/><char c="10788" t="sx"/><char c="10789" t="sx"/><char c="10790" t="sx"/><char c="10791" t="sx"/><char c="10792" t="sx"/><char c="10793" t="sx"/><char c="10794" t="sx"/><char c="10795" t="sx"/><char c="10796" t="sx"/><char c="10797" t="sx"/><char c="10798" t="sx"/><char c="10799" t="sx"/><char c="10800" t="sx"/><char c="10801" t="sx"/><char c="10802" t="sx"/><char c="10803" t="sx"/><char c="10804" t="sx"/><char c="10805" t="sx"/><char c="10806" t="sx"/><char c="10807" t="sx"/><char c="10808" t="sx"/><char c="10809" t="sx"/><char c="10810" t="sx"/><char c="10811" t="sx"/><char c="10812" t="sx"/><char c="10813" t="sx"/><char c="10814" t="sx"/><char c="10815" t="sx"/><char c="10816" t="sx"/><char c="10817" t="sx"/><char c="10818" t="sx"/><char c="10819" t="sx"/><char c="10820" t="sx"/><char c="10821" t="sx"/><char c="10822" t="sx"/><char c="10823" t="sx"/><char c="10824" t="sx"/><char c="10825" t="sx"/><char c="10826" t="sx"/><char c="10827" t="sx"/><char c="10828" t="sx"/><char c="10829" t="sx"/><char c="10830" t="sx"/><char c="10831" t="sx"/><char c="10832" t="sx"/><char c="10833" t="sx"/><char c="10834" t="sx"/><char c="10835" t="sx"/><char c="10836" t="sx"/><char c="10837" t="sx"/><char c="10838" t="sx"/><char c="10839" t="sx"/><char c="10840" t="sx"/><char c="10841" t="sx"/><char c="10842" t="sx"/><char c="10843" t="sx"/><char c="10844" t="sx"/><char c="10845" t="sx"/><char c="10846" t="sx"/><char c="10847" t="sx"/><char c="10848" t="sx"/><char c="10849" t="sx"/><char c="10850" t="sx"/><char c="10851" t="sx"/><char c="10852" t="sx"/><char c="10853" t="sx"/><char c="10854" t="sx"/><char c="10855" t="sx"/><char c="10856" t="sx"/><char c="10857" t="sx"/><char c="10858" t="sx"/><char c="10859" t="sx"/><char c="10860" t="sx"/><char c="10861" t="sx"/><char c="10862" t="sx"/><char c="10863" t="sx"/><char c="10864" t="sx"/><char c="10865" t="sx"/><char c="10866" t="sx"/><char c="10867" t="sx"/><char c="10868" t="sx"/><char c="10869" t="sx"/><char c="10870" t="sx"/><char c="10871" t="sx"/><char c="10872" t="sx"/><char c="10873" t="sx"/><char c="10874" t="sx"/><char c="10875" t="sx"/><char c="10876" t="sx"/><char c="10877" t="sx"/><char c="10878" t="sx"/><char c="10879" t="sx"/><char c="10880" t="sx"/><char c="10881" t="sx"/><char c="10882" t="sx"/><char c="10883" t="sx"/><char c="10884" t="sx"/><char c="10885" t="sx"/><char c="10886" t="sx"/><char c="10887" t="sx"/><char c="10888" t="sx"/><char c="10889" t="sx"/><char c="10890" t="sx"/><char c="10891" t="sx"/><char c="10892" t="sx"/><char c="10893" t="sx"/><char c="10894" t="sx"/><char c="10895" t="sx"/><char c="10896" t="sx"/><char c="10897" t="sx"/><char c="10898" t="sx"/><char c="10899" t="sx"/><char c="10900" t="sx"/><char c="10901" t="sx"/><char c="10902" t="sx"/><char c="10903" t="sx"/><char c="10904" t="sx"/><char c="10905" t="sx"/><char c="10906" t="sx"/><char c="10907" t="sx"/><char c="10908" t="sx"/><char c="10909" t="sx"/><char c="10910" t="sx"/><char c="10911" t="sx"/><char c="10912" t="sx"/><char c="10913" t="sx"/><char c="10914" t="sx"/><char c="10915" t="sx"/><char c="10916" t="sx"/><char c="10917" t="sx"/><char c="10918" t="sx"/><char c="10919" t="sx"/><char c="10920" t="sx"/><char c="10921" t="sx"/><char c="10922" t="sx"/><char c="10923" t="sx"/><char c="10924" t="sx"/><char c="10925" t="sx"/><char c="10926" t="sx"/><char c="10927" t="sx"/><char c="10928" t="sx"/><char c="10929" t="sx"/><char c="10930" t="sx"/><char c="10931" t="sx"/><char c="10932" t="sx"/><char c="10933" t="sx"/><char c="10934" t="sx"/><char c="10935" t="sx"/><char c="10936" t="sx"/><char c="10937" t="sx"/><char c="10938" t="sx"/><char c="10939" t="sx"/><char c="10940" t="sx"/><char c="10941" t="sx"/><char c="10942" t="sx"/><char c="10943" t="sx"/><char c="10944" t="sx"/><char c="10945" t="sx"/><char c="10946" t="sx"/><char c="10947" t="sx"/><char c="10948" t="sx"/><char c="10949" t="sx"/><char c="10950" t="sx"/><char c="10951" t="sx"/><char c="10952" t="sx"/><char c="10953" t="sx"/><char c="10954" t="sx"/><char c="10955" t="sx"/><char c="10956" t="sx"/><char c="10957" t="sx"/><char c="10958" t="sx"/><char c="10959" t="sx"/><char c="10960" t="sx"/><char c="10961" t="sx"/><char c="10962" t="sx"/><char c="10963" t="sx"/><char c="10964" t="sx"/><char c="10965" t="sx"/><char c="10966" t="sx"/><char c="10967" t="sx"/><char c="10968" t="sx"/><char c="10969" t="sx"/><char c="10970" t="sx"/><char c="10971" t="sx"/><char c="10972" t="sx"/><char c="10973" t="sx"/><char c="10974" t="sx"/><char c="10975" t="sx"/><char c="10976" t="sx"/><char c="10977" t="sx"/><char c="10978" t="sx"/><char c="10979" t="sx"/><char c="10980" t="sx"/><char c="10981" t="sx"/><char c="10982" t="sx"/><char c="10983" t="sx"/><char c="10984" t="sx"/><char c="10985" t="sx"/><char c="10986" t="sx"/><char c="10987" t="sx"/><char c="10988" t="sx"/><char c="10989" t="sx"/><char c="10990" t="sx"/><char c="10991" t="sx"/><char c="10992" t="sx"/><char c="10993" t="sx"/><char c="10994" t="sx"/><char c="10995" t="sx"/><char c="10996" t="sx"/><char c="10997" t="sx"/><char c="10998" t="sx"/><char c="10999" t="sx"/><char c="11000" t="sx"/><char c="11001" t="sx"/><char c="11002" t="sx"/><char c="11003" t="sx"/><char c="11004" t="sx"/><char c="11005" t="sx"/><char c="11006" t="sx"/><char c="11007" t="sx"/><char c="11026" t="sx"/><char c="11027" t="sx"/><char c="11028" t="sx"/><char c="11029" t="sx"/><char c="11030" t="sx"/><char c="11031" t="sx"/><char c="11032" t="sx"/><char c="11033" t="sx"/><char c="11034" t="sx"/><char c="11035" t="sx"/><char c="11036" t="sx"/><char c="11037" t="sx"/><char c="11038" t="sx"/><char c="11039" t="sx"/><char c="11040" t="sx"/><char c="11041" t="sx"/><char c="11042" t="sx"/><char c="11043" t="sx"/><char c="11044" t="sx"/><char c="11045" t="sx"/><char c="11046" t="sx"/><char c="11047" t="sx"/><char c="11048" t="sx"/><char c="11049" t="sx"/><char c="11050" t="sx"/><char c="11051" t="sx"/><char c="11052" t="sx"/><char c="11053" t="sx"/><char c="11054" t="sx"/><char c="11055" t="sx"/><char c="11056" t="sx"/><char c="11057" t="sx"/><char c="11058" t="sx"/><char c="11059" t="sx"/><char c="11060" t="sx"/><char c="11061" t="sx"/><char c="11062" t="sx"/><char c="11063" t="sx"/><char c="11064" t="sx"/><char c="11065" t="sx"/><char c="11066" t="sx"/><char c="11067" t="sx"/><char c="11068" t="sx"/><char c="11069" t="sx"/><char c="11070" t="sx"/><char c="11071" t="sx"/><char c="11072" t="sx"/><char c="11073" t="sx"/><char c="11074" t="sx"/><char c="11075" t="sx"/><char c="11076" t="sx"/><char c="11077" t="sx"/><char c="11078" t="sx"/><char c="11079" t="sx"/><char c="11080" t="sx"/><char c="11081" t="sx"/><char c="11082" t="sx"/><char c="11083" t="sx"/><char c="11084" t="sx"/><char c="11088" t="sx"/><char c="11089" t="sx"/><char c="11090" t="sx"/><char c="11091" t="sx"/><char c="11092" t="sx"/><char c="12306" t="sx"/><char c="12336" t="sx"/><char c="12398" t="sx"/><char c="42791" t="sx"/><char c="42898" t="sx"/><char c="57344" t="sx"/><char c="57345" t="sx"/><char c="57346" t="sx"/><char c="57348" t="sx"/><char c="57349" t="sx"/><char c="57354" t="sx"/><char c="57355" t="sx"/><char c="57358" t="sx"/><char c="57359" t="sx"/><char c="57360" t="sx"/><char c="57361" t="sx"/><char c="57366" t="sx"/><char c="57368" t="sx"/><char c="57374" t="sx"/><char c="57379" t="sx"/><char c="57381" t="sx"/><char c="57382" t="sx"/><char c="57383" t="sx"/><char c="57384" t="sx"/><char c="57385" t="sx"/><char c="57386" t="sx"/><char c="57387" t="sx"/><char c="57391" t="sx"/><char c="57397" t="sx"/><char c="57399" t="sx"/><char c="57400" t="sx"/><char c="57401" t="sx"/><char c="57402" t="sx"/><char c="57403" t="sx"/><char c="57404" t="sx"/><char c="57405" t="sx"/><char c="57408" t="sx"/><char c="57411" t="sx"/><char c="57412" t="sx"/><char c="57413" t="sx"/><char c="57414" t="sx"/><char c="57419" t="sx"/><char c="57420" t="sx"/><char c="57421" t="sx"/><char c="57422" t="sx"/><char c="57423" t="sx"/><char c="57424" t="sx"/><char c="57425" t="sx"/><char c="57426" t="sx"/><char c="57427" t="sx"/><char c="57428" t="sx"/><char c="57429" t="sx"/><char c="57430" t="sx"/><char c="57431" t="sx"/><char c="57433" t="sx"/><char c="57434" t="sx"/><char c="57435" t="sx"/><char c="57436" t="sx"/><char c="57437" t="sx"/><char c="57438" t="sx"/><char c="57441" t="sx"/><char c="57442" t="sx"/><char c="57443" t="sx"/><char c="57444" t="sx"/><char c="57445" t="sx"/><char c="57446" t="sx"/><char c="57447" t="sx"/><char c="57448" t="sx"/><char c="57451" t="sx"/><char c="57452" t="sx"/><char c="57453" t="sx"/><char c="57454" t="sx"/><char c="57455" t="sx"/><char c="57456" t="sx"/><char c="57461" t="sx"/><char c="57462" t="sx"/><char c="57463" t="sx"/><char c="57468" t="sx"/><char c="57469" t="sx"/><char c="57470" t="sx"/><char c="57471" t="sx"/><char c="57472" t="sx"/><char c="57473" t="sx"/><char c="57474" t="sx"/><char c="57475" t="sx"/><char c="57476" t="sx"/><char c="57477" t="sx"/><char c="57478" t="sx"/><char c="57479" t="sx"/><char c="57480" t="sx"/><char c="57481" t="sx"/><char c="57490" t="sx"/><char c="57491" t="sx"/><char c="57492" t="sx"/><char c="57493" t="sx"/><char c="57494" t="sx"/><char c="57495" t="sx"/><char c="57496" t="sx"/><char c="57497" t="sx"/><char c="57498" t="sx"/><char c="57499" t="sx"/><char c="57506" t="sx"/><char c="57508" t="sx"/><char c="57509" t="sx"/><char c="57510" t="sx"/><char c="57511" t="sx"/><char c="57512" t="sx"/><char c="57513" t="sx"/><char c="57514" t="sx"/><char c="57515" t="sx"/><char c="57516" t="sx"/><char c="57517" t="sx"/><char c="57518" t="sx"/><char c="57519" t="sx"/><char c="57520" t="sx"/><char c="57521" t="sx"/><char c="57522" t="sx"/><char c="57523" t="sx"/><char c="57524" t="sx"/><char c="57525" t="sx"/><char c="57526" t="sx"/><char c="57527" t="sx"/><char c="57528" t="sx"/><char c="57529" t="sx"/><char c="57531" t="sx"/><char c="57532" t="sx"/><char c="57533" t="sx"/><char c="57534" t="sx"/><char c="57535" t="sx"/><char c="57536" t="sx"/><char c="57537" t="sx"/><char c="57538" t="sx"/><char c="57539" t="sx"/><char c="57540" t="sx"/><char c="57541" t="sx"/><char c="57542" t="sx"/><char c="57543" t="sx"/><char c="57544" t="sx"/><char c="57545" t="sx"/><char c="57546" t="sx"/><char c="57547" t="sx"/><char c="57548" t="sx"/><char c="57549" t="sx"/><char c="57550" t="sx"/><char c="57551" t="sx"/><char c="57552" t="sx"/><char c="57553" t="sx"/><char c="57554" t="sx"/><char c="57555" t="sx"/><char c="57556" t="sx"/><char c="57557" t="sx"/><char c="57558" t="sx"/><char c="57559" t="sx"/><char c="57560" t="sx"/><char c="57561" t="sx"/><char c="57562" t="sx"/><char c="57563" t="sx"/><char c="57564" t="sx"/><char c="57565" t="sx"/><char c="57566" t="sx"/><char c="57567" t="sx"/><char c="57568" t="sx"/><char c="57569" t="sx"/><char c="57570" t="sx"/><char c="57571" t="sx"/><char c="57573" t="sx"/><char c="57574" t="sx"/><char c="57575" t="sx"/><char c="57576" t="sx"/><char c="57577" t="sx"/><char c="57578" t="sx"/><char c="57579" t="sx"/><char c="57580" t="sx"/><char c="57581" t="sx"/><char c="57582" t="sx"/><char c="57583" t="sx"/><char c="57585" t="sx"/><char c="57586" t="sx"/><char c="57587" t="sx"/><char c="57588" t="sx"/><char c="57589" t="sx"/><char c="57590" t="sx"/><char c="57591" t="sx"/><char c="57592" t="sx"/><char c="57593" t="sx"/><char c="57594" t="sx"/><char c="57595" t="sx"/><char c="57596" t="sx"/><char c="57597" t="sx"/><char c="57598" t="sx"/><char c="57599" t="sx"/><char c="57600" t="sx"/><char c="57601" t="sx"/><char c="57602" t="sx"/><char c="57603" t="sx"/><char c="57604" t="sx"/><char c="57605" t="sx"/><char c="57606" t="sx"/><char c="57607" t="sx"/><char c="57608" t="sx"/><char c="57609" t="sx"/><char c="57610" t="sx"/><char c="57612" t="sx"/><char c="57613" t="sx"/><char c="57614" t="sx"/><char c="57615" t="sx"/><char c="57616" t="sx"/><char c="57617" t="sx"/><char c="57618" t="sx"/><char c="57619" t="sx"/><char c="57620" t="sx"/><char c="57621" t="sx"/><char c="57622" t="sx"/><char c="57623" t="sx"/><char c="57624" t="sx"/><char c="57625" t="sx"/><char c="57626" t="sx"/><char c="57627" t="sx"/><char c="57628" t="sx"/><char c="57629" t="sx"/><char c="57630" t="sx"/><char c="57631" t="sx"/><char c="57632" t="sx"/><char c="57633" t="sx"/><char c="57634" t="sx"/><char c="57635" t="sx"/><char c="57636" t="sx"/><char c="57637" t="sx"/><char c="57638" t="sx"/><char c="57639" t="sx"/><char c="57640" t="sx"/><char c="57641" t="sx"/><char c="57642" t="sx"/><char c="57643" t="sx"/><char c="57644" t="sx"/><char c="57645" t="sx"/><char c="57646" t="sx"/><char c="57647" t="sx"/><char c="57648" t="sx"/><char c="57649" t="sx"/><char c="57650" t="sx"/><char c="57651" t="sx"/><char c="57652" t="sx"/><char c="57653" t="sx"/><char c="57654" t="sx"/><char c="57655" t="sx"/><char c="57656" t="sx"/><char c="57657" t="sx"/><char c="57658" t="sx"/><char c="57676" t="sx"/><char c="57677" t="sx"/><char c="57678" t="sx"/><char c="57679" t="sx"/><char c="57724" t="sx"/><char c="57725" t="sx"/><char c="57726" t="sx"/><char c="57727" t="sx"/><char c="57728" t="sx"/><char c="57729" t="sx"/><char c="57730" t="sx"/><char c="57731" t="sx"/><char c="57732" t="sx"/><char c="57733" t="sx"/><char c="57734" t="sx"/><char c="57735" t="sx"/><char c="57736" t="sx"/><char c="57737" t="sx"/><char c="57738" t="sx"/><char c="57739" t="sx"/><char c="57740" t="sx"/><char c="57741" t="sx"/><char c="57742" t="sx"/><char c="57743" t="sx"/><char c="57744" t="sx"/><char c="57745" t="sx"/><char c="57746" t="sx"/><char c="57747" t="sx"/><char c="57748" t="sx"/><char c="57749" t="sx"/><char c="57750" t="sx"/><char c="57751" t="sx"/><char c="57752" t="sx"/><char c="57753" t="sx"/><char c="57754" t="sx"/><char c="57755" t="sx"/><char c="57756" t="sx"/><char c="57757" t="sx"/><char c="57758" t="sx"/><char c="57759" t="sx"/><char c="57760" t="sx"/><char c="57761" t="sx"/><char c="57762" t="sx"/><char c="57763" t="sx"/><char c="57764" t="sx"/><char c="57765" t="sx"/><char c="57766" t="sx"/><char c="57767" t="sx"/><char c="57768" t="sx"/><char c="57769" t="sx"/><char c="57770" t="sx"/><char c="57771" t="sx"/><char c="57772" t="sx"/><char c="57773" t="sx"/><char c="57774" t="sx"/><char c="57775" t="sx"/><char c="57776" t="sx"/><char c="57777" t="sx"/><char c="57778" t="sx"/><char c="57779" t="sx"/><char c="57953" t="sx"/><char c="57957" t="sx"/><char c="57961" t="sx"/><char c="57965" t="sx"/><char c="57969" t="sx"/><char c="57973" t="sx"/><char c="57977" t="sx"/><char c="57981" t="sx"/><char c="57985" t="sx"/><char c="57989" t="sx"/><char c="57996" t="sx"/><char c="57997" t="sx"/><char c="57998" t="sx"/><char c="57999" t="sx"/><char c="58000" t="sx"/><char c="58001" t="sx"/><char c="58002" t="sx"/><char c="58003" t="sx"/><char c="58108" t="sx"/><char c="58110" t="sx"/><char c="58112" t="sx"/><char c="58114" t="sx"/><char c="58116" t="sx"/><char c="58118" t="sx"/><char c="58120" t="sx"/><char c="58122" t="sx"/><char c="58124" t="sx"/><char c="58126" t="sx"/><char c="58128" t="sx"/><char c="58130" t="sx"/><char c="58132" t="sx"/><char c="58134" t="sx"/><char c="58136" t="sx"/><char c="58138" t="sx"/><char c="58140" t="sx"/><char c="58142" t="sx"/><char c="58144" t="sx"/><char c="58146" t="sx"/><char c="58148" t="sx"/><char c="58150" t="sx"/><char c="58152" t="sx"/><char c="58154" t="sx"/><char c="58212" t="sx"/><char c="58216" t="sx"/><char c="58220" t="sx"/><char c="58224" t="sx"/><char c="58306" t="sx"/><char c="58307" t="sx"/><char c="58308" t="sx"/><char c="58311" t="sx"/><char c="58312" t="sx"/><char c="64256" t="sx"/><char c="64257" t="sx"/><char c="64258" t="sx"/><char c="64259" t="sx"/><char c="64260" t="sx"/><char c="65533" t="sx"/><char c="119808" t="sx"/><char c="119809" t="sx"/><char c="119810" t="sx"/><char c="119811" t="sx"/><char c="119812" t="sx"/><char c="119813" t="sx"/><char c="119814" t="sx"/><char c="119815" t="sx"/><char c="119816" t="sx"/><char c="119817" t="sx"/><char c="119818" t="sx"/><char c="119819" t="sx"/><char c="119820" t="sx"/><char c="119821" t="sx"/><char c="119822" t="sx"/><char c="119823" t="sx"/><char c="119824" t="sx"/><char c="119825" t="sx"/><char c="119826" t="sx"/><char c="119827" t="sx"/><char c="119828" t="sx"/><char c="119829" t="sx"/><char c="119830" t="sx"/><char c="119831" t="sx"/><char c="119832" t="sx"/><char c="119833" t="sx"/><char c="119834" t="sx"/><char c="119835" t="sx"/><char c="119836" t="sx"/><char c="119837" t="sx"/><char c="119838" t="sx"/><char c="119839" t="sx"/><char c="119840" t="sx"/><char c="119841" t="sx"/><char c="119842" t="sx"/><char c="119843" t="sx"/><char c="119844" t="sx"/><char c="119845" t="sx"/><char c="119846" t="sx"/><char c="119847" t="sx"/><char c="119848" t="sx"/><char c="119849" t="sx"/><char c="119850" t="sx"/><char c="119851" t="sx"/><char c="119852" t="sx"/><char c="119853" t="sx"/><char c="119854" t="sx"/><char c="119855" t="sx"/><char c="119856" t="sx"/><char c="119857" t="sx"/><char c="119858" t="sx"/><char c="119859" t="sx"/><char c="119860" t="sx"/><char c="119861" t="sx"/><char c="119862" t="sx"/><char c="119863" t="sx"/><char c="119864" t="sx"/><char c="119865" t="sx"/><char c="119866" t="sx"/><char c="119867" t="sx"/><char c="119868" t="sx"/><char c="119869" t="sx"/><char c="119870" t="sx"/><char c="119871" t="sx"/><char c="119872" t="sx"/><char c="119873" t="sx"/><char c="119874" t="sx"/><char c="119875" t="sx"/><char c="119876" t="sx"/><char c="119877" t="sx"/><char c="119878" t="sx"/><char c="119879" t="sx"/><char c="119880" t="sx"/><char c="119881" t="sx"/><char c="119882" t="sx"/><char c="119883" t="sx"/><char c="119884" t="sx"/><char c="119885" t="sx"/><char c="119886" t="sx"/><char c="119887" t="sx"/><char c="119888" t="sx"/><char c="119889" t="sx"/><char c="119890" t="sx"/><char c="119891" t="sx"/><char c="119892" t="sx"/><char c="119894" t="sx"/><char c="119895" t="sx"/><char c="119896" t="sx"/><char c="119897" t="sx"/><char c="119898" t="sx"/><char c="119899" t="sx"/><char c="119900" t="sx"/><char c="119901" t="sx"/><char c="119902" t="sx"/><char c="119903" t="sx"/><char c="119904" t="sx"/><char c="119905" t="sx"/><char c="119906" t="sx"/><char c="119907" t="sx"/><char c="119908" t="sx"/><char c="119909" t="sx"/><char c="119910" t="sx"/><char c="119911" t="sx"/><char c="119912" t="sx"/><char c="119913" t="sx"/><char c="119914" t="sx"/><char c="119915" t="sx"/><char c="119916" t="sx"/><char c="119917" t="sx"/><char c="119918" t="sx"/><char c="119919" t="sx"/><char c="119920" t="sx"/><char c="119921" t="sx"/><char c="119922" t="sx"/><char c="119923" t="sx"/><char c="119924" t="sx"/><char c="119925" t="sx"/><char c="119926" t="sx"/><char c="119927" t="sx"/><char c="119928" t="sx"/><char c="119929" t="sx"/><char c="119930" t="sx"/><char c="119931" t="sx"/><char c="119932" t="sx"/><char c="119933" t="sx"/><char c="119934" t="sx"/><char c="119935" t="sx"/><char c="119936" t="sx"/><char c="119937" t="sx"/><char c="119938" t="sx"/><char c="119939" t="sx"/><char c="119940" t="sx"/><char c="119941" t="sx"/><char c="119942" t="sx"/><char c="119943" t="sx"/><char c="119944" t="sx"/><char c="119945" t="sx"/><char c="119946" t="sx"/><char c="119947" t="sx"/><char c="119948" t="sx"/><char c="119949" t="sx"/><char c="119950" t="sx"/><char c="119951" t="sx"/><char c="119952" t="sx"/><char c="119953" t="sx"/><char c="119954" t="sx"/><char c="119955" t="sx"/><char c="119956" t="sx"/><char c="119957" t="sx"/><char c="119958" t="sx"/><char c="119959" t="sx"/><char c="119960" t="sx"/><char c="119961" t="sx"/><char c="119962" t="sx"/><char c="119963" t="sx"/><char c="119964" t="sx"/><char c="119966" t="sx"/><char c="119967" t="sx"/><char c="119970" t="sx"/><char c="119973" t="sx"/><char c="119974" t="sx"/><char c="119977" t="sx"/><char c="119978" t="sx"/><char c="119979" t="sx"/><char c="119980" t="sx"/><char c="119982" t="sx"/><char c="119983" t="sx"/><char c="119984" t="sx"/><char c="119985" t="sx"/><char c="119986" t="sx"/><char c="119987" t="sx"/><char c="119988" t="sx"/><char c="119989" t="sx"/><char c="119990" t="sx"/><char c="119991" t="sx"/><char c="119992" t="sx"/><char c="119993" t="sx"/><char c="119995" t="sx"/><char c="119997" t="sx"/><char c="119998" t="sx"/><char c="119999" t="sx"/><char c="120000" t="sx"/><char c="120001" t="sx"/><char c="120002" t="sx"/><char c="120003" t="sx"/><char c="120005" t="sx"/><char c="120006" t="sx"/><char c="120007" t="sx"/><char c="120008" t="sx"/><char c="120009" t="sx"/><char c="120010" t="sx"/><char c="120011" t="sx"/><char c="120012" t="sx"/><char c="120013" t="sx"/><char c="120014" t="sx"/><char c="120015" t="sx"/><char c="120016" t="sx"/><char c="120017" t="sx"/><char c="120018" t="sx"/><char c="120019" t="sx"/><char c="120020" t="sx"/><char c="120021" t="sx"/><char c="120022" t="sx"/><char c="120023" t="sx"/><char c="120024" t="sx"/><char c="120025" t="sx"/><char c="120026" t="sx"/><char c="120027" t="sx"/><char c="120028" t="sx"/><char c="120029" t="sx"/><char c="120030" t="sx"/><char c="120031" t="sx"/><char c="120032" t="sx"/><char c="120033" t="sx"/><char c="120034" t="sx"/><char c="120035" t="sx"/><char c="120036" t="sx"/><char c="120037" t="sx"/><char c="120038" t="sx"/><char c="120039" t="sx"/><char c="120040" t="sx"/><char c="120041" t="sx"/><char c="120042" t="sx"/><char c="120043" t="sx"/><char c="120044" t="sx"/><char c="120045" t="sx"/><char c="120046" t="sx"/><char c="120047" t="sx"/><char c="120048" t="sx"/><char c="120049" t="sx"/><char c="120050" t="sx"/><char c="120051" t="sx"/><char c="120052" t="sx"/><char c="120053" t="sx"/><char c="120054" t="sx"/><char c="120055" t="sx"/><char c="120056" t="sx"/><char c="120057" t="sx"/><char c="120058" t="sx"/><char c="120059" t="sx"/><char c="120060" t="sx"/><char c="120061" t="sx"/><char c="120062" t="sx"/><char c="120063" t="sx"/><char c="120064" t="sx"/><char c="120065" t="sx"/><char c="120066" t="sx"/><char c="120067" t="sx"/><char c="120068" t="sx"/><char c="120069" t="sx"/><char c="120071" t="sx"/><char c="120072" t="sx"/><char c="120073" t="sx"/><char c="120074" t="sx"/><char c="120077" t="sx"/><char c="120078" t="sx"/><char c="120079" t="sx"/><char c="120080" t="sx"/><char c="120081" t="sx"/><char c="120082" t="sx"/><char c="120083" t="sx"/><char c="120084" t="sx"/><char c="120086" t="sx"/><char c="120087" t="sx"/><char c="120088" t="sx"/><char c="120089" t="sx"/><char c="120090" t="sx"/><char c="120091" t="sx"/><char c="120092" t="sx"/><char c="120094" t="sx"/><char c="120095" t="sx"/><char c="120096" t="sx"/><char c="120097" t="sx"/><char c="120098" t="sx"/><char c="120099" t="sx"/><char c="120100" t="sx"/><char c="120101" t="sx"/><char c="120102" t="sx"/><char c="120103" t="sx"/><char c="120104" t="sx"/><char c="120105" t="sx"/><char c="120106" t="sx"/><char c="120107" t="sx"/><char c="120108" t="sx"/><char c="120109" t="sx"/><char c="120110" t="sx"/><char c="120111" t="sx"/><char c="120112" t="sx"/><char c="120113" t="sx"/><char c="120114" t="sx"/><char c="120115" t="sx"/><char c="120116" t="sx"/><char c="120117" t="sx"/><char c="120118" t="sx"/><char c="120119" t="sx"/><char c="120120" t="sx"/><char c="120121" t="sx"/><char c="120123" t="sx"/><char c="120124" t="sx"/><char c="120125" t="sx"/><char c="120126" t="sx"/><char c="120128" t="sx"/><char c="120129" t="sx"/><char c="120130" t="sx"/><char c="120131" t="sx"/><char c="120132" t="sx"/><char c="120134" t="sx"/><char c="120138" t="sx"/><char c="120139" t="sx"/><char c="120140" t="sx"/><char c="120141" t="sx"/><char c="120142" t="sx"/><char c="120143" t="sx"/><char c="120144" t="sx"/><char c="120146" t="sx"/><char c="120147" t="sx"/><char c="120148" t="sx"/><char c="120149" t="sx"/><char c="120150" t="sx"/><char c="120151" t="sx"/><char c="120152" t="sx"/><char c="120153" t="sx"/><char c="120154" t="sx"/><char c="120155" t="sx"/><char c="120156" t="sx"/><char c="120157" t="sx"/><char c="120158" t="sx"/><char c="120159" t="sx"/><char c="120160" t="sx"/><char c="120161" t="sx"/><char c="120162" t="sx"/><char c="120163" t="sx"/><char c="120164" t="sx"/><char c="120165" t="sx"/><char c="120166" t="sx"/><char c="120167" t="sx"/><char c="120168" t="sx"/><char c="120169" t="sx"/><char c="120170" t="sx"/><char c="120171" t="sx"/><char c="120172" t="sx"/><char c="120173" t="sx"/><char c="120174" t="sx"/><char c="120175" t="sx"/><char c="120176" t="sx"/><char c="120177" t="sx"/><char c="120178" t="sx"/><char c="120179" t="sx"/><char c="120180" t="sx"/><char c="120181" t="sx"/><char c="120182" t="sx"/><char c="120183" t="sx"/><char c="120184" t="sx"/><char c="120185" t="sx"/><char c="120186" t="sx"/><char c="120187" t="sx"/><char c="120188" t="sx"/><char c="120189" t="sx"/><char c="120190" t="sx"/><char c="120191" t="sx"/><char c="120192" t="sx"/><char c="120193" t="sx"/><char c="120194" t="sx"/><char c="120195" t="sx"/><char c="120196" t="sx"/><char c="120197" t="sx"/><char c="120198" t="sx"/><char c="120199" t="sx"/><char c="120200" t="sx"/><char c="120201" t="sx"/><char c="120202" t="sx"/><char c="120203" t="sx"/><char c="120204" t="sx"/><char c="120205" t="sx"/><char c="120206" t="sx"/><char c="120207" t="sx"/><char c="120208" t="sx"/><char c="120209" t="sx"/><char c="120210" t="sx"/><char c="120211" t="sx"/><char c="120212" t="sx"/><char c="120213" t="sx"/><char c="120214" t="sx"/><char c="120215" t="sx"/><char c="120216" t="sx"/><char c="120217" t="sx"/><char c="120218" t="sx"/><char c="120219" t="sx"/><char c="120220" t="sx"/><char c="120221" t="sx"/><char c="120222" t="sx"/><char c="120223" t="sx"/><char c="120224" t="sx"/><char c="120225" t="sx"/><char c="120226" t="sx"/><char c="120227" t="sx"/><char c="120228" t="sx"/><char c="120229" t="sx"/><char c="120230" t="sx"/><char c="120231" t="sx"/><char c="120232" t="sx"/><char c="120233" t="sx"/><char c="120234" t="sx"/><char c="120235" t="sx"/><char c="120236" t="sx"/><char c="120237" t="sx"/><char c="120238" t="sx"/><char c="120239" t="sx"/><char c="120240" t="sx"/><char c="120241" t="sx"/><char c="120242" t="sx"/><char c="120243" t="sx"/><char c="120244" t="sx"/><char c="120245" t="sx"/><char c="120246" t="sx"/><char c="120247" t="sx"/><char c="120248" t="sx"/><char c="120249" t="sx"/><char c="120250" t="sx"/><char c="120251" t="sx"/><char c="120252" t="sx"/><char c="120253" t="sx"/><char c="120254" t="sx"/><char c="120255" t="sx"/><char c="120256" t="sx"/><char c="120257" t="sx"/><char c="120258" t="sx"/><char c="120259" t="sx"/><char c="120260" t="sx"/><char c="120261" t="sx"/><char c="120262" t="sx"/><char c="120263" t="sx"/><char c="120264" t="sx"/><char c="120265" t="sx"/><char c="120266" t="sx"/><char c="120267" t="sx"/><char c="120268" t="sx"/><char c="120269" t="sx"/><char c="120270" t="sx"/><char c="120271" t="sx"/><char c="120272" t="sx"/><char c="120273" t="sx"/><char c="120274" t="sx"/><char c="120275" t="sx"/><char c="120276" t="sx"/><char c="120277" t="sx"/><char c="120278" t="sx"/><char c="120279" t="sx"/><char c="120280" t="sx"/><char c="120281" t="sx"/><char c="120282" t="sx"/><char c="120283" t="sx"/><char c="120284" t="sx"/><char c="120285" t="sx"/><char c="120286" t="sx"/><char c="120287" t="sx"/><char c="120288" t="sx"/><char c="120289" t="sx"/><char c="120290" t="sx"/><char c="120291" t="sx"/><char c="120292" t="sx"/><char c="120293" t="sx"/><char c="120294" t="sx"/><char c="120295" t="sx"/><char c="120296" t="sx"/><char c="120297" t="sx"/><char c="120298" t="sx"/><char c="120299" t="sx"/><char c="120300" t="sx"/><char c="120301" t="sx"/><char c="120302" t="sx"/><char c="120303" t="sx"/><char c="120304" t="sx"/><char c="120305" t="sx"/><char c="120306" t="sx"/><char c="120307" t="sx"/><char c="120308" t="sx"/><char c="120309" t="sx"/><char c="120310" t="sx"/><char c="120311" t="sx"/><char c="120312" t="sx"/><char c="120313" t="sx"/><char c="120314" t="sx"/><char c="120315" t="sx"/><char c="120316" t="sx"/><char c="120317" t="sx"/><char c="120318" t="sx"/><char c="120319" t="sx"/><char c="120320" t="sx"/><char c="120321" t="sx"/><char c="120322" t="sx"/><char c="120323" t="sx"/><char c="120324" t="sx"/><char c="120325" t="sx"/><char c="120326" t="sx"/><char c="120327" t="sx"/><char c="120328" t="sx"/><char c="120329" t="sx"/><char c="120330" t="sx"/><char c="120331" t="sx"/><char c="120332" t="sx"/><char c="120333" t="sx"/><char c="120334" t="sx"/><char c="120335" t="sx"/><char c="120336" t="sx"/><char c="120337" t="sx"/><char c="120338" t="sx"/><char c="120339" t="sx"/><char c="120340" t="sx"/><char c="120341" t="sx"/><char c="120342" t="sx"/><char c="120343" t="sx"/><char c="120344" t="sx"/><char c="120345" t="sx"/><char c="120346" t="sx"/><char c="120347" t="sx"/><char c="120348" t="sx"/><char c="120349" t="sx"/><char c="120350" t="sx"/><char c="120351" t="sx"/><char c="120352" t="sx"/><char c="120353" t="sx"/><char c="120354" t="sx"/><char c="120355" t="sx"/><char c="120356" t="sx"/><char c="120357" t="sx"/><char c="120358" t="sx"/><char c="120359" t="sx"/><char c="120360" t="sx"/><char c="120361" t="sx"/><char c="120362" t="sx"/><char c="120363" t="sx"/><char c="120364" t="sx"/><char c="120365" t="sx"/><char c="120366" t="sx"/><char c="120367" t="sx"/><char c="120368" t="sx"/><char c="120369" t="sx"/><char c="120370" t="sx"/><char c="120371" t="sx"/><char c="120372" t="sx"/><char c="120373" t="sx"/><char c="120374" t="sx"/><char c="120375" t="sx"/><char c="120376" t="sx"/><char c="120377" t="sx"/><char c="120378" t="sx"/><char c="120379" t="sx"/><char c="120380" t="sx"/><char c="120381" t="sx"/><char c="120382" t="sx"/><char c="120383" t="sx"/><char c="120384" t="sx"/><char c="120385" t="sx"/><char c="120386" t="sx"/><char c="120387" t="sx"/><char c="120388" t="sx"/><char c="120389" t="sx"/><char c="120390" t="sx"/><char c="120391" t="sx"/><char c="120392" t="sx"/><char c="120393" t="sx"/><char c="120394" t="sx"/><char c="120395" t="sx"/><char c="120396" t="sx"/><char c="120397" t="sx"/><char c="120398" t="sx"/><char c="120399" t="sx"/><char c="120400" t="sx"/><char c="120401" t="sx"/><char c="120402" t="sx"/><char c="120403" t="sx"/><char c="120404" t="sx"/><char c="120405" t="sx"/><char c="120406" t="sx"/><char c="120407" t="sx"/><char c="120408" t="sx"/><char c="120409" t="sx"/><char c="120410" t="sx"/><char c="120411" t="sx"/><char c="120412" t="sx"/><char c="120413" t="sx"/><char c="120414" t="sx"/><char c="120415" t="sx"/><char c="120416" t="sx"/><char c="120417" t="sx"/><char c="120418" t="sx"/><char c="120419" t="sx"/><char c="120420" t="sx"/><char c="120421" t="sx"/><char c="120422" t="sx"/><char c="120423" t="sx"/><char c="120424" t="sx"/><char c="120425" t="sx"/><char c="120426" t="sx"/><char c="120427" t="sx"/><char c="120428" t="sx"/><char c="120429" t="sx"/><char c="120430" t="sx"/><char c="120431" t="sx"/><char c="120432" t="sx"/><char c="120433" t="sx"/><char c="120434" t="sx"/><char c="120435" t="sx"/><char c="120436" t="sx"/><char c="120437" t="sx"/><char c="120438" t="sx"/><char c="120439" t="sx"/><char c="120440" t="sx"/><char c="120441" t="sx"/><char c="120442" t="sx"/><char c="120443" t="sx"/><char c="120444" t="sx"/><char c="120445" t="sx"/><char c="120446" t="sx"/><char c="120447" t="sx"/><char c="120448" t="sx"/><char c="120449" t="sx"/><char c="120450" t="sx"/><char c="120451" t="sx"/><char c="120452" t="sx"/><char c="120453" t="sx"/><char c="120454" t="sx"/><char c="120455" t="sx"/><char c="120456" t="sx"/><char c="120457" t="sx"/><char c="120458" t="sx"/><char c="120459" t="sx"/><char c="120460" t="sx"/><char c="120461" t="sx"/><char c="120462" t="sx"/><char c="120463" t="sx"/><char c="120464" t="sx"/><char c="120465" t="sx"/><char c="120466" t="sx"/><char c="120467" t="sx"/><char c="120468" t="sx"/><char c="120469" t="sx"/><char c="120470" t="sx"/><char c="120471" t="sx"/><char c="120472" t="sx"/><char c="120473" t="sx"/><char c="120474" t="sx"/><char c="120475" t="sx"/><char c="120476" t="sx"/><char c="120477" t="sx"/><char c="120478" t="sx"/><char c="120479" t="sx"/><char c="120480" t="sx"/><char c="120481" t="sx"/><char c="120482" t="sx"/><char c="120483" t="sx"/><char c="120484" t="sx"/><char c="120485" t="sx"/><char c="120488" t="sx"/><char c="120489" t="sx"/><char c="120490" t="sx"/><char c="120491" t="sx"/><char c="120492" t="sx"/><char c="120493" t="sx"/><char c="120494" t="sx"/><char c="120495" t="sx"/><char c="120496" t="sx"/><char c="120497" t="sx"/><char c="120498" t="sx"/><char c="120499" t="sx"/><char c="120500" t="sx"/><char c="120501" t="sx"/><char c="120502" t="sx"/><char c="120503" t="sx"/><char c="120504" t="sx"/><char c="120505" t="sx"/><char c="120506" t="sx"/><char c="120507" t="sx"/><char c="120508" t="sx"/><char c="120509" t="sx"/><char c="120510" t="sx"/><char c="120511" t="sx"/><char c="120512" t="sx"/><char c="120513" t="sx"/><char c="120514" t="sx"/><char c="120515" t="sx"/><char c="120516" t="sx"/><char c="120517" t="sx"/><char c="120518" t="sx"/><char c="120519" t="sx"/><char c="120520" t="sx"/><char c="120521" t="sx"/><char c="120522" t="sx"/><char c="120523" t="sx"/><char c="120524" t="sx"/><char c="120525" t="sx"/><char c="120526" t="sx"/><char c="120527" t="sx"/><char c="120528" t="sx"/><char c="120529" t="sx"/><char c="120530" t="sx"/><char c="120531" t="sx"/><char c="120532" t="sx"/><char c="120533" t="sx"/><char c="120534" t="sx"/><char c="120535" t="sx"/><char c="120536" t="sx"/><char c="120537" t="sx"/><char c="120538" t="sx"/><char c="120539" t="sx"/><char c="120540" t="sx"/><char c="120541" t="sx"/><char c="120542" t="sx"/><char c="120543" t="sx"/><char c="120544" t="sx"/><char c="120545" t="sx"/><char c="120546" t="sx"/><char c="120547" t="sx"/><char c="120548" t="sx"/><char c="120549" t="sx"/><char c="120550" t="sx"/><char c="120551" t="sx"/><char c="120552" t="sx"/><char c="120553" t="sx"/><char c="120554" t="sx"/><char c="120555" t="sx"/><char c="120556" t="sx"/><char c="120557" t="sx"/><char c="120558" t="sx"/><char c="120559" t="sx"/><char c="120560" t="sx"/><char c="120561" t="sx"/><char c="120562" t="sx"/><char c="120563" t="sx"/><char c="120564" t="sx"/><char c="120565" t="sx"/><char c="120566" t="sx"/><char c="120567" t="sx"/><char c="120568" t="sx"/><char c="120569" t="sx"/><char c="120570" t="sx"/><char c="120571" t="sx"/><char c="120572" t="sx"/><char c="120573" t="sx"/><char c="120574" t="sx"/><char c="120575" t="sx"/><char c="120576" t="sx"/><char c="120577" t="sx"/><char c="120578" t="sx"/><char c="120579" t="sx"/><char c="120580" t="sx"/><char c="120581" t="sx"/><char c="120582" t="sx"/><char c="120583" t="sx"/><char c="120584" t="sx"/><char c="120585" t="sx"/><char c="120586" t="sx"/><char c="120587" t="sx"/><char c="120588" t="sx"/><char c="120589" t="sx"/><char c="120590" t="sx"/><char c="120591" t="sx"/><char c="120592" t="sx"/><char c="120593" t="sx"/><char c="120594" t="sx"/><char c="120595" t="sx"/><char c="120596" t="sx"/><char c="120597" t="sx"/><char c="120598" t="sx"/><char c="120599" t="sx"/><char c="120600" t="sx"/><char c="120601" t="sx"/><char c="120602" t="sx"/><char c="120603" t="sx"/><char c="120604" t="sx"/><char c="120605" t="sx"/><char c="120606" t="sx"/><char c="120607" t="sx"/><char c="120608" t="sx"/><char c="120609" t="sx"/><char c="120610" t="sx"/><char c="120611" t="sx"/><char c="120612" t="sx"/><char c="120613" t="sx"/><char c="120614" t="sx"/><char c="120615" t="sx"/><char c="120616" t="sx"/><char c="120617" t="sx"/><char c="120618" t="sx"/><char c="120619" t="sx"/><char c="120620" t="sx"/><char c="120621" t="sx"/><char c="120622" t="sx"/><char c="120623" t="sx"/><char c="120624" t="sx"/><char c="120625" t="sx"/><char c="120626" t="sx"/><char c="120627" t="sx"/><char c="120628" t="sx"/><char c="120629" t="sx"/><char c="120630" t="sx"/><char c="120631" t="sx"/><char c="120632" t="sx"/><char c="120633" t="sx"/><char c="120634" t="sx"/><char c="120635" t="sx"/><char c="120636" t="sx"/><char c="120637" t="sx"/><char c="120638" t="sx"/><char c="120639" t="sx"/><char c="120640" t="sx"/><char c="120641" t="sx"/><char c="120642" t="sx"/><char c="120643" t="sx"/><char c="120644" t="sx"/><char c="120645" t="sx"/><char c="120646" t="sx"/><char c="120647" t="sx"/><char c="120648" t="sx"/><char c="120649" t="sx"/><char c="120650" t="sx"/><char c="120651" t="sx"/><char c="120652" t="sx"/><char c="120653" t="sx"/><char c="120654" t="sx"/><char c="120655" t="sx"/><char c="120656" t="sx"/><char c="120657" t="sx"/><char c="120658" t="sx"/><char c="120659" t="sx"/><char c="120660" t="sx"/><char c="120661" t="sx"/><char c="120662" t="sx"/><char c="120663" t="sx"/><char c="120664" t="sx"/><char c="120665" t="sx"/><char c="120666" t="sx"/><char c="120667" t="sx"/><char c="120668" t="sx"/><char c="120669" t="sx"/><char c="120670" t="sx"/><char c="120671" t="sx"/><char c="120672" t="sx"/><char c="120673" t="sx"/><char c="120674" t="sx"/><char c="120675" t="sx"/><char c="120676" t="sx"/><char c="120677" t="sx"/><char c="120678" t="sx"/><char c="120679" t="sx"/><char c="120680" t="sx"/><char c="120681" t="sx"/><char c="120682" t="sx"/><char c="120683" t="sx"/><char c="120684" t="sx"/><char c="120685" t="sx"/><char c="120686" t="sx"/><char c="120687" t="sx"/><char c="120688" t="sx"/><char c="120689" t="sx"/><char c="120690" t="sx"/><char c="120691" t="sx"/><char c="120692" t="sx"/><char c="120693" t="sx"/><char c="120694" t="sx"/><char c="120695" t="sx"/><char c="120696" t="sx"/><char c="120697" t="sx"/><char c="120698" t="sx"/><char c="120699" t="sx"/><char c="120700" t="sx"/><char c="120701" t="sx"/><char c="120702" t="sx"/><char c="120703" t="sx"/><char c="120704" t="sx"/><char c="120705" t="sx"/><char c="120706" t="sx"/><char c="120707" t="sx"/><char c="120708" t="sx"/><char c="120709" t="sx"/><char c="120710" t="sx"/><char c="120711" t="sx"/><char c="120712" t="sx"/><char c="120713" t="sx"/><char c="120714" t="sx"/><char c="120715" t="sx"/><char c="120716" t="sx"/><char c="120717" t="sx"/><char c="120718" t="sx"/><char c="120719" t="sx"/><char c="120720" t="sx"/><char c="120721" t="sx"/><char c="120722" t="sx"/><char c="120723" t="sx"/><char c="120724" t="sx"/><char c="120725" t="sx"/><char c="120726" t="sx"/><char c="120727" t="sx"/><char c="120728" t="sx"/><char c="120729" t="sx"/><char c="120730" t="sx"/><char c="120731" t="sx"/><char c="120732" t="sx"/><char c="120733" t="sx"/><char c="120734" t="sx"/><char c="120735" t="sx"/><char c="120736" t="sx"/><char c="120737" t="sx"/><char c="120738" t="sx"/><char c="120739" t="sx"/><char c="120740" t="sx"/><char c="120741" t="sx"/><char c="120742" t="sx"/><char c="120743" t="sx"/><char c="120744" t="sx"/><char c="120745" t="sx"/><char c="120746" t="sx"/><char c="120747" t="sx"/><char c="120748" t="sx"/><char c="120749" t="sx"/><char c="120750" t="sx"/><char c="120751" t="sx"/><char c="120752" t="sx"/><char c="120753" t="sx"/><char c="120754" t="sx"/><char c="120755" t="sx"/><char c="120756" t="sx"/><char c="120757" t="sx"/><char c="120758" t="sx"/><char c="120759" t="sx"/><char c="120760" t="sx"/><char c="120761" t="sx"/><char c="120762" t="sx"/><char c="120763" t="sx"/><char c="120764" t="sx"/><char c="120765" t="sx"/><char c="120766" t="sx"/><char c="120767" t="sx"/><char c="120768" t="sx"/><char c="120769" t="sx"/><char c="120770" t="sx"/><char c="120771" t="sx"/><char c="120772" t="sx"/><char c="120773" t="sx"/><char c="120774" t="sx"/><char c="120775" t="sx"/><char c="120776" t="sx"/><char c="120777" t="sx"/><char c="120782" t="sx"/><char c="120783" t="sx"/><char c="120784" t="sx"/><char c="120785" t="sx"/><char c="120786" t="sx"/><char c="120787" t="sx"/><char c="120788" t="sx"/><char c="120789" t="sx"/><char c="120790" t="sx"/><char c="120791" t="sx"/><char c="120792" t="sx"/><char c="120793" t="sx"/><char c="120794" t="sx"/><char c="120795" t="sx"/><char c="120796" t="sx"/><char c="120797" t="sx"/><char c="120798" t="sx"/><char c="120799" t="sx"/><char c="120800" t="sx"/><char c="120801" t="sx"/><char c="120802" t="sx"/><char c="120803" t="sx"/><char c="120804" t="sx"/><char c="120805" t="sx"/><char c="120806" t="sx"/><char c="120807" t="sx"/><char c="120808" t="sx"/><char c="120809" t="sx"/><char c="120810" t="sx"/><char c="120811" t="sx"/><char c="120812" t="sx"/><char c="120813" t="sx"/><char c="120814" t="sx"/><char c="120815" t="sx"/><char c="120816" t="sx"/><char c="120817" t="sx"/><char c="120818" t="sx"/><char c="120819" t="sx"/><char c="120820" t="sx"/><char c="120821" t="sx"/><char c="120822" t="sx"/><char c="120823" t="sx"/><char c="120824" t="sx"/><char c="120825" t="sx"/><char c="120826" t="sx"/><char c="120827" t="sx"/><char c="120828" t="sx"/><char c="120829" t="sx"/><char c="120830" t="sx"/><char c="120831" t="sx"/></characters>';delete Array.prototype.__class__;