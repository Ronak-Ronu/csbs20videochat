const socket= io('/');
const videogrid=document.getElementById('video-grid');
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'9000'
});
const myvideo=document.createElement('video');
myvideo.muted=true;
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
    console.log('user connected :',userid);
}
const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video);
}