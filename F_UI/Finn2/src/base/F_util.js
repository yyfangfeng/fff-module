// 工具函数对象
var f_util = {
    // 判断值是否存在
    isDef: function (v) {
        return v !== undefined && v !== null
    },

    isTrue: function (v) {
        return v === true
    },

    isFalse: function (v) {
        return v === false
    },

    // 判断是否为函数
    isFun: function (fun) {
        return typeof fun === 'function'
    },

    // 判断是否为字符串
    isStr: function (o) {
        return typeof o === 'string'
    },

    // 判断是否为数字
    isNum: function (o) {
        return typeof o === 'number'
    },

    // 判断是否为数组
    isArr: function (o) {
        return Array.isArray(o)
    },

    // 判断是否为对象
    isObj: function (o) {
        if (this.isDef(o)) {
            return o.toString().slice(8, -1) === 'Object'
        } else {
            return false
        }
    }
}


// 可覆盖任意函数，不覆盖该函数原本的作用
function callSuper () {
    var func = callSuper.caller.superFunc
    if (func) return func.apply(this, arguments)
}