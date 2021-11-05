// 获取节点


// 轮播图模块
let div = $$('#play'),
    imgs = div.querySelectorAll('.imgList li'),
    btns = div.querySelectorAll('.play-list span'),
    goPrev = $$('.slide-left'),
    goNext = $$('.slide-right');
let index = 0 // 当前图片的下标，默认为0
let lastIndex = 0 // 上一张图片的下标，默认为0
let timer = null;

/***********************轮播图*********************/

// 按钮切换
btns.forEach((btn, i) => {
    btn.onclick = function () {
        // 要让上一张图片去掉ac，再给当前图片加上ac
        // index的值应该更新成当前点击的下标
        // 把index先变成lastIndex，然后再把index赋值为当前的i
        lastIndex = index;
        index = i;
        change();
    }
});
// 向后切换
goNext.onclick = function () {
    lastIndex = index;
    index++;
    // index的范围只能是0~length-1 所以一旦等于length代表超出了，那就回到0
    if (index === imgs.length) index = 0;
    change();
}
// 向前切换
goPrev.onclick = function () {
    lastIndex = index;
    index--;
    if (index < 0) index = imgs.length - 1;
    change();
}


// 自动切换
autoPlay() // 先自调用一次 默认先自动播放起来
function autoPlay() {
    timer = setInterval(() => {
        goNext.onclick()
    }, 5000);
}
// 鼠标进入轮播图区域就停止自动播放，离开就继续
div.onmouseenter = function () {
    clearInterval(timer);
}
div.onmouseleave = function () {
    autoPlay();
}

function change() {
    imgs[lastIndex].classList.remove('current') // 去除
    imgs[index].classList.add('current') // 添加
    btns[lastIndex].classList.remove('current')
    btns[index].classList.add('current')
}



