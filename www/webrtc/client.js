/**
 * Created by THTF on 2019/1/30.
 */
var name,
    yourConnection,stream,connectedUser;
var yourVideo=document.querySelector("#yours"),
    theirVideo=document.querySelector("#theirs");
function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    return !!window.RTCPeerConnection;
}
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
        // video.src=window.URL.createObjectURL(stream);
        video.srcObject =stream;
    },function (err){alert(err)});
}
else
{
    alert('很抱歉，你的浏览器不支持usermedia');
}
var iceServers = {
    iceServers: IceServersHandler.getIceServers(),
    // iceTransportPolicy: iceTransportPolicy.value,
    rtcpMuxPolicy: 'require',
    bundlePolicy: 'max-bundle'
};
var connection=new WebSocket("ws://112.74.192.63:8888");
// var connection=new WebSocket("ws://192.168.199.217:8888");
var loginPage=document.querySelector("#login-page");
usernameInput=document.querySelector(("#username"));
loginButton=document.querySelector("#login");
callpage=document.querySelector('#call-page');
theirUsernameInput=document.querySelector("#their-username");
callButton=document.querySelector("#call");
hangUpButton=document.querySelector("#hang-up");
callpage.style.display="none";
callButton.addEventListener("click",function()
{
    var theirUsername=theirUsernameInput.value;
    if(theirUsername.length>0)
    {
        startPeerConnection(theirUsername);
    }
});
function startPeerConnection(user)
{
    connectedUser=user;
    yourConnection.createOffer(function(offer){
        // alert('createOffer');
        send({
            type:"offer",
            offer:offer
        });
        yourConnection.setLocalDescription(offer);
    },function(error){
        alert("an error has occured"+error);
    });
}
function onOffer(offer,name)
{
    connectedUser=name;
    yourConnection.setRemoteDescription(new RTCSessionDescription(offer));
    yourConnection.createAnswer(function(answer){
        yourConnection.setLocalDescription(answer);
        send({
            type:"answer",answer:answer
        });
    },function(error){alert("an error has occurred")});
}
function onAnswer(answer)
{
    yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
}
function onCandidate(candidate)
{
    yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
}
loginButton.addEventListener("click",function(event){
    name=usernameInput.value;
    if(name.length>0)
    {
        send({
            type:"login",
            name:name
        })
    }

});
function  onLogin(success)
{
    if(success===false)
    {
        alert("login unsuccessful ,please try a different name.");
    }
    else
    {
        loginPage.style.display="none";
        callpage.style.display="block";
        startConnection();
    }
}

function startConnection()
{
    if(hasUserMedia())
    {
        navigator.getUserMedia({video:true,audio:true},
        function(myStream)
        {
            stream=myStream;
            // yourVideo.src=window.URL.createObjectURL(stream);
            yourVideo.srcObject=stream;
            setupPeerConnection(stream);
        },function(error){
                console.log(error);
            })
    }

}
function setupPeerConnection(stream) {
    var configuration = {
        "iceServers": [{"url": "turn:webrtcweb.com:7788"}]
    }
    if(hasRTCPeerConnection()){
        // yourConnection = new RTCPeerConnection(configuration);
        yourConnection = new RTCPeerConnection(iceServers);
        yourConnection.addStream(stream);
        yourConnection.onaddstream = function (e) {
            // theirVideo.src = window.URL.createObjectURL(e.stream);
            theirVideo.srcObject = e.stream;
        }
        yourConnection.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: event.candidate
                });
            }
        }
    } else {
        alert("Sorry,your browser does not support WebRTC.");
    }

}
connection.onopen=function(){
    console.log("Connected");
}
connection.onmessage=function(message)
{
    console.log("got message",message.data);
    if(message.data!='hello world'){
    var data=JSON.parse(message.data);
    // alert(data.type);
    switch (data.type)
    {
        case "login":
            onLogin(data.success);
            break;
        case "offer":
            onOffer(data.offer,data.name);
            break;
        case "answer":
            onAnswer(data.answer);
            break;
        case "candidate":
            onCandidate(data.candidate);
            break;
        case "leave":
            leave();
            break;
        default:
            break;
    }}
}

connection.onerror=function(error)
{
    console.log("got error",error);

}
function  send(message)
{
    if(connectedUser)
    {
        message.name=connectedUser;
    }
    connection.send(JSON.stringify(message));
}

