const mapX = 4200;
const mapY = 2600;

document.addEventListener("click", function(event) {
    var map = document.getElementById("actMap");
    var x = event.clientX;
    var y = event.clientY;
    x -= map.offsetLeft - map.offsetWidth/2;
    y -= map.offsetTop;
    x = ~~(mapX * x / map.offsetWidth);
    y = ~~(mapY * y / map.offsetHeight);
    if(x > 0 && x < mapX && y > 0 && y < mapY)
        console.log(x + " " + y);
  });
/*
function hoverFunc(who, value){
    switch(value){
    case 0:
        document.getElementById(who).style.display = "block";
        return;
    case 1:
        document.getElementById(who).style.display = "none";
        return;
    }
}
var elements = document.getElementsByClassName("mapimg");
var elementsArray = Array.from(elements);
for (var i = 0; i < elementsArray.length; i++) {
    if(elementsArray[i].id === "blank" || elementsArray[i].id === "empty")
        elementsArray[i].style.display = "block";
    else
        elementsArray[i].style.display = "none";
        
  }
  */
//document.getElementById("blank").style.display = "none";