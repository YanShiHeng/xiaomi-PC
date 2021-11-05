// 获取节点

//  登录模块 购物车模块 
let username = localStorage.getItem('username');
let loginR = $$('.login-r');
let userN = $$('#userName');
let logout = $$('.logout');
let goods = localStorage.getItem('goodsNum');
let shoppingCart = $$('.shoppingcart');
let content = $$('.con');
let cartInfo = $$('.cart-info');
// console.log(goods);






//搜索框模块
let inp = $$('.SearchBox');
let search_info = $$('.search_info')
let SearchBtn = $$('.SearchBtn');
let arr = ['小米手机5', '空气净化器2', '活塞耳机', '小米路由器', '小米插线', '配件优惠套装'];
let len = arr.length;


//导航栏
let navLi = document.querySelectorAll('.leftnav li');


//登录模块  获取用户名  固定栏购物车商品数量
if (username) {
    // let goods = localStorage.getItem('goodsNum');

    loginR.style.display = 'none';
    userN.style.display = 'inline-block';
    $$('.userid').innerHTML = username;
    $$('.goodsNum').innerHTML = goods;
    // $$('.shoppingcart').style.background = '#ff6700';
    // $$('.shoppingcart a').style.color = '#fff';
    if (goods > 0) {
        $$('.shoppingcart').style.background = '#ff6700';
        $$('.shoppingcart a').style.color = '#fff';
        $$('.perNum').innerHTML = goods;
        $$('.perNum').style.display = 'block';
    } else {
        $$('.perNum').style.display = 'none';
    }
} else {
    loginR.style.display = 'inline-block';
    userN.style.display = 'none';
}

// 点击退出登录 本地账户信息设置为空
logout.addEventListener('click', function () {
    localStorage.setItem('username', '');
    location.reload();
});




// 窗口滚动事件
window.onscroll = function () {
    // 获取滚动条距离顶部的位置  兼容写法
    let top = document.documentElement.scrollTop || document.body.scrollTop;
    // console.log(top);
    if (top > 1200) {
        $$('.quTop').style.display = 'block';
        $$('.quTop').style.marginTop = '20px';
    } else {
        $$('.quTop').style.display = 'none';
        $$('.quTop').style.marginTop = '20px';
    }
    $$('.quTop').addEventListener('click', function () {
        document.documentElement.scrollTop = 0;
    })
}

let loading = '';
let times = '';

content.addEventListener('mouseenter', function () {
    // 先关闭加载层和清除延时器
    layer.closeAll();
    clearTimeout(times);
    let status = cartInfo.style.display;
    // console.log(status);
    //避免错位  当鼠标从cartInfo移到content中时，如果没有此判断会再次执行后面的代码，就错位了
    if (status == 'block') {
        return;
    }
    // this.getBoundingClientRect().top   得到shoppingCart距离页面顶部的距离
    let top = this.getBoundingClientRect().top + 65 + 'px';
    let left = this.getBoundingClientRect().left - 80 + 'px';
    $$('.cart-msg').style.display = 'block';
    //layer加载层  里面参数是调节其位置的
    loading = layer.load(0, {
        offset: [top, left],
        shade: false
    });
    times = setTimeout(() => {
        layer.close(loading);
        //判断浏览器中的用户名，为空就显示提示信息，反之就显示商品
        if (username) {
            //获取浏览器中保存的商品信息及总数量
            // let good=localStorage.getItem('goodsNum');
            // console.log(cart==true);
            let cart = localStorage.getItem('carts');
            cart = JSON.parse(cart);

            // 判断购物车中是否有商品
            if (cart.length != 0) { //有
                // $$('.shoppingcart').style.background = '#ff6700';
                // $$('.shoppingcart a').style.color = '#fff';
                cartInfo.style.display = 'block';
                $$('.cart-msg').style.display = 'none';

                let html = '';
                // 商品总金额
                let sumMoney = 0;
                //商品总数量
                let sumN = 0;
                cart.forEach(v => {
                    sumMoney += v.price * v.num;
                    sumN += v.num - 0;
                    html += ` <li>
                                    <div class="cart-list clearfix">
                                        <a href="">
                                            <img src="${v.src}" alt="">
                                        </a>
                                        <a href="">
                                            <p>${v.name}</p>
                                        </a>
                                        <span class="rightfix good-del" onclick="delFn(${v.id},this)">×</span>
                                        <div><span>${v.price}</span>元 x <i>${v.num}</i></div>
                                    </div>
                                </li>`;
                });
                // 更改页面信息
                $$('.cart-info ul').innerHTML = html;
                $$('.cartsNum').innerHTML = sumN;
                $$('.sumMoney').innerHTML = sumMoney;
                $$('.goodsNum').innerHTML = sumN;
                // // if (goods > 0) {
                // //     $$('.perNum').innerHTML = goods;
                // //     $$('.perNum').style.display = 'block';
                // // } else {
                // //     $$('.perNum').style.display = 'none';
                // // }

            } else { //无商品
                $$('.cart-msg').style.color = '#424242';
            }

        } else {
            $$('.cart-msg p').innerHTML = '请先登录账号';
            $$('.cart-msg').style.color = '#424242';
        }
    }, 1000);
})

shoppingCart.addEventListener('mouseleave', function () {
    layer.closeAll();
    $$('.cart-msg').style.display = 'none';
    cartInfo.style.display = 'none';
    $$('.cart-msg').style.color = '#fff';
})


//商品删除功能
function delFn(id, that) {
    // console.log(window.event);
    // console.log(that.parentNode.parentNode);
    let cNum = $$('.cartsNum').innerHTML;
    let gNum = $$('.goodsNum').innerHTML;
    let sumM = $$('.sumMoney').innerHTML;
    let c = localStorage.getItem('carts');
    c = JSON.parse(c);
    // console.log(c);
    // console.log(carts);
    //删除页面中的商品
    that.parentNode.parentNode.remove();
    //删除浏览器中存储的此商品信息
    c.forEach((v, key) => {
        if (v.id == id) {
            cNum = cNum - v.num;
            sumM -= v.price * v.num;
            c.splice(key, 1);
            // 更新信息
            localStorage.setItem('goodsNum', cNum)
        }
    });
    // console.log(cNum);
    // console.log($$('.cartsNum'));
    //更新页面信息
    $$('.cartsNum').innerHTML = cNum;
    $$('.goodsNum').innerHTML = cNum;
    $$('.sumMoney').innerHTML = sumM;
    if (cNum > 0) {
        $$('.perNum').innerHTML = cNum;
        $$('.perNum').style.display = 'block';
    } else {
        $$('.shoppingcart').style.background = '#424242';
        $$('.shoppingcart a').style.color = '#b0b0b0';
        $$('.perNum').style.display = 'none';
    }
    //更新localStorage
    localStorage.setItem('carts', JSON.stringify(c));
}




/*********************搜索框***********************/


inp.addEventListener('focus', function () {
    search_info.style.display = 'block';
    inp.style.borderColor = '#ff6700';
    SearchBtn.style.borderColor = '#ff6700';

});
inp.addEventListener('blur', function () {
    search_info.style.display = 'none';
    inp.style.borderColor = '#e0e0e0';
    SearchBtn.style.borderColor = '#e0e0e0';

});
let ind;
let time = '';
time = setInterval(() => {
    ind = parseInt(Math.random() * len);
    inp.setAttribute('placeholder', arr[ind]);
}, 5000);




/********************* 导航栏***********************/
// let navLi = document.querySelectorAll('.leftnav li');
//给每个小li绑定鼠标进入事件
navLi.forEach(v => {
    let navName = v.getAttribute('nav-name');
    if (navName) {
        v.addEventListener('mouseenter', function () {
            // console.log(navName);
            nav(navName);
            $$('.head_content').style.height = '220px';
            $$('.head_content').style.borderTop = '2px solid #e0e0e0';
        });
        v.addEventListener('mouseleave', function () {
            $$('.head_content').style.height = '0px';
            $$('.head_content').style.borderTop = '0';
        });
    }
});
//往对应导航下的菜单中增加数据
function nav(filename) {
    let path = 'http://localhost/xiaomi/json/' + filename + '.json';
    ajax.get(path).then(data => {
        // console.log(JSON.parse(data));
        // 先转化成对象
        data = JSON.parse(data);
        let headContentLi = document.querySelectorAll('.head_content li');
        let num = 0; //记录遍历次数
        let len = data.length;
        headContentLi.forEach(v => {
            //如果对应导航下的菜单中能保存的数据的数量大于json中的商品数，则多余的保存盒子高度设置为0
            if (num > len - 1) {
                v.style.display = 'none';
            } else {
                v.style.display = 'block';

                v.querySelector('.menu-img img').src = data[num].src;
                v.querySelector('.menu-name').innerHTML = data[num].name;
                v.querySelector('.menu-price').innerHTML = data[num].nowPrice;
            }
            num++;
        });

    });
}
$$('.head_content').addEventListener('mouseenter', function () {
    this.style.height = '220px';
    this.style.borderTop = '2px solid #e0e0e0';
})
$$('.head_content').addEventListener('mouseleave', function () {
    this.style.height = '0px';
    this.style.borderTop = '0';
})