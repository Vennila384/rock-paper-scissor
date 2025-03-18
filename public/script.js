
const socket = io();
let choice;

function findRoom(request)
{
    choice=request;
    if(request=="create")
    {
        var create=document.getElementById("createRoom");
        create.style.display="flex";
        var div = document.getElementById("container");
        div.style.display="none";
    }
    else if(request=="join")
   {
        var join=document.getElementById("joinRoom");
        join.style.display="flex";
        var div = document.getElementById("container");
        div.style.display="none";
    }
}

function back(type)
{
    if(type=="create")
    {
        var create=document.getElementById("createRoom");
        create.style.display="none";
        var div = document.getElementById("container");
        div.style.display="flex";
    }
    else if(type=="join")
    {
        var join=document.getElementById("joinRoom");
        join.style.display="none";
        var div = document.getElementById("container");
        div.style.display="flex";
    }
}


function showGame(type){
    var join=document.getElementById("joinRoom");
    var create=document.getElementById("createRoom");
    var div=document.getElementById("gamePage");
    var head=document.getElementById("head");
    // var players=document.getElementById("playerDetail");
    // var detail=document.getElementById("details");
    // detail.style.display="flex";
    // players.style.display="none";
    if(type=="join")
    {
        head.style.display="none"
        div.style.display="flex";
        join.style.display="none";
    }
    else if(type=="create")
    {
        head.style.display="none"
        div.style.display="flex";
        create.style.display="none";
    }    
}


function createRoom()
{
    var roomName = document.getElementById("newRoomName").value;
    var para=document.getElementById("paragraph");
    if(roomName!="")
    {
        socket.emit("createRoom",roomName);
    }
    else(roomName=="")
    {
        para.style.display="flex";
    }
    setTimeout(()=>{
        para.style.display="none";
    },2000);
}


socket.on("created",msg=>{
    console.log(msg);
    showGame('create');
})

socket.on("exist",msg=>{
    console.log(msg);
})

function joinRoom()
{
    var roomName=document.getElementById("roomName").value;
    var para=document.getElementById("paraTag");
    if(roomName!="")
    {
        socket.emit("join",roomName);
    }
    else if(roomName=="")                                                                                                                                                                    
    {
        para.style.display="block";
    }
    // else{
    //     console.log("Array: ",rooms)
    //     console.log("This room is full");
    // }
    setTimeout(()=>{
        para.style.display="none";
    },2000);
}

socket.on("roomFull",msg=>{
    console.log(msg);
})


socket.on("joined",msg=>{
    console.log(msg);
    showGame('join');
})


// function showGame()
// {
    // var roomName=document.getElementById("roomName").value;
    // var para=document.getElementById("paraTag");
    // if(roomName!="")
    // {
    //     // para.style.display="none";
    //     socket.emit("join",roomName);
    // }
    // else
    // {
    //     para.style.display="block";
    // }
    // setTimeout(()=>{
    //     para.style.display="none";
    // },2000);
    // var join=document.getElementById("joinRoom");
    // var gamePage=document.getElementById("gamePage");
    // join.style.display="none";
    // gamePage.style.display="flex";
// }

socket.on("msg2",(roomName,id)=>{
    rooms.push({roomName:roomName,socketId:id});
    showGame('join');
})


function userChoice(option)
{
    var whole=document.getElementById("images");
    var players=document.getElementById("playerDetail");
    var div=document.getElementById("image1");
    whole.style.display="none";
    players.style.display="flex";
    div.src = "./images/icon-"+option+".svg";
    console.log(option);
    if(choice=="create")
    {
        console.log(choice);
        socket.emit("cChoice",option);   
    }
    else if(choice=="join")
    {
        socket.emit("jChoice",option);
    }
}


socket.on("userChoice",(choices)=>{
    let image=document.getElementById("image2");
    var createRoom=choices.create;
    var joinRoom=choices.join;
    console.log(createRoom);
    console.log(joinRoom);
    console.log(choices);
    if(choice=="create")
    {
        image.src="./images/icon-"+joinRoom+".svg";
    }
    else if(choice=="join"){
        image.src="./images/icon-"+createRoom+".svg";
    }
    scoreCalculation(choices);
})


function showNewGamePage(type)
{
    document.getElementById("image1").src="";
    document.getElementById("image2").src="";
    var join=document.getElementById("joinRoom");
    var create=document.getElementById("createRoom");
    var div=document.getElementById("gamePage");
    var head=document.getElementById("head");
    var players=document.getElementById("playerDetail");
    var detail=document.getElementById("details");
    var image=document.getElementById("images");
    document.getElementById("result").innerText="";
    detail.style.display="flex";
    players.style.display="none";
    image.style.display="flex";
    if(type=="join")
    {
        head.style.display="none"
        div.style.display="flex";
        join.style.display="none";
    }
    else if(type=="create")
    {
        head.style.display="none"
        div.style.display="flex";
        create.style.display="none";
    }    
}

function scoreCalculation(obj)
{
    var createRoom=obj.create;
    var joinRoom=obj.join;
    let result="";
    var array1 = ["scissors","paper","rock"];
    var array2 = ["paper","rock","scissors"];
    for(let i=0; i<array1.length; i++)
    {
        if(createRoom==joinRoom){
            result="Draw";
        }
        else if(createRoom==array1[i]&&joinRoom==array2[i]){
            if(choice=="create"){
                console.log("create win");
                var score=Number(document.getElementById("scoreNumber").innerText);
                document.getElementById("scoreNumber").innerText=score+1;
                document.getElementById("result").innerText="You Win!";
            }
            else if(choice=="join"){
                console.log("Join lose");
                document.getElementById("result").innerText="You Lose";
            }
        }
        else if(createRoom==array2[i]&&joinRoom==array1[i]){
            if(choice=="join"){
                console.log("join win");
                var score=Number(document.getElementById("scoreNumber").innerText);
                document.getElementById("scoreNumber").innerText=score+1;
                document.getElementById("result").innerText="You Win!";
            }
            else if(choice=="create"){
                console.log("create lose");
                document.getElementById("result").innerText="You Lose";
            }
        }
    }
    socket.emit("finish");
    setTimeout(() => {
        showNewGamePage(choice);
    },5000);
}

