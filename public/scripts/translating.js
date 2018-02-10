var tagArr = []; // All html of tags for the image is pulled from the database and saved in this array.
var jsonArr = []; // All concept IDs for the image is pulled from the database and saved in this array.

$(document).ready(function() {

  // Load the selected image
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

// This function will show corresponding translated words based on the tag clicked on the side.
// When a tag is clicked, the translated words with the same concept will be shown in the box on the right of the image.
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
          '<div class="translation_entry" style="background-color: #efdac1; height: 30px; padding: 4px; border-radius: 10px; margin: 5px;">' +
          "No Translation Found" +'</div>');
      }
      else {
        for(var i = 0; i < data[0].terms.length; i++)
        {
          if( to == 'eng_3_0')
          {
            $("#translation_box").append(
              '<div class="translation_entry" style="background-color: #efdac1; height: 30px; padding: 4px; border-radius: 10px; margin: 5px;">' +
              data[0].terms[i].lemma +'</div>');
          }
          else {
            $("#translation_box").append(
              '<div class="translation_entry" style="background-color: #efdac1; height: 30px; padding: 4px; border-radius: 10px; margin: 5px;">' +
              data[0].terms[i].lemma_accent +'</div>');
          }
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
