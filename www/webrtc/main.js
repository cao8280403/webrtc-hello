/**
 * Created by THTF on 2019/1/25.
 */
alert(!!navigator.getUserMedia);
function  hasUserMedia()
{
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);
}
if(hasUserMedia())
{
    navigator.getUserMedia=(navigator.getUserMedia || navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);
   // navigator.getUserMedia= navigator.mozGetUserMedia;
    navigator.getUserMedia({video:{mandatory:{/*minAspectRatio:2.777,maxAspectRatio:2.778,*/maxWidth:640,maxHeight:320}},audio:false},function(stream){
     var video=document.querySelector('video');
        video.src=window.URL.createObjectURL(stream);
        alert(video.src);
    },function (err){});
}
else
{
    alert('很抱歉，你的浏览器不支持usermedia');
}