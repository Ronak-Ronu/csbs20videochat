const socket= io('/');
const videogrid=document.getElementById('video-grid');
const myvideo=document.createElement('video');
myvideo.muted=true;
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
});
let myvideostream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myvideostream= stream;
    addvideostream(myvideo,stream);
    peer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video');
        call.on('stream',uservideostream=>{
            addvideostream(video,uservideostream)
        })
    });
    socket.on('user-connected',(userid)=>{
        connecttouser(userid,stream);
    })
})
peer.on('open',id =>{
    socket.emit('join-room',ROOMID,id);
})

const connecttouser=(userid,stream)=>{
    const call=peer.call(userid,stream);
    const video=document.createElement('video');
    call.on('stream',uservideostream =>{
        addvideostream(video,uservideostream);
    })
    console.log('new user connected :',userid);
}
const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video);
}