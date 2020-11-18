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
var storage = firebase.storage();
var storageRef = storage.ref();
const tag = '1'
// (() => {

// })()
const get_media_id = async () => {
  let url_array = new Array()
  await $.ajax({
    type: 'GET',
    url: 'https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,username,timestamp,children,user_profile&access_token=IGQVJVcUYyRk9HZAER5NzFrZA3k5ZAUd4bl8wTDdTeFZA5M1Foai1pWm1rTGJGU1FqNE83dmZAvbUtTb205ZAjZAQdkRtdXpRV0w0em9wUmVvOHNLWWRPQ3VhWHIyLWpPbFNvVDdEemlKak9R',
    cache: false,
    dataType: 'json',
    success: function (data) {
      try {
        url_array = data
      } catch (err) {}
    }
  });
  return url_array
}

const get_children = async (media_id) => {
  let url_array = new Array()
  await $.ajax({
    type: 'GET',
    url: 'https://graph.instagram.com/' + media_id + '/children/?fields=id,media_type,media_url,timestamp&access_token=IGQVJVcUYyRk9HZAER5NzFrZA3k5ZAUd4bl8wTDdTeFZA5M1Foai1pWm1rTGJGU1FqNE83dmZAvbUtTb205ZAjZAQdkRtdXpRV0w0em9wUmVvOHNLWWRPQ3VhWHIyLWpPbFNvVDdEemlKak9R',
    cache: false,
    dataType: 'json',
    success: function (data) {
      try {
        url_array = data
      } catch (err) {}
    }
  });
  return url_array
}

let caption_arr = new Object()
let date_arr = new Object()
let img_arr = new Object()
async function load_html() {
  const arr = await get_media_id();
  arr["data"].forEach((d) => {
    caption_arr[d.id] = d.caption
    date_arr[d.id] = d.timestamp
    img_arr[d.id] = d.media_url
    $('.grid').append('<div class="box animate__animated animate__fadeIn ' + d.id + '"><img class="thumbnail" src="' + d.media_url + '" alt=""></div>')
    if (d.children) {
      $('.' + d.id).append('<i class="fas fa-clone album"></i>')
    }
    $('.' + d.id).append('<div class="box-caption">' + d.caption + '</div>')
    $('.' + d.id).attr('data-id', d.id);
    $('.' + d.id).attr('data-children', d.children !== undefined ? 'y' : 'n')
  })
}
load_html()
$(document).on('click', '.dot, .modal-direction', (event) => {
  let clicked_class = event.currentTarget
  let imglist = $(".modal-img-box").find('img')
  let leng = imglist.length
  let idx
  if (clicked_class.className.includes('dot')) {
    idx = clicked_class.classList[3].replace('th_dot', "")
  } else {
    if (clicked_class.className.includes("right")) {
      idx = $('.dots').children('.active-dot').index() + 1
    } else {
      idx = $('.dots').children('.active-dot').index() - 1
    }
  }
  if (leng - 1 === idx) {
    del_slide_btn('right')
  } else {
    add_slide_btn('right')
  }

  if (idx === 0) {
    del_slide_btn('left')
  } else {
    add_slide_btn('left')
  }

  $('.modal-img-box').children('img').eq(idx).addClass('active-img')
  $('.modal-img-box').children('img').eq(idx).siblings().removeClass('active-img')
  $('.dots').children().removeClass('active-dot')
  $('.dots').children().eq(idx).addClass('active-dot')
})

function add_slide_btn(direction) {
  if ($('.modal-img-box').children('.modal-' + direction).length) {
    return
  } else {
    if (direction === 'right') {
      $('.modal-img-box').append('<i class="fas fa-chevron-right modal-direction modal-right"></i>')
    }
    if (direction === 'left') {
      $('.modal-img-box').append('<i class="fas fa-chevron-left modal-direction modal-left"></i>')
    }
  }
}

function del_slide_btn(direction) {
  if (direction === 'right') {
    $('.modal-img-box').children('.modal-right').remove()
  }
  if (direction === 'left') {
    $('.modal-img-box').children('.modal-left').remove()
  }
}
$(document).on({
  mouseenter: function (event) {
    $('.' + event.currentTarget.classList[3]).children('img').animate({
      opacity: "0.4"
    }, 200)
    $('.' + event.currentTarget.classList[3]).children('.box-caption').fadeIn(200)
  },
  mouseleave: function (event) {
    $('.' + event.currentTarget.classList[3]).children('img').animate({
      opacity: "1"
    }, 0)
    $('.' + event.currentTarget.classList[3]).children('.box-caption').hide()
  }
}, ".box")
$(document).on("click", ".box", async (event) => {
  event.preventDefault();
  $('.header-wrapper').addClass('header-back')
  wrapWindowByMask();
  $('.modal').addClass('on')
  let check_children = event.currentTarget.attributes["data-children"].value
  let media_id = event.currentTarget.attributes["data-id"].value
  $('.modal-date').html('<p>' + date_arr[event.currentTarget.classList[3]].split('T')[0] + '</p>')
  $('.modal-article').html('<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + caption_arr[event.currentTarget.classList[3]] + '</p>')
  if (check_children === 'y') {
    const arr = await get_children(media_id);
    add_slide_btn('right')
    let arr_len = arr["data"].length
    let active_dot = "active-dot"
    for (let i = 0; i < arr_len; i++) {
      $('.dots').append('<i class="fas fa-circle dot ' + i + 'th_dot' + ' ' + active_dot + '"></i>')
      active_dot = ""
    }
    let classname = "class=active-img"
    arr["data"].forEach((d) => {
      $('.modal-img-box').append('<img ' + classname + ' src="' + d.media_url + '" alt="">')
      classname = ""
    })
  } else {
    let url = img_arr[media_id]
    $('.modal-img-box').append('<img class="active-img" src="' + url + '" alt="">')
  }
  $('.modal').css('display', 'flex')
})

$(function () {
  $("body").click(function (e) {
    if ($('.modal').hasClass('on')) {
      if (!$('.modal').has(e.target).length) {
        $('.modal').removeClass('on')
        $('.modal').css('display', 'none')
        $('.modal-img-box').children('img').remove()
        $('.dots').children().remove()
        $('.gallery').css('display', 'block')
        $('.mask').hide()
        $('.header-wrapper').removeClass('header-back')
      }
    }
  })
  $('.modal-exit').click(function () {
    $('.modal').removeClass('on')
    $('.modal').css('display', 'none')
    $('.modal-img-box').children('img').remove()
    $('.dots').children().remove()
    $('.gallery').css('display', 'block')
    $('.mask').hide()
    $('.header-wrapper').removeClass('header-back')
  })
})