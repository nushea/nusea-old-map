// load the wasm module
var script = document.createElement('script');
script.src = 'js/time.js';
document.head.appendChild(script);
var curtime;


script.onload = () => {
    Module.onRuntimeInitialized = () => {
        
		curtime = Module.cwrap('curtime', null, ['number']);
    };
};

//while(curtime == null){
//	console.log("nowasm");
//}


var checkWasmReady = setInterval(() => {
    if (curtime) {
		var oup = Module._malloc(50);
		curtime(oup);
		var outputString = Module.UTF8ToString(oup);
		console.log(outputString);
	        

        Module._free(oup);
    } else {
        console.log("nowasm");
    }
}, 1000);

/*
var oup = Module._malloc(50);


    curtime(oup);
	var outputString = Module.UTF8ToString(oup);
	console.log(outputString);
	console.log(outputString);
	i++;
		
	Module._free(oup);
*/

