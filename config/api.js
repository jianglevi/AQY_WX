
// const host = "https://gzaql.xyz/YJTransports/"
// const host = "https://www.sharewe.net.cn/AQLGYL/YJTransports/"
// const host = "http://42.193.146.142/YJTransports/"
const host = "http://192.168.1.152:9001/YJTransport/"
// const host = "https://www.sharewe.net.cn/WSM/YJTransports/"

function request(url, data = {}, method = "POST", config = {}) {
  let showToast = true,
      showLoading = true,
      header = "application/x-www-form-urlencoded",
      loadingTitle = "加载中...";
  //更换请求头
  if (config['header'] != undefined && config['header']) { 
    header = "application/json";
  }
  // 不显示toast
  if (config['showToast'] != undefined && config['showToast'] == false) {
    showToast = false;
  }
  // 不显示loading
  if (config['showLoading'] != undefined && config['showLoading'] == false) {
    showLoading = false;
  }
  if (config['loadingTitle']) {
    loadingTitle = config['loadingTitle'];
  }
  return new Promise((resolve, reject) => {
    // 是否显示loading
    if (showLoading) {
      wx.showLoading({ title: loadingTitle, icon: 'none', mask: true });
    }
    wx.request({
      url: host + url,
      data: data,
      header: {
        'Content-Type': header,
        'Cookie':wx.getStorageSync('session')
      },
      method: method,
      success: (res => {
        if (showLoading) {
          wx.hideLoading();
        }
        if(res.statusCode == 404){
          // wx.reLaunch({
          //   url: '/pages/login/index'
          // });
          wx.showToast({ title:res.data.error + res.data.status, icon: 'none',duration:2000 });
          return;
        }
        if (res.statusCode == 200&&res.data.result == 404) {
          wx.showToast({ title:res.data.msg, icon: 'none',duration:2000 });
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/login/login'
            });
          },1000)
          return;
        }
        if (!res.data.result){
          if (showToast) {
            wx.showToast({ title: res.data.msg, icon: 'none',duration:2000});
          }
          return;
        }
        resolve(res.data);
      }),
      fail: (err => {
        reject(err);
        if (showLoading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: '请求失败',
          icon: 'none',
       })
        // if (err.errMsg.indexOf('url not in domain list') > -1) {
        //   wx.showToast({ title: '请求url不在合法域名中，请打开调试模式', icon: 'none' });
        // }
      })
    });
  });

};
 //  get 网络请求
 function getRequest(url, data = {}, config = {}){
   return request(url, data, "GET", config);
 }
   //  post 网络请求
 function postRequest(url, data = {}, config = {}){
   return request(url, data, "POST", config);
 }
  
module.exports = {
  getRequest,
  postRequest,
  host
}