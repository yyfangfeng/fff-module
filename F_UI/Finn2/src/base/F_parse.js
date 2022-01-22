// 模板引擎
var f_parse = {
    // 解析 html
    parseHtml: function (temp) {
        try {
            temp = this.parseTemp.call(this, temp)
        } catch (e) {
            console.error('模板解析失败：' + this.name, e)
        }
        return temp
    },

    // 将模板字符串 解析成 模板数组
    parseTempArr: function (temp) {
        var temp_arr = []
        var html_arr = temp.split('\n')

        // 拼接模板字符串
        var temp_item = ''
        html_arr.forEach(function (html_item) {
            // 将前后空格去掉
            html_item = html_item.replace(/(^\s*)|(\s*$)/g, '')

            // 判断是否为注释
            if (html_item.substring(0, 2) !== '//') {

                // 判断模板字符串，当前行的语句，是否未结束
                if (/\}|\>/.test(html_item[html_item.length - 1]) && /\{|\</.test(html_item[0])) {
                    if (temp_item) temp_arr.push(temp_item)
                    temp_arr.push(html_item)
                    temp_item = ''
                } else {
                    temp_item += html_item
                }
            }
        })

        return temp_arr
    },


    // 解析生成 js 代码
    parseTemp: function (temp) {
        var self = this

        // 将模板字符串 解析成 模板数组
        var split = this.parseTempArr(temp)

        var script = []
        script.push('var html=""')
        script.push('var self=this')

        split.forEach(function (item, index) {

            // 将前后空格去掉
            item = item.replace(/(^\s*)|(\s*$)/g, '')
            // 将 单引号 改为 双引号，避免拼接 html 字符串时出错
            item = item.replace(/'/g, '"')

            // 正则匹配 {{ }} 模板插值语法
            var val_RE = /\{{(.+?)\}}/g

            // 正则匹配 for 模板语法
            var for_RE = /{%( )*for( )*\(?\((.)* in (.)*\)?( )*%}/g
            var end_for_RE = /{%( )?endfor( )?%}/g

            // 正则匹配 if 模板语法
            var if_RE = /{%( )?if( )*(\()?\(.*\)(\))?( )?%}/g
            var elif_RE = /{%( )?elif( )*(\()?\(.*\)(\))?( )?%}/g
            var else_RE = /{%( )?else( )?%}/g
            var end_if_RE = /{%( )?endif( )?%}/g

            // 正则匹配使用组件
            var comp_RE = /{%( )?<.*?>( )?(\{.*?\}( )?)?%}/g

            // 判断是否存在模板语法
            if (val_RE.test(item)) {
                self.parseValRE.call(self, item, script, val_RE)

            } else if (for_RE.test(item)) {
                self.parseForRE.call(self, item, script)

            } else if (end_for_RE.test(item)) {
                self.parseEndForRE.call(self, item, script)

            } else if (if_RE.test(item)) {
                self.parseIfRE.call(self, item, script)

            } else if (elif_RE.test(item)) {
                self.parseElifRE.call(self, item, script)

            } else if (else_RE.test(item)) {
                self.parseElseRE.call(self, item, script)

            } else if (end_if_RE.test(item)) {
                self.parseEndIfRE.call(self, item, script)

            } else if (comp_RE.test(item)) {
                self.parseCompRE.call(self, item, script)

            } else {
                script.push(`html+='${item}'`)
            }
        })
        script.push('return html')
        // console.log(script)

        var fn = new Function(script.join(';'))
        var template = fn.call(self)
        return template
    },


    // 获取 {{ }} 里的模板语言
    parseValRE: function (item, script, RE) {
        var html = item

        // 查询 {{ }} 出来的数组
        var val_match = item.match(RE)

        // 查询出正则符号转义生成新的替换正则
        var val_reg = /\$|\?|\+|\*|\-|\/|\(|\)/g

        val_match.forEach(function (val_item, val_index) {
            var val_reg_str = val_item.replace(val_reg, function () {
                return '\\' + arguments[0]
            })
            var reg = new RegExp(val_reg_str)
            val_item = val_item.replace(/{{/, "'+(")
            val_item = val_item.replace(/}}/, ")+'")

            html = html.replace(reg, val_item)
        })

        script.push(`html+='${html}'`)
    },


    // for 解析表达式
    parseForRE: function (item, script) {
        var for_exp = /\(.*\)/.exec(item)[0]
        var exp = for_exp.substring(1, for_exp.length - 1).split(' in ')

        var name = null
        if (exp[0][0] === '(') {
            name = exp[0].substring(1, exp[0].length - 1).split(',').map(function (item_1) {
                return item_1.replace(/ /, '')
            })
        } else {
            name = exp[0]
        }
        var data = exp[1]

        var item = this.isArr(name) ? name[0] : name
        var index = this.isArr(name) ? name[1] : 'index'

        script.push(`self.parseForMethod.call(this,${data},function(${item},${index}){`)
    },

    // for 解析结束表达式
    parseEndForRE: function (item, script) {
        script.push(`})`)
    },


    // for 循环函数
    parseForMethod: function (data, cb) {
        if (this.isArr(data)) {
            for (var i = 0; i < data.length; i++) {
                this.isFun(cb) && cb.call(this, data[i], i)
            }
        } else if (this.isObj(data)) {
            for (var key in data) {
                this.isFun(cb) && cb.call(this, data[key], key)
            }
        }
    },


    // if 解析表达式
    parseIfRE: function (item, script) {
        var if_exp = /\(.*\)/.exec(item)[0]
        var data = if_exp.substring(1, if_exp.length - 1)
        script.push(`if(${data}){`)
    },

    // else if 解析表达式
    parseElifRE: function (item, script) {
        var if_exp = /\(.*\)/.exec(item)[0]
        var data = if_exp.substring(1, if_exp.length - 1)
        script.push(`}else if(${data}){`)
    },

    // else 解析表达式
    parseElseRE: function (item, script) {
        script.push(`}else{`)
    },

    // if 解析结束表达式
    parseEndIfRE: function (item, script) {
        script.push(`}`)
    },


    // < > 解析使用组件
    parseCompRE: function (item, script) {
        var comp_exp = /\<.*\>/.exec(item)[0]
        var data_exp = /\{( )?.*?( )?\}/.exec(item.substring(2, item.length - 2))
        var data_name_exp = data_exp ? data_exp[0].replace(/ /g, '') : null
        var data = data_name_exp ? data_name_exp.substring(1, data_name_exp.length - 1) : null
        var comp_name = comp_exp.substring(1, comp_exp.length - 1)

        if (data) {
            script.push(`var data=${data_name_exp}`)
            script.push(`html+=self.parseUseComp(data,'${comp_name}')`)
        } else {
            script.push(`html+=self.parseUseComp({},'${comp_name}')`)
        }
    },

    // 调用组件
    parseUseComp: function (data, comp_name) {
        // this.components[comp_name].sender = this
        return `<component comp_name="${comp_name}">${JSON.stringify(this.mergeObj(data))}</component>`
    }
}