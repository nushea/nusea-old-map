const mapX = 4200;
const mapY = 2600;

var elements = document.getElementsByClassName("mapimg");
var elementsArray = Array.from(elements);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "img/Nusea/Full.png";

image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };

function getPixelColor(x, y){
    var map = document.getElementById("actMap");
    x -= map.offsetLeft - map.offsetWidth/2;
    y -= map.offsetTop;
    x = ~~(mapX * x / map.offsetWidth);
    y = ~~(mapY * y / map.offsetHeight);
    if(x > 0 && x < mapX && y > 0 && y < mapY)
        return ctx.getImageData(x, y, 1, 1).data;
    else 
        return -1;
}
function colorMatch(value){
    if(col[0] == 197 && col[1] == 98 && col[2] == 162 && col[3] == 255)
        return "Hamnq";
}

document.addEventListener("click", function(event) {
    col = getPixelColor(event.clientX, event.clientY);
    hoverFunc(colorMatch(col));
  });

function hoverFunc(who){
    for (var i = 0; i < elementsArray.length; i++) {
        if(elementsArray[i].id === "blank" || elementsArray[i].id === "empty" || elementsArray[i].id === "actMap" || elementsArray[i].id === who)
            elementsArray[i].style.display = "block";
        else
            elementsArray[i].style.display = "none";    
    }
}
hoverFunc("WRONG");