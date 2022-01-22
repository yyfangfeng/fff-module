
// f 对象
var f = {
    config: {},
    routes: {},             // 路由
    components: {},         // 组件
    ui: {},            // 默认 html ui

    // 组件创建，继承
    extend: function (subClass, supClass) {
        function obj () {}
        obj.prototype = subClass
        obj.prototype.constructor = obj
        var o = supClass
        subClass = new obj()

        if (Object.assign) {
            Object.assign(subClass, o)
            this.lifeCycle.call(subClass)

        } else {
            if (Object.getOwnPropertyNames) {
                var names = Object.getOwnPropertyNames(o)
                for (var i = 0; i < names.length; i++) {
                    var desc = Object.getOwnPropertyDescriptor(names[i])
                    Object.defineProperty(subClass, names[i], desc)
                }
            } else {
                for (var prop in o) {
                    if (prop === 'data' && this.isFun(o[prop])) {
                        subClass['$' + prop] = o[prop]
                        subClass[prop] = o[prop]()
                    } else {
                        subClass[prop] = o[prop]
                    }
                }
            }
        }

        this.components[subClass.name] = subClass
        return subClass
    },

    // 对象继承
    extend2: function (subClass, supClass) {
        function obj () {}
        obj.prototype = subClass
        obj.prototype.constructor = obj
        var o = supClass
        subClass = new obj()

        if (Object.assign) {
            Object.assign(subClass, o)
            this.lifeCycle.call(subClass)

        } else {
            if (Object.getOwnPropertyNames) {
                var names = Object.getOwnPropertyNames(o)
                for (var i = 0; i < names.length; i++) {
                    var desc = Object.getOwnPropertyDescriptor(names[i])
                    Object.defineProperty(subClass, names[i], desc)
                }
            } else {
                for (var prop in o) {
                    if (prop === 'data' && this.isFun(o[prop])) {
                        subClass['$' + prop] = o[prop]
                        subClass[prop] = o[prop]()
                    } else {
                        subClass[prop] = o[prop]
                    }
                }
            }
        }
        return subClass
    },



    // 生命周期函数
    lifeCycle: function () {
        this.init.call(this)
        this.initData.call(this)
        this.initUI.call(this)
        this.initExecute.call(this)
    },

    init: function () {
        console.log(this)
    },

    // 初始化 data 数据
    initData: function () {
        if (this.isFun(this.data)) {
            this.$data = this.data
            this.data = this.$data()
        }
    },

    initUI: function () {
        this.el = this.compCreateEl.call(this)
        this.compCreateItems.call(this)
        // 创建私有样式
        this.viewCreateStyle.apply(this)
    },

    // 挂载事件
    initExecute: function () {
        // console.log(this.el)
        console.log(this.name + 'Execute' in this)
        console.log(this)

        // if (this.el) {
        //     var self = this
        //     let action_dom = []

        //     // console.log(this.el.outerHTML.match(/@\w*?=/g))

        //     if (this.el.getAttribute('action')) {
        //         action_dom.push(this.el)
        //     } else {
        //         action_dom = this.el.querySelectorAll('[action]')
        //     }
            
        //     for (let dom_i = 0; dom_i < action_dom.length; dom_i++) {
        //         let method_name = action_dom[dom_i].getAttribute('action')
        //         action_dom[dom_i].onclick = function (e) {
        //             try {
        //                 self[method_name].call(self, e)
        //             } catch (e) {
        //                 console.log(e)
        //                 console.error('方法调用错误：' + self.name + ' --- ' + method_name + '()')
        //             }
        //         }
        //         action_dom[dom_i].removeAttribute('action')
        //     }
        // }
    },
}

// 载入工具函数
Object.assign(f, f_util)

// 载入组件相关函数
Object.assign(f, f_component)

// 载入 ui 相关 html
Object.assign(f.ui, f_ui)

// 载入模板引擎相关
Object.assign(f, f_parse)