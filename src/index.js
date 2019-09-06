import Chip8 from "./Chip8.js";

// function readFile(file) {
// 	return new Promise((resolve, reject) => {
// 		let fr = new FileReader();
// 		fr.onload = (x) => resolve(fr.result);
// 		fr.readAsText(file);
// 	});
// }

// function dispFile(contents) {
// 	document.getElementById("contents").innerHTML = contents;
// }

// function clickElem(elem) {
// 	// Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
// 	var eventMouse = document.createEvent("MouseEvents");
// 	eventMouse.initMouseEvent(
// 		"click",
// 		true,
// 		false,
// 		window,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		false,
// 		false,
// 		false,
// 		false,
// 		0,
// 		null,
// 	);
// 	elem.dispatchEvent(eventMouse);
// }

// function openFile(func) {
// 	let readFile = (e) => {
// 		var file = e.target.files[0];
// 		if (!file) {
// 			return;
// 		}
// 		var reader = new FileReader();
// 		reader.onload = function(e) {
// 			var contents = e.target.result;
// 			fileInput.func(contents);
// 			document.body.removeChild(fileInput);
// 		};
// 		reader.readAsText(file);
// 	};
// 	let fileInput = document.createElement("input");
// 	fileInput.type = "file";
// 	fileInput.style.display = "none";
// 	fileInput.onchange = readFile;
// 	fileInput.func = func;
// 	document.body.appendChild(fileInput);
// 	clickElem(fileInput);
// }

function openFile(cb) {
	let reader = new FileReader();
	reader.onload = (event) => {
		let arrayBuffer = event.target.result;
		let array = new Uint8Array(arrayBuffer);
		// let binaryString = String.fromCharCode.apply(null, array);
		cb(array);
	};
	reader.readAsArrayBuffer(event.target.files[0]);
}

// document.querySelector("input").addEventListener("change", (event) => {}, false);

function main() {
	let chip8 = new Chip8();
	chip8.init();

	window.chip8 = chip8;

	document.querySelector("input").addEventListener(
		"change",
		() => {
			openFile((contents) => {
				// console.log(contents);
				// let ROM = contents.
				chip8.loadROM(contents);
				// while (true) {
				setInterval(() => {
					chip8.tick();
					// console.log(chip8.cpu.opcode.toString(16));
				}, 200);
				// }
			});
		},
		false,
	);

	// openFile((contents) => {
	// 	// console.log(contents);
	// 	chip8.loadROM(contents.split(""));
	// 	setInterval(() => {
	// 		chip8.tick();
	// 	}, 100);
	// });

	// readFile("C:\\");
}

// window.run = main;
main();
