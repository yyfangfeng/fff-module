var f_component = {
    compShow: function (name) {
        var body = document.querySelector('body')
        body.appendChild(this.components[name].el)
    },

    compGetTemp: function () {
        if (!this.template) {
            if (this.f_type) {
                this.template = this.ui[this.f_type]
            }
        }
    },

    // 用 html 字符串创建节点，返回节点对象
    compCreateEl: function () {
        var div = document.createElement('div')
        this.compGetTemp.call(this)

        var temp = ''
        if (this.isFun(this.template)) {
            temp = this.template.call(this)
        } else {
            temp = this.template
        }

        // 解析 html
        div.innerHTML = this.parseHtml.call(this, temp)
        let el = div.children[0]
        el.setAttribute('comp_name', this.name)
        el.classList.add(this.name)
        return el
    },

    // 用 html 字符串创建节点，返回节点对象
    compCreateEl2: function (temp) {
        var div = document.createElement('div')
        this.compGetTemp.call(this)

        // 解析 html
        div.innerHTML = this.parseHtml.call(this, temp)
        let el = div.children[0]
        return el
    },

    // 创建 items 组件
    compCreateItems: function () {
        if (this.view && this.view.items) {
            let items = this.view.items
            
            items.forEach((item) => {
                let item_obj = f.extend2(f, item)
                let item_el = this.compCreateEl2.call(item_obj, this.ui[item.f_type])
                this.el.querySelector('.items-box').appendChild(item_el)
                if (this.isFun(this[item.name + 'Execute'])) {
                    item_el.onclick = this[item.name + 'Execute']
                }
                item.el = item_el
            })
        }
    },

    // 创建样式
    viewCreateStyle: function () {
        let head = document.querySelector('head')

        // 创建页面 style
        if (this.style) {
            let create_style = document.createElement('style')
            create_style.setAttribute('name', this.name)
            create_style.innerHTML = this.viewGetScopedStyle.call(this)
            head.appendChild(create_style)
        }
    },

    // 获取私有 style
    viewGetScopedStyle: function () {
        let style = ''

        if (this.isFun(this.style)) style = this.style()
        else if (this.isStr(this.style)) style = this.style
        else console.error('错误的 style 类型')

        // 设置私有 style
        if (style) style = this.viewSetScopedStyle.call(this, style)
        return style
    },

    // 设置私有 style
    viewSetScopedStyle: function (style) {
        var first_css_reg = /^\^/

        let s_arr = style.split('\n')
        for (let i = 0; i < s_arr.length; i++) {
            // 设置组件私有变量
            if (/{/g.test(s_arr[i])) {
                s_arr[i] = s_arr[i].replace(/^\s*/, '')

                if (first_css_reg.test(s_arr[i])) {
                    s_arr[i] = s_arr[i].replace(/^\^/, '.'+ this.name)
                } else {
                    s_arr[i] = '.'+ this.name +' ' + s_arr[i]
                }
            }
            // 设置注释
            if (/\/\//g.test(s_arr[i])) {
                s_arr[i] = s_arr[i].replace(/\/\//, '/*')
                s_arr[i] = s_arr[i].replace(/;$/, '*/')
            }
        }
        return s_arr.join('\n')
    },
}