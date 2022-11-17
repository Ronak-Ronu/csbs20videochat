const socket=io('/')
const videogrid = document.getElementById('video-grid')
const mypeer= new Peer(undefined,{
    host:'/',
    port:'2002'
})
const myvideo=document.createElement('video')
myvideo.muted=true
const peers={}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    addvideostream(myvideo,stream)
    
    mypeer.on('call',call => {
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream => {
            addvideostream(video,userVideoStream)
        })
    })
    socket.on('user-connected',userid =>{
        connectTonewuser(userid,stream)
    })
})
socket.on('user-disconnected',userid=>{
    if(peers[userid]) peers[userid].close()
})
function connectTonewuser(userid,stream){
    const call=mypeer.call(userid,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addvideostream(video,userVideoStream)
    })
    call.on('close',() => {
        video.remove()
    })
    peers[userid]=call
}
mypeer.on('open',id => {
    socket.emit('join-room',ROOM_ID,id)
})

// socket.on('user-connected',userid => {
//     console.log('user-connected:'+userid)
// })
function addvideostream(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videogrid.append(video)
}