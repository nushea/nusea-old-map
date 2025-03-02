// load the wasm module
var script = document.createElement('script');
script.src = 'js/time.js';
document.head.appendChild(script);
var curtime;

var divt = document.getElementById('dietime');
divt.innerHTML = "uwu";


script.onload = () => {
    Module.onRuntimeInitialized = () => {
        
		curtime = Module.cwrap('curtime', null, ['number']);
    };
};



var checkWasmReady = setInterval(() => {
    if (curtime) {
		var oup = Module._malloc(50);
		curtime(oup);
		var outputString = Module.UTF8ToString(oup);
		if(outputString.charAt(outputString.length - 3) == ':')
			outputString = outputString.substring(0, outputString.length - 2) + '0' + outputString.charAt(outputString.length - 2);
		outputString = "<p style=\"font-size: 125%;margin: 0;\">" + outputString.substring(0, outputString.indexOf(' ')) + "</p>" + 
			           "<p style=\"font-size: 200%;margin: 0;\">" + outputString.substring(outputString.indexOf(' ')+1) + "</p>";
		divt.innerHTML = outputString;
	        

        Module._free(oup);
    } else {
        console.log("nowasm");
    }
}, 1000);


