//将浏览器中的购物车数据显示到页面中
class Cart {
    constructor() {
        //1.获取购物车数据
        this.getCartGoods();
        this.productNP();
        //2.获取单选和全选按钮
        this.oneC = document.querySelectorAll('.checkOne');
        // console.log(this.oneC);
        this.allC = $$('.check-all');
        //3.全选按钮事件绑定
        this.allC.addEventListener('click', this.allFn.bind(this));
        // 4.单选
        this.oneFn();
        //5.+、-、单个商品删除功能
        $$('.content').addEventListener('click', this.contentFn.bind(this));

    }
    //处理+、-、单个商品的删除
    contentFn(eve) {
        let e = eve || window.event;
        let tar = e.target;
        // console.log(tar.id);
        if (tar.id == 'add') {
            this.changeFn(tar, 'add');
        }
        if (tar.id == 'reduce') {
            this.changeFn(tar, 'reduce');
        }
        if (tar.id == 'del') {
            this.deleteFn(tar);
        }
    }
    //删除
    deleteFn(tar) {
        let shopObj = tar.parentNode.parentNode;
        let id = shopObj.getAttribute('goods-id');
        let that = this;
        // 页面层中的html
        let html = `<div class="shop-del">
        <a href="javascript:void(0);" class="close">×</a>
        <div class="info">确定删除吗？</div>
        <div class="but">
            <button id="sure">确定</button>
            <button class="close">取消</button>
        </div>
    </div>`;
        // 页面层
        let index = layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            content: html //这里content 传入任意的文本或html
        });
        // 获取确认和关闭节点
        let sure = $$('#sure');
        let close = document.querySelectorAll('.close');
        sure.addEventListener('click', function () {
            that.oneC.forEach(v => {
                if (v.parentNode.parentNode.getAttribute('goods-id') == id) {
                    v.parentNode.parentNode.remove();
                }
            });
            // 更新商品总数量和总金额  localstorage信息
            that.productNP();
            that.updateL(id, 0);
            layer.close(index);
        });
        close[0].addEventListener('click', function () {
            layer.close(index);
        });
        close[1].addEventListener('click', function () {
            layer.close(index);
        });
    }
    //商品数量增减
    changeFn(tar, type) {
        let brotherObj;
        if (type == 'add') { //增加
            //得到保存商品数量的节点对象
            brotherObj = tar.previousElementSibling;
            //数量增加
            brotherObj.innerHTML = brotherObj.innerHTML - 0 + 1;
        } else if (type == 'reduce') { //减少
            brotherObj = tar.nextElementSibling;
            //数量减少
            brotherObj.innerHTML > 1 && (brotherObj.innerHTML = brotherObj.innerHTML - 1);
        }

        //得到当前商品盒子节点
        let shopObj = tar.parentNode.parentNode;
        //取出单价
        let price = shopObj.querySelector('.shop-price').innerHTML;
        //计算小计
        let subtotal = brotherObj.innerHTML * price;
        // 更新小计
        shopObj.querySelector('.subtotal').innerHTML = subtotal;
        //如果此商品被选中则将数量及小计加到已选商品和合计里面去
        shopObj.querySelector('.checkOne').checked ? this.productNP() : $$('#sumNum').innerHTML = ($$('#sumNum').innerHTML - 0) + 1;

        //更新localStrage
        let id = shopObj.getAttribute('goods-id');
        this.updateL(id, brotherObj.innerHTML);
    }

    //更新localStorage内容
    updateL(id, num) {
        let dataL = localStorage.getItem('carts');
        let sum = 0;
        dataL = JSON.parse(dataL);
        //遍历购物车数据
        dataL.forEach((v, key) => {
            if (v.id == id) {
                if (num == 0) { //如果数量为0则删除该商品
                    dataL.splice(key, 1);
                } else {
                    v.num = num;
                }
            }
        });
        localStorage.setItem('carts', JSON.stringify(dataL));
        // localStorage.setItem('goodsNum', sum);

    }

    //全选
    allFn(eve) {
        let tar = eve.target.checked;
        if (!tar) {
            $$('.selected').style.display = 'block';
            $$('#settle').className = 'btn-disabled';
        } else {
            $$('.selected').style.display = 'none';
            $$('#settle').className && $$('#settle').classList.remove('btn-disabled')
        }
        this.oneC.forEach(v => {
            v.checked = tar;
        });
        this.productNP();
    }

    //单选
    oneFn() {
        let that = this;
        // console.log(len);
        this.oneC.forEach(v => {
            v.addEventListener('click', function () {
                // console.log(v.checked);
                // console.log(this);

                let checkedNum = 0; //设置单选按钮被选中数 初始化
                let nowOneC = document.querySelectorAll('.checkOne');
                // console.log(nowOneC);
                let len = nowOneC.length;
                // console.log(len);
                // 遍历时已经将点击复选框时的状态算了进去
                nowOneC.forEach(v => {
                    v.checked && checkedNum++; //被选中的按钮数
                })
                // console.log(checkedNum);

                if (this.checked) { //选中商品
                    // console.log(checkedNum);
                    $$('.selected').style.display = 'none';
                    $$('#settle').className && $$('#settle').classList.remove('btn-disabled');
                    //如果被选中的单选按钮的数量等于单选按钮的总数则选中全选
                    checkedNum == len && (that.allC.checked = true);
                } else { //取消选中商品
                    // console.log(checkedNum);
                    if (!checkedNum) {
                        $$('.selected').style.display = 'block';
                        $$('#settle').className = 'btn-disabled';
                    }
                    //取消全选
                    that.allC.checked = false;
                }
                //更新商品数量及金额
                that.productNP();
            });
        });
    }

    //统计已选的商品数量和总金额
    productNP() {
        let sum = 0; //购物车中的商品总数量
        let productNum = 0; //数量
        let subtotal = 0; //小计
        // 重新获取当前页面选中的商品
        let oneObj = document.querySelectorAll('.checkOne');
        // console.log(oneObj);
        //遍历商品，找出被选中的商品，把其数量和小计分别累加
        oneObj.forEach(v => {
            let shopObj = v.parentNode.parentNode;
            if (v.checked) {
                // console.log(shopObj);
                productNum += shopObj.querySelector('.count').innerHTML - 0;
                subtotal += shopObj.querySelector('.subtotal').innerHTML - 0;
            }
            sum += shopObj.querySelector('.count').innerHTML - 0;
        });
        // 购物车中无商品则隐藏商品具体信息页面
        if (sum == 0) {
            //判断是否已登录
            let username = localStorage.getItem('username');
            console.log(username);
            $$('#tips').classList.add('hide');
            $$('#J_cartEmpty').classList.remove('hide');
            $$('#J_cartListGoods').classList.add('hide');
            if (username) {
                $$('.btn-login').style.display = 'none';
                $$('#J_Shoping').style.background = '#ff6700';
                $$('#J_Shoping').style.color = '#fff';
                // $$('#J_Shoping').style.= '#ff6700';
            } else {
                $$('.btn-login').style.display = 'inline-block';
                $$('#J_Shoping').style.background = '#fff';
                $$('#J_Shoping').style.color = '#ff6700';
            }
        }
        // 修改被选中的商品数量及合计
        $$('#sumNum').innerHTML = sum;
        $$('#checked-num').innerHTML = productNum;
        $$('#totalMoney').innerHTML = subtotal;
        localStorage.setItem('goodsNum', sum)
    }
    //获取购物车数据
    getCartGoods() {
        let data = localStorage.getItem('carts');
        data = JSON.parse(data);
        console.log(data.length);
        if (data.length>0) {//有数据
            $$('#tips').classList.remove('hide');
            $$('#J_cartEmpty').classList.add('hide');
            $$('#J_cartListGoods').classList.remove('hide');
            let html = '';
            data.forEach(v => {
                html += `<div class="clearfix shop" goods-id=${v.id}>
    <div class="leftfix check-one">
        <input type="checkbox" name="" id="" class="checkOne" checked>
    </div>
    <div class="spl leftfix"><a href=""><img src="${v.src}" alt=""></a></div>
    <div class="name leftfix"><a href="">${v.name}</a></div>
    <div class="price leftfix"><span class="shop-price">${v.price}</span>元</div>
    <div class="number leftfix clearfix">
        <button class="leftfix " id="reduce">-</button>
        <span class="leftfix count">${v.num}</span>
        <button class="rightfix" id="add">+</button>
    </div>
    <div class="xiaoji leftfix "><span class="subtotal">${v.price * v.num}</span>元</div>
    
    <div class="handle leftfix">
        <a href="javascript:void(0)" class="del" id="del">×</a>
    </div>
    </div>`;
            });
            //添加到购物车中
            $$('.content').innerHTML = html;
        } else {//无数据
            //判断是否已登录
            let username = localStorage.getItem('username');
            // console.log(username);
            $$('#tips').classList.add('hide');
            $$('#J_cartEmpty').classList.remove('hide');
            $$('#J_cartListGoods').classList.add('hide');
            if (username) {
                $$('.btn-login').style.display = 'none';
                $$('#J_Shoping').style.background = '#ff6700';
                $$('#J_Shoping').style.color = '#fff';
                // $$('#J_Shoping').style.= '#ff6700';
            } else {
                $$('.btn-login').style.display = 'inline-block';
                $$('#J_Shoping').style.background = '#fff';
                $$('#J_Shoping').style.color = '#ff6700';
            }
        }
    }
}
new Cart;