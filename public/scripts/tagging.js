var wordArr = [];
var conceptArr = [];
var tagArr = [];

// Get the modal
var modal = document.getElementById('conceptModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

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

    $("#imageMap").click(function(e){


        var image_left = $(this).offset().left;
        var click_left = e.pageX;
        var left_distance = click_left - image_left;

        var image_top = $(this).offset().top;
        var click_top = e.pageY;
        var top_distance = click_top - image_top;

        var mapper_width = $('#mapper').width();
        var imagemap_width = $('#imageMap').width();

        var mapper_height = $('#mapper').height();
        var imagemap_height = $('#imageMap').height();






        if((top_distance + mapper_height > imagemap_height) && (left_distance + mapper_width > imagemap_width)){
            $('#mapper').css("left", (click_left - mapper_width - image_left  ))
            .css("top",(click_top - mapper_height - image_top  ))
            .css("width","100px")
            .css("height","100px")
            .show();
        }
        else if(left_distance + mapper_width > imagemap_width){


            $('#mapper').css("left", (click_left - mapper_width - image_left  ))
            .css("top",top_distance)
            .css("width","100px")
            .css("height","100px")
            .show();

        }
        else if(top_distance + mapper_height > imagemap_height){
            $('#mapper').css("left", left_distance)
            .css("top",(click_top - mapper_height - image_top  ))
            .css("width","100px")
            .css("height","100px")
            .show();
        }
        else{


            $('#mapper').css("left",left_distance)
            .css("top",top_distance)
            .css("width","100px")
            .css("height","100px")
            .show();
        }


        $("#mapper").resizable({ containment: "parent" });
        $("#mapper").draggable({ containment: "parent" });

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

$(".tagged").live("click",function(){
    $(this).find(".tagged_box").html("<img src='images/del.png' class='openDialog' value='Delete' onclick='deleteTag(this)' />\n\
<img src='images/save.png' onclick='editTag(this);' value='Save' />");

    var img_scope_top = $("#imageMap").offset().top + $("#imageMap").height() - $(this).find(".tagged_box").height();
    var img_scope_left = $("#imageMap").offset().left + $("#imageMap").width() - $(this).find(".tagged_box").width();

    $(this).draggable({ containment:[$("#imageMap").offset().left,$("#imageMap").offset().top,img_scope_left,img_scope_top]  });

});

var addTag = function(){
  if( $("#title").val() != "" )
  {
    var position = $('#mapper').position();


    var pos_x = position.left;
    var pos_y = position.top;
    var pos_width = $('#mapper').width();
    var pos_height = $('#mapper').height();


    $('#planetmap').append('<div class="tagged" data-engSynsetIdHTML="" style="width:'+pos_width+';height:'+
        pos_height+';left:'+pos_x+';top:'+pos_y+';" ><div class="tagged_box" style="width:'+pos_width+';height:'+
        pos_height+';display:none;" ></div><div class="tagged_title" style="top:'+(pos_height+5)+';display:none;" >'+
        $("#title").val()+'</div></div>');

    /*
    var tagHTML = '<div class="tagged" style="width:'+pos_width+';height:'+
        pos_height+';left:'+pos_x+';top:'+pos_y+';" ><div class="tagged_box" style="width:'+pos_width+';height:'+
        pos_height+';display:none;" ></div><div class="tagged_title" style="top:'+(pos_height+5)+';display:none;" >'+
        $("#title").val()+'</div></div>';
    */

    //ajax to send word over
    var from = $('#from').val();
    var to = $('#to').val();
    var word = $("#title").val();
    $.ajax({
      url: '/sendTerm',
      contentType: "application/json; charset=utf-8",
      type: 'GET',
      cache: false,
      data: { 'term': $("#title").val(), 'from': from, 'to': to},
    }).done(function (data) {
      conceptArr.length = data.length;
      for(var i = 0; i < data.length; i++)
      {
        conceptArr[i] = data[i];
        console.log(conceptArr[i]);
        var definitionId = "definition" + i;
        if(from == 'eng_3_0')
        {
          if(data[i].source_concept.definition == "")
          {
            //console.log("No definition found.")
            $(".concept-content").append(
              '<div class="wnsynset" id=' + definitionId + ' onclick="chooseDefinition(this)" style="background-color: #efdac1; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
                '<h4 class="" style="display: block; border-bottom: 2px solid #684235; padding-bottom: 10px; color: #a50000; text-align: center;">' +
                  ' term: ' + word + ', part of speech: undefined' +
                '</h4>' +
                '<p class="" style="padding: 0 0 0 10px;">' +
                  '<strong>definition:</strong> No definition found' +
                '</p>' +
              '</div>');
          }
          else
          {
            //console.log(sourceConceptArr[i]);
            $(".concept-content").append(
              '<div class="wnsynset" id=' + definitionId + ' onclick="chooseDefinition(this)"  style="background-color: #efdac1; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
                '<h4 class="" style="display: block; border-bottom: 2px solid #684235; padding-bottom: 10px; color: #a50000; text-align: center;">' +
                  ' term: ' + word + ', part of speech: ' + data[i].english_concept.ss_type +
                '</h4>' +
                '<p class="" style="padding: 0 0 0 10px;">' +
                  '<strong>definition:</strong> ' + data[i].source_concept.definition +
                '</p>' +
              '</div>');
            }
        }
        else
        {
          if(data[i].source_concept.gloss == "")
          {
            //console.log("No definition found.")
            $(".concept-content").append(
              '<div class="wnsynset" id=' + definitionId + ' onclick="chooseDefinition(this)" style="background-color: #efdac1; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
                '<h4 class="" style="display: block; border-bottom: 2px solid #684235; padding-bottom: 10px; color: #a50000; text-align: center;">' +
                  ' term: ' + word + ', part of speech: undefined' +
                '</h4>' +
                '<p class="" style="padding: 0 0 0 10px;">' +
                  '<strong>definition:</strong> No definition found' +
                '</p>' +
              '</div>');
          }
          else
          {
            //console.log(sourceConceptArr[i]);
            $(".concept-content").append(
              '<div class="wnsynset" id=' + definitionId + ' onclick="chooseDefinition(this)"  style="background-color: #efdac1; padding: 4px; border: 2px solid #684235; border-radius: 10px; margin: 5px;">' +
                '<h4 class="" style="display: block; border-bottom: 2px solid #684235; padding-bottom: 10px; color: #a50000; text-align: center;">' +
                  ' term: ' + word + ', part of speech: ' + data[i].english_concept.ss_type +
                '</h4>' +
                '<p class="" style="padding: 0 0 0 10px;">' +
                  '<strong>definition:</strong> ' + data[i].source_concept.gloss +
                '</p>' +
              '</div>');
          }
        }
      }
    });

    //close form panel and reset input box
    $("#mapper").hide();
    $("#title").val('');
    $("#form_panel").hide();

    showConcepts();
  }
  else
  {
    $("#mapper").hide();
    $("#title").val('');
    $("#form_panel").hide();
  }
};

var openDialog = function(){
    $("#form_panel").fadeIn("slow");
};

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

var editTag = function(obj){

    $(obj).parent().parent().draggable( 'disable' );
    $(obj).parent().parent().removeAttr( 'class' );
    $(obj).parent().parent().addClass( 'tagged' );
    $(obj).parent().parent().css("border","none");
    $(obj).parent().css("display","none");
    $(obj).parent().parent().find(".tagged_title").css("display","none");
    $(obj).parent().html('');

};

var deleteTag = function(obj){
    $(obj).parent().parent().remove();
};

// Save all tags present in the image panel to database.
var saveTags = function() {
  var tagArr = document.getElementsByClassName('tagged');
  /* TRANSLATING BY WORDS
  var htmlArr = document.getElementsByClassName('tagged_title');

  wordArr.length = htmlArr.length;
  for(var i = 0; i < htmlArr.length; i++)
  {
    wordArr[i] = htmlArr[i].innerHTML;
    console.log(wordArr[i]);
  }
*/

  // remove tags associated to current image,
  // then after delete ajax is done, it runs save ajax
  $.ajax({
    url: '/removeTags',
  }).done(function (data) {
    console.log("REMOVED TAGS");
  //saving tags to database
    for(var i = 0; i < tagArr.length; i++)
    {
      console.log(tagArr[i]);
      $.ajax({
        url: '/saveTags',
        contentType: false,
        type: 'GET',
        cache: false,
        data: { 'tags': tagArr[i].outerHTML},
      });
    }
  });

};

var translateWords = function() {
  var from = $('#from').val();
  var to = $('#to').val();
  for(var i = 0; i < wordArr.length; i++)
  {
    console.log("i = " + i + "\n");
    $.ajax({
      url: '/TranslateData',
      contentType: "application/json; charset=utf-8",
      type: 'GET',
      cache: false,
      data: { 'word': wordArr[i], 'from': from, 'to': to },
    });
  }
/*
  $.ajax({url: '/getTranslateData/test'}).done(function (data) {
    $('body').replaceWith(data);
  }); */

};

// Modal box that pops up when user creates a tag.
// Modal box contains definitions for the tag word.
var showConcepts = function() {
    $(".modal").css("display","block");
};

// When the user clicks on <span> (x), close the modal
var closeModal = function() {
    $(".modal").css("display","none");
    $(".concept-content").empty();
};

// All definition for the word of the tag is displayed in the modal box.
// User can select a definition to associate with the specific tag.
var chooseDefinition = function(item) {
  var clickedId = $(item).attr('id');
  var index = clickedId.charAt(clickedId.length - 1);
  $(".tagged").last().attr("data-engSynsetIdHTML", conceptArr[index].english_concept.synset_ID_3_1);
  closeModal();

  /*
  $.ajax({
    url: '/saveConcept',
    contentType: "application/json; charset=utf-8",
    type: 'GET',
    cache: false,
    data: { 'concept': conceptArr[index].english_concept.synset_ID_3_1},
  });
  */

};

var goToImageTranslating = function() {
  $.ajax({
    url: '/imageTranslating',
  });
};
