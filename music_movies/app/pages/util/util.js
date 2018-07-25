// 拆分数组的方法
function num2Array(stars){
  var stars = stars.toString().substring(0,1);
  // 这里不处理半颗星星，只处理整数星星
  var num = Number(stars);
  // 现在有5颗星星
  var starArr = [];
  for(var i=0;i<5;i++){
    if(i<num){
      starArr.push(1);
    }else{
      starArr.push(0);
    }
  }

  return starArr;
};

// 网络请求的函数
// http请求函数封装
function https(url, callback){
  wx.request({
    url: url,
    method: "GET",
    header: {
      'content-type': 'application/xml' // 默认值注意这里有个bug就是
    },
    success: function (res) {
      callback(res.data)
      // console.log(res.data);
    }
  })
}
// 处理导演的信息
function handlerDirector(directors){
  var director = {};
  // 判断导演头像是否存在
  if(directors[0].avatars!=null){
    if(directors[0].avatars.large!=null){
      director.avatars = directors[0].avatars.large;
    }
    director.name = directors[0].name;
    director.id = directors[0].id;
  }

  return director;
}

// 处理演员的名称
// 以‘/’隔开
function handlerCastsName(casts){
  var str = "";
  for(var i=0; i < casts.length; i++){
    str += casts[i].name + ' / ';
  }
  return str.substring(0,str.length-3);
}

// 处理演员信息与头像
function handlerCastsInfoImage(casts){
  var castsArray = [];
  for(var i=0; i<casts.length; i++){
    var cast = {
      image: casts[i].avatars ? casts[i].avatars.large : "",
      name: casts[i].name
    }
    castsArray.push(cast);
  }

  return castsArray;
}

// 处理电影类型
function handlerGenres(genres){
  return genres.join("，");
}
module.exports = {
  num2Array: num2Array,
  https: https,
  handlerCastsName: handlerCastsName,
  handlerCastsInfoImage: handlerCastsInfoImage,
  handlerDirector: handlerDirector,
  handlerGenres: handlerGenres
}