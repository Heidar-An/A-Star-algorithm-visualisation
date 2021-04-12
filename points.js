class Points{
  constructor(x, y){
      this.x = x;
      this.y = y;
      this.colour = "white";
      this.f = 0;
      this.g = 0;
      this.h = 0;
      this.parent = null;
  }
  change(){
    if(this.colour === "white"){
      this.colour = "black";
    }
    else if(this.colour === "black"){
      this.colour = "white";
    }
  }
  initial(){
    this.colour = "blue";
  }
  end(){
    this.colour = "green";
  }
  check(){
    this.colour = "purple";
  }
  path(){
    this.colour = "yellow";
  }
  current(){
    return this.colour;
  }
  hChange(newH){
    this.h = newH;
  }
  fChange(newF){
    this.f = newF;
  }
  gChange(newG){
    this.g = newG;
  }
  parentChange(newParent){
    this.parent = newParent;
  }
}
