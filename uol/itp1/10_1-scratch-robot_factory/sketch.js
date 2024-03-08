/// <reference path="/Users/bgmacbook/.vscode/extensions/samplavigne.p5-vscode-1.2.7/p5types/global.d.ts" />
let robot = {};
let robots = [];

function setup() {
  createCanvas(900, 900);
}

function draw() {
	background(220);
	
	if(robots.length>0){
		for(let i=0; i < robots.length; i++){
			drawRobot(robots[i]);
			moveRobot(robots[i],i);
		}
	}
}

function mousePressed(){
  robot = createRobot(mouseX, mouseY);
  robots.push(robot);
}

function createRobot(x,y){
  let r = {
	x_pos: x,
	y_pos: y,
    firstName: selectRobotName(),
    iq: round(random(300, 3000)),
    serialNumber: round(random(10000, 100000)),
    abilities: selectRobotAbilities(),
    physical: {
      r: round(random(0, 255)),
      g: round(random(0, 255)),
      b: round(random(0, 255)),
      headWidth: round(random(60, 100)),
    }
  }
  return r;
}

function drawRobot(robot)
{
	let x = robot.x_pos;
	let y = robot.y_pos;
	let physical = robot.physical;

	strokeWeight(2);
	stroke(0);

	//robot head
	fill(physical.r, physical.g, physical.b);
	rect(x, y, physical.headWidth, 100);

	//ears
	fill(physical.g, physical.r, physical.b);
	rect(x - 7, y + 30, 10, 33);
	rect(x + physical.headWidth - 3, y + 30, 10, 33);

	//robots' antennas
	fill(250, 250, 0);
	ellipse(x + physical.headWidth * 0.5, y - 7, 10, 10);
	fill(255 - physical.r, 255 - physical.g, 255 - physical.b);
	rect(x + physical.headWidth * 0.5 - 10, y - 3, 20, 10);

	//eyes
	fill(255);
	ellipse(x + physical.headWidth * 0.25, y + 30, 26, 26);
	point(x + physical.headWidth * 0.25, y + 30);
	ellipse(x + physical.headWidth * 0.75, y + 30, 26, 26);
	point(x + physical.headWidth * 0.75, y + 30);

	//robots' nose
	fill(255, 0, 0);
	triangle(x + physical.headWidth * 0.5, y + 35, x + physical.headWidth * 0.35, y + 60, x + physical.headWidth * 0.65, y + 60);

	//robot mouth
	noFill();
	beginShape();
	vertex(x + physical.headWidth * 0.28, y + 75);
	vertex(x + physical.headWidth * 0.36, y + 85);
	vertex(x + physical.headWidth * 0.42, y + 75);
	vertex(x + physical.headWidth * 0.50, y + 85);
	vertex(x + physical.headWidth * 0.58, y + 75);
	vertex(x + physical.headWidth * 0.66, y + 85);
	vertex(x + physical.headWidth * 0.74, y + 75);
	endShape();
}

function selectRobotName(){
	var firstNames = ["Asad", "Agatha", "Benny", "Beau", "Carol", "Colin", "Data", "Delia", "Edward", "Ethal", "Freddy", "Fiona", "Georgina", "Greg", "Hal", "Holly", "Ishmail", "India", "Jamie", "Joanna", "Katan", "Kelly", "liam", "Leanne", "Marvin", "Michaela", "Nicholas", "Niamh", "Oscar", "Olivia", "Quentin", "Queenie", "Richard", "Rebecca", "Simon", "Simone", "Thomas", "Tilly", "Ulysses", "Ursula", "Vinny", "Violet", "William", "Winifred", "Xander", "Xanthe", "Yves", "Yvonne", "Zach", "Zara"];
  var firstName = firstNames[parseInt(random(0, firstNames.length - 1))];

  return firstName;
}

function selectRobotAbilities(){
  //set the robots unique skills - deduct randomly from the list so the robot has 4 skills
  var abilities = ["clean house", "make bed", "babysit", "cook", "school run", "laundry", "grow vegetables", "charity work", "darn socks", "do shopping", "take out rubbish", "feed the cat", "mow lawn", "paint fence"];
  while (abilities.length > 4){
    abilities.splice(random(0, abilities.length), 1);
  }

  return abilities;
}

function moveRobot(robot,i){
	robot.x_pos += .5 - noise(i*100+frameCount/500);
	robot.y_pos += .5 - noise(i*110+frameCount/500);
	robot.x_pos = constrain(robot.x_pos,50,width-50);
	robot.y_pos = constrain(robot.y_pos,50,height-50);
}
