
const express=require('express');
const socketio=require('socket.io');
const http=require('http');
const app=express();

const path=require('path');
const pubdir=path.join(__dirname,"/public");
const server=http.createServer(app);
const io=socketio(server);
app.set("view engine","ejs");
app.use(express.static(pubdir));

app.get("/",(req,res)=>{
    res.render(__dirname+"/public/index.html");
})

let count=0;
let rooms=[];
let players={};

io.on("connection",(socket)=>{
    // console.log(socket);
    console.log("new user connected "+socket.id);

    socket.on("createRoom",(roomName)=>{
        count=0;
        for(let i=0; i<rooms.length; i++)
        {
            if(roomName==rooms[i].roomName)
            {
                count++;
            }
        }
        if(count==0)
        {
            socket.join(roomName);
            socket.emit("created","Room created");
            rooms.push({roomName:roomName,id:socket.id});
        }
        else if(count>0)
        {
            socket.emit("exist","This room is already exist");
        }
        socket.on("cChoice",(choice)=>{
            console.log(players);
            players.create=choice;
            console.log(players);
            if(Object.keys(players).length==2)
            {
                io.to(roomName).emit("userChoice",players);
            }
        })

        
    })

    socket.on("join",(roomName)=>{
        count=0;
        for(let j=0; j<rooms.length; j++)
        {
            if(roomName==rooms[j].roomName)
            {
                count++;
            }
        }
        if(count==1)
        {
            socket.join(roomName);
            socket.emit("joined","room is joined");
            rooms.push({roomName:roomName,id:socket.id});
        }
        else if(count>1)
        {
            socket.emit("roomFull","This room is full");
        }
        socket.on("jChoice",(choice)=>{
            players.join=choice;
            if(Object.keys(players).length==2)
            {
                io.to(roomName).emit("userChoice",players);
            }
        })

        // if(players.length==2)
        // {
        //     socket.emit("userChoice",players);
        // }
    })

    socket.on("finish",()=>{
        players={};
    })

    // const sockets = io.to("test").fetchSockets();
    // console.log(sockets);
    console.log("players length: "+players.length);
    console.log("rooms: "+rooms.length);
})

server.listen(3108,()=>{
    console.log("Server is running on port 3108");
})
