function Particle(x, y, xSpeed, ySpeed, size, colour, age){
  this.x        = x;
  this.y        = y;
  this.xSpeed   = xSpeed;
  this.ySpeed   = ySpeed;
  this.size     = size;
  this.colour   = colour;
  this.age      = age;

  this.drawParticle = function(){
    fill(this.colour);
    ellipse(this.x, this.y, this.size);
  }

  this.moveParticle = function(){
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.age ++;
  }

  this.ageParticle = function(){
    this.age ++;
  }
}

function Emitter(emitterXpos, emitterYpos, partXspeed, partYspeed, partSize, partColour){
  this.x        = emitterXpos;
  this.y        = emitterYpos;
  this.xSpeed   = partXspeed;
  this.ySpeed   = partYspeed;
  this.size     = partSize;
  this.colour   = partColour;

  this.number   = 0;
  this.lifetime = 0;

  this.particles = [];


  this.initializeEmitter = function(particlesNumber, particlesLifetime){
    this.number = particlesNumber;
    this.lifetime = particlesLifetime;
    
    // load emitter with initial particles
    for(let i = 0; i < this.number; i++){
      this.particles.push(this.addParticle());
    }
  }

  this.addParticle = function(){

    let p = new Particle(
      random(this.x - 10, this.x + 10),
      random(this.y - 10, this.y + 10),
      random(this.xSpeed -1, this.xSpeed +1),
      random(this.ySpeed -1, this.ySpeed +1),
      random(this.size -4, this.size +4),
      color(random(0,255),random(0,255),random(0,255),100),
      random(this.lifetime/2,this.lifetime)
    )
    return p;
  }

  this.emitParticles = function(){

    //iterate thru particles and update each one
    for(let i = this.particles.length -1; i >=0; i--){
      this.particles[i].drawParticle();
      this.particles[i].moveParticle();
      this.particles[i].ageParticle();
      this.replaceExpiredParticle(i);
    }
  }

  this.replaceExpiredParticle = function(i){

    //if particle has aged past lifetime, delete it
    if(this.particles[i].age > this.lifetime){
      this.particles.splice(i, 1);

      //spawn a new particle in its place
      this.particles.push(this.addParticle());
    }
  }
}



let emitup;
let emitdown;

function setup() {

  createCanvas(800, 600);
  noStroke();

  emitup = new Emitter(
    width/2, 
    height-100, 
    0, 
    -2, 
    20, 
    color(200, 0, 200,100)
    );

  emitdown = new Emitter(
    width/2, 
    100, 
    0, 
    2, 
    20, 
    color(0, 200, 200,100)
    );

  emitup.initializeEmitter(200,400);
  emitdown.initializeEmitter(200,400);
}

function draw() {

  background(10);
  emitup.emitParticles();
  emitdown.emitParticles();

}
