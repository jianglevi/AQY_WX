
const api = require('../../../config/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile:false,
    functionList:[
      {img:'check',name:'核销项目',url:'check/check'},
      {img:'waybill',name:'运单同步',url:'runbill/runbill'},
      {img:'bluetooth',name:'蓝牙测试',url:'bluetooth/bluetooth'},
      {img:'password',name:'修改密码',url:'password/password'},
    ]
  },
  functionTap(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/functionList/'+url,
    })
  },
  logOut(){
    api.getRequest("login/ajaxLogout",{}).then(res=>{
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: function(res){
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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