var firebaseConfig = {
  apiKey: "AIzaSyBDg620nc4dxyEfKQTEfVMaiaXomzzZ5J0",
  authDomain: "viron-57745.firebaseapp.com",
  databaseURL: "https://viron-57745.firebaseio.com",
  projectId: "viron-57745",
  storageBucket: "viron-57745.appspot.com",
  messagingSenderId: "849415377120",
  appId: "1:849415377120:web:e8eb93fc8fe48101e54085"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
const tag = '1'
var storage = firebase.storage();
var storageRef = storage.ref();
let ref;
let storef;
let now_year;
var queryString = new Array();
if (queryString.length == 0) {
  if (window.location.search.split('?').length > 1) {
    var params = window.location.search.split('?')[1].split('&');
    for (var i = 0; i < params.length; i++) {
      var key = params[i].split('=')[0];
      var value = decodeURIComponent(params[i].split('='));
      now_year = value.split('/')[0] - 0
      ref = database.ref('projects/' + value)
      storef = storage.ref('project-area/' + value)
      queryString[key] = value;
    }
  }
}
ref.once('value', function (sdata) {
  var client = sdata.hasChild("client") ? sdata.val()["client"] : ""
  var area = sdata.hasChild("area") ? sdata.val()["area"] : ""
  var status = sdata.hasChild("status") ? sdata.val()["status"] : ""
  var collabo = sdata.hasChild("collaboration") ? sdata.val()["collaboration"] : ""
  var location = sdata.hasChild("location") ? sdata.val()["collaboration"] : ""
  $(".project_outline").append('<div class="outline-item"><strong>Client: </strong>' + client + '</div>')
  $(".project_outline").append('<div class="outline-item"><strong>Area: </strong>' + area + '</div>')
  $(".project_outline").append('<div class="outline-item"><strong>Status: </strong>' + status + '</div>')
  $(".project_outline").append('<div class="outline-item"><strong>Location: </strong>' + location + '</div>')
  $(".project_outline").append('<div class="outline-item"><strong>Collaboration: </strong><br>' + collabo + '</div>')
  var title = sdata.hasChild('/name') ? sdata.val()["name"] : ""
  var subtitle = sdata.hasChild('/subtitle') ? sdata.val()["subtitle"] : ""
  $(".project-title").text(title)
  $('.project-subtitle').text(subtitle)
  var length = sdata.hasChild('/paragraph/text') ? sdata.val()["paragraph"]["text"].length : 0
  var txt = sdata.hasChild('/paragraph/text') ? sdata.val()["paragraph"]["text"] : ""
  for (var i = 0; i < length; i++) {
    $('.project_describe').children("article").append('<div class="box"><p>' + txt[String(i)] + '</p></div>')
  }
})
storef.listAll().then(function (reso) {
  let check = true;
  $('.clicked_pj_slide').append('<i class="fas fa-chevron-right modal-direction modal-right"></i>')
  $('.clicked_pj_slide').append('<i class="fas fa-chevron-left modal-direction modal-left"></i>')
  reso.items.forEach(function (itemRef) {
    itemRef.getDownloadURL().then(function (url) {
      let active_class = check ? 'now_on' : ''
      check = false;
      $('.clicked_pj_slide').append('<div class="slide ' + active_class + '"><img class="animate__animated animate__fadeIn" src="' + url + '" alt=""></div>')
    })
  })
})

$(document).on('click', '.modal-right', function () {
  let len = $('.slide').length
  let cur_now_on = $('.now_on').index() - 2
  $('.now_on').removeClass('now_on')
  if (cur_now_on !== len - 1) {
    $('.slide').eq(cur_now_on + 1).addClass('now_on')
  } else {
    $('.slide').eq(0).addClass('now_on')
  }
})
$(document).on('click', '.modal-left', function () {
  let len = $('.slide').length
  let cur_now_on = $('.now_on').index() - 2
  $('.now_on').removeClass('now_on')
  if (cur_now_on !== 0) {
    $('.slide').eq(cur_now_on - 1).addClass('now_on')
  } else {
    $('.slide').eq(len - 1).addClass('now_on')
  }
})