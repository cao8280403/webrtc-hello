# webrtc-hello
第一次成功的视频聊天


集成的时候的步骤： 
1，建立项目
2，替换内核cordova plugin add cordova-plugin-crosswalk-webview
    安装好之后，需要在里面两处位置修改最低版本16改为19以符合最新的android版本
    <preference name="android-minSdkVersion" value="19" />
3，由于新版本gradle跟旧版的cordova-android不兼容，需要添加兼容插件
     cordova plugin add cordova-android-support-gradle-release --variable ANDROID_SUPPORT_VERSION=27.0.0
4,添加安卓平台 (如果没有修改内核最低版本，此处会变为默认的16，出错)
    cordova platform add android 
5，在androidmanifest.xml文件中添加权限，否则不会调用摄像头和麦克风
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.CAPTURE_VIDEO_OUTPUT" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
