// this is some initial stuff to define, canvas size, number of squares can be changed here, nothing else.
let width = 400;
let height = 400;
let myGrid = [];
let gap = 20;
let first = 0;
let startPoint = false;
let endPoint = false;
let startPosition;
let endPosition;

//make every single square in the canvas an object of the class "points"
function setup() {
  createCanvas(400, 400);
  for(let i = 0; i < width / gap; i++){
    myGrid.push([])
    for(let j = 0; j < height / gap; j++){
      myGrid[i][j] = new Points(i * gap, j * gap);
    }
  }
}

// this draws the lines, and colours the squares in depending on what they are, e.g. barricade, end position, start position, path, checked...
function draw() {
  background(255);
  let finalPath = algorithm();
  for(let i = 0; i < width / gap; i++){
    for(let j = 0; j < height / gap; j++){
      if(myGrid[i][j].current() ===  "black"){
        fill(0)
        //print(i * gap, j * gap)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "blue"){
        fill(0, 0, 255)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "green"){
        fill(0, 255, 0)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "purple"){
        fill(128,0,128)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "yellow"){
        fill(255,255,0)
        rect(i * gap, j * gap, gap, gap)
      }
        
    }
  }
  for(let i = 0; i < width / gap; i++){
    line(i * gap, 0, i * gap, height)
  }
  for(let j = 0; j < height / gap; j++){
    line(0, j * gap, width, j * gap)
  }
  // call the algorithm at the end to check if the final position and initial position has been put onto the canvas
  if(finalPath.length > 0){
    noLoop()
  }
}

//if the mouse is pressed, the row and column of the square pressed is found, if it's a left mouse click then the colour changes from white to black or black to white, else the square becomes the inital square / final square
function mousePressed(){
  posX = mouseX
  posY = mouseY
  row = intdivision(posX, gap)
  column = intdivision(posY, gap)
  row = int(row)
  column = int(column)
  if (mouseButton === LEFT){
    myGrid[row][column].change()
  }
  if(mouseButton === RIGHT){
    if(first === 0){
      myGrid[row][column].initial()
      startPoint = true;
      startPosition = myGrid[row][column];
    }
    else if(first === 1){
      myGrid[row][column].end()
      endPoint = true;
      endPosition = myGrid[row][column];
    }
    //this makes sure that after first is higher than 1, there can't be multiple final or start positions
    first ++
  }
}

//the actual a star algorithm
function algorithm(){
  //check if the start and final position have been plotted
  if(startPoint === true && endPoint === true){
    //add the heuristic distance to the start position from the final position
    startPosition.h = distance([startPosition.x, startPosition.y]);
    
    let openList = []
    
    openList.push(startPosition)
    let closedList = []
      while (openList.length > 0){
        //print(openList)
        lowPos = 0;
        for(let i = 0; i < openList.length; i++){
          if(openList[i].f < openList[lowPos].f){
            lowPos = i;
          }
        }
        let currentPosition = openList[lowPos];
        //currentPosition.check()
        //if the currentPosition is the endPosition, retrace steps and find the path, then return this path
        if(currentPosition === endPosition){
          let curr = currentPosition;
          let ret = [];
          while(curr.parent != null){
            curr.path()
            ret.push(curr);
            curr = curr.parent;
          }
          endPosition.end()
          return ret.reverse();
        }
        openList.splice(lowPos, 1);
        closedList.push(currentPosition);
        let neighbours = neighbors(currentPosition);
        for(let i = 0; i < neighbours.length; i++){
          let neighbour = neighbours[i];
          if(closedList.includes(neighbour) || neighbour.colour == "black"){
            continue;
          }
          neighbour.check()
          let gScore = currentPosition.g + 1;
          let gScoreBest = false;
          if(openList.includes(neighbour) == false){
            gScoreBest = true;
            neighbour.h = distance([neighbour.x, neighbour.y]);
            openList.push(neighbour);
          }
          else if(gScore < neighbour.g){
            gScoreBest = true;
          }
          if(gScoreBest == true){
            neighbour.parent = currentPosition;
            neighbour.g = gScore;
            neighbour.f = neighbour.g + neighbour.h;
          }
        }
      }
  }
  //meaning that either the path is not possible or the final node/initial node has not yet been placed.
  return [];
}

//this is the euclidean distance of the node passed to it, and the final node, e.g. the heuristic, I prefer the euclidean to the manhatten distance, since I believe that it makes it more accurate.
function distance(randomPosition){
  startX = randomPosition[0] * gap;
  startY = randomPosition[1] * gap;
  finalX = endPoint * gap;
  finalY = endPoint * gap;
  heuristic = ((finalX - startX) ** 2 + (finalY - startY) ** 2) ** 1/2;
  return heuristic;
}

// find each neighbour of the node passed to it
function neighbors(node){
  let ret = [];
  let nodeX = intdivision(node.x, gap);
  let nodeY = intdivision(node.y, gap);
  //print(nodeX, nodeY)
  //first check if the neighbour is within the canvas, if yes then add it onto the neighbour list and return it at the end
  if(0 <= nodeX - 1 && nodeX - 1 < width / gap){
    ret.push(myGrid[nodeX - 1][nodeY])
  }
  if(0 <= nodeX + 1 && nodeX + 1 < width / gap) {
      ret.push(myGrid[nodeX+1][nodeY]);
  }
  if(0 <= nodeY - 1 && nodeY - 1 < height / gap) {
      ret.push(myGrid[nodeX][nodeY-1]);
  }
  if(0 <= nodeY + 1 && nodeY + 1 < height / gap) {
      ret.push(myGrid[nodeX][nodeY+1]);
  }
  //print(ret)
  return ret;
}

// a function I made for integer division to work out the position of the mouse, there is definitely a better way, but I don't know it, so I had to implement integer division myself, since there is no integer division feature in JS according to stack overflow.

function intdivision(x, gap){
  return ((x / gap) - (x % gap) / gap)
}
