/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "bundles/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CPU.js":
/*!********************!*\
  !*** ./src/CPU.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fontset = _interopRequireDefault(__webpack_require__(/*! ./fontset.js */ "./src/fontset.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let randomNumbers = [];
let rNum = 0;

for (let i = 0; i < 10000; i++) {
  randomNumbers.push(Math.round(Math.random() * 255));
}

class CPU {
  constructor() {
    // current opcode:
    this.opcode = 0; // 4K of memory:

    this.memory = new Uint8Array(4096); // 0x000-0x1FF - Chip 8 interpreter (contains font set in emu)
    // 0x050-0x0A0 - Used for the built in 4x5 pixel font set (0-F)
    // 0x200-0xFFF - Program ROM and work RAM
    // general purpose registers:

    this.V = new Uint8Array(16); // keys (input):

    this.keys = new Uint8Array(16);
    this.I = 0; //	index

    this.pc = 0; //	program counter

    this.delay_timer = 0;
    this.sound_timer = 0; // stack:

    this.stack = new Uint8Array(16);
    this.sp = 0;
    this.drawFlag = false; // 64 x 32px

    this.gfx = new Uint8Array(2048);
  }

  init() {
    // start at 0x200:
    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0; // Clear display

    for (let i = 0; i < 2048; i++) {
      this.gfx[i] = 0;
    } // Clear stack


    for (let i = 0; i < 16; i++) {
      this.stack[i] = 0;
    }

    for (let i = 0; i < 16; i++) {
      this.keys[i] = 0;
      this.V[i] = 0;
    } // Clear memory


    for (let i = 0; i < 4096; i++) {
      this.memory[i] = 0;
    } // load font set:


    for (let i = 0; i < 80; i++) {
      this.memory[i] = _fontset.default[i];
    } // reset timers:


    this.delay_timer = 0;
    this.sound_timer = 0;
    this.drawFlag = true;
  }

  loadROM(buffer) {
    // load rom:
    for (let i = 0; i < buffer.length; i++) {
      this.memory[i + 512] = buffer[i];
    }
  }

  emulateCycle() {
    let VX = this.V[(this.opcode & 0x0f00) >> 8];
    let VY = this.V[(this.opcode & 0x00f0) >> 4];
    let NN;
    let rand0t255;
    let n;
    let x, y, height, pixel; // switch (this.opcode & 0xf000) {
    // 	case 0x0000:
    // 		switch (this.opcode & 0x000f) {
    // 			case 0x0000:
    // 				// Display disp_clear() Clears the screen.
    // 				// Clear display
    // 				for (let i = 0; i < 2048; i++) {
    // 					this.gfx[i] = 0;
    // 				}
    // 				this.drawFlag = true;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x000e:
    // 				// Flow return; Returns from a subroutine.
    // 				this.sp -= 1; // 16 levels of stack, decrease stack pointer to prevent overwrite
    // 				this.pc = this.stack[this.sp]; // Put the stored return address from the stack back into the program counter
    // 				this.pc += 2;
    // 				break;
    // 			default:
    // 				console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
    // 				break;
    // 		}
    // 		break;
    // 	case 0x1000: // 0x1XNN
    // 		// Flow goto NNN; Jumps to address NNN.
    // 		this.pc = this.opcode & 0x0fff;
    // 		break;
    // 	case 0x2000:
    // 		// Flow *(0xNNN)() Calls subroutine at NNN.
    // 		this.stack[this.sp] = this.pc;
    // 		this.sp += 1;
    // 		this.pc = this.opcode & 0x0fff;
    // 		break;
    // 	case 0x3000: // 0x3XNN
    // 		// Cond if(Vx==NN) Skips the next instruction if VX equals NN.
    // 		// (Usually the next instruction is a jump to skip a code block)
    // 		NN = this.opcode & 0x00ff;
    // 		if (VX === NN) {
    // 			this.pc += 4;
    // 		} else {
    // 			this.pc += 2;
    // 		}
    // 		break;
    // 	case 0x4000: // 0x4XNN
    // 		// Cond if(Vx!=NN) Skips the next instruction if VX doesn't equal NN.
    // 		// (Usually the next instruction is a jump to skip a code block)
    // 		NN = this.opcode & 0x00ff;
    // 		if (VX !== NN) {
    // 			this.pc += 4;
    // 		} else {
    // 			this.pc += 2;
    // 		}
    // 		break;
    // 	case 0x5000: // 0x5XY0
    // 		// Cond if(Vx==Vy) Skips the next instruction if VX equals VY.
    // 		// (Usually the next instruction is a jump to skip a code block)
    // 		if (VX === VY) {
    // 			this.pc += 4;
    // 		} else {
    // 			this.pc += 2;
    // 		}
    // 		break;
    // 	case 0x6000: // 0x6XNN
    // 		// Const Vx = NN Sets VX to NN.
    // 		this.V[(this.opcode & 0x0f00) >> 8] = this.opcode & 0x00ff;
    // 		this.pc += 2;
    // 		break;
    // 	case 0x7000: // 0x7XNN
    // 		// Const Vx += NN Adds NN to VX. (Carry flag is not changed)
    // 		this.V[(this.opcode & 0x0f00) >> 8] += this.opcode & 0x00ff;
    // 		this.pc += 2;
    // 		break;
    // 	case 0x8000:
    // 		switch (this.opcode & 0x000f) {
    // 			case 0x0000: // 8XY0
    // 				// Assign Vx=Vy Sets VX to the value of VY.
    // 				this.V[(this.opcode & 0x0f00) >> 8] = VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0001: // 8XY1
    // 				// BitOp Vx=Vx|Vy Sets VX to VX or VY. (Bitwise OR operation)
    // 				this.V[(this.opcode & 0x0f00) >> 8] = VX | VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0002: // 8XY2
    // 				// BitOp Vx=Vx&Vy Sets VX to VX and VY. (Bitwise AND operation)
    // 				this.V[(this.opcode & 0x0f00) >> 8] = VX & VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0003: // 8XY3
    // 				// BitOp Vx=Vx^Vy Sets VX to VX xor VY.
    // 				this.V[(this.opcode & 0x0f00) >> 8] = VX ^ VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0004: // 8XY4
    // 				// Math Vx += Vy Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
    // 				if (VY > 0xff - VX) {
    // 					this.V[0xf] = 1; // carry
    // 				} else {
    // 					this.V[0xf] = 0; // not
    // 				}
    // 				this.V[(this.opcode & 0x0f00) >> 8] += VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0005: // 8XY5
    // 				// Math Vx -= Vy VY is subtracted from VX.
    // 				// VF is set to 0 when there's a borrow, and 1 when there isn't.
    // 				if (VY > VX) {
    // 					this.V[0xf] = 0; // borrow
    // 				} else {
    // 					this.V[0xf] = 1; // not
    // 				}
    // 				this.V[(this.opcode & 0x0f00) >> 8] -= VY;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0006: // 8XY6
    // 				// BitOp Vx>>=1 Stores the least significant bit of VX in VF and then shifts VX to the right by 1.[2]
    // 				this.V[0xf] = VX & 1;
    // 				this.V[(this.opcode & 0x0f00) >> 8] >>= 1;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0007: // 8XY7
    // 				// Math Vx=Vy-Vx Sets VX to VY minus VX.
    // 				// VF is set to 0 when there's a borrow, and 1 when there isn't.
    // 				if (VX > VY) {
    // 					this.V[0xf] = 0; // borrow
    // 				} else {
    // 					this.V[0xf] = 1; // not
    // 				}
    // 				this.V[(this.opcode & 0x0f00) >> 8] = VY - VX;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x000e: // 8XYE
    // 				// BitOp Vx<<=1
    // 				// Stores the most significant bit of VX in VF and then shifts VX to the left by 1.[3]
    // 				this.V[0xf] = VX >> 7;
    // 				this.V[(this.opcode & 0x0f00) >> 8] <<= 1;
    // 				this.pc += 2;
    // 				break;
    // 			default:
    // 				console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
    // 				break;
    // 		}
    // 		break;
    // 	case 0x9000: // 0x9XY0
    // 		// Cond if(Vx!=Vy) Skips the next instruction if VX doesn't equal VY.
    // 		// (Usually the next instruction is a jump to skip a code block)
    // 		if (VX !== VY) {
    // 			this.pc += 4;
    // 		} else {
    // 			this.pc += 2;
    // 		}
    // 		break;
    // 	case 0xa000: // 0xANNN
    // 		// MEM I = NNN Sets I to the address NNN.
    // 		this.I = this.opcode & 0x0fff;
    // 		this.pc += 2;
    // 		break;
    // 	case 0xb000: // 0xBNNN
    // 		// Flow PC=V0+NNN Jumps to the address NNN plus V0.
    // 		// this.pc = this.V[0] + (this.opcode & 0x0fff);
    // 		this.pc = (this.opcode & 0x0fff) + this.V[0];
    // 		break;
    // 	case 0xc000: // 0xCXNN
    // 		// Rand Vx=rand()&NN Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
    // 		rand0t255 = Math.round(Math.random() * 255);
    // 		NN = this.opcode & 0x00ff;
    // 		this.V[(this.opcode & 0x0f00) >> 8] = rand0t255 & NN;
    // 		this.pc += 2;
    // 		break;
    // 	case 0xd000: // 0xDXYN
    // 		// Disp draw(Vx,Vy,N) Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels. Each row of 8 pixels is read as bit-coded starting from memory location I;
    // 		// I value doesn’t change after the execution of this instruction.
    // 		// As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen
    // 		// todo:
    // 		x = this.V[(this.opcode & 0x0f00) >> 8];
    // 		y = this.V[(this.opcode & 0x00f0) >> 4];
    // 		height = this.opcode & 0x000f;
    // 		// pixel;
    // 		this.V[0xf] = 0;
    // 		for (let yline = 0; yline < height; yline++) {
    // 			pixel = this.memory[this.I + yline];
    // 			for (let xline = 0; xline < 8; xline++) {
    // 				if ((pixel & (0x80 >> xline)) != 0) {
    // 					if (this.gfx[x + xline + (y + yline) * 64] === 1) {
    // 						this.V[0xf] = 1;
    // 					}
    // 					this.gfx[x + xline + (y + yline) * 64] ^= 1;
    // 				}
    // 			}
    // 		}
    // 		this.drawFlag = true;
    // 		this.pc += 2;
    // 		break;
    // 	case 0xe000:
    // 		switch (this.opcode & 0x00ff) {
    // 			case 0x009e: // 0xEX9E
    // 				// KeyOp if(key()==Vx) Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)
    // 				n = (this.opcode & 0x0f00) >> 8;
    // 				if (this.keys[this.V[n]] !== 0) {
    // 					this.pc += 4;
    // 					return;
    // 				} else {
    // 					this.pc += 2;
    // 				}
    // 				break;
    // 			case 0x00a1: // 0xEXA1
    // 				// KeyOp if(key()!=Vx) Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)
    // 				n = (this.opcode & 0x0f00) >> 8;
    // 				if (this.keys[this.V[n]] === 0) {
    // 					this.pc += 4;
    // 				} else {
    // 					this.pc += 2;
    // 				}
    // 				break;
    // 			default:
    // 				console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
    // 				break;
    // 		}
    // 		break;
    // 	case 0xf000:
    // 		switch (this.opcode & 0x00ff) {
    // 			case 0x0007: // 0xFX07
    // 				// Timer Vx = get_delay() Sets VX to the value of the delay timer.
    // 				this.V[(this.opcode & 0x0f00) >> 8] = this.delay_timer;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x000a: // 0xFX0A
    // 				// KeyOp Vx = get_key() A key press is awaited, and then stored in VX.
    // 				// (Blocking Operation. All instruction halted until next key event)
    // 				let keyPress = false;
    // 				for (let i = 0; i < 16; i++) {
    // 					if (this.keys[i] != 0) {
    // 						this.V[(this.opcode & 0x0f00) >> 8] = i;
    // 						keyPress = true;
    // 					}
    // 				}
    // 				// If we didn't received a keypress, skip this cycle and try again.
    // 				if (!keyPress) {
    // 					return;
    // 				}
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0015: // 0xFX15
    // 				// Timer delay_timer(Vx) Sets the delay timer to VX.
    // 				this.delay_timer = VX;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0018: // 0xFX18
    // 				// Sound sound_timer(Vx) Sets the sound timer to VX.
    // 				this.sound_timer = VX;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x001e: // 0xFX1E
    // 				// MEM I +=Vx Adds VX to I.[4]
    // 				// VF is set to 1 when range overflow (I+VX>0xFFF), and 0 when there isn't.
    // 				if (this.I + VX > 0xfff) {
    // 					this.V[0xf] = 1;
    // 				} else {
    // 					this.V[0xf] = 0;
    // 				}
    // 				this.I += VX;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0029: // 0xFX29
    // 				// MEM I=sprite_addr[Vx]
    // 				// Sets I to the location of the sprite for the character in VX.
    // 				// Characters 0-F (in hexadecimal) are represented by a 4x5 font.
    // 				this.I = VX * 0x5;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0033: // 0xFX33
    // 				// BCD	set_BCD(Vx); *(I+0)=BCD(3); *(I+1)=BCD(2); *(I+2)=BCD(1);
    // 				// Stores the binary-coded decimal representation of VX, with the most significant of three digits at the address in I,
    // 				// the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX,
    // 				// place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
    // 				this.memory[this.I] = VX / 100;
    // 				this.memory[this.I + 1] = (VX / 10) % 10;
    // 				this.memory[this.I + 2] = (VX % 100) % 10;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0055: // 0xFX55
    // 				// MEM reg_dump(Vx,&I) Stores V0 to VX (including VX) in memory starting at address I.
    // 				// The offset from I is increased by 1 for each value written, but I itself is left unmodified.
    // 				n = (this.opcode & 0x0f00) >> 8;
    // 				for (let i = 0; i <= n; ++i) {
    // 					this.memory[this.I + i] = this.V[i];
    // 				}
    // 				// On the original interpreter, when the operation is done, I = I + X + 1.
    // 				this.I += VX + 1;
    // 				this.pc += 2;
    // 				break;
    // 			case 0x0065: // 0xFX65
    // 				// MEM reg_load(Vx,&I) Fills V0 to VX (including VX) with values from memory starting at address I.
    // 				// The offset from I is increased by 1 for each value written, but I itself is left unmodified.
    // 				n = (this.opcode & 0x0f00) >> 8;
    // 				for (let i = 0; i <= n; i++) {
    // 					this.V[i] = this.memory[this.I + i];
    // 				}
    // 				// On the original interpreter, when the operation is done, I = I + X + 1.
    // 				this.I += VX + 1;
    // 				this.pc += 2;
    // 				break;
    // 			default:
    // 				console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
    // 				break;
    // 		}
    // 		break;
    // 	default:
    // 		console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
    // 		break;
    // }
    // Process opcode

    switch (this.opcode & 0xf000) {
      case 0x0000:
        switch (this.opcode & 0x000f) {
          case 0x0000:
            // 0x00E0: Clears the screen
            for (let i = 0; i < 2048; ++i) {
              this.gfx[i] = 0x0;
            }

            this.drawFlag = true;
            this.pc += 2;
            break;

          case 0x000e:
            // 0x00EE: Returns from subroutine
            --this.sp; // 16 levels of stack, decrease stack pointer to prevent overwrite

            this.pc = this.stack[this.sp]; // Put the stored return address from the stack back into the program counter

            this.pc += 2; // Don't forget to increase the program counter!

            break;

          default:
            console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
            break;
        }

        break;

      case 0x1000:
        // 0x1NNN: Jumps to address NNN
        this.pc = this.opcode & 0x0fff;
        break;

      case 0x2000:
        // 0x2NNN: Calls subroutine at NNN.
        this.stack[this.sp] = this.pc; // Store current address in stack

        ++this.sp; // Increment stack pointer

        this.pc = this.opcode & 0x0fff; // Set the program counter to the address at NNN

        break;

      case 0x3000:
        // 0x3XNN: Skips the next instruction if VX equals NN
        if (this.V[(this.opcode & 0x0f00) >> 8] == (this.opcode & 0x00ff)) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }

        break;

      case 0x4000:
        // 0x4XNN: Skips the next instruction if VX doesn't equal NN
        if (this.V[(this.opcode & 0x0f00) >> 8] != (this.opcode & 0x00ff)) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }

        break;

      case 0x5000:
        // 0x5XY0: Skips the next instruction if VX equals VY.
        if (this.V[(this.opcode & 0x0f00) >> 8] == this.V[(this.opcode & 0x00f0) >> 4]) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }

        break;

      case 0x6000:
        // 0x6XNN: Sets VX to NN.
        this.V[(this.opcode & 0x0f00) >> 8] = this.opcode & 0x00ff;
        this.pc += 2;
        break;

      case 0x7000:
        // 0x7XNN: Adds NN to VX.
        this.V[(this.opcode & 0x0f00) >> 8] += this.opcode & 0x00ff;
        this.pc += 2;
        break;

      case 0x8000:
        switch (this.opcode & 0x000f) {
          case 0x0000:
            // 0x8XY0: Sets VX to the value of VY
            this.V[(this.opcode & 0x0f00) >> 8] = this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0001:
            // 0x8XY1: Sets VX to "VX OR VY"
            this.V[(this.opcode & 0x0f00) >> 8] |= this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0002:
            // 0x8XY2: Sets VX to "VX AND VY"
            this.V[(this.opcode & 0x0f00) >> 8] &= this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0003:
            // 0x8XY3: Sets VX to "VX XOR VY"
            this.V[(this.opcode & 0x0f00) >> 8] ^= this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0004:
            // 0x8XY4: Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't
            if (this.V[(this.opcode & 0x00f0) >> 4] > 0xff - this.V[(this.opcode & 0x0f00) >> 8]) {
              this.V[0xf] = 1; //carry
            } else {
              this.V[0xf] = 0;
            }

            this.V[(this.opcode & 0x0f00) >> 8] += this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0005:
            // 0x8XY5: VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't
            if (this.V[(this.opcode & 0x00f0) >> 4] > this.V[(this.opcode & 0x0f00) >> 8]) {
              this.V[0xf] = 0; // there is a borrow
            } else {
              this.V[0xf] = 1;
            }

            this.V[(this.opcode & 0x0f00) >> 8] -= this.V[(this.opcode & 0x00f0) >> 4];
            this.pc += 2;
            break;

          case 0x0006:
            // 0x8XY6: Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift
            this.V[0xf] = this.V[(this.opcode & 0x0f00) >> 8] & 0x1;
            this.V[(this.opcode & 0x0f00) >> 8] >>= 1;
            this.pc += 2;
            break;

          case 0x0007:
            // 0x8XY7: Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't
            if (this.V[(this.opcode & 0x0f00) >> 8] > this.V[(this.opcode & 0x00f0) >> 4]) {
              // VY-VX
              this.V[0xf] = 0; // there is a borrow
            } else {
              this.V[0xf] = 1;
            }

            this.V[(this.opcode & 0x0f00) >> 8] = this.V[(this.opcode & 0x00f0) >> 4] - this.V[(this.opcode & 0x0f00) >> 8];
            this.pc += 2;
            break;

          case 0x000e:
            // 0x8XYE: Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift
            this.V[0xf] = this.V[(this.opcode & 0x0f00) >> 8] >> 7;
            this.V[(this.opcode & 0x0f00) >> 8] <<= 1;
            this.pc += 2;
            break;

          default:
            console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
            break;
        }

        break;

      case 0x9000:
        // 0x9XY0: Skips the next instruction if VX doesn't equal VY
        if (this.V[(this.opcode & 0x0f00) >> 8] != this.V[(this.opcode & 0x00f0) >> 4]) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }

        break;

      case 0xa000:
        // ANNN: Sets I to the address NNN
        this.I = this.opcode & 0x0fff;
        this.pc += 2;
        break;

      case 0xb000:
        // BNNN: Jumps to the address NNN plus V0
        this.pc = (this.opcode & 0x0fff) + this.V[0];
        break;

      case 0xc000:
        // CXNN: Sets VX to a random number and NN
        this.V[(this.opcode & 0x0f00) >> 8] = Math.random() * 1000 % 0xff & (this.opcode & 0x00ff);
        this.pc += 2;
        break;

      case 0xd000:
        // DXYN: Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
        // Each row of 8 pixels is read as bit-coded starting from memory location I;
        // I value doesn't change after the execution of this instruction.
        // VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn,
        // and to 0 if that doesn't happen
        {
          let x = this.V[(this.opcode & 0x0f00) >> 8];
          let y = this.V[(this.opcode & 0x00f0) >> 4];
          let height = this.opcode & 0x000f;
          let pixel;
          this.V[0xf] = 0;

          for (let yline = 0; yline < height; yline++) {
            pixel = this.memory[this.I + yline];

            for (let xline = 0; xline < 8; xline++) {
              if ((pixel & 0x80 >> xline) != 0) {
                if (this.gfx[x + xline + (y + yline) * 64] == 1) {
                  this.V[0xf] = 1;
                }

                this.gfx[x + xline + (y + yline) * 64] ^= 1;
              }
            }
          }

          this.drawFlag = true;
          this.pc += 2;
        }
        break;

      case 0xe000:
        switch (this.opcode & 0x00ff) {
          case 0x009e:
            // EX9E: Skips the next instruction if the key stored in VX is pressed
            if (this.keys[this.V[(this.opcode & 0x0f00) >> 8]] != 0) {
              this.pc += 4;
            } else {
              this.pc += 2;
            }

            break;

          case 0x00a1:
            // EXA1: Skips the next instruction if the key stored in VX isn't pressed
            if (this.keys[this.V[(this.opcode & 0x0f00) >> 8]] == 0) {
              this.pc += 4;
            } else {
              this.pc += 2;
            }

            break;

          default:
            console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
            break;
        }

        break;

      case 0xf000:
        switch (this.opcode & 0x00ff) {
          case 0x0007:
            // FX07: Sets VX to the value of the delay timer
            this.V[(this.opcode & 0x0f00) >> 8] = this.delay_timer;
            this.pc += 2;
            break;

          case 0x000a:
            // FX0A: A key press is awaited, and then stored in VX
            let keyPress = false;

            for (let i = 0; i < 16; ++i) {
              if (this.keys[i] != 0) {
                this.V[(this.opcode & 0x0f00) >> 8] = i;
                keyPress = true;
              }
            } // If we didn't received a keypress, skip this cycle and try again.


            if (!keyPress) {
              return;
            }

            this.pc += 2;
            break;

          case 0x0015:
            // FX15: Sets the delay timer to VX
            this.delay_timer = this.V[(this.opcode & 0x0f00) >> 8];
            this.pc += 2;
            break;

          case 0x0018:
            // FX18: Sets the sound timer to VX
            this.sound_timer = this.V[(this.opcode & 0x0f00) >> 8];
            this.pc += 2;
            break;

          case 0x001e:
            // FX1E: Adds VX to I
            if (this.I + this.V[(this.opcode & 0x0f00) >> 8] > 0xfff) {
              // VF is set to 1 when range overflow (I+VX>0xFFF), and 0 when there isn't.
              this.V[0xf] = 1;
            } else {
              this.V[0xf] = 0;
            }

            this.I += this.V[(this.opcode & 0x0f00) >> 8];
            this.pc += 2;
            break;

          case 0x0029:
            // FX29: Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font
            this.I = this.V[(this.opcode & 0x0f00) >> 8] * 0x5;
            this.pc += 2;
            break;

          case 0x0033:
            // FX33: Stores the Binary-coded decimal representation of VX at the addresses I, I plus 1, and I plus 2
            this.memory[this.I] = this.V[(this.opcode & 0x0f00) >> 8] / 100;
            this.memory[this.I + 1] = this.V[(this.opcode & 0x0f00) >> 8] / 10 % 10;
            this.memory[this.I + 2] = this.V[(this.opcode & 0x0f00) >> 8] % 100 % 10;
            this.pc += 2;
            break;

          case 0x0055:
            // FX55: Stores V0 to VX in memory starting at address I
            for (let i = 0; i <= (this.opcode & 0x0f00) >> 8; ++i) {
              this.memory[this.I + i] = this.V[i];
            } // On the original interpreter, when the operation is done, I = I + X + 1.
            // this.I += ((this.opcode & 0x0f00) >> 8) + 1;


            this.pc += 2;
            break;

          case 0x0065:
            // FX65: Fills V0 to VX with values from memory starting at address I
            for (let i = 0; i <= (this.opcode & 0x0f00) >> 8; ++i) {
              this.V[i] = this.memory[this.I + i];
            } // On the original interpreter, when the operation is done, I = I + X + 1.
            // this.I += ((this.opcode & 0x0f00) >> 8) + 1;


            this.pc += 2;
            break;

          default:
            console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
            break;
        }

        break;

      default:
        console.log(`Unknown opcode: ${this.opcode.toString(16)}`);
        break;
    } // Update timers


    if (this.delay_timer > 0) {
      --this.delay_timer;
    }

    if (this.sound_timer > 0) {
      if (this.sound_timer === 1) {
        console.log("beep\n");
      }

      --this.sound_timer;
    } // case 0x0NNN:// Call Calls RCA 1802 program at address NNN. Not necessary for most ROMs.
    // case 0x00E0:// Display disp_clear() Clears the screen.
    // case 0x00EE:// Flow return; Returns from a subroutine.
    // case 0x1NNN:// Flow goto NNN; Jumps to address NNN.
    // case 0x2NNN:// Flow *(0xNNN)() Calls subroutine at NNN.
    // case 0x3XNN:// Cond if(Vx==NN) Skips the next instruction if VX equals NN. (Usually the next instruction is a jump to skip a code block)
    // case 0x4XNN:// Cond if(Vx!=NN) Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
    // case 0x5XY0:// Cond if(Vx==Vy) Skips the next instruction if VX equals VY. (Usually the next instruction is a jump to skip a code block)
    // case 0x6XNN:// Const Vx = NN Sets VX to NN.
    // case 0x7XNN:// Const Vx += NN Adds NN to VX. (Carry flag is not changed)
    // case 0x8XY0:// Assign Vx=Vy Sets VX to the value of VY.
    // case 0x8XY1:// BitOp Vx=Vx|Vy Sets VX to VX or VY. (Bitwise OR operation)
    // case 0x8XY2:// BitOp Vx=Vx&Vy Sets VX to VX and VY. (Bitwise AND operation)
    // case 0x8XY3:// BitOp Vx=Vx^Vy Sets VX to VX xor VY.
    // case 0x8XY4:// Math Vx += Vy Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
    // case 0x8XY5:// Math Vx -= Vy VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
    // case 0x8XY6:// BitOp Vx>>=1 Stores the least significant bit of VX in VF and then shifts VX to the right by 1.[2]
    // case 0x8XY7:// Math Vx=Vy-Vx Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
    // case 0x8XYE:// BitOp Vx<<=1 Stores the most significant bit of VX in VF and then shifts VX to the left by 1.[3]
    // case 0x9XY0:// Cond if(Vx!=Vy) Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)
    // case 0xANNN:// MEM I = NNN Sets I to the address NNN.
    // case 0xBNNN:// Flow PC=V0+NNN Jumps to the address NNN plus V0.
    // case 0xCXNN:// Rand Vx=rand()&NN Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
    // case 0xDXYN:// Disp draw(Vx,Vy,N) Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels. Each row of 8 pixels is read as bit-coded starting from memory location I; I value doesn’t change after the execution of this instruction. As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen
    // case 0xEX9E:// KeyOp if(key()==Vx) Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)
    // case 0xEXA1:// KeyOp if(key()!=Vx) Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)
    // case 0xFX07:// Timer Vx = get_delay() Sets VX to the value of the delay timer.
    // case 0xFX0A:// KeyOp Vx = get_key() A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
    // case 0xFX15:// Timer delay_timer(Vx) Sets the delay timer to VX.
    // case 0xFX18:// Sound sound_timer(Vx) Sets the sound timer to VX.
    // case 0xFX1E:// MEM I +=Vx Adds VX to I.[4]
    // case 0xFX29:// MEM I=sprite_addr[Vx] Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font. FX33	BCD	set_BCD(Vx); *(I+0)=BCD(3); *(I+1)=BCD(2); *(I+2)=BCD(1);
    // //Stores the binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
    // case 0xFX55:// MEM reg_dump(Vx,&I) Stores V0 to VX (including VX) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
    // case 0xFX65:// MEM reg_load(Vx,&I) Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.

  }

  tick() {
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    this.emulateCycle();
  }

}

exports.default = CPU;
module.exports = exports.default;

/***/ }),

/***/ "./src/Chip8.js":
/*!**********************!*\
  !*** ./src/Chip8.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CPU = _interopRequireDefault(__webpack_require__(/*! ./CPU.js */ "./src/CPU.js"));

var _PPU = _interopRequireDefault(__webpack_require__(/*! ./PPU.js */ "./src/PPU.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let keyList = ["1", "2", "3", "4", "Q", "W", "E", "R", "A", "S", "D", "F", "Z", "X", "C", "V"];

class Chip8 {
  constructor() {
    this.cpu = new _CPU.default();
    this.ppu = new _PPU.default(document.getElementById("canvas"));
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

    this.cpu.drawFlag = false; // check keyboard:

    for (let i = 0; i < keyList.length; i++) {
      if (key.isPressed(keyList[i])) {
        this.cpu.keys[i] = 1;
      } else {
        this.cpu.keys[i] = 0;
      }
    }
  }

}

exports.default = Chip8;
module.exports = exports.default;

/***/ }),

/***/ "./src/PPU.js":
/*!********************!*\
  !*** ./src/PPU.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class PPU {
  constructor(canvas) {
    this.canvas = canvas;
  }

  init() {
    this.ctx = this.canvas.getContext("2d");
  }

  debugRender(gfx) {
    let lines = ""; // Draw

    for (let y = 0; y < 32; ++y) {
      let line = "";

      for (let x = 0; x < 64; ++x) {
        if (gfx[y * 64 + x] == 0) {
          line += "O";
        } else {
          line += "X";
        }
      } // line += ` ${Math.random()} ${Math.random()}`;
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

exports.default = PPU;
module.exports = exports.default;

/***/ }),

/***/ "./src/fontset.js":
/*!************************!*\
  !*** ./src/fontset.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const chip8Fontset = [0xf0, 0x90, 0x90, 0x90, 0xf0, // 0
0x20, 0x60, 0x20, 0x20, 0x70, // 1
0xf0, 0x10, 0xf0, 0x80, 0xf0, // 2
0xf0, 0x10, 0xf0, 0x10, 0xf0, // 3
0x90, 0x90, 0xf0, 0x10, 0x10, // 4
0xf0, 0x80, 0xf0, 0x10, 0xf0, // 5
0xf0, 0x80, 0xf0, 0x90, 0xf0, // 6
0xf0, 0x10, 0x20, 0x40, 0x40, // 7
0xf0, 0x90, 0xf0, 0x90, 0xf0, // 8
0xf0, 0x90, 0xf0, 0x10, 0xf0, // 9
0xf0, 0x90, 0xf0, 0x90, 0x90, // A
0xe0, 0x90, 0xe0, 0x90, 0xe0, // B
0xf0, 0x80, 0x80, 0x80, 0xf0, // C
0xe0, 0x90, 0x90, 0x90, 0xe0, // D
0xf0, 0x80, 0xf0, 0x80, 0xf0, // E
0xf0, 0x80, 0xf0, 0x80, 0x80];
var _default = chip8Fontset;
exports.default = _default;
module.exports = exports.default;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Chip = _interopRequireDefault(__webpack_require__(/*! ./Chip8.js */ "./src/Chip8.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  reader.onload = event => {
    let arrayBuffer = event.target.result;
    let array = new Uint8Array(arrayBuffer); // let binaryString = String.fromCharCode.apply(null, array);

    cb(array);
  };

  reader.readAsArrayBuffer(event.target.files[0]);
} // document.querySelector("input").addEventListener("change", (event) => {}, false);


function main() {
  let chip8 = new _Chip.default();
  chip8.init();
  window.chip8 = chip8;
  document.querySelector("input").addEventListener("change", () => {
    openFile(contents => {
      // console.log(contents);
      // let ROM = contents.
      chip8.loadROM(contents); // while (true) {

      setInterval(() => {
        chip8.tick(); // console.log(chip8.cpu.opcode.toString(16));
      }, 200); // }
    });
  }, false); // openFile((contents) => {
  // 	// console.log(contents);
  // 	chip8.loadROM(contents.split(""));
  // 	setInterval(() => {
  // 		chip8.tick();
  // 	}, 100);
  // });
  // readFile("C:\\");
} // window.run = main;


main();

/***/ })

/******/ });
//# sourceMappingURL=index.bundle.js.map