import CPU from "./CPU.js";
import PPU from "./PPU.js";

let keyList = [
	"1",
	"2",
	"3",
	"4",
	"Q",
	"W",
	"E",
	"R",
	"A",
	"S",
	"D",
	"F",
	"Z",
	"X",
	"C",
	"V",
];

export default class Chip8 {
	constructor() {
		this.cpu = new CPU();
		this.ppu = new PPU(document.getElementById("canvas"));
	}

	init() {
		this.cpu.init();
		this.ppu.init();
	}

	loadROM(buffer) {
		this.cpu.loadROM(buffer);
	}

	tick() {
		this.cpu.tick();

		if (this.cpu.drawFlag) {
			this.ppu.render(this.cpu.gfx);
		}

		this.cpu.drawFlag = false;

		// check keyboard:
		for (let i = 0; i < keyList.length; i++) {
			if (key.isPressed(keyList[i])) {
				this.cpu.keys[i] = 1;
			} else {
				this.cpu.keys[i] = 0;
			}
		}
	}
}
