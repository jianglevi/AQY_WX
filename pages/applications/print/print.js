// pages/applications/print/print.js
const ToBase64 = require('../../../utils/print/base64gb2312.js');
const cpclExp = require('../../../utils/print/cpcl-exp.js');
const cpclAql = require('../../../utils/print/cpcl-aql.js');
const {PrintUtil} = require('../../../utils/print/PrintUtil.js');
const utils = require('../../../utils/util')

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}
// ArrayBuffer转16进度字符串
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    connected: false,
    chs: [],
    cpclAql:'',
    sendData64: [],
    deviceId:'',
    serviceId: '',
    characteristicId: '',
    showM: false,
    remark: '',
    remarkIndex:'',
    sysPlatform:'',
  },

  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log(45)
        console.log(res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          this.showTip('请打开蓝牙')
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },

  showActionSheet(e){
    var that = this;
    console.log(95)
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var devices = that.data.devices;
    var deviceId = e.currentTarget.dataset.deviceId;
    console.log(devices)
    console.log(deviceId)
    wx.showActionSheet({
      itemList: ['连接', '设置备注', '删除'],
      success: function (res) {
        switch (res.tapIndex){
          case 0: //区分安卓和ios设备
            if (that.data.sysPlatform == 'ios'){
              that.createBLEConnection(e)
            }else{
              setTimeout(function(){
                that.createBLEConnection(e)
              },1000)
            }
            break;
          case 1: that.setRemark(index); break;
          case 2: that.deletePrint(index); break;
        }
      }
    })
  },
  createBLEConnection(e) {
    console.log(114)
    console.log(e)
    // var data = cpclExp.val
    // var data = cpclAql.val
    // console.log(data)
    // this.cutCommand(data)
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    wx.showLoading({
      title: 'Loding...',
    })
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        wx.hideLoading()
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        
        // wx.setStorageSync('connected', true)
        // wx.setStorageSync('name', name)
        // wx.setStorageSync('devices', this.data.devices)

        console.log(137)
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  getBLEDeviceServices(deviceId) {
    console.log(137)
    console.log(deviceId)
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log(142)
        console.log(res)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    console.log(154)
    console.log(deviceId, serviceId)
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log(160)
        console.log(res)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            console.log(165)
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) {
            console.log(173)
            this.setData({
              canWrite: true
            })
            // this._deviceId = deviceId
            // this._serviceId = serviceId
            // this._characteristicId = item.uuid
            this.setData({
              deviceId : deviceId,
              serviceId : serviceId,
              characteristicId : item.uuid
            })

            var deviceInfo = {
              deviceId: deviceId,
              serviceId: serviceId,
              characteristicId: item.uuid,
              canWrite: true,
              name: this.data.name,
              // connected: true,
              devices: this.data.devices
            }
            wx.setStorageSync('deviceInfo', deviceInfo)
            // wx.setStorageSync('deviceId', deviceId)
            // wx.setStorageSync('serviceId', serviceId)
            // wx.setStorageSync('characteristicId', item.uuid)
            // wx.setStorageSync('canWrite', true)
            console.log(185)
            // this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            console.log(192)
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      data[`chs[${this.data.chs.length}]`] = {
        uuid: characteristic.characteristicId,
        value: ab2hex(characteristic.value)
      }
      this.setData(data)
    })
  },

  writeBLECharacteristicValue(e) {
    var obj1 = {
      "title":"中铁建工1号地块",
      "QRData":"20210524",
      "text11":"车牌:",
      "text12":"粤ACC682",
      "text21":"单品名称:",
      "text22":"牛奶",
      "text31":"土方单位:",
      "text32":"成都市恒辉商品混凝土有限责任公司",
      "text41":"工  单:",
      "text42":"1959-002623",
      "text51":"倒土方式:",
      "text52":"指定渣土场(二局码头)",
      "text61":"土的类型:",
      "text62":"一类土",
      "text71":"方  数:",
      "text72":"14.75",
      "text81":"出场时间:",
      "text82":"2021-05-07 16:28:47",
      "text91":"打印时间:",
      "text92":utils.formatTime(new Date()) + ' (第一次)',
      "text101":'第一联(电子联单)',
    }
    var obj2 = {
      "title":"中铁建工1号地块",
      "QRData":"20210524",
      "text11":"车牌:",
      "text12":"粤ACC682",
      "text21":"单品名称:",
      "text22":"牛奶",
      "text31":"供货单位:",
      "text32":"汕头市华发货运有限公司",
      "text41":"收货单位:",
      "text42":"上海弘项物流有限公司",
      "text51":"工  单:",
      "text52":"SJ2012231311284749",
      "text61":"浇筑部位:",
      "text62":"其他",
      "text71":"本车方量:",
      "text72":"820",
      "text81":"出场时间:",
      "text82":"2021-05-07 16:28:47",
      "text91":"打印时间:",
      "text92":utils.formatTime(new Date()) + ' (第一次)',
      "text101":'第一联(电子联单)',
    }
    var buffer = this.printAQL(obj1);
    console.log(232)
    console.log(buffer);
    this.setData({
      sendData64: buffer
    })
    wx.showLoading({
      title: '正在传输...',
      mask: true
    })
    this._writeBLECharacteristicValue(1)
  },
  _writeBLECharacteristicValue(times){
    var that = this
    console.log(times)
    var sendData64 = that.data.sendData64
    console.log(sendData64[times - 1])
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
          that.showTip('传输失败');
          // that.closeBLEConnection()
        }
      })
    }else {
      that.showTip('传输完成')
      // that.closeBLEConnection()
    }
  },

  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
      deviceId: '',
    })
    wx.removeStorageSync('deviceInfo')
    // wx.setStorageSync('connected', false)
    // wx.setStorageSync('canWrite', false)
  },

  //设置备注
  setRemark(index){
    var that = this;
    var list = that.data.devices;
    that.setData({
      showM: true,
      remarkIndex: index
    })
    if (list[index].hasOwnProperty('remark')){
      that.setData({
        remark: list[index].remark
      })
    }else{
      that.setData({remark: ''})
    }
  },
  //删除打印机
  deletePrint(index){
    var _this = this;
    wx.showModal({
      content: '确认删除打印机？',
      success: function (res) {
        if (res.confirm) {
          _this.stopBluetoothDevicesDiscovery()
          var list = _this.data.devices;
          list.splice(index, 1);
          _this.upListdata(list);
        }
      }
    })
  },
  inputRemark:function(e){
    this.setData({
      remark:e.detail.value
    })
  },
  cancelR(){
    this.setData({
      showM: false
    })
  },
  confirmR(){
    console.log(310)
    var val = this.data.remark;
    wx.setStorageSync('remark', val)
    var index = this.data.remarkIndex;
    var list = this.data.devices;
    console.log(val, index, list)
    list[index].remark = val;
    this.upListdata(list);
    this.cancelR();
  },
  upListdata(list){
    this.stopBluetoothDevicesDiscovery()
    this.setData({
      devices: list
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  showTip(data) {
    wx.hideLoading();
    wx.showModal({
      content: data,
      showCancel: false
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('连接蓝牙成功之后关闭蓝牙搜索');
      }
    })
  },
  cutCommand(data) {
    var sendData64 = [];
    var packageLength = 15;
    for (let i = 0; i < Math.ceil(data.length / packageLength); i++) {
      sendData64[i] = wx.base64ToArrayBuffer(ToBase64.encode64gb2312(data.substr(i * packageLength, packageLength)));
    }
    console.log(sendData64);
    this.setData({
      sendData64: sendData64
    })
  },

  printAQL(e){
    console.log(439)
    console.log(e)
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
    print.text(8, 90, 328, e.text12)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sysPlatform: res.platform
        })   
      }
    })
    wx.getSetting({
      success(res){
        console.log(res)
        if(!res.authSetting['scope.userLocation']){
          wx.authorize({
            scope: 'scope.userLocation',
            success(){
              console.log('用户定位')
            },
            fail(){
              wx.showToast({
                title: '需要打开位置权限',
                icon:'none'
              })
            }
          })
        }
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
    console.log(549)
    var deviceInfo = wx.getStorageSync('deviceInfo')
    console.log(deviceInfo)
    if(deviceInfo){
      console.log(552)
      this.setData({
        devices: deviceInfo.devices,
        name: deviceInfo.name,
        deviceId: deviceInfo.deviceId,
        serviceId: deviceInfo.serviceId,
        characteristicId: deviceInfo.characteristicId,
        canWrite: deviceInfo.canWrite,
      })
    }
    var remark = wx.getStorageSync('remark')
    this.setData({
      remark: remark
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