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

function hoverFunc(who){
    for (var i = 0; i < elementsArray.length; i++) {
        if(elementsArray[i].id === "blank" || elementsArray[i].id === "empty" || elementsArray[i].id === "actMap" || elementsArray[i].id === who)
            elementsArray[i].style.display = "block";
        else
            elementsArray[i].style.display = "none";    
    }
}

function colorMatch(value){
    if(col[0] == 218 && col[1] == 91 && col[2] == 96 && col[3] > 250 )
        return "Hayi";
    if(col[0] == 226 && col[1] == 31 && col[2] == 86 && col[3] > 250 )
        return "Hasi";
    if(col[0] == 235 && col[1] ==165 && col[2] ==255 && col[3] > 250 )
        return "Hafu";
    if(col[0] == 190 && col[1] == 128 && col[2] ==74 && col[3] > 250 )
        return "Harim";
    if(col[0] == 197 && col[1] == 98 && col[2] ==162 && col[3] > 250 )
        return "Hamnq";
}


hoverFunc("WRONG");

document.addEventListener("click", function(event) {
    col = getPixelColor(event.clientX, event.clientY);
    console.log(col);
    hoverFunc(colorMatch(col));
  });