import Chip8 from "./Chip8.js";

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

function run(chip8) {
	chip8.tick();
	setTimeout(run, window.tickRateMS, chip8);
}

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
				run(chip8);
			});
		},
		false,
	);
}

window.tickRateMS = 50;

main();
