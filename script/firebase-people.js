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
// Get metadata properties
var listRef = storageRef.child('people-area');
var database = firebase.database();
var ref = database.ref("people/");
load_html()
async function load_html(){
    const aa = await append_face()
    ref.once('value', function (data) {
        data.forEach(function (sdata) {
            var key = sdata.key;
            var name = sdata.val()["name"]
            var position = sdata.val()["position"]
            var text = sdata.val()["text"]
            $('.'+name).prepend('<article class="ppl-article ' + key + '"><div class="ppl-position"><h3>' + name + '</h3><p class="position">' + position + '</p></div><p>' + text.replaceAll('\n',"<br>") + '</p></article>')
        })
    })
}
async function append_face() {
    await listRef.listAll().then(async (res) => {
        const promises = await res.items.map(async (itemRef) => {
            var name = (itemRef.name).substring(0, (itemRef.name).indexOf(".", 0));
            const urls = await itemRef.getDownloadURL().then((url) => {
                $('.grid').append('<div class="img-cont face animate__animated animate__fadeInUp ' + name + '"><div class=face-wrapper><img src="' + url + '" alt=""></div><div class="ppl-describe">' + name + '</div></div>')
            })
            return urls
        });
        const aa = await Promise.all(promises)
        
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });
}

$(document).on('click','.face',(e)=>{
    var name = e.currentTarget.classList[4]
    $('article.' + name).slideToggle();
    $('.grid').find('article').not('.'+name).slideUp()
})