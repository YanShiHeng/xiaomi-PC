class ajax {
  static get(url, paramobj) {
      return ajax.rsc('get', url, paramobj);
  }
  static post(url, paramobj) {
      return ajax.rsc('post', url, paramobj);

  } 
  static rsc(type, url, paramobj='') {
      let param = '';
      if (paramobj) { //1.传入的对象不为空
          for (const key in paramobj) {
              // 2.将接收的对象转为符合请求格式的字符串
              param = param + key + '=' + paramobj[key] + '&';
          }
      }
      // 3.如果是get请求，则将字符串加到url地址栏后面，并把字符串转为null，以免影响之后的xhr.send(param)
      if (type == 'get') {
          url = url + '?' + param;
          param = null;
      }
      // 4.获取服务器返回值 此处需用promise来避免回调地狱，将其中的返回值传出来
      return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          xhr.open(type, url);
          // 请求头设置 只给post请求设置
          type == 'post' && xhr.setRequestHeader('content-type',
              'application/x-www-form-urlencoded');
          xhr.send(param);
          //监听ajax状态

          xhr.addEventListener('readystatechange', function () {
              if (xhr.readyState == 4) { //ajax状态=4  相应内容解析完成
                  if (xhr.status == 200) { //服务器状态=200  客户端请求成功
                      resolve(xhr.response);
                  } else {
                      reject('服务器错误');
                  }
              }
          })
      })

  }
}
// 获取节点的方法
function $$(tag) {
  return document.querySelector(tag);
}