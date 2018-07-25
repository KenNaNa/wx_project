var app = getApp();
import util from '../../util/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;//获取到电影的Id值，根据id值去请求电影条目的信息
    // 资源链接
    var sourceUrl = '/v2/movie/subject/';

    // 获取url地址
    var url = app.globalUrl.doubanUrl + sourceUrl + id;
    util.https(url,this.callback);
  },

  callback(res){
    // console.log(res);
    // 获取电影图片
    var large = res.images.large;

    //  获取电影制片国家
    var countries = res.countries[0];

    // 获取电影名称
    var title = res.title;

    // 获取繁体电影名称
    var originalTitle = res.original_title;

    // 获取想看人数
    var wishCount = res.wish_count;

    // 获取短评人数
    var commentsCount = res.comments_count;

    // 获取电影年代
    var year = res.year;

    // 获取电影类型
    var genres = res.genres;

    // 获取評星
    var stars = res.rating.stars;

    // 获取电影评分
    var average = res.rating.average;

    // 获取电影简介
    var summary = res.summary;

    // 获取导演信息
    var directors = res.directors;

    // 获取主演
    var casts = res.casts;

    // 获取主演信息和头像
    


    // 整理数据
    var temp = {
      large: large,
      countries: countries,
      title: title,
      originalTitle: originalTitle,
      wishCount: wishCount,
      year: year,
      genres: util.handlerGenres(genres),
      stars: util.num2Array(stars),
      average: average,
      summary: summary,
      directors: util.handlerDirector(directors),
      casts: util.handlerCastsName(casts),
      castsInfo: util.handlerCastsInfoImage(casts),
      commentsCount: commentsCount
    }

    console.log(temp);
    this.setData({
      movie: temp
    })
    wx.setNavigationBarTitle({
      title: this.data.movie.title
    })
  },

  onReady: function(){
  
  }
})