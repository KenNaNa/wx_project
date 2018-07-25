var newsData = require('../../data/newsData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这个setData是指更新数据到上面那个data:{}对象里面去
    this.setData(newsData.newsData[options.newsId]);
    this.setData({
      newsId: options.newsId
    });

    // 第一次进入视图时判断是否收藏和是否有本地储存
    var newsCollect = wx.getStorageSync("newsCollect");
    // 如果存在则代表以前收藏过，或者以前取消过收藏
    if(newsCollect){
      var newCollect = newsCollect[this.newsId];
      this.setData({
        selected: newCollect
      })
    } else {// 如果不存在则给当前的一个默认值
      var newsCollect = {};
      newsCollect[options.newsId] = false;
      // 设置到缓存里面去
      wx.setStorageSync("newsCollect", newsCollect);
    }
    
    /**
     * 测试本地存储
     * wx.setStorageSync(KEY,DATA)
     * key-> 本地缓存中的指定的 key
     * data-> 需要存储的内容
     *  wx.setStorageSync("key", "value");
     * const value = wx.getStorageSync("key");
     * console.log(value);
     * wx.removeStorageSync("key");
     * */ 
  },
  onCollected(event){
    // 这个是处理点击收藏
    /**
     * 数据收藏的格式
     * var newsCollect = {
     *    0: true,
     *    1: false,
     *    2: true
     * }
     *
     * */
    //  获取到本地存储的集合
     var newsCollect = wx.getStorageSync("newsCollect");
    // 接下来就是要获取点击的newsId;
    // 我们要根据这个newsId来获取当前点击收藏或者不收藏
    var newCollect = newsCollect[this.data.newsId];
    // console.log(newCollect);//这里是undefined
    newCollect = !newCollect;//取反
    // 我们要把它更新到本地储存里面去
    newsCollect[this.data.newsId] = newCollect;
    wx.setStorageSync("newsCollect", newsCollect);
    console.log(newsCollect);
    // 更新到视图里面去
    this.setData({
      //现在不知道视图怎么更新的，现在我们到news-detail.wxml更改一下
      selected: newCollect
    });


    // 显示收藏和取消收藏的提示
    // 根据options.newsId去判断
    wx.showToast({
      title: newsCollect[this.data.newsId]?"收藏成功":"取消收藏",
      icon: 'success',
      duration: 800,
      mask: true
    })
  },
  shareTap(){
    // 模态框
    // wx.showModal({
    //   title: '分享',
    //   content: '这是一个分享弹窗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    // wx.showActionSheet(OBJECT)
    wx.showActionSheet({
      itemList: ['分享到微信', '分享到微博', '分享到QQ'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },


  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: newsData.newsData[this.data.newsId].title, // 分享标题
      desc: '和音乐一起分享时光', // 分享描述
      path: 'http://www.iwen.wiki/blog' // 分享路径
    }
  },

  playMusic(event){
    var that = this;
    // 判断是否播放
    // 获取当前的newsId以及播放
    var newsId = event.currentTarget.dataset["newsid"];
    var url = newsData.newsData[newsId].music.url;
    var coverImgUrl = newsData.newsData[newsId].music.coverImg;
    var title = newsData.newsData[newsId].music.title;
    var isPlay = this.data.isPlay;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    // 因为第一次打印出来是undefined 所以将它转换为false
    // backgroundAudioManager.paused = !!backgroundAudioManager.paused;
    // console.log(backgroundAudioManager.paused);
    
    if (isPlay){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlay: false
      })
      console.log(backgroundAudioManager.paused);
    }else{
      wx.playBackgroundAudio({
        dataUrl: url,
        title: title,
        coverImgUrl: coverImgUrl
      });
      this.setData({
        isPlay: true
      })
      console.log(backgroundAudioManager.paused);
    }
    // 监听音乐播放
    wx.onBackgroundAudioPlay(function(){
      console.log("音乐正在播放");
    })
    // 监听是否暂停播放或者关闭播放
    wx.onBackgroundAudioPause(function(){
      console.log("音乐已经暂停");
    })

    // 监听音乐是否停止
    wx.onBackgroundAudioStop(function(){
      console.log("音乐已经停止");
      that.setData({
        isPlay: false
      })
    })
    

    // const backgroundAudioManager = wx.getBackgroundAudioManager();
    // console.log(backgroundAudioManager);
    // if (!backgroundAudioManager.paused){
    //   backgroundAudioManager.title = title;
    //   backgroundAudioManager.src = url;
    //   backgroundAudioManager.coverImgUrl = coverImgUrl;
    //   backgroundAudioManager.play();
    //   console.log(backgroundAudioManager.paused)
    //   backgroundAudioManager.paused = !backgroundAudioManager.paused;
    //   this.setData({
    //     player:true
    //   })
    // }else{
    //   backgroundAudioManager.pause();
    //   backgroundAudioManager.paused = !backgroundAudioManager.paused;
    //   this.setData({
    //     player:false
    //   })
    // }
    // // wx.playBackgroundAudio({
    // //   dataUrl: url,
    // //   title: title,
    // //   coverImgUrl: coverImgUrl
    // // })
  }
})