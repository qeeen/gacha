/* Set variables */

const backgroundX = 600; const backgroundY = 400; const backgroundZ = 600;
let bg_tex = [];
const cameraLocationX = 200; const cameraLocationZ = 1; const orbitRadius = 300;
const rareProbability = 10;

let focusX = 0, focusZ = 0, focusY = 0, focusAngleH = 0, focusAngleV = 0;

let o = [];
let o_rare = [];

let cover;

let currentIndex = -1;

let isStart = false; let gachaStart = false; let gachaDisplay = false; let clickAble = true;

let capsuleHeight = 70; let countDown = 60; let varyingNum = 0;

let glass_shad;

function preload() {
	for(let i = 0; i < 25; i++){
		o[i] = loadImage((i+1) + ".png")
	}

	for(let i = 0; i < 5; i++){
		o_rare[i] = loadModel((i+26) + ".obj");
	}

	bg_tex[0] = loadImage("sky/skyleft.png");
	bg_tex[1] = loadImage("sky/skymid.png");
	bg_tex[2] = loadImage("sky/skyright.png");
	bg_tex[3] = loadImage("sky/skyfarright.png");
	bg_tex[4] = loadImage("sky/skytop.png");
	bg_tex[5] = loadImage("sky/skybot.png");

	cover = loadImage("cover.png");
	
	glass_shad = loadShader("shad.vert", "shad.frag");
}


function setup() {
	/* Set frameRate, canvas, and colorMode */
	frameRate(60);
	createCanvas(windowWidth, windowHeight, WEBGL);
	colorMode(HSB, 360,100,100,100);

	imageMode(CENTER);
	noStroke();
}


function draw() {
	if(isStart){
		//debug
		//print(focusAngleH);

		//background
		background(0);

		//camera movement
		cameraMovement();
		camera(cameraLocationX,backgroundY/2-100,cameraLocationZ, -focusX,focusY,-focusZ, 0,100,0);

		//background box - shader can applied here
		push();
		texture(bg_tex[2]);
		push(); translate(0,0,-backgroundZ/2); plane(backgroundX,backgroundY); pop();//right
		texture(bg_tex[0]);
		push(); translate(0,0,backgroundZ/2); plane(backgroundX,backgroundY); pop();//left
		texture(bg_tex[4]);
		push(); translate(0,-backgroundY/2,0); rotateX(radians(90));  plane(backgroundX,backgroundZ); pop();//top
		texture(bg_tex[5]);
		push(); translate(0,backgroundY/2,0); rotateX(radians(90)); plane(backgroundX,backgroundZ); pop();//bot
		texture(bg_tex[1]);
		push(); translate(-backgroundX/2,0,0); rotateY(radians(90)); plane(backgroundZ,backgroundY); pop();//front
		texture(bg_tex[3]);
		push(); translate(backgroundX/2,0,0); rotateY(radians(90)); plane(backgroundZ,backgroundY); pop();//back
		pop();

		//gacha machine - shader can be applied here
		push();
		translate(0,backgroundY/2-35,0); 
		
		fill(60, 100, 100);
		box(40,30,40);

		push();
		texture(cover);
		translate(10, -20, 0);
		rotateX(PI/2);
		rotateY(PI);
		cylinder(15, 40);
		pop();

		push();
		translate(0, -35, 0);
		fill(60, 100, 100);
		box(40,5,40);
		pop();

		push();
		translate(20, 8, -8);
		fill(0, 100, 0);
		box(5, 10, 10);
		pop();

		push();
		translate(20, 0, 8);
		rotateZ(PI/2);
		fill(0, 70, 100);
		cylinder(5, 10, 10);
		pop();
		
		gachaSystem();
		if(gachaDisplay) 
			capsuleAnimation(currentIndex);
		pop();

		varyingNum++;
	}
	else {
		background(100);
		push(); fill(0,100,100); sphere(5); pop();
	}
}

function mouseClicked() {
	if(isStart && clickAble) {
		if(focusAngleH<=100 && focusAngleH>=-100) { //click on gacha machine starts pickups
			gachaStart = true;
		}
	}
	isStart = true;
}

function cameraMovement() {
	focusAngleH += movedX ; focusAngleV += movedY*1.5;  
	focusX = cameraLocationX + orbitRadius*cos(focusAngleH*0.01);
	focusZ = cameraLocationZ + orbitRadius*sin(focusAngleH*0.01);
	focusY = focusAngleV;
}

function gachaSystem() {
	if(gachaStart) {
		clickAble = false;
		let rarityNum = int(random(0,100));
		let randomNum;

		if(rarityNum>=100-rareProbability) { //rare item
			randomNum = int(random(25,30));
		}
		else {
			randomNum = int(random(1,25));
		}

		gachaDisplay = true;
		currentIndex = randomNum
		print(randomNum); //select each gacha objects without overlapping
		gachaStart = false;
	}
}

function capsuleAnimation(objIndex) {
	const dropSpeed = 0.5;

	if (capsuleHeight > 20) {
		capsuleHeight -= dropSpeed;
		push(); 
		shader(glass_shad);
		glass_shad.setUniform("u_resolution", [width, height]);

		translate(50,0-capsuleHeight,0); rotateX(radians(varyingNum*2)); rotateZ(radians(varyingNum*4));
		sphere(12, 16, 4); 
		resetShader();
		if(objIndex < 26){
			texture(o[objIndex-1]);
			rotateY(45);
			plane(7, 7);
		}
		pop();
		//This sphere is Capsule
	}
	else {
		if(countDown > 0){
			countDown -= dropSpeed
		if(objIndex<25) {
			push(); 
			translate(30,-30,0); 
			rotateY(radians(90)); 
			objDrawer(objIndex); 
			pop();
		}
		else {
			push(); 
			translate(40,-30,0); 
			rotateX(radians(varyingNum*2)); 
			rotateZ(radians(varyingNum*4));
			objDrawer(objIndex); 
			pop();
		}
		//Image pops out about which item you picked
		//receives Index which is from gachaSystem()
		//NEED SOME TEXTURE OR SHADER OF OBJECT PICTURE
		}
		else {
			capsuleHeight = 70;
			countDown = 60;
			gachaStart = false;
			gachaDisplay = false;
			clickAble = true;
		}
	}
}

function objDrawer(objNum) {
	if(objNum < 26){
		image(o[objNum-1], 0, 0);
	}
	else{
		scale(3); 
		model(o_rare[objNum - 26]); 
	}
}








