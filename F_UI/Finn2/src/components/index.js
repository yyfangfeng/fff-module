
// 登录组件
C_LOGIN = f.extend(f, {
    name: 'C_LOGIN',
    f_type: 'loginView',
    // f_type: 'topView',
    style: `
        ^ {
            background-color: #949494;
        }
        .items-box {
            width: 300px;
            display: flex;
            flex-direction: column;
        }
    `,
    view: {
        layout: '',
        items: [
            { name: 'F_USERNAME', caption: '账号', f_type: 'input', type: 'text' },
            { name: 'F_PASSWORD', caption: '密码', f_type: 'input', type: 'password' },
            { name: 'login', caption: '登录', f_type: 'button' }
        ]
    },
    data: function () {
        return {
            bg_img: './public/image/head.jpg',
        }
    },
    loginExecute: function () {
        // console.log(this.getValue('F_USERNAME'))
        f.compShow('C_HEAD')
    },
    F_USERNAMEExecute: function () {
        console.log('heheh')
    }
})



// 头部组件
C_HEAD = f.extend(f, {
    name: 'C_HEAD',
    f_type: 'header',
    style: `
        ^ {
            display: flex;
            align-items: center;
            padding: 0 10px;
            height: 50px;
            box-shadow: 0 0 10px rgba(0,0,0,.1);
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            z-index: 100;
            background-color: #fff;
        }
        .header_name {
            color: #333;
            font-weight: bold;
            font-size: 16px;
        }
        ul {
            display: flex;
            list-style: none;
            margin-left: 40px;
        }
        ul li {
            margin: 0 10px;
        }
    `,
    data: function () {
        return {
            head_name: 'Finn 后台管理系统',
            link_list: [
                { caption: '首页', url: '#/' },
                { caption: '登录', url: '#/login' },
                { caption: '列表', url: '#/list' }
            ]
        }
    },
})