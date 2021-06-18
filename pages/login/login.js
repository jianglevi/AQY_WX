const api = require('../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  login(e){
    var userInfo=e.detail.value
    if (userInfo.username.length < 1) {
      wx.showModal({
        title: "登录失败",
        content: "请输入账号",
        showCancel: false
      });
      return false;
    }else if(userInfo.password.length < 1){
      wx.showModal({
        title: "登录失败",
        content: "请输入密码",
        showCancel: false
      });
      return false;
    }
    api.getRequest("login/ajaxLogin",{username:userInfo.username,password:userInfo.password},{loadingTitle: "登录中..."}).then(res => {
      if(res.result){
        wx.setStorageSync('username',userInfo.username)
        wx.setStorageSync('password',userInfo.password)
        wx.setStorageSync('session','token='+res.session)
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/tabPage/home/home',
          })
        },300)
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      username:wx.getStorageSync('username')||'',
      password:wx.getStorageSync('password')||'',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})