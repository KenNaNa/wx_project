// pages/movies/movies.js
var util = require('../util/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheathers:{},
    comingSoon: {},
    top250: {},
    searchData:[],
    totalCount: 0,
    isEmpty: true,

    value: "",

    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheathers = "/v2/movie/in_theaters?start=0&count=3";
    var comingSoon = "/v2/movie/coming_soon?start=0&count=3";
    var top250 = "/v2/movie/top250?start=0&count=3";
    this.https(inTheathers, this.callback, "正在热映", "inTheathers");
    this.https(comingSoon, this.callback, "即将上映","comingSoon");
    this.https(top250, this.callback, "排行榜","top250");
  },

  // http请求函数封装
  https(sourseUrl, callback, categoryName, category){
    wx.request({
      url: app.globalUrl.doubanUrl + sourseUrl,
      header: {
        'content-type': 'application/xml' // 默认值注意这里有个bug就是
      },
      success: function (res) {
        callback(res.data, categoryName, category)
        console.log(res.data);
      }
    })
  },
  callback(res, categoryName, category){
    /**
     * 电影名称是变化的
     * 电影海报是变化的
     * 电影评分是变化的
     * 电影星星是变化的
     * 电影的id值
     * 电影的大标题也是变化的
     * */ 
     var movies = [];
     for(var idx in res.subjects){
       var subjects = res.subjects[idx];
      //  标题
       var title = subjects.title;
      //  处理标题函数
      if(title.length>6){
        title = title.substr(0,6)+"...";
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

    //  处理大标题及其电影数据
    var readyData = {};
    // 一个大标题下带着三条数据以一个对象的形式储存
    readyData[category] = {
      categoryName: categoryName,
      movies: movies
    }


    this.setData(readyData);
    console.log(readyData);
  },

  // 跟多跳转
  movieMoreTap(event){
    // console.log(event);
    var categoryName = event.currentTarget.dataset.categoryname;
    // console.log(categoryName);
    wx.navigateTo({
      url: 'movie-more/movie-more?categoryname='+categoryName,
    })
  },

  onMovieDetailTap(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + id
    })
  },

  onBindFocus:function(e){
    // 获取焦点的时候，把电影类型隐藏
    var containerShow = false;
    var searchPanelShow = true;
    this.setData({
      containerShow: containerShow,
      searchPanelShow: searchPanelShow
    })
  },

  onBindBlur:function(e){
    // var containerShow = true;
    // var searchPanelShow = false;
    // this.setData({
    //   containerShow: containerShow,
    //   searchPanelShow: searchPanelShow
    // })
    // console.log(e);
    // if(e.detail.value){
      // 获取搜索栏的值
      this.setData({
        value: e.detail.value
      })
    // }

  },

  onCancelImgTap:function(e){
    var containerShow = true;
    var searchPanelShow = false;
    // this.data.value = "";直接改变data.value是不会触发视图的
    var value = '';
    this.setData({
      containerShow: containerShow,
      searchPanelShow: searchPanelShow,
      value: value
    })
    console.log(this.data.value);
  },
  onSearch: function(e){
    console.log(this.data.value);
    console.log(app.globalUrl.doubanUrl);
    // 进行网络数据请求
    var value = this.data.value; //请求字段
    var sourceUrl = "/v2/movie/search?q="+value;
    this.setData({
      value: '',
      sourceUrl: sourceUrl
    })

    // 搜索sourceUrl;
    this.https(sourceUrl, this.callback, "搜索电影", "searchData");
    // , "搜索电影","searchData"
  },

  onReachBottom: function (event) {
    // 下拉加载数据，是在一开始的基础上再加载20条数据
    // 获取数据的基地址
    // this.data.totalCount这个数据要怎么加上去
    // var url = app.globalUrl.doubanUrl + this.data.sourceUrl + "&start=" + this.data.totalCount + "&count=20";
    // util.https(url, this.callback_down);
    var sourceUrl = this.data.sourceUrl + "&start=" + this.data.totalCount + "&count=20";
    this.https(sourceUrl, this.callback, "搜索电影", "searchData");
    var totalCount = this.data.totalCount += 20;
    
    this.setData({
      totalCount: totalCount
    })
  },

  // // 回调函数
  // callback_down(res) {
  //   console.log(res);
  //   /**
  //    * 电影名称是变化的
  //    * 电影海报是变化的
  //    * 电影评分是变化的
  //    * 电影星星是变化的
  //    * 电影的id值
  //    * 电影的大标题也是变化的
  //    * */
  //   var searchData = [];
  //   for (var idx in res.subjects) {
  //     var subjects = res.subjects[idx];
  //     //  标题
  //     var title = subjects.title;
  //     //  处理标题函数
  //     if (title.length > 6) {
  //       title = title.substr(0, 6) + "...";
  //     }
  //     // 评分
  //     var average = subjects.rating.average;
  //     // 大图片
  //     var large = subjects.images.large;

  //     // 电影的id
  //     var id = subjects.id;

  //     // 評星处理
  //     var stars = subjects.rating.stars;
  //     stars = util.num2Array(stars);

  //     // 数据整理
  //     var tempdata = {
  //       // categoryName: categoryName,这样是不合理的，因为一个大的标题下面带着三条数据
  //       average: average,
  //       title: title,
  //       large: large,
  //       id: id,
  //       stars: stars
  //     }

  //     // 把数据tempdata放进movies数组中
  //     searchData.push(tempdata);
  //   }

  //   // 在数据请求完成之后
  //   var totalCount = 0;
  //   totalCount = this.data.totalCount += 20;

  //   // 将上次的数据与这一个请求的数据合并在一起
  //   var totalMovies = [];


  //   if (!this.data.isEmpty) {// 判断非第一次进来时
  //     totalMovies = this.data.searchData.concat(searchData)
  //   } else {
  //     // 第一次进来时
  //     totalMovies = searchData;
  //     // 将标志取反，表示下次进来不是第一次了
  //     this.data.isEmpty = false;
  //   }


  //   this.setData({
  //     searchData: totalMovies,
  //     totalCount: totalCount
  //   })

  //   // 数据加载完成把加载小图标隐藏
  //   wx.hideNavigationBarLoading();
  // },

})