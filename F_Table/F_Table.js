
function Table (obj) {
    this.initParams(obj)
    this.init()
}


Table.prototype = {
    
    // 生命周期函数
    // 创建前
    createBefore: function () {},
    // 创建后
    createAfter: function () {},
    // 挂载前
    mounteBefore: function () {},
    // 挂载后
    mounteAfter: function () {},

    // 数据载入前
    loadData: function () {},
    // 数据载入后
    loadedData: function () {},

    // 滚动事件
    eventScroll: function (event) {},

    init: function () {
        if (this.$data) this.data = this.$data()
        
        // 生命周期
        this.createBefore()

        this.el = this.getDocumentElement()
        if (!this.el) return console.error(this.name, '节点不存在!!!')

        // 生命周期
        this.createAfter()
        this.mounteBefore()
        
        this.initElement()
        this.createTable()

        // 生命周期
        this.mounteAfter()
        this.loadData()
        
        // 载入数据
        let data = this.getLimitData(this.dataset.records, 0, this.row_limit)
        this.tableRenderData(data)
        
        // 生命周期
        this.loadedData()
    },

    initParams: function (obj) {
        this.row_limit = 20          // 默认只显示 20 行数据
        this.scroll_limit = 5        // 默认滚轮滚动 5 条数据

        this.page = {
            page_num: null,          // 当前页数
            total_page_num: null,    // 总页数
        }

        for (let key in obj) {
            if (key === 'data') {
                this['$' + key] = obj[key]
            } else {
                this[key] = obj[key]
                // console.log(this[key])
            }
        }
    },

    initElement: function () {
        let table_html = `<div class="__table__"></div>`
        let table_html_el = this.createHtml(table_html)
        this.table_el = table_html_el[0]
        this.el.append(table_html_el[0])
        // 最外层添加 class 名
        this.el.classList.add('__F_Table__')
        this.setStyle()
    },

    // 获取页面节点
    getDocumentElement: function () {
        let name = this.name
        let el = document.querySelector(name)
        return el
    },

    // html 字符串生成节点
    createHtml: function (html) {
        let div = document.createElement('div')
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
        let table = this.table_el
        let table_height = table.offsetHeight
        let row_limit = this.row_limit
        let scroll_limit = this.scroll_limit
        let dataset = this.dataset

        // 滚动条
        let scroll_html = 
        `<div class="__scroll__">
            <div></div>
        </div>`
        let scroll_html_el = this.createHtml(scroll_html)

        // 鼠标多余滚动数
        let over_scroll_num = (row_limit - scroll_limit) / scroll_limit
        // 鼠标总滚动数
        let total_scroll_num = (dataset.records.length / scroll_limit) - over_scroll_num
        
        // 计算滚动条长度
        let scroll_height = table_height * total_scroll_num

        scroll_html_el[0].children[0].style.height = scroll_height + 'px'
        el.append(scroll_html_el[0])
    },

    // 获取滚动条节点
    getScroll: function () {
        let scroll = this.el.querySelector('.__scroll__')
        return scroll
    },

    // 初始化分页栏
    initPageColumn: function () {
        // 分页栏
        let html = 
        `<div class="__page_column__">
            <div click="a_page_previous"><</div>
            <div class="page_num">
                <input class="page_num_input" type="text" />
                <div class="page_split">/</div>
                <div class="total_page_num"></div>
            </div>
            <div click="a_page_next">></div>
        </div>`
        let html_el = this.createHtml(html)

        // 当前页码
        let page_num_input = html_el[0].querySelector('.page_num_input')
        page_num_input.value = this.computePageNum()

        // 总页数
        let total_page_num = html_el[0].querySelector('.total_page_num')
        total_page_num.innerText = this.getTotalPageNum()

        this.el.append(html_el[0])
        this.setPageObj()
    },

    // 获取分页节点
    getPageColumn: function () {
        let page = this.el.querySelector('.__page_column__')
        return page
    },

    // 获取分页栏对象
    getPageObj: function () {
        return this.page
    },

    // 设置页码对象
    setPageObj: function (obj={}) {
        this.page.page_num = obj.page_num || this.computePageNum()
        this.page.total_page_num = obj.total_page_num || this.getTotalPageNum()
    },

    // 计算当前页码
    computePageNum: function () {
        let row_index = this.getScrollLimitIndex()
        return Math.floor(row_index / this.row_limit) + 1
    },

    // 获取总页数
    getTotalPageNum: function () {
        let dataset = this.dataset
        let row_limit = this.row_limit
        return Math.ceil(dataset.records.length / row_limit)
    },

    // 创建表格，并渲染第一页数据
    createTable: function () {
        let table = this.table_el
        let dataset = this.dataset
        let row_limit = this.row_limit === 0 ? dataset.records.length : this.row_limit

        // 表头
        let table_header = `<div class="thead">`
        dataset.field.forEach(function (item, index) {
            let field = `<div class="tfield">${item}</div>`
            table_header += field
        })
        table_header += `</div>`
        let table_header_el = this.createHtml(table_header)
        table.append(table_header_el[0])

        // 表体
        let table_body = `<div class="tbody">`
        dataset.records.forEach(function (item1, index1) {
            if (index1 < row_limit) {
                table_body += `<div class="tbody_item">`
                item1.forEach(function (item2, index2) {
                    // let field = `<div fname="${dataset.field[index2]}">${item2 ? item2 : ''}</div>`
                    let field = `<div fname="${dataset.field[index2]}"></div>`
                    table_body += field
                })
            }
            table_body += `</div>`
        })
        table_body += `</div>`
        let table_body_el = this.createHtml(table_body)
        table.append(table_body_el[0])

        // 列数设置大于 0 时，固定列数
        if (this.row_limit > 0) {
            this.initScroll()
            this.initPageColumn()
            this.mountTableEvent()
        }
    },

    // table 渲染数据
    tableRenderData: function (data) {
        let tbody_items = this.el.querySelectorAll('.tbody .tbody_item')

        // 清空数据
        tbody_items.forEach(function (tbody_item, tbody_index) {
            tbody_item.childNodes.forEach(function (child, child_index) {
                child.innerText = ''
            })
        })

        // 渲染数据
        for (let i = 0; i < data.length; i++) {
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
        let s_index = index
        let e_index = index + length

        let data_ = []
        for (let i = s_index; i < e_index; i++) {
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

        // 获取当前是第几个下标
        let computed_row_index = Math.ceil(scroll_top / one_height)

        return computed_row_index
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

        let dataset = this.dataset
        let row_limit = this.row_limit

        // 滚动时记录滚动条位置，用于避免重复渲染
        let scroll_row_index = null

        scroll.onscroll = function (event) {
            let row_index = self.getScrollLimitIndex(event)

            // 判断当前滚动位置跟上一次不同时 才渲染数据
            if (scroll_row_index !== row_index) {
                self.eventScroll(event)
                scroll_row_index = row_index
                let data = self.getLimitData(dataset.records, row_index, row_limit)
                self.tableRenderData(data)

                // 设置当前页码
                let page_num = self.computePageNum()
                let page_column_el = self.getPageColumn()
                if (page_column_el) {
                    let page_num_input = page_column_el.querySelector('.page_num_input')
                    page_num_input.value = page_num
                    self.setPageObj({
                        page_num: page_num
                    })
                }
            }
        }
    },

    // 表格滚轮事件
    tableWheelEvent: function () {
        let table = this.table_el
        let scroll = this.getScroll()

        let row_limit = this.row_limit
        let one_height = this.table_el.offsetHeight / this.row_limit

        table.onmousewheel = function (event) {
            let scroll_Y = one_height * row_limit
            // 下滚
            if (event.deltaY > 0) scroll.scrollTop += scroll_Y
            // 上滚
            if (event.deltaY < 0) scroll.scrollTop -= scroll_Y
        }
    }
}