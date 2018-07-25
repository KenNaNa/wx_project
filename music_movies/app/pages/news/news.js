const newsData = require('../data/newsData.js');
Page({
  data:{
    indicatorDots:true,
    autoplay:true,
    interval:2000,
    circular:true,
    imageUrl:[
      '../images/banner1.jpg',
      '../images/banner2.jpg',
      '../images/banner3.jpg'
    ]
  },
  onLoad(){
    this.setData({
      newsData: newsData.newsData
    })
  },
  goToNewsDetail(event){
    // console.log(1);
    console.log(event);
    var newsId = event.currentTarget.dataset.newsid;
    console.log(newsId);
    wx.navigateTo({
      url: 'news-detail/news-detail?newsId=' + newsId,
    })
  }

})