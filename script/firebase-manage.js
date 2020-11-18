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
var storage = firebase.storage();
var storageRef = storage.ref();

var deleted_pic = new Array()
var upto_upload_img;
var upto_upload_img_arr = new Array();
var add_check = false;
$(function () {
  $(document).ready(function () {
    $(".modify").click(function () {
      clear()
      add_check = false;
      var selected_value = $("#menu-item1 option:selected").attr('value')
      call_select(selected_value)
      if (selected_value !== 'project-area' && selected_value !== 'people') {
        $('.' + selected_value).show()
        $('.' + selected_value).siblings().hide()
        load_html($("#menu-item1 option:selected").attr('value'))
      } else {
        $("#menu-item2").show();
      }
    })
    $(".add").click(function () {
      add_check = true
      $('#menu-item3').children().remove()
      add()
    })
    $("#menu-item1").change(function () {
      clear()
      var selected_value = $("#menu-item1 option:selected").attr('value')
      if (selected_value === 'about' || selected_value === 'welcome-area') {
        $("#menu-item2").hide()
      }
      if (selected_value === 'project-area' || selected_value === 'people' || selected_value === 'news') {
        $('.add').show()
      } else {
        $('.add').hide()
      }
      $('.' + selected_value).siblings().hide();
      $('.' + selected_value).siblings().find('.img-box').remove();
      $('.' + selected_value).siblings().find('.para-input').remove();
      $('.' + selected_value).siblings().find('input').val("");
      $('#menu-item2').hide()
    });
    $("#menu-item2").change(function () {
      clear()
      if ($("#menu-item1 option:selected").attr('value') === 'project-area') {
        $('#menu-item3').children().remove()
        $('#menu-item3').append('<option value="" disabled selected></option>')
        $('#menu-item3').show()
        project_select($("#menu-item2 option:selected").attr('value'))
      } else {
        $('.' + $("#menu-item1 option:selected").attr('value')).show()
        $('.' + $("#menu-item1 option:selected").attr('value')).siblings().hide()
        load_html($("#menu-item1 option:selected").attr('value'))
      }
      $('#image_container').empty();
    });
    $("#menu-item3").change(function () {
      clear()
      $('.project-area').show()
      load_html('project-area/' + $("#menu-item2 option:selected").attr('value') + '/' + $("#menu-item3 option:selected").attr('value'))
    });
    $('.para-add').click(function () {
      var len = $(this).parent().siblings().children(".para-input").prevObject.length
      $('.' + $("#menu-item1 option:selected").attr('value')).find('.text').append('<div class="para-input"><div class="aa">' + len + '</div>' + "<textarea></textarea>" + ' <button class="para-remove para-btn ' + len + '" onclick="remove_btn_click(event)">삭제</button></div>')
    })
  })
})

function add() {
  var selected_value = $("#menu-item1 option:selected").attr('value')
  $('.' + $("#menu-item1 option:selected").attr('value')).find('#image_container').children().remove()
  if (selected_value === 'project-area') {
    $('.' + $("#menu-item1 option:selected").attr('value')).find('.para-input').remove()
  }
  $('.' + selected_value).find('input').val("")
  $('.' + selected_value).find('textarea').val("")
  $('.' + selected_value).show()
  $("#menu-item2").hide();
}

function project_select(pj_name) {
  var listRef = storageRef.child('project-area/' + pj_name);
  listRef.listAll().then((res) => {
    res.prefixes.forEach((folderRef) => {
      $('#menu-item3').append('<option value="' + folderRef.name + '">' + folderRef.name + '</option>')
    });
  }).catch(function (error) {});
}

function call_select(class_name) {
  $('#menu-item2').empty()
  $('#menu-item2').append('<option value="" disabled selected></option>')
  var listRef = storageRef.child(class_name);
  if (class_name === "project-area") {
    $('#menu-item2').children().remove()
    $('#menu-item3').children().remove()
    $('#menu-item2').append('<option value="" disabled selected></option>')
    $('#menu-item3').append('<option value="" disabled selected></option>')
    listRef.listAll().then((res) => {
      res.prefixes.forEach((folderRef) => {
        $('#menu-item2').append('<option value="' + folderRef.name + '">' + folderRef.name + '</option>')
      });
    }).catch(function (error) {});
  } else if (class_name === "people") {
    storageRef.child('people-area').listAll().then((res) => {
      res.items.forEach((data) => {
        var name = data.name.substring(0, data.name.lastIndexOf('.'))
        $('#menu-item2').append('<option value="' + name + '">' + name + '</option>')
      })
    })
  } else if (class_name === 'news') {
    database.ref('news/').once('value', function (data) {
      data.forEach((sdata) => {
        var name = sdata.key
        $('#menu-item2').append('<option value="' + name + '">' + name + '</option>')
      })
    })
  }
}

function load_html(selected_area) {
  if (selected_area.includes("project-area")) {
    project_load_html(selected_area)
  } else if (selected_area === "about") {
    about_load_html()
  } else if (selected_area === "welcome-area") {
    welcome_load_html()
  } else if (selected_area === "AwardsAndCompetition") {
    awards_load_html()
  } else if (selected_area === "people") {
    people_load_html($("#menu-item2 option:selected").attr('value'))
  } else if (selected_area === 'news') {
    news_load_html()
  }
}

function people_load_html(people_name) {
  var ref = database.ref($("#menu-item1 option:selected").attr('value') + '/' + people_name + '/');
  var people_html = $('.people').children('.general-wrapper')
  people_html.find("#image_container").children().remove()
  people_html.find("input").val("")
  people_html.find("textarea").val("")
  people_html.find("textarea").text("")
  ref.once('value', function (data) {
    data.forEach((sdata) => {
      if (sdata.key !== 'text') {
        people_html.find('.' + sdata.key).find('input').val(sdata.val())
      } else {
        people_html.find('.' + sdata.key).find('textarea').val(sdata.val())
      }
    })
  })
  storage.ref('people-area/').listAll().then(function (res) {
    res.items.some((data) => {
      var name = data.name.substring(0, data.name.lastIndexOf('.'))
      if (name === people_name) {
        data.getDownloadURL().then(function (url) {
          people_html.find('#image_container').append('<div class="img-box ' + name + '"><img style="width:150px; height:150px;" src="' + url + '"><i class="fas fa-times-circle" onclick="delete_img(event)"></i></div>')
        })
      }
      return (name === people_name);
    })
  })
}

function people_submit() {
  var people_html = $('.people')
  var name = $('.people_name').val()
  var position = $('.people_position').val()
  var text = people_html.find('.text').find('textarea').val()
  var db_name = add_check ? upto_upload_img[0].name.substring(0, upto_upload_img[0].name.lastIndexOf('.')) : $("#menu-item2 option:selected").attr('value')
  firebase.database().ref('people/' + db_name + '/').set({
    name: name,
    position: position,
    text: text
  });
  if (add_check) {
    storage.ref('people-area/' + upto_upload_img[0].name).put(upto_upload_img[0])
  }
  clear()
}

function people_delete() {
  var project_name = $("#menu-item2 option:selected").attr('value');
  storage.ref('people-area/').listAll().then(function (res) {
    res.items.some((data) => {
      var name = data.name.substring(0, data.name.lastIndexOf('.'))
      if (name === project_name) {
        data.delete().then(function () {
          // File deleted successfully
        }).catch(function (error) {
          // Uh-oh, an error occurred!
        });
      }
      return (name === project_name)
    })
  })
  database.ref("/projects/" + project_name).remove();
}

function project_load_html(project_name) {
  var project = $('.project-area').children('.pj-wrapper')
  var parsing = project_name.split('/')
  let year = parsing[1]
  let name = parsing[2]
  storage.ref(project_name).listAll().then(function (reso) {
    reso.items.forEach(function (itemRef) {
      itemRef.getDownloadURL().then(function (url) {
        project.find('#image_container').append('<div class="img-box ' + itemRef.name + '"><img style="width:150px; height:150px;" src="' + url + '"><i class="fas fa-times-circle" onclick="delete_img(event)"></i></div>')
      })
    })
  })
  var ref = database.ref("/projects/" + year + '/' + name);
  $(".pj-wrapper").find("input").val("")
  $('.para-text-box').siblings().remove()
  ref.once('value', function (data) {
    data.forEach(function (ssdata) {
      var key = ssdata.key;
      if (ssdata.key === 'paragraph') {
        project.find('.para-text-box').siblings().remove()
        ssdata.forEach(function (para_data) {
          para_data.forEach(function (text_data) {
            project.find('.' + para_data.key).append('<div class="para-input"><div class="aa">' + text_data.key + '</div><textarea>' + text_data.val() + '</textarea><button class="para-remove para-btn ' + text_data.key + '" onclick="remove_btn_click(event)">삭제</button></div>')
          })
        })
      } else {
        $('.pj-wrapper').children('.' + ssdata.key).children('input').val(ssdata.val())
      }
    })
  })

}

function welcome_load_html() {
  var welcome = $('.welcome-area').children('.general-wrapper')
  storage.ref('welcome-area/').listAll().then(function (reso) {
    reso.items.forEach(function (itemRef) {
      itemRef.getDownloadURL().then(function (url) {
        welcome.find('#image_container').append('<div class="img-box ' + itemRef.name + '"><img style="width:150px; height:150px;" src="' + url + '"><i class="fas fa-times-circle" onclick="delete_img(event)"></i></div>')
      })
    })
  })
}

function remove_btn_click(event) {
  var name = event.target.className.replaceAll(/(para-remove para-btn )/g, "")
  var name = name.replaceAll(/(new )/g, "")
  var nextAll = $("." + name).parent().nextAll()
  $("." + name).parent().remove()
  nextAll.each(function (index, item) {
    item.querySelector(".para-remove").className = "para-remove para-btn " + String(item.querySelector(".aa").innerHTML - 1)
    item.querySelector(".aa").innerHTML = item.querySelector(".aa").innerHTML - 1
  })
}
var idx = 0

function setThumbnail(event) {
  upto_upload_img = document.getElementById('image').files
  for (var i = 0; i < upto_upload_img.length; i++) {
    upto_upload_img_arr.push(upto_upload_img[i])
  }
  if ($("#menu-item1 option:selected").attr('value') === 'about') {
    $('.' + $("#menu-item1 option:selected").attr('value')).find('#image_container').children().remove()
  }
  for (var image of event.target.files) {
    var reader = new FileReader();
    reader.onload = function (event) {
      $('.' + $("#menu-item1 option:selected").attr('value')).find('#image_container').append('<div class="img-box img' + idx + '"><img style="width:150px; height:150px;" src="' + event.target.result + '"><i class="fas fa-times-circle upto" onclick="delete_img(event)"></i></div>')
      idx++
    };
    reader.readAsDataURL(image);
  }
}

function delete_img(event) {
  var name = event["path"][1].className.replaceAll(/(img-box )/g, "")
  if (event.target.className === "fas fa-times-circle") {
    deleted_pic.push('project-area/' + $("#menu-item2 option:selected").attr('value') + '/' + $("#menu-item3 option:selected").attr('value') + '/' + name)
    console.log('project-area/' + $("#menu-item2 option:selected").attr('value') + '/' + $("#menu-item3 option:selected").attr('value') + '/' + name)
  } else {
    if ($("#menu-item2 option:selected").attr('value') === 'about') {
      upto_upload_img_arr.length = 0
    }
    upto_upload_img_arr[event["path"][0].parentNode.className.replaceAll(/(img-box img)/g, "")] = 0
  }

  event["path"][1].parentNode.removeChild(event["path"][1]);
}

function pj_delete() {
  var project_name = $("#menu-item2 option:selected").attr('value') + '/' + $("#menu-item3 option:selected").attr('value');
  var listRef = storageRef.child('project-area/' + $("#menu-item2 option:selected").attr('value'));
  listRef.listAll().then((res) => {
    res.prefixes.forEach((folderRef) => {
      if (folderRef.name === $("#menu-item3 option:selected").attr('value')) {
        folderRef.delete()
        console.log(folderRef.name)
        console.log($("#menu-item3 option:selected").attr('value'))
      }
    });
  }).catch(function (error) {});
  database.ref("/projects/" + project_name + '/').remove();
  clear()
}

function pj_submit() {
  var name = add_check ? $('.project-area').children('.pj-wrapper').find('.name').children('input').val() : $("#menu-item3 option:selected").attr('value');
  let subtitle = $('.subtitle').children("input[type=text]").val();
  var area = $(".area").children("input[type=text]").val();
  var client = $(".client").children("input[type=text]").val();
  var collaboration = $(".collaboration").children("input[type=text]").val();
  var location = $(".location").children("input[type=text]").val();
  var status = $(".status").children("input[type=text]").val();
  var txt = $('.project-area').find(".text").children('.para-input')
  var text = new Array()
  txt.each(function (index, item) {
    text.push(item.children[1].value)
  })
  var db_name = add_check ? $('.project-area').children('.pj-wrapper').find('.year').children('input').val() + '/' + $('.project-area').children('.pj-wrapper').find('.name').children('input').val() : $("#menu-item2 option:selected").attr('value') + '/' + $("#menu-item3 option:selected").attr('value')
  console.log(db_name)
  firebase.database().ref('projects/' + db_name + '/').set({
    area: area,
    name: name,
    subtitle: subtitle,
    collaboration: collaboration,
    location: location,
    client: client,
    status: status,
  });
  firebase.database().ref('projects/' + db_name + '/paragraph/').set({
    text
  });
  for (var i = 0; i < upto_upload_img_arr.length; i++) {
    if (upto_upload_img_arr[i] !== 0) {
      storage.ref('project-area/' + db_name + '/' + upto_upload_img_arr[i].name + '/').put(upto_upload_img_arr[i])
    }
  }
  // Delete the file
  clear()
}

function clear() {
  for (pic in deleted_pic) {
    var desertRef = storageRef.child(deleted_pic[pic]);
    desertRef.delete().then(function () {
      // File deleted successfully
    }).catch(function (error) {
      // Uh-oh, an error occurred!
    });
  }
  deleted_pic.length = 0
  upto_upload_img = undefined
  upto_upload_img_arr.length = 0
  $('.' + $("#menu-item1 option:selected").attr('value')).find('input').val("")
  $('.' + $("#menu-item1 option:selected").attr('value')).find("textarea").val("")
  $('.para-input').remove()
  $('.' + $("#menu-item1 option:selected").attr('value')).find('#image_container').children().remove()
  $('.' + $("#menu-item1 option:selected").attr('value')).find('#image_container').children().remove()
}

function uploadimage() {
  $('#image').click()
}

function about_submit() {
  var field = $("#menu-item1 option:selected").attr('value')
  var area = $('.' + field)
  var st = area.find(".sub_title").children('.para-input')
  var txt = area.find(".text").children('.para-input')
  var sub_title = new Array();
  if (deleted_pic.length) {
    storage.ref(field + '-area/').listAll().then(function (reso) {
      reso.items.forEach(function (itemRef) {
        itemRef.delete().then(function () {
          // File deleted successfully
        }).catch(function (error) {
          // Uh-oh, an error occurred!
        });
      })
    })
  }
  st.each(function (index, item) {
    sub_title.push(item.children[1].value)
  })
  var text = new Array()
  txt.each(function (index, item) {
    text.push(item.children[1].value)
  })
  firebase.database().ref(field + '/').set({
    sub_title,
    text
  });
  if (upto_upload_img) {
    storage.ref('about-area/' + upto_upload_img[0].name).put(upto_upload_img[0])
  }
  clear()
}

function about_delete() {
  var field = $("#menu-item1 option:selected").attr('value')
  storage.ref(field + '-area/').listAll().then(function (reso) {
    reso.items.forEach(function (itemRef) {
      itemRef.delete().then(function () {
        // File deleted successfully
      }).catch(function (error) {
        // Uh-oh, an error occurred!
      });
    })
  })
  database.ref("/" + field + "/").remove();
}

function welcome_submit() {
  for (var i = 0; i < upto_upload_img_arr.length; i++) {
    storage.ref('welcome-area/' + upto_upload_img_arr[i].name).put(upto_upload_img_arr[i])
  }
  clear()
}