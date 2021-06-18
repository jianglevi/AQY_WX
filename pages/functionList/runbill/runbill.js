
const api = require('../../../config/api')
let rangeName = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    writeInfo:[
      {title:'发货人姓名',name:'consignerName',type:'input-picker',show:false},
      {title:'收货方姓名',name:'consigneeName',type:'input-picker',show:false},
      {title:'开始时间',name:'beginDate',type:'date'},
      {title:'结束时间',name:'endDate',type:'date'},
    ]
  },
  formPickerItem(e){
    let index = e.currentTarget.dataset.index,
        item = e.currentTarget.dataset.item
    this.setData({
      ['writeInfo['+index+'].value']:item.value,
      ['writeInfo['+index+'].range']:[],
      ['writeInfo['+index+'].show']:false
    })
  },
  hidePicker(){
    this.setData({
      ['writeInfo[0].show']:false,
      ['writeInfo[1].show']:false
    })
  },
  formFocusPicker(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      ['writeInfo['+index+'].show']:true
    })
  },
  formInputPicker(e){
    let index = e.currentTarget.dataset.index
    let range = rangeName.filter(item=> item.label.includes(e.detail.value))
    this.setData({
      ['writeInfo['+index+'].value']:e.detail.value,
      ['writeInfo['+index+'].range']:range,
      ['writeInfo['+index+'].show']:true
    })
  },
  formDate(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      ['writeInfo['+index+'].value']:e.detail.value
    })
  },
formSubmit(e){
  let obj = {}
  this.data.writeInfo.forEach(item=> item.value && (obj[item.name]=item.value))
  console.log(obj)
  //obj.beginDate
    // api.getRequest('order/sync',e.detail.value).then(res=>{
    //   if(res.result){
    //     wx.showToast({title: '同步成功'})
    //     setTimeout(()=>wx.navigateBack({delta: 1}),1000)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await api.getRequest('order/options',{value:"name", label:"name",table:'erp_customer'})
    rangeName = res.data
    this.setData({
      'writeInfo[0].range':res.data,
      'writeInfo[1].range':res.data
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