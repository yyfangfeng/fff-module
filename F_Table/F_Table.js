
function Table (obj) {
    this.initParams(obj)
    this.init()
}


Table.prototype = {
    init: function () {
        if (this.$data) this.data = this.$data()
        this.el = this.getDocumentElement()
        if (!this.el) return console.error(this.name, '节点不存在!!!')
        this.initElement()
        this.createTable()
    },

    initParams: function (obj) {
        this.row_limit = 20          // 默认只显示 20 行数据
        this.scroll_limit = 5        // 默认滚轮滚动 5 条数据

        this.$row_index = 0

        for (var key in obj) {
            if (key === 'data') {
                this['$' + key] = obj[key]
            } else {
                this[key] = obj[key]
                // console.log(this[key])
            }
        }
    },

    initElement: function () {
        this.createBefore()
        var table_html = `<div class="__table__"></div>`
        var table_html_el = this.createHtml(table_html)
        this.table_el = table_html_el[0]
        this.el.append(table_html_el[0])
        // 最外层添加 class 名
        this.el.classList.add('__F_Table__')
        this.setStyle()
    },

    // 获取页面节点
    getDocumentElement: function () {
        var name = this.name
        var el = document.querySelector(name)
        return el
    },

    // html 字符串生成节点
    createHtml: function (html) {
        var div = document.createElement('div')
        div.innerHTML = html
        return div.children
    },

    setStyle: function () {
        let style = this.style || {}
        for (let s in style) {
            this.el.style[s] = style[s]
        }
    },

    // 初始化滚动条
    initScroll: function () {
        let el = this.el
        var table = this.table_el
        var table_height = table.offsetHeight
        var row_limit = this.row_limit
        let scroll_limit = this.scroll_limit
        let datasets = this.datasets

        // 滚动条
        var scroll_height = table_height * (datasets.records.length / scroll_limit)
        var scroll_html = 
        `<div class="__scroll__">
            <div></div>
        </div>`
        var scroll_html_el = this.createHtml(scroll_html)

        scroll_html_el[0].children[0].style.height = scroll_height + 'px'
        el.append(scroll_html_el[0])
    },

    // 滚动条节点
    getScroll: function () {
        let scroll = this.el.querySelector('.__scroll__')
        return scroll
    },

    // 渲染数据
    createTable: function () {
        var table = this.table_el
        var datasets = this.datasets
        var row_limit = this.row_limit === 0 ? datasets.records.length : this.row_limit

        // 表头
        var table_header = `<div class="thead">`
        datasets.field.forEach(function (item, index) {
            var field = `<div class="tfield">${item}</div>`
            table_header += field
        })
        table_header += `</div>`
        var table_header_el = this.createHtml(table_header)
        table.append(table_header_el[0])

        // 表体
        var table_body = `<div class="tbody">`
        datasets.records.forEach(function (item1, index1) {
            if (index1 < row_limit) {
                table_body += `<div class="tbody_item">`
                item1.forEach(function (item2, index2) {
                    var field = `<div fname="${datasets.field[index2]}">${item2 ? item2 : ''}</div>`
                    table_body += field
                })
            }
            table_body += `</div>`
        })
        table_body += `</div>`
        var table_body_el = this.createHtml(table_body)
        table.append(table_body_el[0])

        // 列数设置大于 0 时，固定列数
        if (this.row_limit > 0) {
            this.initScroll()
            this.mountTableEvent()
        }
    },

    // table 渲染数据
    tableRenderData: function (data) {
        var tbody_items = this.el.querySelectorAll('.tbody .tbody_item')

        // 清空数据
        tbody_items.forEach(function (tbody_item, tbody_index) {
            tbody_item.childNodes.forEach(function (child, child_index) {
                child.innerText = ''
            })
        })

        // 渲染数据
        for (var i = 0; i < data.length; i++) {
            if (tbody_items[i]) {
                data[i].forEach(function (data_item, data_index) {
                    tbody_items[i].children[data_index].innerText = data_item
                })
            }
        }
    },

    // data 数组
    // index 下标
    // length 取多少条数据
    getLimitData: function (data, index, length) {
        var s_index = index
        var e_index = index + length

        var data_ = []
        for (var i = s_index; i < e_index; i++) {
            if (data[i]) {
                data_.push(data[i])
            }
        }
        return data_
    },

    // 通过滚动条位置，获取分页页码
    getScrollLimitIndex: function (event) {
        let scroll_top = null
        if (event) {
            scroll_top = event.target.scrollTop
        } else {
            scroll_top = this.getScroll().scrollTop
        }

        let one_height = this.table_el.offsetHeight / this.scroll_limit

        // 获取当前是第几页
        let row_index = null
        let computed_row_index = Math.ceil(scroll_top / one_height)

        if (row_index === computed_row_index) return
        row_index = computed_row_index

        return row_index
    },

    // 挂载 table 方法函数
    mountTableEvent: function () {
        // table 滚动条事件
        this.tableScrollEvent()
        // table 滚轮事件
        this.tableWheelEvent()
    },

    // 表格滚动条事件
    tableScrollEvent: function () {
        let self = this
        let scroll = this.getScroll()

        let datasets = this.datasets
        let row_limit = this.row_limit

        scroll.onscroll = function (event) {
            let row_index = self.getScrollLimitIndex(event)
            let data = self.getLimitData(datasets.records, row_index, row_limit)
            self.tableRenderData(data)
        }
    },

    // 表格滚轮事件
    tableWheelEvent: function () {
        var table = this.table_el
        var scroll = this.getScroll()

        var row_limit = this.row_limit
        let one_height = this.table_el.offsetHeight / this.row_limit

        table.onmousewheel = function (event) {
            let scroll_Y = one_height * row_limit
            // 下滚
            if (event.deltaY > 0) scroll.scrollTop += scroll_Y
            // 上滚
            if (event.deltaY < 0) scroll.scrollTop -= scroll_Y
        }
    },


    // 生命周期函数
    // 创建前
    createBefore: function () {},
    // 创建后
    createAfter: function () {},
    // 挂载前
    mounteBefore: function () {},
    // 挂载后
    mounteAfter: function () {},
}