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
const tag = 'projects'
var storage = firebase.storage();
var storageRef = storage.ref();
var listRef;
var database = firebase.database()
var ref;
let loc;
let now_year;

//주소에서 선택된 년도 추출
var queryString = new Array();
if (queryString.length == 0) {
  if (window.location.search.split('?').length > 1) {
    var params = window.location.search.split('?')[1];
    let year = params
    loc = 'project-area/' + year + '/'
    ref = database.ref("projects/" + year);
    now_year = year;
    listRef = storageRef.child('project-area/' + year)
  }
}

$(document).on({
  mouseenter: function (event) {
    console.log(event.currentTarget.classList)
    $('.' + event.currentTarget.classList[1]).find('img').animate({
      opacity: "0.4"
    }, 200)
    $('.' + event.currentTarget.classList[1]).find('.pj-article').fadeIn(200)
  },
  mouseleave: function (event) {
    $('.' + event.currentTarget.classList[1]).find('img').animate({
      opacity: "1"
    }, 0)
    $('.' + event.currentTarget.classList[1]).find('.pj-article').hide()
  }
}, ".img-cont")

//틀이랑 설명 생성
ref.once('value', function (data) {
  data.forEach(function (sdata) {
    var key_name = sdata.key
    var name = sdata.val()
    $('.images').append('<div class="img-cont ' + key_name.replaceAll(" ", "_") + '"><div class="pj-article animate__animated animate__fadeIn"><h4>' + name["name"] + '</h4><p>' + name["subtitle"] + '</p></div></div>')
  })
})
image_add()

//이미지 추가.
async function image_add() {
  await listRef.listAll().then(async (res) => {
    await res.prefixes.forEach(async (folderRef) => {
      await storageRef.child(loc + folderRef.name).listAll().then(async (reso) => {
        if(reso.items.length){
          await reso.items[0].getDownloadURL().then(async (url) => {
            var name = folderRef.name
            $('.' + name.replaceAll(" ", "_")).prepend('<a href="#none"><img  style="display:none" src="' + url + '" alt=""></a>').find("img").on('load',function(){
              $('.'+name.replaceAll(" ", "_")).addClass(' animate__animated animate__fadeIn')
              $('.'+name.replaceAll(" ", "_")).find('img').css('display','block')
            })
          })
        }
      })
    });
  }).catch(function (error) {});
}
// 클릭된 년도랑 프로젝트 이름 보내기
$(document).on('click', '.img-cont', function () {
  let class_name = $(this).attr('class').replaceAll('animate__animated animate__fadeIn',"").replace(/(img-cont| )/g, "")
  var url = "project_clicked.html?" + encodeURIComponent(now_year)+'/'+encodeURIComponent(class_name.replace('animate__animated animate__fadeInUp',"").replaceAll("_", " "))
  window.location.href = url;
})

