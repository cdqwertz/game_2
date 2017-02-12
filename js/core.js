var canvas;
var ctx;

var lanes_1 = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]];
var lanes_2 = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]];
var lanes_1_y = 0;
var lanes_2_y = 0;
var player_pos = 1;
var power = 100;
var state = 0;

var time = new function() {
	this.time = 0;
	this.last_time = 0;
	this.delta = 0;

	this.update = function(time) {
		this.time = time;
		this.delta = this.time - this.last_time;
		this.last_time = this.time;
	}
}

function load() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	lanes_2_y = -canvas.height;

	ctx = canvas.getContext("2d");

	window.requestAnimationFrame(update);
}

function update(t) {
	time.update(t);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(state == 1) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#666";
		ctx.fillStyle = "#666";

		var w = (canvas.width/lanes_1.length);
		var h = (canvas.height/lanes_1[0].length)

		lanes_1_y += time.delta/3;
		lanes_2_y += time.delta/3;

		if(lanes_1_y > canvas.height) {
			lanes_1_y -= canvas.height * 2;
			//lanes_1_y = -canvas.height;
			randomize_lanes(lanes_1);
		}

		if(lanes_2_y > canvas.height) {
			lanes_2_y -= canvas.height * 2;
			//lanes_2_y = -canvas.height;
			randomize_lanes(lanes_2);
		}

		draw_lanes(lanes_1, w, h, lanes_1_y);
		draw_lanes(lanes_2, w, h, lanes_2_y);

		ctx.lineWidth = 1;

		ctx.fillRect(w*player_pos + w/2 - 15, canvas.height/6*5, 30, 30);

		{
			var p = canvas.height/6*5;
			var line = check_line(lanes_1[player_pos], lanes_1_y, h, p, 30) || check_line(lanes_2[player_pos], lanes_2_y, h, p, 30);
			if (!line) {
				power -= time.delta;
				if(power < 0) {
					state = 0;
					power = 100;
					lanes_1_y = 0;
					lanes_2_y = -canvas.height;
					player_pos = 1;
					lanes_1 = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]];
					lanes_2 = [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]];
				}
			} else {
				power = 100;
			}
		}
	} else if (state == 0) {

	}

	window.requestAnimationFrame(update);
}

function draw_lanes(lanes, w, h, a) {
	for(var i = 0; i < lanes.length; i++) {
		for(var j = 0; j < lanes[i].length; j++) {
			if (lanes[i][j] == 1) {
				var x = w * i + w/2;
				var y = h * j + a;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x, y + h);
				ctx.stroke();
			}
		}
	}
}

function randomize_lanes(lanes) {
	for(var i = 0; i < lanes.length; i++) {
		for(var j = 0; j < lanes[i].length; j++) {
			lanes[i][j] = 0;
		}
	}

	var x = 0;

	for(var i = 0; i < lanes[0].length; i++) {
		if(Math.random() > 0.8) {
			x += 1;
			if(x > lanes.length-1) {
				x = 0;
			}
		} else if(Math.random() > 0.8) {
			x -= 1;
			if(x < 0) {
				x = lanes.length-1;
			}
		}

		lanes[x][i] = 1;
		console.log(x);
	}
}

function check_line(lane, y, h, p, r) {
	for(var j = 0; j < lane.length; j++) {
		if (lane[j] == 1) {
			var x = h * j + y;
			if(x < p + r && x+h > p - r) {
				return true;
			}
		}
	}

	return false;
}

document.onkeydown = function(event) {
	if(state == 0) {
		state = 1;
	} else {
		if(event.keyCode == 37) {
			if(player_pos > 0) {
				player_pos -= 1;
			} else {
				player_pos = lanes_1.length-1;
			}
		}

		if(event.keyCode == 39) {
			if(player_pos < lanes_1.length-1) {
				player_pos += 1;
			} else {
				player_pos = 0;
			}
		}
	}
}
