require("dotenv").config()
const { Socket } = require('engine.io')
const express= require('express')
const { request } = require('http')
const path = require("path")
const app = express()
const server = require('http').Server(app)
const io= require('socket.io')(server)
const { v4: uuidV4 } =require('uuid')
app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomid:req.params.room})
})
io.on('connection',socket =>{
    socket.on('join-room',(roomid,userid)=>{
        socket.join(roomid)
        socket.broadcast.to(roomid).emit('user-connected',userid)
        socket.on('disconnect',()=>{
        socket.broadcast.to(roomid).emit('user-disconnected',userid)
        })
    })
})

if(process.env.PROD){
    app.use(express.static(path.join(__dirname,'./VIDEOCHAT')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'./VIDEOCHAT'));
    });
}

const port = process.env.PORT || 9000;
server.listen(port)