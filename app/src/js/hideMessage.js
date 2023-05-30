var imagedatauri;
var rowN = 0;
//reads the original image 
function readURL(input){  

    var reader = new FileReader();
    reader.onload = function(e){
        imagedatauri = e.target.result;
        document.querySelector('#image1').src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
    
}
//encodes the user's message in the image and creates a new image for the user to download
function hideText(){
    var image = document.getElementById('image2'),
    download = document.getElementById("download"); 
    image.src = steg.encode(document.querySelector('#text').value, imagedatauri);
    download.href=image.src.replace("image/png", "image/octet-stream");
}
//decodes the image with the hidden message
function decode(input){ 
    try{
        decode(input);
    }
    catch(e){
        console.log(e);
    }
    finally{
        var reader = new FileReader();
        reader.onload = function(e){
            document.querySelector('#decoded').innerText = 
            steg.decode(e.target.result)
            console.log(steg.decode(e.target.result));
        }
        reader.readAsDataURL(input.files[0]);
    }
  
    
}