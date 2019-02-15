
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");

}
else {
// List cameras and microphones.

    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
            });
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
}
/*

MediaStreamTrack.getSettings(
    function(sources)
    {
        var audioSources=null;
        var videoSource=null;
        for(var i=0;i<sources.length;i++)
        {

            var source=sources[i];
            if(source.kind==="audio")
            {
                console.log("发现麦克风",source.label,source.id);
                audioSources=source.id;
            }
            else if(source.kind==="video")
            {
                console.log("发现摄像头",source.label,source.id);
            }
            else
            console.log("发现未名资源",source);
        }
        var constraints=
        {
            audio:{
                optional:[{sourceId:audioSources}]
            },
            video:{
                optional:[{sourceId:videoSource}]
            }
        };
        navigator.getUserMedia({video:{mandatory:{maxWidth:640,maxHeight:320}},audio:false},function(stream){
            var video=document.querySelector('video');
            video.src=window.URL.createObjectURL(stream);
            alert(video.src);
        },function (err){});

    }
);


*/
