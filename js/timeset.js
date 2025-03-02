// load the wasm module
var script = document.createElement('script');
script.src = 'js/time.js';
document.head.appendChild(script);

script.onload = () => {
    Module.onRuntimeInitialized = () => {
        console.log("wasm loaded!");

        // Wrap the curtime function from C
		var curtime = Module.cwrap('curtime', null, ['number']);
		
		var oup = Module._malloc(50);
        // Call curtime and log the result
        console.log("curtime is ", curtime(oup));
		var outputString = Module.UTF8ToString(oup);
		console.log(outputString);
		
		Module._free(oup);

    };
};

