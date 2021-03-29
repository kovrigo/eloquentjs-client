(function(e,t){typeof exports==="object"&&typeof module!=="undefined"?module.exports=t():typeof define==="function"&&define.amd?define(t):(e=typeof globalThis!=="undefined"?globalThis:e||self,e.Eloquent=t())})(this,function(){"use strict";function i(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||false;r.configurable=true;if("value"in r)r.writable=true;Object.defineProperty(e,r.key,r)}}function e(e,t,n){if(t)r(e.prototype,t);if(n)r(e,n);return e}function u(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});if(t)n(e,t)}function o(e){o=Object.setPrototypeOf?Object.getPrototypeOf:function e(t){return t.__proto__||Object.getPrototypeOf(t)};return o(e)}function n(e,t){n=Object.setPrototypeOf||function e(t,n){t.__proto__=n;return t};return n(e,t)}function t(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(e){return false}}function a(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function s(e,t){if(t&&(typeof t==="object"||typeof t==="function")){return t}return a(e)}function l(i){var u=t();return function e(){var t=o(i),n;if(u){var r=o(this).constructor;n=Reflect.construct(t,arguments,r)}else{n=t.apply(this,arguments)}return s(this,n)}}var c=function(){function n(e,t){i(this,n);this.connection=e;this.stack=[];this._model=null;if(t)this._setModel(t)}e(n,[{key:"_call",value:function e(t,n){this.stack.push([t,n]);return this}},{key:"select",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("select",n)}},{key:"addSelect",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("addSelect",n)}},{key:"distinct",value:function e(){return this._call("distinct",[])}},{key:"where",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("where",n)}},{key:"orWhere",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhere",n)}},{key:"whereBetween",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereBetween",n)}},{key:"orWhereBetween",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereBetween",n)}},{key:"whereNotBetween",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNotBetween",n)}},{key:"orWhereNotBetween",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereNotBetween",n)}},{key:"whereNested",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNested",n)}},{key:"whereExists",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereExists",n)}},{key:"orWhereExists",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereExists",n)}},{key:"whereNotExists",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNotExists",n)}},{key:"orWhereNotExists",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereNotExists",n)}},{key:"whereIn",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereIn",n)}},{key:"orWhereIn",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereIn",n)}},{key:"whereNotIn",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNotIn",n)}},{key:"orWhereNotIn",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereNotIn",n)}},{key:"whereNull",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNull",n)}},{key:"orWhereNull",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereNull",n)}},{key:"whereNotNull",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereNotNull",n)}},{key:"orWhereNotNull",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orWhereNotNull",n)}},{key:"whereDate",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereDate",n)}},{key:"whereDay",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereDay",n)}},{key:"whereMonth",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereMonth",n)}},{key:"whereYear",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("whereYear",n)}},{key:"groupBy",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("groupBy",n)}},{key:"having",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("having",n)}},{key:"orHaving",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orHaving",n)}},{key:"orderBy",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("orderBy",n)}},{key:"latest",value:function e(t){return this._call("latest",t?[t]:[])}},{key:"oldest",value:function e(t){return this._call("oldest",t?[t]:[])}},{key:"offset",value:function e(t){return this._call("offset",[t])}},{key:"skip",value:function e(t){return this._call("skip",[t])}},{key:"limit",value:function e(t){return this._call("limit",[t])}},{key:"take",value:function e(t){return this._call("take",[t])}},{key:"forPage",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}return this._call("forPage",n)}},{key:"with",value:function e(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++){n[r]=arguments[r]}this._call("with",n);return this}},{key:"find",value:function e(t,n){var r=this;if(Array.isArray(t)){return this.findMany(t,n)}return this.connection.read(t).then(function(e){return e?r._model.newInstance(e,true):null})}},{key:"findMany",value:function e(t,n){return this.whereIn(this._model.getKeyName(),t).get(n)}},{key:"findOrFail",value:function e(t,n){return this.find(t,n).then(h)}},{key:"first",value:function e(t){return this.limit(1).get(t).then(f)}},{key:"firstOrFail",value:function e(t){return this.first(t).then(h)}},{key:"value",value:function e(t){return this.first(t).then(function(e){return e[t]})}},{key:"lists",value:function e(t){return this.get(t).then(function(e){return e.map(function(e){return e[t]})})}},{key:"scope",value:function e(t,n){var r=[t];if(n){r.push(n)}this._call("scope",r);return this}},{key:"get",value:function e(t){var n=this;if(t){this.select(t)}return this.connection.read(this.stack).then(function(e){return n._model.hydrate(e)})}},{key:"insert",value:function e(t){return this.connection.create(t)}},{key:"update",value:function e(t){return this.connection.update(this.stack,t)}},{key:"delete",value:function e(){return this.connection["delete"](this.stack)}},{key:"_getModel",value:function e(){return this._model}},{key:"_setModel",value:function e(t){var n=this;this._model=t;(t.constructor.scopes||[]).forEach(function(r){n[r]=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++){t[n]=arguments[n]}this.scope(r,t);return this}})}}]);return n}();function f(e){return e[0]?e[0]:null}function h(e){if(e===null){throw new Error("ModelNotFoundException")}return e}var v=function(){function t(e){i(this,t);this.baseClass=e;this.items=new Map}e(t,[{key:"register",value:function e(t,n,r){var i;if(typeof n==="function"){i=n}else{i=function e(t){return Object.assign(t,n)}}this.items.set(t,i);return r?this.make(t):this}},{key:"make",value:function e(t){var n=this.items.get(t);if(!n){throw new Error("Model [".concat(t,"] not registered"))}if(!n._made){n._made=this._makeClass(this.baseClass,n)}return n._made}},{key:"_makeClass",value:function e(t,n){var r=n(function(e){u(n,e);var t=l(n);function n(){i(this,n);return t.apply(this,arguments)}return n}(t));r.prototype.bootIfNotBooted();return r}}]);return t}();var y=require("cross-fetch");var d=function(){function t(e){i(this,t);this.endpoint=e}e(t,[{key:"create",value:function e(t){var n=this;return this.sendRequest(null,"post",t).then(function(e){return n.unwrap(e)})}},{key:"read",value:function e(t){var n=this;return this.sendRequest(t).then(function(e){return n.unwrap(e)})}},{key:"update",value:function e(t,n){var r=this;return this.sendRequest(t,"put",n).then(function(e){return r.unwrap(e)})}},{key:"delete",value:function e(t){return this.sendRequest(t,"delete").then(function(e){return e.status===200})}},{key:"_fetch",value:function e(t,n,r,i){return y(this.url(t,n),this._makeInit(r,i))}},{key:"sendRequest",value:function e(t,n,r){return y(this.buildUrl(t),this.buildOptions(n,r))}},{key:"buildUrl",value:function e(t){if(!this.endpoint){throw"Endpoint must be set before using this connection"}var n=this.endpoint;if(Array.isArray(t)){if(t.length){n+="?query="+JSON.stringify(t)}}else if(t){n+="/"+t}return n}},{key:"buildOptions",value:function e(t,n,r){var i=p();var u="Bearer "+i;var o={credentials:"same-origin",headers:{Accept:"application/json",Authorization:u,"X-XSRF-TOKEN":g()}};if(t){o.method=t}if(n){o.headers["Content-Type"]="application/json";o.body=JSON.stringify(n)}return Object.assign(o,r||{})}},{key:"unwrap",value:function e(t){return t.json()}},{key:"url",value:function e(t,n){if(!this.endpoint){throw"Endpoint must be set before using this connection"}var e=this.endpoint;if(t){e+="/"+t}if(n&&n.length){return"".concat(e,"?query=").concat(JSON.stringify(n))}return e}},{key:"_makeInit",value:function e(t,n,r){var i={credentials:"same-origin",headers:{Accept:"application/json","X-XSRF-TOKEN":g()}};if(t){i.method=t}if(n){i.headers["Content-Type"]="application/json";i.body=JSON.stringify(n)}return Object.assign(i,r||{})}}]);return t}();function g(){if(typeof document==="undefined")return;return decodeURIComponent((document.cookie.match("(^|; )XSRF-TOKEN=([^;]*)")||0)[2])}function p(){if(typeof document==="undefined"){return global.token}return}var k=function(){function n(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};i(this,n);this.bootIfNotBooted();Object.defineProperties(this,{original:{writable:true},exists:{writable:true}});this.exists=false;this.fill(e);this._syncOriginal()}e(n,[{key:"bootIfNotBooted",value:function e(){if(!this.constructor.booted){this.constructor.boot()}}},{key:"fill",value:function e(t){for(var n in t){this.setAttribute(n,t[n])}return this}},{key:"_syncOriginal",value:function e(){this.original=this.getAttributes()}},{key:"getAttribute",value:function e(t){return this[t]}},{key:"setAttribute",value:function e(t,n){if(n!==null&&this.isDate(t)){n=new Date(n);n.toJSON=_}if(this._isRelation(t)){n=this._makeRelated(t,n)}this[t]=n;return this}},{key:"getAttributes",value:function e(){var t=Object.assign({},this);for(var n in t){if(this.isDate(n)){t[n]=new Date(this[n]);t[n].toJSON=_}if(this._isRelation(n)){delete t[n]}}return t}},{key:"getDirty",value:function e(){var t=this.getAttributes();for(var n in t){if(typeof this.original[n]!=="undefined"&&(this.original[n]===null&&t[n]===null||this.original[n]!==null&&t[n]!==null&&this.original[n].valueOf()===t[n].valueOf())){delete t[n]}}return t}},{key:"getKey",value:function e(){return this[this.getKeyName()]}},{key:"getKeyName",value:function e(){return this.constructor.primaryKey||"id"}},{key:"isDate",value:function e(t){return this.constructor.dates.concat("created_at","updated_at","deleted_at").indexOf(t)>-1}},{key:"_isRelation",value:function e(t){return Object.keys(this.constructor.relations).indexOf(t)>-1}},{key:"newQuery",value:function e(){return new c(this.connection,this)}},{key:"newInstance",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var r=new this.constructor(t);r.exists=n;return r}},{key:"hydrate",value:function e(t){var n=this;return t.map(function(e){return n.newInstance(e,true)})}},{key:"save",value:function e(){var t=this;var n;if(this.triggerEvent("saving")===false){return Promise.reject("saving.cancelled")}if(this.exists){n=this._performUpdate()}else{n=this._performInsert()}return n.then(function(e){t.exists=true;t.triggerEvent("saved",false);return t.fill(e)&&t._syncOriginal()})}},{key:"_performInsert",value:function e(){var t=this;if(this.triggerEvent("creating")===false){return Promise.reject("creating.cancelled")}return this.newQuery().insert(this.getAttributes()).then(function(e){t.triggerEvent("created",false);return e})}},{key:"_performUpdate",value:function e(){var t=this;if(this.triggerEvent("updating")===false){return Promise.reject("updating.cancelled")}return this.connection.update(this.getKey(),this.getDirty()).then(function(e){t.triggerEvent("updated",false);return e})}},{key:"update",value:function e(t){if(!this.exists){return this.newQuery().update(t)}this.fill(t);return this.save()}},{key:"delete",value:function e(){var t=this;if(this.triggerEvent("deleting")===false){return Promise.reject("deleting.cancelled")}return this.connection["delete"](this.getKey()).then(function(e){if(e){t.exists=false}t.triggerEvent("deleted",false);return e})}},{key:"load",value:function e(){var n=this;for(var t=arguments.length,r=new Array(t),i=0;i<t;i++){r[i]=arguments[i]}return this.newQuery()["with"](r).first().then(function(t){r.forEach(function(e){n.setAttribute(e,t[e])});return n})}},{key:"_makeRelated",value:function e(t,n){var r=this._getRelatedClass(this.constructor.relations[t]);var i=new r;if(Array.isArray(n)){return i.hydrate(n)}return i.fill(n)}},{key:"_getRelatedClass",value:function e(t){throw new Error("Cannot make related class [".concat(t,"]"))}},{key:"triggerEvent",value:function e(t){var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var r=this.constructor.events;for(var i=0,u=(r[t]||[]).length;i<u;++i){var o=r[t][i](this);if(n&&typeof o!=="undefined"){return o}}}}],[{key:"boot",value:function e(){if(!n.booted){this._bootBaseModel()}this._bootSelf()}},{key:"_bootSelf",value:function e(){this.booted=true;this.dates=this.dates||[];this.relations=this.relations||{};this.scopes=this.scopes||[];if(!this.prototype.connection)this.prototype.connection=new d(this.endpoint);this._bootScopes(this.scopes)}},{key:"_bootBaseModel",value:function e(){this.events={};var t=Object.getPrototypeOf(new c);Object.getOwnPropertyNames(t).filter(function(e){return e.charAt(0)!=="_"&&e!=="constructor"&&typeof t[e]==="function"}).forEach(function(t){w(n.prototype,t,function(){var e=this.newQuery();return e[t].apply(e,arguments)});w(n,t,function(){var e=this.query();return e[t].apply(e,arguments)})})}},{key:"_bootScopes",value:function e(t){t.forEach(function(r){w(this,r,function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++){t[n]=arguments[n]}return this.newQuery().scope(r,t)});w(this.constructor,r,function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++){t[n]=arguments[n]}return this.query().scope(r,t)})},this.prototype)}},{key:"query",value:function e(){return(new this).newQuery()}},{key:"create",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var n=new this(t);return n.save().then(function(){return n})}},{key:"all",value:function e(t){return(new this).newQuery().get(t)}},{key:"setContainer",value:function e(t){this.prototype._getRelatedClass=function(e){return t.make(e)}}},{key:"creating",value:function e(t){this.registerEventHandler("creating",t)}},{key:"created",value:function e(t){this.registerEventHandler("created",t)}},{key:"updating",value:function e(t){this.registerEventHandler("updating",t)}},{key:"updated",value:function e(t){this.registerEventHandler("updated",t)}},{key:"saving",value:function e(t){this.registerEventHandler("saving",t)}},{key:"saved",value:function e(t){this.registerEventHandler("saved",t)}},{key:"deleting",value:function e(t){this.registerEventHandler("deleting",t)}},{key:"deleted",value:function e(t){this.registerEventHandler("deleted",t)}},{key:"registerEventHandler",value:function e(t,n){if(!this.events[t])this.events[t]=[];this.events[t].push(n)}}]);return n}();function w(e,t,n,r){if(typeof e[t]!=="undefined"&&!r){return e}return Object.defineProperty(e,t,{value:n})}function _(){return Math.round(this.valueOf()/1e3)}var b;var m=function e(t,n){if(!b){b=new v(k);k.setContainer(b)}if(n){Object.defineProperty(e,t,{get:function e(){return b.make(t)}});return b.register(t,n)}return b.make(t)};m.Builder=c;m.Container=v;m.Model=k;m.RestConnection=d;return m});