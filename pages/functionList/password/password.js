
const api = require('../../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    writeInfo:[
      {title:'原密码',name:'oldPwd',type:'input',event:'oldPwd',input:'password'},
      {title:'新密码',name:'newPwd',type:'input',event:'newPwd',input:'password'},
      {title:'确认密码',name:'newPwdAgain',type:'input',event:'newPwdAgain',input:'password'}    
]
  },
  // formDate(e){
  //   let index = e.currentTarget.dataset.index
  //   this.setData({
  //     ['writeInfo['+index+'].value']:e.detail.value
  //   })
  // },
  oldPwd:function(e){
    let password = e.detail.value
    this.setData({
      oldPwd: password
    })
    if (password == '') {
      wx.showToast({
        title: '原密码不能为空，请输入密码!',
        icon: 'none',
      });
      return
    }
    var username=wx.getStorageSync('username')
    console.log(username)
    wx.request({
      url: 'login/ajaxLogin', 
      data: {
        username: wx.getStorageSync('username'),
        password: password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        //console.log(res)
        if (res.data.result==1) {
          console.log("原密码正确")
        }
        else if(res.data.msg=="出错过多，账号已被锁定，10分钟后重试！"){
          console.log("出错过多，账号已被锁定，10分钟后重试！")
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          });
        }  else {
          console.log("原密码不正确")
          wx.showToast({
            title: '原密码不正确，请重新输入!',
            icon: 'none',
          });
          return
        }
      }
    })
    // }else if (password!=123){
    //   wx.showToast({
    //     title: '原密码不正确，请重新输入!',
    //     icon: 'none',
    //   });
    //   return false
    // }
  },
  newPwd(e) {
    let newPwd = e.detail.value
    this.setData({
      newPwd: newPwd
    })
    // if (newPwd == '') {
    //   wx.showToast({
    //     title: '新密码不能为空，请输入密码!',
    //     icon: 'none',
    //   });
    //   return false
    // }

  },
  newPwdAgain(e) {
    let newPwdAgain = e.detail.value
    this.setData({
      newPwdAgain: newPwdAgain
    })
    // if (newPwdAgain == '') {
    //   wx.showToast({
    //     title: '二次确认密码不能为空，请输入密码!',
    //     icon: 'none',
    //   });
    //   return false
    // }
    // if (newPwdAgain != this.data.newPwd){
    //   wx.showToast({
    //     title: '两次密码输入不一致，请重新输入!',
    //     icon: 'none',
    //   })
    //   return false
    // }
  },
  formSubmit: function (e) {
    let input = e.detail.value
    console.log(input);
    var oldPwd=this.data.oldPwd
    var newPwd=this.data.newPwd
    var newPwdAgain=this.data.newPwdAgain
    if (oldPwd == '') {
      wx.showToast({
        title: '原密码不能为空，请输入密码!',
        icon: 'none',
      });
      return
    }
    
    if (newPwd == '') {
      wx.showToast({
        title: '新密码不能为空，请输入密码!',
        icon: 'none',
      });
      return
    }

    if (newPwdAgain == '') {
      wx.showToast({
        title: '二次确认密码不能为空，请输入密码!',
        icon: 'none',
      });
      return
    }
    if (newPwdAgain != newPwd){
      wx.showToast({
        title: '两次密码输入不一致，请重新输入!',
        icon: 'none',
      })
      return
    }
    console.log(143)
    api.getRequest('login/ajaxLogin', { username: wx.getStorageSync('username'),password: oldPwd}).then(res =>{
      console.log(154)
      console.log(res)
      if (res.result==1) {
        console.log("确认时原密码正确")
        wx.setStorageSync('session','token='+res.session)
        wx.showModal({
          title: '提示',
          content: '确定要修改密码吗？',
          success: function (sm) {
            if (sm.confirm) {
              console.log(oldPwd,newPwd,newPwdAgain)
              var args={
                oldPwd:oldPwd,
                newPwd:newPwd,
                newPwdAgain:newPwdAgain
              }
              console.log(160)
              api.getRequest('sys/updateUser',args).then(function(pr){
                console.log(162)
                console.log(pr.result)
                if (pr.result) {
                  wx.setStorage({
                    key: "password",
                    data: ""
                  });
                  wx.showModal({
                    title: '修改密码成功！',
                    content: '请重新登录',
                    success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定')
                      }else{
                          console.log('用户点击取消')
                      }
                    }
                })
                api.getRequest('login/ajaxLogout', {}).then(function (ar) {
                  if (ar.result) {
                    console.log("成功退出")
                  } else {
                    console.log("退出失败")
                  }
                })
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                } else {
                  wx.showToast({
                    title: '修改密码失败!',
                    icon: 'none',
                  });
                }
              })
              console.log(197)
            } else if (sm.cancel) {
              console.log('用户点击取消')
            }
            }
          })
      }else if(res.msg=="出错过多，账号已被锁定，10分钟后重试！"){
        console.log("出错过多，账号已被锁定，10分钟后重试！")
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
      } else {
        console.log("确认时原密码不正确")
        wx.showToast({
          title: '原密码不正确，请重新输入!',
          icon: 'none',
        });
        return
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