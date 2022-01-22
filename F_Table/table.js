
function Table (obj) {
    this.initParams(obj)
    this.init()
}

Table.prototype = {
    init: function () {
        if (this.$data) this.data = this.$data()
        this.el = this.getDocumentElement()
        if (!this.el) return console.error(this.name, '节点不存在!!!')
        this.initEl()
        this.renderData()
    },

    initParams: function (obj) {
        this.row_limit = 20         // 默认只显示 20 行数据
        this.wheel_limit = 5        // 默认滚轮滚动 5 条数据

        this.$row_index = 0

        for (var key in obj) {
            if (key === 'data') {
                this['$' + key] = obj[key]
            } else {
                this[key] = obj[key]
                console.log(this[key])
            }
        }
    },

    initEl: function () {
        var table_html = `<div class="__table__"></div>`
        var table_html_el = this.createHtml(table_html)
        this.table_el = table_html_el[0]
        this.el.append(table_html_el[0])
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
        this.el.style.position = 'relative'
        for (let s in style) {
            this.el.style[s] = style[s]
        }
    },

    // 渲染数据
    renderData: function () {
        var self = this
        var el = this.el
        var table = this.table_el
        var datasets = this.datasets
        var row_limit = this.row_limit === 0 ? datasets.records.length : this.row_limit


        // 表格
        var table_header = `<div class="thead">`
        datasets.field.forEach(function (item, index) {
            var field = `<div class="tfield">${item}</div>`
            table_header += field
        })
        table_header += `</div>`
        var table_header_el = this.createHtml(table_header)
        table.append(table_header_el[0])


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

        
        if (this.row_limit > 0) {

            // 滚动条
            var tbody_height = table.querySelector('.tbody').offsetHeight
            var scroll_height = tbody_height / datasets.records.length * row_limit
            console.log(scroll_height)
            var scroll_html = 
            `<div class="__scroll__">
                <div></div>
            </div>`
            // var scroll_html = `<div class="scroll"></div>`
            var scroll_html_el = this.createHtml(scroll_html)
            // el.style.position = 'relative'
            scroll_html_el[0].style.height = scroll_height + 'px'
            el.append(scroll_html_el[0])


            this.mountWheelEvent()
            this.mountScrollEvent()
        }
    },

    // 鼠标滚动渲染数据
    wheelRenderData: function (data) {
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

        return data.slice(s_index, e_index)
    },

    // 滚轮事件
    mountWheelEvent: function () {
        var self = this
        var el = this.el
        var table = this.table_el
        var tbody = table.querySelector('.tbody')
        var scroll = el.querySelector('.scroll')
        var datasets = this.datasets

        var row_index = this.$row_index
        var row_limit = this.row_limit
        var wheel_limit = this.wheel_limit
        
        var wheel_num = 0

        tbody.onmousewheel = function (event) {
            // row_index = self.$row_index
            // console.log(row_index)

            // 下滚
            if (event.deltaY > 0) {
                if (row_index + wheel_limit < datasets.records.length) {
                    row_index = row_index + wheel_limit
                    wheel_num++
                }
            }

            // 上滚
            if (event.deltaY < 0) {
                if (row_index > 0) {
                    row_index = row_index - wheel_limit
                    wheel_num--
                } else {
                    row_index = 0
                }
            }

            // self.$row_index = row_index

            // 设置滚动条位置
            var tbody_height = table.querySelector('.tbody').clientHeight
            var thead_height = table.querySelector('.thead').clientHeight

            var scroll_height = tbody_height - thead_height
            var scroll_top = (tbody_height / datasets.records.length) * wheel_num * wheel_limit

            if (Math.ceil(scroll_top) < scroll_height) {
                scroll.style.top = scroll_top + 'px'

                var data = self.getLimitData(datasets.records, row_index, row_limit)
                self.wheelRenderData(data)

            } else {
                scroll.style.top = scroll_height + 'px'
            }
        }
    },

    // 滚动条事件
    // mountScrollEvent: function () {
    //     var self = this
    //     var el = this.el
    //     var table = this.table_el
    //     var row_limit = this.row_limit
    //     var wheel_limit = this.wheel_limit

    //     var datasets = this.datasets

    //     var tbody_height = table.querySelector('.tbody').clientHeight
    //     var thead_height = table.querySelector('.thead').clientHeight
        
    //     var scroll_el = el.querySelector('.scroll')
    //     scroll_el.onmousedown = function (e) {
    //         console.log(self.$row_index)
    //         var top = scroll_el.offsetTop
    //         var y = e.pageY

    //         window.onmousemove = function (e1) {
    //             var scroll_height = tbody_height - thead_height
    //             var scroll_top = e1.pageY - y + top
    //             scroll_el.style.top = scroll_top + 'px'
    //             var row_index = self.$row_index

    //             // 每条数据的高度
    //             var data_item_height = tbody_height / datasets.records.length
    //             var scroll_ = row_index * data_item_height

    //             // if (row_index < 0) row_index = 0
    //             // if (row_index > datasets.records.length) row_index = datasets.records.length

    //             // if (e1.movementY > 0 && scroll_top < scroll_) return
    //             // if (e1.movementY < 0 && scroll_top > scroll_) return
                
    //             if (e1.movementY > 0) {
    //                 if (scroll_top > scroll_) {
    //                     self.$row_index += self.wheel_limit
    //                     if (row_index > datasets.records.length) self.$row_index = datasets.records.length
    //                 } else {
    //                     return
    //                 }
    //             }

    //             if (e1.movementY < 0) {
    //                 if (scroll_top < scroll_) {
    //                     self.$row_index -= self.wheel_limit
    //                     if (row_index < 0) self.$row_index = 0
    //                 } else {
    //                     return
    //                 }
    //             }

    //             var data = self.getLimitData(datasets.records, self.$row_index, row_limit)
    //             self.wheelRenderData(data)

    //             // console.log(row_index)
    //         }

    //         window.onmouseup = function (e2) {
    //             window.onmousemove = null
    //         }
    //     }
    // }

    mountScrollEvent: function () {
        
    }
}