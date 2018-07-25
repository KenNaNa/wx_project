var app = getApp();
var util = require("../../util/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);

    // 获取公共链接地址
    var baseUrl = app.globalUrl.doubanUrl;
    // 资源链接地址
    var sourceUrl = "";
    var url = ""
    // console.log(options);
    // 根据点击的那个电影类型，跳转到那个页面
    switch(options.categoryname){
      case "正在热映" :
        sourceUrl = "/v2/movie/in_theaters";
        break;
      
      case "即将上映" :
        sourceUrl = "/v2/movie/coming_soon";
        break;
      
      case "排行榜" : 
        sourceUrl = "/v2/movie/top250";
        break;
    }
    url = baseUrl + sourceUrl;
    // 设置电影类型的地址
    // 供下面的下拉加载数据使用
    this.setData({
      url: url
    })

    // 数据请求
    util.https(url, this.callback);

    

    // 数据开始加载
    wx.showNavigationBarLoading();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    // 下拉加载数据，是在一开始的基础上再加载20条数据
    // 获取数据的基地址
    // this.data.totalCount这个数据要怎么加上去
    var url = this.data.url+"?start="+this.data.totalCount+"&count=20";
    util.https(url,this.callback);
  },

  // 回调函数
  callback(res) {
    console.log(res);
    /**
     * 电影名称是变化的
     * 电影海报是变化的
     * 电影评分是变化的
     * 电影星星是变化的
     * 电影的id值
     * 电影的大标题也是变化的
     * */
    var movies = [];
    for (var idx in res.subjects) {
      var subjects = res.subjects[idx];
      //  标题
      var title = subjects.title;
      //  处理标题函数
      if (title.length > 6) {
        title = title.substr(0, 6) + "...";
      }
      // 评分
      var average = subjects.rating.average;
      // 大图片
      var large = subjects.images.large;

      // 电影的id
      var id = subjects.id;

      // 評星处理
      var stars = subjects.rating.stars;
      stars = util.num2Array(stars);

      // 数据整理
      var tempdata = {
        // categoryName: categoryName,这样是不合理的，因为一个大的标题下面带着三条数据
        average: average,
        title: title,
        large: large,
        id: id,
        stars: stars
      }

      // 把数据tempdata放进movies数组中
      movies.push(tempdata);
    }

    // 在数据请求完成之后
    var totalCount=0;
    totalCount = this.data.totalCount += 20;

    // 将上次的数据与这一个请求的数据合并在一起
    var totalMovies = [];

    
    if (!this.data.isEmpty) {// 判断非第一次进来时
      totalMovies = this.data.movies.concat(movies)
    }else{
      // 第一次进来时
      totalMovies = movies;
      // 将标志取反，表示下次进来不是第一次了
      this.data.isEmpty = false;
    }
    

    this.setData({
      movies: totalMovies,
      totalCount: totalCount
    })

    // 数据加载完成把加载小图标隐藏
    wx.hideNavigationBarLoading();
  },





  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动态改变标题
    wx.setNavigationBarTitle({
      title: this.options.categoryname
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  // 下拉刷新
  onPullDownRefresh(){
    var url = this.data.url;

    // 下拉之后数据不能让他重复了，还是原来的20条数据
    this.data.movies = [];
    this.data.isEmpty = true;
    util.https(url,this.callback);
  },

  // 跳转到详情页
  onMovieDetailTap(event){
    var id = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+id
    })
  }
})