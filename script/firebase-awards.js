var firebaseConfig = {
  apiKey: "AIzaSyBDg620nc4dxyEfKQTEfVMaiaXomzzZ5J0",
  authDomain: "viron-57745.firebaseapp.com",
  databaseURL: "https://viron-57745.firebaseio.com",
  projectId: "viron-57745",
  storageBucket: "viron-57745.appspot.com",
  messagingSenderId: "849415377120",
  appId: "1:849415377120:web:e8eb93fc8fe48101e54085"
};
const tag = '1'
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
var storageRef = storage.ref();
var listRef = storageRef.child('project-area');
listRef.listAll().then(function (res) {
  res.prefixes.forEach(function (folderRef) {
    $(function () {
      //class name active menu이거는 프로젝트 페이지에서 저거 클릭하면 페이지 이동이 아니라 그냥 gallery 내에서마 바뀌게
      $('.pj-drop').append('<li class="active-menu"><a href="./project_clicked.html">'+folderRef.name+'</a></li>')
    })
  });
}).catch(function (error) {});
var database = firebase.database();
var ref = database.ref("AwardsAndCompetition/");
ref.once('value', function (data) {
  data.forEach(function (sdata) {
    var key = sdata.key;
    sdata.forEach(function (ssdata) {
      if (key === "awards") {
        $('.awards-container').append('<div class="ac-box"><p>' + ssdata.key + '</p>' + '<p>' + ssdata.val() + '</p></div>')
      } else {
        $('.competition-container').append('<div class="ac-box"><p>' + ssdata.key + '</p>' + '<p>' + ssdata.val() + '</p></div>')
      }
    })
  })
})