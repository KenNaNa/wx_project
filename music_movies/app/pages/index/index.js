Page({
  goNewsTap:function(event){
    console.log(event);
    console.log("跳转吧");
    //点击跳转到news页面
    // 跳转到tabBar
    // wx.switchTab({
    //   url: '../news/news',
    // })

    wx.switchTab({
      url: '../news/news',
    })
  }
})
