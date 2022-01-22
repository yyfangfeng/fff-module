# F_Table

用于创建 table 组件

```js
let table = new Table({
    name: '#table1',	// 节点
    row_limit: 20,		// 固定行数
    wheel_limit: 5,		// 滚动多少条数据
    // 数据集
    datasets: {
        field: ['username', 'password', 'nickname'],
        records: [
            ['111', 'aaa', 'SB'],
            ['222', 'bbb', '爱思从'],
            ['333', 'ccc', '行行行'],
            ['444', 'ccc', '行行行'],
            ['555', 'ccc', '行行行'],
            ['666', 'ccc', '行行行'],
            ['777', 'ccc', '行行行'],
            ['888', 'ccc', '行行行'],
            ['999', 'ccc', '行行行'],
            ['000', 'ccc', '行行行'],
            ['000', 'ccc', '行行行'],
            ['000', 'ccc', '行行行'],
        ]
    }
})
```

