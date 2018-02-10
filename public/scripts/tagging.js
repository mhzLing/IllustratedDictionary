var conceptArr = []; // Temporary storage for concept IDs of tagged words to save into database.
var tagArr = []; // Temporary storage for html of existing tags to save into database.

// Get the modal
var modal = document.getElementById('conceptModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

$(document).ready(function() {

  // Load the selected image from home.ejs
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

// Runs when the user presses the 'checkmark' button on the newly made tag box.
// Opens a dialog box to prompt user for a word to associate with the tag.
// Then, a modal box will then pop up and the user must select a definition to associate with the word.
var addTag = function(){
  if( $("#title").val() != "" )
  {
    var position = $('#mapper').position();

    var pos_x = position.left;
    var pos_y = position.top;
    var pos_width = $('#mapper').width();
    var pos_height = $('#mapper').height();

    // Insert the newly made tag box inside the html
    $('#planetmap').append('<div class="tagged" data-engSynsetIdHTML="" style="width:'+pos_width+';height:'+
        pos_height+';left:'+pos_x+';top:'+pos_y+';" ><div class="tagged_box" style="width:'+pos_width+';height:'+
        pos_height+';display:none;" ></div><div class="tagged_title" style="top:'+(pos_height+5)+';display:none;" >'+
        $("#title").val()+'</div></div>');

    //ajax to send word over and get all possible definitions
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
      // Save the return data (definitions) into the conceptArray.
      conceptArr.length = data.length;
      for(var i = 0; i < data.length; i++)
      {
        conceptArr[i] = data[i];
        console.log(conceptArr[i]);
        var definitionId = "definition" + i;

        // A modal box will be created and all possible definitions will be added inside it.
        if(from == 'eng_3_0') // If the currently selected language is English
        {
          if(data[i].source_concept.definition == "") // If no definition is found.
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
          else // Definitions are found
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
        else // If the currently selected language is not English
        {
          if(data[i].source_concept.gloss == "") // If no definition is found.
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
          else // Definitions are found
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

// The dialog box will ask the user for input to associate a word to the new tag.
// Only runs when the 'checkmark' button is pressed after a new tag box is made.
var openDialog = function(){
    $("#form_panel").fadeIn("slow");
};

// All unselected tags will be visible when the 'showTags' button is pressed.
var showTags = function(){
    $(".tagged_box").css("display","block");
    $(".tagged").css("border","2px solid #EEE");
    $(".tagged_title").css("display","block");
};

// All outlined tags will be hidden from view, but not deleted.
var hideTags = function(){
    $(".tagged_box").css("display","none");
    $(".tagged").css("border","none");
    $(".tagged_title").css("display","none");
};

// User can click on a newly made tag and have the option to move it to a new location only once.
// Once it is moved, it cannot be moved again.
var editTag = function(obj){

    $(obj).parent().parent().draggable( 'disable' );
    $(obj).parent().parent().removeAttr( 'class' );
    $(obj).parent().parent().addClass( 'tagged' );
    $(obj).parent().parent().css("border","none");
    $(obj).parent().css("display","none");
    $(obj).parent().parent().find(".tagged_title").css("display","none");
    $(obj).parent().html('');

};

// When clicking on 'x' of the selected tag, that tag will be deleted.
var deleteTag = function(obj){
    $(obj).parent().parent().remove();
};

// Save all tags present in the image panel to database.
var saveTags = function() {
  // Get all tags and save each of them as an element in the tagArray.
  var tagArr = document.getElementsByClassName('tagged');

  // Remove previously saved tags associated to current image,
  // then replace them with new/current tags in the image.

  // Remove old tags
  $.ajax({
    url: '/removeTags',
  }).done(function (data) {
    console.log("REMOVED TAGS");

  // Save current tags 1 by 1 to database
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
};
