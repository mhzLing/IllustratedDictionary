<script>
   function previewFile(){
       var preview = document.querySelector('img');
       var file    = document.querySelector('input[type=file]').files[0];
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file);
           document.getElementById("previewImg").innerHTML = reader.result;
       } else {
           preview.src = "";
       }
  }

  previewFile();
  </script>
