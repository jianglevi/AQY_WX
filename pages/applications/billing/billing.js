
const ToBase64 = require('../../../utils/print/base64gb2312.js')
const {PrintUtil} = require('../../../utils/print/PrintUtil.js')
const utils = require('../../../utils/util')
const api = require('../../../config/api')

const dateTimePicker = require('../../../utils/dateTimePicker')
let drivers = []
const business = [
  {label:'干线普货运输',value:'干线普货运输'},
  {label:'城市配送',value:'城市配送'},
  {label:'农村配送',value:'农村配送'},
  {label:'集装箱运输',value:'集装箱运输'},
  {label:'其他',value:'其他'},
]
const payType = [
  {label:'现付',value:'现付'},{label:'到付',value:'到付'},{label:'回付',value:'回付'},
  {label:'周结',value:'周结'},{label:'月结',value:'月结'},{label:'货款扣',value:'货款扣'},
  {label:'季度结',value:'季度结'},{label:'在线支付',value:'在线支付'},{label:'到付月结',value:'到付月结'}
]
const cargoType = [
  {label:'煤炭及制品',value:'煤炭及制品'},
  {label:'石油、天然气及制品',value:'石油、天然气及制品'},
  {label:'金属矿石',value:'金属矿石'},
  {label:'钢铁',value:'钢铁'},
  {label:'矿建材料',value:'矿建材料'},
  {label:'水泥',value:'水泥'},
  {label:'木材',value:'木材'},
  {label:'非金属矿石',value:'非金属矿石'},
  {label:'化肥及农药',value:'化肥及农药'},
  {label:'盐',value:'盐'},
  {label:'粮食',value:'粮食'},
  {label:'机械、设备、电器',value:'机械、设备、电器'},
  {label:'轻工原料及制品',value:'轻工原料及制品'},
  {label:'有色金属',value:'有色金属'},
  {label:'轻工医药产品',value:'轻工医药产品'},
  {label:'鲜活农产品',value:'鲜活农产品'},
  {label:'冷藏冷冻货物',value:'冷藏冷冻货物'},
  {label:'商品汽车',value:'商品汽车'},
  {label:'其他',value:'其他'},
]
const deliveryType = [{label:'自提',value:'自提'},{label:'送货',value:'送货'}]
const cargo = [
  {event:'cargo_name_picker_same',level:'cargoList',type:'picker_same',name:'name',title:'货物名称'},
  {event:'cargo_picker_same',level:'cargoList',type:'picker_same',name:'type',title:'货物类型',range:cargoType},
  {event:'cargo_input',level:'cargoList',type:'input',name:'weight',title:'装货重量(吨)'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'volume',title:'装货体积(方)'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'quantity',title:'装货件数'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'unloadWeight',title:'卸货重量(吨)'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'unloadVolume',title:'卸货体积(方)'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'unloadQuantity',title:'卸货件数'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'value',title:'货值(元)'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'remarks',title:'货物备注'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'note1',title:'浇筑部位/倒土方式'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'note2',title:'渣土类型'},
  {event:'cargo_input',level:'cargoList',type:'input',name:'note3',title:'自定义3',hide:true},
  {event:'cargo_input',level:'cargoList',type:'input',name:'note4',title:'自定义4',hide:true}
]
Page({  
  data: {
    sendData64: [],
    deviceId:'',
    serviceId: '',
    characteristicId: '',
    comeOutTime: new Date(),
    printTitle: '中铁建工1号地块',
    printCount: '一',
    msg: {},
    licenceNumberInfo:{},
    cargoList:[],
    consigner:[
      {level:'consigner',title:'发货方',class:'bold',type:'switch',value:false},
      {level:'consigner',type:'picker_same',name:'consignerName',title:'姓名',event:'consignPicker'},
      {level:'consigner',type:'view',name:'consignerPhone',title:'电话'},
      {level:'consigner',type:'view',name:'consignerIdNO',title:'证件号码'},
      {level:'consigner',type:'region',title:'省-市-区',value:[],disabled:true},
      {level:'consigner',type:'view',name:'consignerProvince',title:'省',hide:true},
      {level:'consigner',type:'view',name:'consignerCity',title:'市',hide:true},
      {level:'consigner',type:'view',name:'consignerDistrict',title:'地区',hide:true},
      {level:'consigner',type:'view',name:'consignerAddress',title:'详细地址'}
    ],
    consignee:[
      {level:'consignee',title:'收货方',class:'bold',type:'switch',value:false},
      {level:'consignee',type:'picker_same',name:'consigneeName',title:'姓名',event:'consignPicker'},
      {level:'consignee',type:'view',name:'consigneePhone',title:'电话'},
      {level:'consignee',type:'view',name:'consigneeIdNO',title:'证件号码'},
      {level:'consignee',type:'region',title:'省-市-区',value:[],disabled:true},
      {level:'consignee',type:'view',name:'consigneeProvince',title:'省',hide:true},
      {level:'consignee',type:'view',name:'consigneeCity',title:'市',hide:true},
      {level:'consignee',type:'view',name:'consigneeDistrict',title:'地区',hide:true},
      {level:'consignee',type:'view',name:'consigneeAddress',title:'详细地址'}
    ],
    openBillInfomation:[
      {level:'openBillInfomation',title:'开单信息',class:'bold'},
      {level:'openBillInfomation',type:'datetimes',name:'openTime',title:'开单时间'},
      {level:'openBillInfomation',type:'datetimes',name:'deliveryTime',title:'提货时间'},
      {level:'openBillInfomation',type:'datetimes',name:'appointArriveTime',title:'预计送达时间'},
      {level:'openBillInfomation',type:'input',name:'originalOrderNumber',title:'客户单号'},
      {level:'openBillInfomation',type:'picker_same',name:'businessType',title:'业务类型',range:business},
      {level:'openBillInfomation',type:'input',name:'project',title:'项目'}
    ],
    freightIn:[
      {title:'运费信息',class:'bold'},
      {level:'freightIn',type:'input',name:'serviceFee',title:'服务费'},
      {level:'freightIn',type:'input',name:'freightInAmount',title:'运费'},
      {level:'freightIn',type:'picker_same',name:'freightInPayType',title:'支付方式',range:payType},
      {level:'freightIn',type:'input',name:'settlementName',title:'结算方名称'},
      {level:'freightIn',type:'input',name:'settlementPhone',title:'结算方电话'}
    ],
    carrier:[
      {title:'承运信息',class:'bold'},
      {level:'carrier',type:'input',name:'carNumber',title:'车牌号码'},
      {level:'carrier',type:'picker_same',name:'driverName',title:'司机姓名',range:[],event:"driverPicker"},
      {level:'carrier',type:'input',name:'driverPhone',title:'司机电话'},
      {level:'carrier',type:'input',name:'driverFreight',title:'司机运费'},
      {level:'carrier',type:'input',name:'driverFeePayeeName',title:'承运人'},
      {level:'carrier',type:'input',name:'driverFeePayeePhoneNumber',title:'承运人电话'},
      {level:'carrier',type:'input',name:'driverFeePayeeIdCard',title:'证件号码'},
    ],
    payee:[
      {title:'承运收款信息',class:'bold'},
      {level:'payee',type:'input',name:'driverFeePayeeBankName',title:'银行开户名'},
      {level:'payee',type:'input',name:'driverFeePayeeBankCardNumber',title:'银行卡号'},
      {level:'payee',type:'input',name:'driverFeePayeeName',title:'开户银行名'}
    ],
    others:[
      {title:'其他',class:'bold'},
      {level:'others',type:'input',name:'paymentCollect',title:'代收货款'},
      {level:'others',type:'input',name:'receiptCount',title:'回单数'},
      {level:'others',type:'input',name:'salesman',title:'业务员'},
      {level:'others',type:'input',name:'salesmanPhone',title:'业务员电话'},
      {level:'others',type:'picker_same',name:'deliveryType',title:'提送类型',range:deliveryType},
      {level:'others',type:'input',name:'remarks',title:'备注'},
      {level:'others',type:'input',name:'number',title:'单号',hide:true}
    ],
  },
  consignPicker(e){
    console.log(e)
    var that = this
    let index = e.currentTarget.dataset.index,
    level = e.currentTarget.dataset.level,
    range = e.currentTarget.dataset.range
    api.getRequest('order/customer',{msg:range[e.detail.value].value}).then(res=>{
      console.log(res)
      let info = res.data[0]
      info.provinceCity = info.provinceCity.match(/.+?(省|市|自治区|自治州|盟|县|区|旗|管委会)/g)
      that.setData({
        [[level]+'['+index+'].value']: info.name,
        [[level]+'['+(index+1)+'].value']:info.phoneNumber,
        [[level]+'['+(index+2)+'].value']:info.identityNumber,
        [[level]+'['+(index+3)+'].value']:info.provinceCity,
        [[level]+'['+(index+4)+'].value']:info.provinceCity[0],
        [[level]+'['+(index+5)+'].value']:info.provinceCity[1],
        [[level]+'['+(index+6)+'].value']:info.provinceCity[2],
        [[level]+'['+(index+7)+'].value']:info.address,
      })
    })
  },
  cargoSwitch(e){
    let isChanges = e.detail.value
    let newCargoList = this.data.cargoList.map(row=>{
      row.forEach(item=>{
        if(index == 0){  
        }else if(item.type == 'input' || item.type == 'view'){
          item.type = isChanges ? 'input' : 'view'
        }else if(item.type == 'picker_same'){
          item.disabled = isChanges ? false : true
        }
      })
      return row
    })
    this.setData({cargoList:newCargoList})
  },
  formSwitch(e){
    let index = e.currentTarget.dataset.index,
    level = e.currentTarget.dataset.level
    if(e.detail.value){
      this.setData({[[level]+'['+(index+2)+'].type']:'input'})
      this.setData({[[level]+'['+(index+3)+'].type']:'input'})
      this.setData({[[level]+'['+(index+4)+'].disabled']:false})
      this.setData({[[level]+'['+(index+8)+'].type']:'input'})
    }else{
      this.setData({[[level]+'['+(index+2)+'].type']:'view'})
      this.setData({[[level]+'['+(index+3)+'].type']:'view'})
      this.setData({[[level]+'['+(index+4)+'].disabled']:true})
      this.setData({[[level]+'['+(index+8)+'].type']:'view'})
    }
  },
  goodsDetele(){
    this.setData({cargoList:this.data.cargoList.slice(0,-1)})
  },
  goodsAdd(){
    let arr = [...cargo]
    this.setData({cargoList:[...this.data.cargoList,arr]})
  },
  cargo_input(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level,
        row = e.currentTarget.dataset.row;
     this.setData({
       [[level]+'['+row+']'+'['+index+'].value']:e.detail.value,
     })
  },
  cargo_name_picker_same(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level,
        row = e.currentTarget.dataset.row,
        range = e.currentTarget.dataset.range;
      console.log(row,index)
      console.log(range[e.detail.value].value)
    this.setData({
       [[level]+'['+row+']'+'['+index+'].value']:range[e.detail.value].value,
    })
  },
  cargo_picker_same(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level,
        row = e.currentTarget.dataset.row,
        range = e.currentTarget.dataset.range
      console.log(row,index)
      console.log(range[e.detail.value].value)
     this.setData({
       [[level]+'['+row+']'+'['+index+'].value']:range[e.detail.value].value,
    })
  },
  driverPicker(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level,
        range = e.currentTarget.dataset.range
     this.setData({
       [[level]+'['+index+'].value']:range[e.detail.value].value,
       [[level]+'['+(index+1)+'].value']:range[e.detail.value].phone,
    })
  },
  formDate(e){
    let index = e.currentTarget.dataset.index,
         level = e.currentTarget.dataset.level
       this.setData({
         [[level]+'['+index+'].value']:e.detail.value,
       })
  },
  formPickerDiff(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level
        this.setData({
           [[level]+'['+index+'].value']:e.detail.value,
        })
  },
  formPickerSame(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level,
        range = e.currentTarget.dataset.range
        this.setData({
           [[level]+'['+index+'].value']:range[e.detail.value].value,
        })
  },
  formRegion(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let level = e.currentTarget.dataset.level
    this.setData({
      [[level]+'['+index+'].value']:e.detail.value,
      [[level]+'['+(index+1)+'].value']:e.detail.value[0],
      [[level]+'['+(index+2)+'].value']:e.detail.value[1],
      [[level]+'['+(index+3)+'].value']:e.detail.value[2],
    })
  },
  formInput(e){
    let index = e.currentTarget.dataset.index,
        level = e.currentTarget.dataset.level
    console.log([[level]+'['+index+'].value'])
    this.setData({
      [[level]+'['+index+'].value']:e.detail.value,
    })
},
changeDateTimeColumn(e){
  if(e.detail.column !== 0 && e.detail.column !==1)return
  let dateTime = e.currentTarget.dataset.range.dateTime,
      index = e.currentTarget.dataset.index,
      level = e.currentTarget.dataset.level,
      dateTimeArray = e.currentTarget.dataset.range.dateTimeArray;
  dateTime[e.detail.column] = e.detail.value;
  dateTimeArray[2] = dateTimePicker.getMonthDay(dateTimeArray[0][dateTime[0]], dateTimeArray[1][dateTime[1]]);
  this.setData({[[level]+'['+index+'].range.dateTimeArray']: dateTimeArray});
},
changeDateTime(e){
  let index = e.currentTarget.dataset.index,
      level = e.currentTarget.dataset.level,
      range = e.currentTarget.dataset.range.dateTimeArray,
      valueArr = e.detail.value
  this.setData({[[level]+'['+index+'].range.dateTime']: valueArr});
  this.setData({[[level]+'['+index+'].value']:
  range[0][valueArr[0]]+'-'+range[1][valueArr[1]]+'-'+range[2][valueArr[2]]+' '+range[3][valueArr[3]]+':'+range[4][valueArr[4]]+':'+range[5][valueArr[5]]
  });
},
clearForm(e){
  let sort =  ['openBillInfomation','consigner','consignee','freightIn','carrier','payee','others']
  sort.forEach(name=>{
    this.data[name] && this.data[name].map(item=>{
      if(item.name && (item.type == 'input' || item.type == 'picker_same')){item.value= ''}
      return item})
  })
  sort.forEach(name=>{
    this.setData({[name]:this.data[name]})
  })
  this.setData({cargoList:[[...cargo]]})
},
formSubmit(e){
  let cargoes = this.data.cargoList.map(row=>{
    let obj = {}
    row.forEach(item=>{if(item.name){obj[item.name]=item.value}})
    return obj
  })
  let sort =  ['openBillInfomation','consigner','consignee','freightIn','carrier','payee','others']
  let order = {}
  sort.forEach(name=>{
    let obj = {}
    this.data[name].forEach(item=>{
      if(item.name){ return obj[item.name]=item.value}})
    order[name]=obj
  })
  console.log(cargoes,order)
  var that = this
  let subObj = {
    cargoes: cargoes,
    order: {...order.carrier,...order.consignee,...order.consigner,...order.freightIn,...order.openBillInfomation,...order.others,...order.payee},
  }
  api.getRequest('order/createOrder',{obj:JSON.stringify(subObj)}).then((res)=>{  // order/createOrder
    if(res.result){
      wx.showToast({
        title: '保存成功',
        none: 'none',
        duration: '2000'
      })
      // 打印
      that.setData({printCount:'一'})
      let msg = {
        cargoes: cargoes,
        order: order
      }
      that.setData({msg: msg})
      that.writeBLECharacteristicValue(msg)
    } else {
      wx.showToast({
        title: res.data,
        none: 'none',
        duration: '3000'
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.enableAlertBeforeUnload({
      message: "返回上页",
      success: function (res) {
        console.log("成功：", res);
      },
      fail: function (errMsg) {
        console.log("失败：", errMsg);
      },
    });
    let res = await api.getRequest('order/options',{value:"name", label:"name",table:'erp_customer'})
    let res1 = await api.getRequest('order/customer',{msg:"广州穗番混凝土有限公司"})
    if(options.licenceNumberInfo){
      this.setData({licenceNumberInfo:JSON.parse(options.licenceNumberInfo)})
      // 货物信息赋值
      this.data.cargoList = this.data.licenceNumberInfo.cargoes && this.data.licenceNumberInfo.cargoes.map(item=>{
        let arr = cargo.map(row=>{
          var obj = {...row}
          if(obj.name){obj.value=item[obj.name]};return obj
        })
        return arr
      })
      drivers = this.data.licenceNumberInfo.drivers.map(item=>{return{ label:item.drivername,value:item.drivername,phone:item.driverphone}})
      this.data.carrier[2].range = drivers
      // 数据赋值
      let sort =  ['openBillInfomation','consigner','consignee','freightIn','carrier','payee','others']
      sort.forEach(name=>{
        this.data[name].map(item=>{
          if(item.name && (item.type == 'picker_diff')){ item.value = item.range.findIndex(item=>this.data.licenceNumberInfo.order[item.name]==item.label)}
          else if(item.name){item.value=this.data.licenceNumberInfo.order[item.name]}
          return item})
      })
      if(!this.data.carrier[2].value){this.data.carrier[2].value = drivers[0].value;this.data.carrier[3].value =  drivers[0].phone}
      // 地区赋值
      this.setDistrict('consigner')
      this.setDistrict('consignee')
      //时间选择器
      this.setDatetimes('openBillInfomation')

      sort.forEach(name=>{
        this.setData({[name]:this.data[name]})
      })

      this.setData({cargoList:[...this.data.cargoList]})

      const conkey = this.data.licenceNumberInfo.note4
      api.getRequest('sys/getParameterConfigure',{name:'printTitle', conKey:typeof(conkey)=='undefined'?'title':conkey}).then((res)=>{
        this.setData({printTitle: res.data})
      })
      this.setData({'consigner[1].range':res.data,'consignee[1].range':res.data})
      let newCargoList = this.data.cargoList.map(row=>{
        row.forEach((item,index)=>{
          if(index == 0){  
          }else if(item.type == 'input' || item.type == 'view'){
            item.type = 'view'
          }else if(item.type == 'picker_same'){
            item.disabled = true
          }
        })
        return row
      })
      this.setData({cargoList:newCargoList})
    }
  },
  setDatetimes(name){
    this.data[name].forEach((item)=>{
      if(item.type==='datetimes'){
        console.log(dateTimePicker.getNewDateArry(item.value ? new Date(item.value) : new Date()))
        !item.value && (item.value = utils.formatTime(new Date))
        item.range = dateTimePicker.dateTimePicker(1980, 2100,dateTimePicker.getNewDateArry(item.value ? new Date(item.value) : new Date()),true)
      }
    })
  },
  setDistrict(name){
    this.data[name].forEach((item,index)=>{
      if(item.type==='region'){item.value=[this.data[name][index+1].value,this.data[name][index+2].value,this.data[name][index+3].value]}
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
    var deviceInfo =  wx.getStorageSync('deviceInfo')
    this.setData({
      deviceInfo: deviceInfo,
      deviceId: deviceInfo.deviceId,
      serviceId: deviceInfo.serviceId,
      characteristicId: deviceInfo.characteristicId,
      comeOutTime: new Date(),
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

  },

  //蓝牙打印
  writeBLECharacteristicValue(e) {
    var obj = {}
    const type = e.cargoes[0].name
    if(type!='混凝土'){
      obj = {
        "title": this.data.printTitle,
        "QRData": e.order.others.number,
        "text11":"车  牌:",
        "text12": e.order.carrier.carNumber,
        "text21":"单品名称:",
        "text22": e.cargoes[0].name,
        "text31":"土方单位:",
        "text32": e.order.consigner.consignerName,
        "text41":"工  单:",
        "text42": e.order.others.number,
        "text51":"倒土方式:",
        "text52": e.cargoes[0].note1,
        "text61":"渣土类型:",
        "text62": e.cargoes[0].note2,
        "text71":"方  数:",
        "text72": e.cargoes[0].volume,
        "text81":"出场时间:",
        "text82": utils.formatTime(this.data.comeOutTime),
        "text91":"打印时间:",
        "text92": utils.formatTime(new Date()) + ' (第一次)',
        "text101":'第一联(电子联单)',
      }
    } else {
      obj = {
        "title": this.data.printTitle,
        "QRData": e.order.others.number,
        "text11":"车牌:",
        "text12": e.order.carrier.carNumber,
        "text21":"单品名称:",
        "text22": e.cargoes[0].name,
        "text31":"供货单位:",
        "text32": e.order.consigner.consignerName,
        "text41":"收货单位:",
        "text42": e.order.consignee.consigneeName,
        "text51":"工  单:",
        "text52": e.order.others.number,
        "text61":"浇筑部位:",
        "text62": e.cargoes[0].note1,
        "text71":"本车方量:",
        "text72": e.cargoes[0].volume,
        "text81":"出场时间:",
        "text82": utils.formatTime(this.data.comeOutTime),
        "text91":"打印时间:",
        "text92":utils.formatTime(new Date()) + ' (第'+ this.data.printCount +'次)',
        "text101":'第'+ this.data.printCount +'联(电子联单)',
      }
    }
    var buffer = this.printAQL(obj);
    this.setData({
      sendData64: buffer
    })
    wx.showLoading({
      title: '正在打印...',
      mask: true
    })
    this._writeBLECharacteristicValue(1)
  },
  _writeBLECharacteristicValue(times){
    var that = this
    var sendData64 = that.data.sendData64
    if (sendData64.length >= times) {
      wx.writeBLECharacteristicValue({
        deviceId: this.data.deviceId,
        serviceId: this.data.serviceId,
        characteristicId: this.data.characteristicId,
        value: sendData64[times - 1],
        // value: wx.base64ToArrayBuffer(sendData64[times - 1]),
        success: function (res) {
          that._writeBLECharacteristicValue(++times)
        },
        fail: function (res) {
          that.showTip('数据传输失败')
        }
      })
    }else {
      that.showTip('第'+ this.data.printCount +'联数据传输完成')
      if(this.data.printCount=='一'){

        wx.showActionSheet({
          alertText: '是否打印第二联',
          itemList: ['打印下一联', '重新打印'],
          success (res) {
            console.log(res.tapIndex)
            if(res.tapIndex==0){
              that.setData({printCount: '二'})
              that.writeBLECharacteristicValue(that.data.msg)
            }
            if(res.tapIndex==1){
              that.setData({printCount: '一'})
              that.writeBLECharacteristicValue(that.data.msg)
            }
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
        // wx.showModal({
        //   title:'提示',
        //   content: '一联数据传输完成,是否打印第二联',
        //   cancelColor: '#ff4d00',
        //   success (res) {
        //     if (res.confirm) {
              
        //     } else if (res.cancel) {
        //       console.log('521取消')
        //       wx.showModal({
        //         title:'提示',
        //         content: '是否需要重新打印?',
        //         cancelColor: '#ff4d00',
        //         success (res) {
        //           if (res.confirm) {
        //             that.setData({printCount: '一'})
        //             that.writeBLECharacteristicValue(that.data.msg)
        //           } else if (res.cancel) {
        //             console.log('530取消')
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
      }
      if(this.data.printCount=='二') {
        wx.showToast({
          title: '第二联数据传输成功',
          none: 'none',
          duration: '2000'
        })
        // 打印第二联后返回首页
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/tabPage/home/home',
          })
        }, 500);
      }
    }
  },
  printAQL(e){
    var print = new PrintUtil(998, 1);
    print.align('center')
    print.setMag(3,3)
    print.text(8, 10, 88, e.title)
    print.QRCode(0, 168, 7, e.QRData)
    print.setMag(1,1)
    print.align('LEFT')
    print.text(8, 0, 348, e.text11)
    print.setMag(2, 2)
    print.setBold(1)
    print.text(8, 90, 338, e.text12)
    print.setMag(1, 1)
    print.setBold(0)
    print.text(8, 0, 398, e.text21)
    print.text(8, 110, 398, e.text22)
    print.text(8, 0, 438, e.text31)
    print.text(8, 120, 438, e.text32)
    print.text(8, 0, 478, e.text41)
    print.text(8, 120, 478, e.text42)
    print.text(8, 0, 518, e.text51)
    print.text(8, 120, 518, e.text52)
    print.text(8, 0, 558, e.text61)
    print.text(8, 120, 558, e.text62)
    print.text(8, 0, 598, e.text71)
    print.text(8, 120, 598, e.text72)
    print.text(8, 0, 638, e.text81)
    print.text(8, 120, 638, e.text82)
    print.text(8, 0, 678, e.text91)
    print.text(8, 120, 678, e.text92)
    // print.text(8, 0, 718, e.text93) 
    // print.text(8, 120, 718, e.text)
    print.text(8, 0, 758, e.text101)
    return print.getData()
  },
  showTip(data) {
    wx.hideLoading();
    wx.showToast({
      title: data,
      icon: 'none',
      duration: 1000
    })
  },

})