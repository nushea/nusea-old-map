const mapX = 4200;
const mapY = 2600;

var elements = document.getElementsByClassName("mapimg");
var elementsArray = Array.from(elements);
var map = document.getElementById("actMap");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "img/Nusea/Full.png";

image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };

function moveContext(){
    document.getElementById("context").style.top = (map.offsetTop + map.offsetHeight) + "px";
}
function getPixelColor(x, y){
    x -= map.offsetLeft - map.offsetWidth/2 - document.documentElement.scrollLeft;
    y -= map.offsetTop - document.documentElement.scrollTop;
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
    if(col[0] == 107 && col[1] ==48 && col[2] ==159 && col[3] > 250 )
        return "Hago";
    if(col[0] == 168 && col[1] == 45 && col[2] ==210 && col[3] > 250 )
        return "Haryu";
    if(col[0] == 190 && col[1] == 128 && col[2] ==74 && col[3] > 250 )
        return "Harim";
    if(col[0] == 197 && col[1] == 98 && col[2] ==162 && col[3] > 250 )
        return "Hamnq";
    if(col[0] == 201 && col[1] == 169 && col[2] ==99 && col[3] > 250 )
        return "Adzir";
    if(col[0] == 192 && col[1] == 128 && col[2] ==93 && col[3] > 250 )
        return "Krin";
    if(col[0] == 213 && col[1] == 217 && col[2] ==68 && col[3] > 250 )
        return "Edin";
    if(col[0] == 190 && col[1] == 179 && col[2] ==67 && col[3] > 250 )
        return "Dzuri";
    if(col[0] == 202 && col[1] == 238 && col[2] ==103 && col[3] > 250 )
        return "Alhim";
    if(col[0] == 213 && col[1] == 233 && col[2] ==93 && col[3] > 250 )
        return "Agui";
    if(col[0] == 142 && col[1] == 138 && col[2] ==100 && col[3] > 250 )
        return "Urda";
    if(col[0] == 127 && col[1] == 194 && col[2] ==68 && col[3] > 250 )
        return "Toua";
    if(col[0] == 52 && col[1] == 87 && col[2] ==21 && col[3] > 250 )
        return "Kruki";
    if(col[0] == 42 && col[1] == 194 && col[2] ==195 && col[3] > 250 )
        return "Fara";
}
function texthing(who){
    var NewText = "EMPTY";

    if(who == "Hamnq") 
        NewText = "<h3> HAMNQ </h3> <p> The birth of the Ra'u, hamnq is the place to be if you want to experience the old order Ga, although through the centuries of war it has come to be a bastion of bastions and a castle of castles </p>";
    if(who == "Hayi") 
        NewText = "<h3> HAYI </h3> <p> As even their name suggests, hayi is the land of elegance, cotton and the new order Ga, going through Rokya to Kyani you pass through the lands so many of our gods have been through, from Rokyan archipelago, to the BaMiNya river, and to the Ba'u river where the Ba'u script has been birhted </p>";
    if(who == "Hasi") 
        NewText = "<h3> HASI </h3> <p> If you want to marvel at the advancements of our world you need to visit Hasi, the land of good, where the cultural mix presents a variety of options, but think wrong, Hasi is still Ha land, so you will be welcomed as a Ga believer, and through thanks to the people of other beliefs you will be able to take comfort in RiMa like nowhere else";
    if(who == "Hago")
        NewText = "<h3> HAGO </h3> <p> Hago, as the name implies is the newest of the Ha lands, this makes it a land of exploration and adventure, it is the perfect land for a person who is ready to help in the expansion of our great religion</p>"
    if(who == "Hafu")
        NewText = "<h3> HAFU </h3> <p> Hafu represents a miriad of individual places, adventuring through it is bound to bring a new perspective in life, one of understanding why Ga is the religion it is, despite the fact that most places are old order you would be hard pressed to find more religious variety elsewhere, with multiple sea gods you are always under the protection of good spirits no matter where you decide to venture</p>"
    if(who != undefined && NewText == "EMPTY") 
        NewText = "<h3>" + who + "</h3> <p> There is not a description of them yet </p>";
    else if(who == undefined)
        NewText = "<h3> EMPTY </h3> <p> Press on any culture to find a short description of them </p>";
    
    document.getElementById("context").innerHTML = NewText;
}


document.addEventListener("click", function(event) {
    moveContext();
    col = getPixelColor(event.clientX, event.clientY);
    if(col != -1){
        hoverFunc(colorMatch(col));
        texthing(colorMatch(col));
    }
});
document.addEventListener("mousemove",function(event){
    moveContext();
});
window.addEventListener("resize",function(event){
    moveContext();
});

hoverFunc("WRONG");
setTimeout(moveContext, 100);