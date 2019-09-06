export default class PPU {
	constructor(canvas) {
		this.canvas = canvas;
	}

	init() {
		this.ctx = this.canvas.getContext("2d");
	}

	debugRender(gfx) {
		let lines = "";
		// Draw
		for (let y = 0; y < 32; ++y) {
			let line = "";
			for (let x = 0; x < 64; ++x) {
				if (gfx[y * 64 + x] == 0) {
					line += "O";
				} else {
					line += "X";
				}
			}
			// line += ` ${Math.random()} ${Math.random()}`;
			// console.log(line);
			lines += line + "\n";
		}
		console.log(lines);
	}

	render(gfx) {
		// this.debugRender(gfx);
		// this.ctx.fillRect(20, 20, 150, 100);

		for (let y = 0; y < 32; ++y) {
			for (let x = 0; x < 64; ++x) {
				if (gfx[y * 64 + x] == 0) {
					this.ctx.fillStyle = "#000";
				} else {
					this.ctx.fillStyle = "#FFF";
				}
				this.ctx.fillRect(x * 10, y * 10, 10, 10);
			}
		}
	}
}
