var f_ui = {
    // 视图
    view: `<div class="items-box"></div>`,

    // 顶级试图
    topView: 
    `<div>
        <div class="items-box"></div>
    </div>`,

    // 登录试图
    loginView: 
    `<div class="login_page">
        <div class="items-box"></div>
    </div>`,

    // 头部
    header: 
    `<div>
        <a class="header_name" href="#">{{this.data.head_name}}</a>
        <ul>
            {% for (item in this.data.link_list) %}
            <li>
                <a href="{{item.url}}">{{item.caption}}</a>
            </li>
            {% endfor %}
        </ul>
    </div>`,

    // 输入框
    input: 
    `<label class="f-label f-input-form">
        <span>{{this.caption}}</span>
        <input name="{{this.name}}" class="f-input" type="{{this.type}}" />
    </label>`,

    // 按钮
    button: 
    `<div class="f-button-form">
        <button name="{{this.name}}">{{this.caption}}</button>
    </div>`
}