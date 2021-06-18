
const api = require('../../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:'',
    waybillList:[],
    currentPage:1,
    total:0
  },
  signOff(e) {
    wx.showModal({
      title: '提示',
      content: '是否确认签收',
      cancelColor: '#ff4d00',
      success(res){
        if (res.confirm) {
          console.log('用户点击确定')
          const username = wx.getStorageSync('username')
          console.log(username)
          api.getRequest('order/signOff', {number:e.currentTarget.dataset.item.number,signer:username}).then((res)=>{
            console.log(18)
            console.log(res)
            if(res.result){
              wx.showToast({
                title: '签收成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 3000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  searchInput({detail}){
    this.setData({searchText:detail.value})
  },
  cardClick(e){
    let item = JSON.stringify(e.currentTarget.dataset.item)
  },
  lower(e){
    if(this.data.total==this.data.waybillList.length)return
    this.setData({currentPage:this.data.currentPage+1})
    this.uploadList()
  },
  search(){
    this.setData({pageSize:1})
    this.uploadList()
  },
  uploadList(){
    let that = this
    api.getRequest('order/search',{msg:this.data.searchText,page:this.data.currentPage,size:10}).then((res)=>{
       if(res.result){
         that.setData({waybillList:[...this.data.waybillList,...res.data.list],total:res.data.total})
       }
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
    this.setData({waybillList:[],currentPage:1})
    this.uploadList()
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