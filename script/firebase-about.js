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
const tag = '1'
var storageRef = storage.ref();
var database = firebase.database();
var ref = database.ref("/about/")
ref.once('value', function (data) {
  data.forEach(function (sdata) {
    sdata.forEach(function (ssdata) {
      var key = ssdata.key
      if (sdata.key === 'sub_title') {
        // $('.' + ssdata.key).children('.box').prepend('<p class="sub_title"><strong>' + ssdata.val() + '</strong></p><br>')
      } else {
        $('.about-describe').append('<article class="' + ssdata.key + ' animate__animated animate__fadeIn"><div class="box kor-article "></div></article>')
        $('.' + ssdata.key).children('.box').append('<p>' + ssdata.val().replaceAll('\n',"<br>") + '</p><br>')
      }
    })
  })
  $('.about-describe article').css('width', 100 / data.child('sub_title').numChildren() + '%')
})
// ...
var ref = database.ref("about/");
storageRef.child('about-area').listAll().then(function (res) {
  res.items.forEach(function (itemRef) {
    itemRef.getDownloadURL().then(function (url) {
      $(function () {
        $('.about-img').append('<img class="animate__animated animate__fadeIn" src="' + url + '" alt="">')
      })
    })
  });
}).catch(function (error) {
  // Uh-oh, an error occurred!
});
$(function(){
  // $('.about-img').addClass('animate__animated animate__flip')
  //   $('.about-describe').addClass('animate__animated animate__flip')
})
