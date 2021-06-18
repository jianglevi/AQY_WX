
const api = require('../../../config/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accessToken:'',
    licenceNumberInfo:{},
    printStatus:'无连接',
    deviceInfo: {},
  },
  pageToPrint(){
    wx.navigateTo({
      url: '/pages/applications/print/print',
    })
  },
  onSuccess(e){
    console.log(e)
  },
  scan(){
    var deviceId = this.data.deviceInfo.deviceId
    // if(!deviceId){
    //   wx.showToast({
    //     title: '请连接蓝牙',
    //     icon:'none'
    //   })
    //   return
    // }
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        that.uploadFiles(tempFilePaths)
      }
    })
  },
  uploadFiles(imgPaths){
    var that = this;
    wx.uploadFile({
      header:{
       'Cookie':wx.getStorageSync('session')
      },
      url: api.host+'/orc/uploadAndFindWaybill', //接口地址
      filePath: imgPaths,
      name: 'file',//文件
      success:function(e){
        console.log(51)
        console.log(e)
        if(JSON.parse(e.data).msg == 'false'){
          wx.showModal({
            title: '提示',
            content: '车牌识别失败, 请重新上传',
            cancelColor: '#ff4d00',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.scan()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          that.setData({licenceNumberInfo:JSON.parse(e.data).data})
          wx.navigateTo({
            url: '/pages/applications/billing/billing?licenceNumberInfo='+JSON.stringify(that.data.licenceNumberInfo),
          })
        }
      },
      fail:function(e){
        console.log(e)
      },
     
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    // var name = wx.getStorageSync('name')
    // this.setData({printStatus:name ? name : '无连接'})
    var that = this
    wx.getBluetoothAdapterState({
      fail(res){
        console.log(94)
        if(res.errCode >= 10000){
          console.log(res.errMsg)
          wx.removeStorageSync('deviceInfo')
        }
      },
      success(res){
        console.log(103)
        console.log(res)
        var deviceInfo = wx.getStorageSync('deviceInfo')
        var remark = wx.getStorageSync('remark')
        console.log(deviceInfo)
        console.log(remark)
        that.setData({
          deviceInfo: deviceInfo,
          printStatus: deviceInfo.name ? (remark ? remark + '(' + deviceInfo.name + ')' :  deviceInfo.name ) : '无连接'
        })
      }
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