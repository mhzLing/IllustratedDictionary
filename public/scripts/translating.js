var tagArr = [];
var jsonArr = [];

$(document).ready(function() {

  var baseUrl = "http://localhost:3000/";
  var imgFileName = "a";
  $.ajax({url: '/getImage'}).done(function (data) {
    imgFileName = baseUrl.concat(data);
    $('#imageMap').attr('src', imgFileName);
  });

  //load tags from the corresponding image id
  $.ajax({url: '/loadTags'}).done(function (data) {
    for(var i = 0; i < data.length; i++)
    {
      $('#planetmap').append(data[i].tagString);
    }
  });
});

$(".tagged").live("mouseover",function(){
    if($(this).find(".openDialog").length == 0){
        $(this).find(".tagged_box").css("display","block");
        $(this).css("border","2px solid #EEE");

        $(this).find(".tagged_title").css("display","block");
    }
});

$(".tagged").live("mouseout",function(){
    if($(this).find(".openDialog").length == 0){
        $(this).find(".tagged_box").css("display","none");
        $(this).css("border","none");
        $(this).find(".tagged_title").css("display","none");
    }
});

//this function will show corresponding translated words based on the tag clicked on the side.
$(".tagged").live("click",function(){
    $('#translation_box').empty();

    var to = $('#to').val();
    var ajaxUrl = 'https://kamusi.org/pred/translate/' + $(this).attr("data-engSynsetIdHTML") + '/eng_3_1/' + to;
    console.log(to);
    console.log(ajaxUrl);
    $.ajax({
      url: ajaxUrl,
      contentType: "application/json; charset=utf-8",
      type: 'GET',
      cache: false,
    }).done(function (data)
    {
      if(data.length == 0)
      {
        $("#translation_box").append(
          '<div class="translation_entry" style="background-color: #efdac1; height: 30px; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
          "No Translation Found" +'</div>');
      }
      else {
        for(var i = 0; i < data[0].terms.length; i++)
        {
          $("#translation_box").append(
            '<div class="translation_entry" style="background-color: #efdac1; height: 30px; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
            data[0].terms[i].lemma_accent +'</div>');
        }
      }
    });
});

var showTags = function(){
    $(".tagged_box").css("display","block");
    $(".tagged").css("border","2px solid #EEE");
    $(".tagged_title").css("display","block");
};

var hideTags = function(){
    $(".tagged_box").css("display","none");
    $(".tagged").css("border","none");
    $(".tagged_title").css("display","none");
};
/*
var translateWords = function() {
//save all tag html into array called tagArr using getElementByCLassName.
//Run through tagArr using for loop. each loop has an ajax call.
//ajax call to kamusi/pred/translate/id/from/to. save json data to array named
//jsonArr.

  $('#translation_box').empty(); //clear all entries in the translation box

  tagArr = document.getElementsByClassName('tagged');
  jsonArr.length = tagArr.length;
  var to = $('#to').val();

  for (var i = 0; i < tagArr.length; i++)
  {
    var ajaxUrl = 'https://kamusi.org/pred/translate/' + tagArr[i].getAttribute('data-engSynsetIdHTML') + '/eng_3_1/' + to;
    $.ajax({
      url: ajaxUrl,
      contentType: "application/json; charset=utf-8",
      type: 'GET',
      cache: false,
    }).done(function (data)
    {
      jsonArr[i] = data;
    });
  }
};
*/
