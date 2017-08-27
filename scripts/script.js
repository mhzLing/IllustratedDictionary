function readURL(input)
{
  if (input.files && input.files[0])
  {
    var reader = new FileReader();
    reader.onload = function(e)
    {
      $('#preview img').attr('src',e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$(document).on('change','input[type="file"]',function()
{
  readURL(this);
});
