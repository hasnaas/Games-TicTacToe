var squares=[];
var endgame=false; //detects the end of the game
var nbplayers=1; //defaults to one player
//one player's game settings
var computer='x';
var hplayer='o';

//two players's game settings
var player1='x';
var player2='o';
var turn=player1;


//show the settings dialog at first
$(document).ready(function(){
  $("#myModal").modal('show');
  });
$("#submit2").click(function(){
  //reset_canvas();
  var s=$('input[name="symbol"]:checked').val();
  if(s!=null)
  if(s=='x'){
    computer='o';
    hplayer='x';
  }
  else{
    computer='x';
    hplayer='o';
  }
    $("#myCanvas").off("click",listener2);
  $("#myCanvas").off("click",listener1);
    $("#myCanvas").on("click",listener1);
});
//
$('#submit').click(function(){
  endgame=true;
  reset_canvas();
  var v=$('input[name="nbplayers"]:checked').val();
  if(v!=null)
    nbplayers=v;
  if(nbplayers==1){
    $("#myModal2").modal("show");
    
  }
    
    else{
      $("#myCanvas").off("click",listener1);
      $("#myCanvas").on("click",listener2);
      turn=player1;
    }
      
});



//handles two players game
function listener2(event){
  var totalOffsetX = 0;
    var totalOffsetY = 0;
    var x = 0;
    var y = 0;
    var currentElement = this;
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

   //actual coordinates of the click
    x = event.pageX - totalOffsetX;
    y = event.pageY - totalOffsetY; 
  //corresponding square's coordinates
  x=Math.floor(x/90)*90;
  y=Math.floor(y/90)*90;
 if(endgame){
   reset_canvas();
   endgame=false;
 }
  
  //draw a circle or a cross depending on players'turns
  //$("#pl").html("Player "+turn+" turn");
  for(var i=0;i<squares.length;i++)
    if(squares[i].x==x && squares[i].y==y){
      if(turn==player1)
        {
          drawCross(x,y);
          turn=player2;
        }
      else
        {
          drawCircle(x,y);
          turn=player1;
        }
      break;
    }
    
  if(checkGrid(player1)){
    $("#pl").html("player "+player1+" wins !");
    endgame=true;
  }
    
  else if (checkGrid(player2)){
    $("#pl").html("player "+player2+" wins !");
    endgame=true;
  }
    
  else if(emptyPlaces().length==0)
    $("#pl").html("A tie!");
  else {
    $("#pl").html("player "+turn+" turn");
  }
  
 
}

//handles one player game
function listener1(event){
var totalOffsetX = 0;
var totalOffsetY = 0;
var x = 0;
var y = 0;
var currentElement = this;
do{
totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
}
while(currentElement = currentElement.offsetParent)
//actual coordinates of the click
    x = event.pageX - totalOffsetX;
    y = event.pageY - totalOffsetY;
//corresponding square's coordinates
  x=Math.floor(x/90)*90;
  y=Math.floor(y/90)*90;
if(endgame){
  reset_canvas();
  endgame=false;
}
  
$("#pl").html("Your turn");
for(var i=0;i<squares.length;i++){
    if(squares[i].x==x &&squares[i].y==y){
      if(squares[i].checked!='')
        // do not count a click on an aleardy clicked square
        continue;
      if(hplayer=='o')
        drawCircle(x,y);
      else if(hplayer=='x')
        drawCross(x,y);
      if(checkGrid(hplayer)){
    $("#pl").html("You win");
    endgame=true;
  }
      
    else if(emptyPlaces().length==0){
      $("#pl").html("A tie");
    }
      

  else{
    $("#pl").html("Computer's turn");
    var val=minimax(computer);
  
    for(var i=0;i<9;i++)
      if(squares[i].number==val.number){
        if(computer=='x')
        drawCross(squares[i].x,squares[i].y);
        else if(computer=='o')
          drawCircle(squares[i].x,squares[i].y);
        break;
      }
    if(checkGrid(computer)){
      $("#pl").html("The computer wins");
      endgame=true;
     }
      
    else if(emptyPlaces().length==0)
      $("#pl").html("A tie");
    else
      $("#pl").html("Your turn");
        
  }
      
    break;
    }
}
  
  
  
  
}

//calculate the best move with the minimax algorithm
//references here
//https://medium.freecodecamp.com/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
//and
//http://neverstopbuilding.com/minimax
function minimax(player){
  
 if(checkGrid(computer))
   return {score:10};
  else if(checkGrid(hplayer))
    return {score:-10};
  else if (emptyPlaces().length==0)
    return {score:0};
  else{
    var moves=[];
    
    for(var i=0;i<9;i++)
      if(squares[i].checked==''){
        var move={};
        move.number=squares[i].number;
        squares[i].checked=player;
        if (player==computer){
          var res=minimax(hplayer);
          move.score=res.score;
        }
          
        else{
          var res=minimax(computer);
          move.score=res.score;
        }
          
        squares[i].checked='';
        moves.push(move);
        //console.log("moves so far :"+moves.length);
      }
    if(player==computer)
      moves=moves.sort(function(m1,m2){
        return m2.score-m1.score;
      });
    else
      moves=moves.sort(function(m1,m2){
        return m1.score-m2.score;
      });
    return moves[0];
  }
}

//returns empty spots on the game board
function emptyPlaces(){
  return squares.filter(function(s){
    return s.checked=='';
  });
}

//evaluate wether player won
function checkGrid(player){
  //checking columns
  for(var i=0;i<9;i++){
   if(squares[i].checked==player && squares[i+1].checked==player && squares[i+2].checked==player)
      return true;
     i=i+2;
  }
  //checking lines
  for(var i=0;i<3;i++){
    if(squares[i].checked==player && squares[i+3].checked==player && squares[i+6].checked==player)
      return true;
  }
  
  //checking the diagonals
if(squares[0].checked==player && squares[4].checked==player && squares[8].checked==player)
      return true;
if(squares[2].checked==player && squares[4].checked==player && squares[6].checked==player)
      return true;
  
  return false;
}

//constructor for the square object
function Square(x,y,checked,number){
  this.x=x;
  this.y=y;
  this.checked='';
  this.number=number;
}
Square.prototype.draw=function(color){
  var _x=this.x;
  var _y=this.y;
$("#myCanvas").drawRect({
  strokeStyle: color,
  strokeWidth: 2,
  x: _x, y: _y,
  fromCenter: false,
  width: 90,
  height: 90
});
}

//draws the initial grid
function drawGrid(){
  var k=1;
for(var i=0;i<=180;i=i+90)
  for(var j=0;j<=180;j=j+90)
    {
      
      var s=new Square(i,j,'',k);
      squares.push(s);
      s.draw('#5BC0DE');  
      k++;
      
    }  
}
function drawCircle(x,y){
  
  $("#myCanvas").drawArc({
  strokeStyle: 'red',
  strokeWidth: 2,
  x: x+45, y: y+45,
  radius: 20
  });
   squares.forEach(function(s){
    if(s.x==x && s.y==y)
      s.checked='o';
  });
}

function drawCross(x,y){
  var q=45*Math.sqrt(2)-20;
 $("#myCanvas").drawLine({
    strokeStyle:'orange',
    strokeWidth: 2,
    x1:x+q-25,y1:y+q-25,
    x2:x+q+25,y2:y+q+25
  });
  $("#myCanvas").drawLine({
    strokeStyle:'orange',
    strokeWidth: 2,
    x1:x+q-25,y1:y+q+25,
    x2:x+q+25,y2:y+q-25
  });

 squares.forEach(function(s){
    if(s.x==x && s.y==y)
      s.checked='x';
  });
}

$("#reset").on('click',function(){
  reset_canvas();
});

function reset_canvas(){
  $("#myCanvas").clearCanvas();
  $("#pl").html("New Game");
  squares=[];
  drawGrid();
}
reset_canvas();