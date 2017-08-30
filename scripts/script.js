function readURL(input)
{
  if (input.files && input.files[0])
  {
    var reader = new FileReader();
    reader.onload = function(e)
    {
      $('#preview img').attr('src',e.target.result);

      //saves the selected image into localStorage
      localStorage.setItem('lastImage', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

//if "Submit" button is pressed, the image will be submitted and saved
function submitPressed()
{
  //uploads the preview image to the submit image
  $('#submitted img').attr('src', localStorage.getItem('lastImage'));
  //saves the submitted image to another localstorage called savedImage
  localStorage.setItem('savedImage', localStorage.getItem('lastImage'));
}

$(document).on('change','input[type="file"]',function()
{
  readURL(this);
});

//what to do as soon as page loads
$(document).ready(function()
{
  //savedImage is loaded
  $('#submitted img').attr('src', localStorage.getItem('savedImage'));
});
