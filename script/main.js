aa()

$(window).on('load', function(){
  $('.before_load').addClass('animate__animated animate__bounceOutLeft')
  setTimeout(() => {
    $('.before_load').css('display','none')
  }, 2000);
});
async function aa() {
  await append_menu()
  if(tag !== 'index'){
    let href_path = window.location.href.split('/')
    let cut_idx = href_path[href_path.length - 1].indexOf('.')
    let href_loc = href_path[href_path.length - 1].slice(0, cut_idx)
    let clicked_check = false;
    if(href_path[href_path.length - 2].split('?')[0] ==='project_clicked.html'){
      href_loc ='projects'
      clicked_check = true
    }
    if (href_loc !== 'projects') {
      let parent_node = $('.' + href_loc + '-item').parent().parent()
      console.log(parent_node)
      let parent_node_name = parent_node[0].classList[parent_node[0].classList.length - 1]
      $('.' + parent_node_name).addClass('clicked_menu')
      $('.' + parent_node_name).children('ul').show()
      $('.' + href_loc+'-item').addClass('clicked_menu')
    } else {
      let cnt = clicked_check ? -2 : -1
      let current_path = href_path[href_path.length + cnt].split('?')[1].replace('%20', ' ').replace('#', '').replace('none','')
      $('.projects').addClass('clicked_menu')
      $('.projects').children('ul').css('display','flex')
      $('.projects').addClass('on')
      $('.' + current_path).addClass('clicked_menu')
    }
  }
}

let year_name_arr = new Array()
async function append_menu() {
  var pj_menu_Ref = storageRef.child('project-area');
  await pj_menu_Ref.listAll().then(async (res) => {
    await res.prefixes.forEach(function (folderRef) {
      if (isNaN(Number(folderRef.name))) {
        $('.pj-drop').prepend('<li class="active-menu ' + folderRef.name.replace(' ', '') + '"><a>' + folderRef.name.replace(' ', '') + '</a></li>')
      } else {
        year_name_arr.push(folderRef.name)
      }
    });
  }).catch(function (error) {});
  for (let year in year_name_arr) {
    $('.pj-drop').prepend('<li class="active-menu ' + year_name_arr[year] + '"><a>' + year_name_arr[year] + '</a></li>')
  }
}

function wrapWindowByMask() {
  //화면의 높이와 너비를 구한다.
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();
  //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
  $('.mask').css({
    'width': maskWidth,
    'height': maskHeight
  });
  //마스크의 투명도 처리
  $('.mask').show()
}
$(function () {
  if (tag !== 'index') {
    $("header").load("header.html")
  }
  $(document).on('click', '.active-menu', function () {
    //클릭하는 page가 index일 경우 /page/추가
    var html = tag === "index" ? "./page/" : ""
    var url = html + "projects.html?" + encodeURIComponent($(this).children("a").text())
    window.location.href = url;
  })
  // $(document).on('click', '.menu-item', function () {

  //   // if ($(this)[0].classList[2] === 'projects') {
  //   //   if ($(this)[0].classList[3] === 'on') {
  //   //     $(this).children('ul').css('display', 'none')
  //   //     $(this).removeClass('on')
  //   //   } else {
  //   //     $(this).children('ul').css('display', 'flex')
  //   //     $(this).addClass('on')
  //   //   }
  //   // } else {
  //   //   $(this).siblings('.projects').removeClass('on')
  //   //   $(this).children('ul').toggle()
  //   // }
  //   // $(this).toggleClass('clicked_menu')
  //   // $(this).siblings().children('ul').hide()
  //   // $(this).siblings().removeClass('clicked_menu')
  // })
  //about,people,news => about,  프로젝트들은 projects license,recruting,contact는 contact
  $(document).on('click', '.hamburger', function () {
    if ($('.hamburger').hasClass('is-active')) {
      $('.mask').hide()
    } else {
      wrapWindowByMask();
    }
    $('.header-wrapper').toggleClass('header-back')
    $(this).toggleClass("is-active");
    $('.menu-nav').animate({
      width: "toggle"
    });
  })
})