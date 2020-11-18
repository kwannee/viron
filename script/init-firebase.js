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
var database = firebase.database();
var forestRef = storageRef.child('welcome-area/');
var html = ""
// Get metadata properties

async function append_slide() {
  var listRef = storageRef.child('welcome-area');
  listRef.listAll().then(async (res) => {
    const promises = await res.items.map(async (itemRef) => {
      const urls = await itemRef.getDownloadURL().then((url) => {
        $('.index_grid').append('<div class="slide"><img src="' + url + '" alt=""></div>');
      })
      return urls
    });
    const aa = await Promise.all(promises)
  }).catch(function (error) {
    // Uh-oh, an error occurred!
  });
}
append_slide()

const tag = 'index'