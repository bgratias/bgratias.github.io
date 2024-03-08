
var tadpoles;
var screenBorder;

function setup()
{

    createCanvas(1200,800);
    
    screenBorder = 100;
    
    tadpoles = [];
    
    for(var i = 0; i < 200; i++)
    {
        tadpoles.push(
            createTadpole(
                random(0,width + screenBorder),
                random(0, height + screenBorder)
            )
        );
    }

    
    
}

function draw()
{
    
    background(0,105,148);
    
    for(var i = 0; i < tadpoles.length; i++)
    {
        tadpoles[i].update();
        tadpoles[i].draw();
    }

    
}



function mousePressed()
{
    var v = createVector(mouseX, mouseY);
    
    for(var i = 0; i < tadpoles.length; i++)
    {
        if(!tadpoles[i].isHatched)
        {
            tadpoles[i].testClick(v);
        }
    }
    
}

function createTadpole(x,y)
{
    var tadpole = 
    {
        
        pos: undefined,
        dir: undefined,
        isHatched: false,
        tailFlick: 5,
        tailIncr: -1,
        
        setup: function(x,y)
        {
            this.pos = createVector(x,y);
            this.dir = createVector(random(-1,1),random(-1,1));
            this.dir.normalize();
        },
        
        draw: function()
        {
            push();
            
            translate(this.pos.x, this.pos.y);
            
            if(!this.isHatched)
            {

                fill(100,100);
                stroke(150);
                ellipse(0,0,25);
                fill(0);
                ellipse(0,0,6);
                
            }
            else
            {
                rotate(this.dir.heading());
                fill(0);
                stroke(0);
                ellipse(0,0,12,8);
                strokeWeight(2);
                noFill();
                beginShape();
                
                curveVertex(-6,0);
                curveVertex(-6,0);
                curveVertex(-18,this.tailFlick);
                curveVertex(-36, 0);
                curveVertex(-36, 0);
 
                
                endShape();
            }
            
            pop();
        },
        
        update: function()
        {
            if(!this.isHatched)
            {
                this.pos.x += random(-0.5,0.5);
                this.pos.y += random(-0.5,0.5);    
            }
            else
            {
                
                this.tailFlick += this.tailIncr;
                
                if(abs(this.tailFlick) > 5)
                {
                    this.tailIncr *=-1;
                }
                
                this.pos.add(this.dir);
                
                
                
            }
            
            this.screenWrap();
        },
        
        screenWrap: function()
        {
            if(this.pos.x > width + screenBorder)
            {
                this.pos.x -= width + screenBorder;
            }
            else if(this.pos.x < -screenBorder)
            {
                this.pos.x += width + screenBorder;
            }

            if(this.pos.y > height + screenBorder)
            {
                this.pos.y -= height + screenBorder;
            }
            else if(this.pos.y < -screenBorder )
            {
                this.pos.y += height + screenBorder;
            }
        },
        
        testClick: function(mouse)
        {
            if(this.pos.dist(mouse) < 25)
            {
                this.isHatched = true;
            }
        }
    };
    
    
    tadpole.setup(x,y);
    
    return tadpole;
}