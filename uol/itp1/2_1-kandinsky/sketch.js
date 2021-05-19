/// <reference path="/Users/bgmacbook/Documents/UoL Computer Science/CM1005 - ITP1/p5.intellisense/p5.global-mode.d.ts" />

function setup() 
{
    createCanvas(664,682);
    background(224,213,195);
    noLoop();
    stroke(1);
    noFill();
}

function draw()
{
    //Green Stripe
    noStroke();
    fill(85,139,123,150);
    quad(130,8,229,8,654,399,654,647);
    
    //Yellow Stripe
    noStroke();
    fill(211,170,118,150);
    quad(605,8,656,8,11,744,11,496);

    stroke(1);
    
    //Heavy circles
    strokeWeight(30);
    noFill();
    ellipse(325,333,583);
    
    strokeWeight(6);
    fill(219,21,38,200);
    ellipse(145,308,34);
    
    strokeWeight(2);
    fill(55,67,83,200);
    ellipse(111,381,18);
    fill(107,156,137,150);
    ellipse(189,386,47);
    fill(193,99,115,150);
    ellipse(511,473,26);
    ellipse(307,96,15);
    fill(203,132,128,150);
    ellipse(363,533,35);
    ellipse(244,430,60);
    
    //light circles
    strokeWeight(1);
    fill(204,35,58,150);
    ellipse(341,230,113);
    fill(120,67,87,150);
    ellipse(450,186,77);
    fill(107,156,137,150)
    ellipse(442,308,150);
    fill(10,110,125,150);
    ellipse(505,318,58);
    ellipse(449,270,26);
    ellipse(403,213,41);
    fill(107,156,137,150)
    ellipse(315,356,185);
    fill(235,176,180,150);
    ellipse(258,207,133);
    ellipse(152,475,36);
    fill(116,147,129,150);
    ellipse(258,271,72);
    fill(228,195,80,150);
    ellipse(262,365,149);
    fill(0);
    ellipse(277,473,9);
    fill(196,84,82,150);
    ellipse(319,458,13);
    fill(227,188,123,150);
    ellipse(394,485,16);
    fill(224,194,96,150);
    ellipse(419,409,102);
    fill(0);
    ellipse(448,444,28);
    fill(204,35,58,150);
    ellipse(336,393,18);
    
    //Medium circles
    strokeWeight(3);
    fill(216,93,52,150);
    ellipse(307,307,68);
    fill(0);
    ellipse(307,307,17);
    
    //Heavy Lines
    strokeWeight(3);
    line(92,332,553,425);
    line(487,480,484,216);
    line(219,527,464,118);

    strokeWeight(2);
    line(156,174,544,239);
    line(123,360,310,186);
    line(131,360,453,526);
    line(195,469,285,520);
    line(165,501,292,478);
    line(407,540,471,140);
    line(156,422,367,145);
    line(348,138,370,172);
    line(338,149,365,182);
    line(478,240,505,240);
    line(478,249,515,249);
    
    //Light Lines
    strokeWeight(1);
    line(203,163,543,384);
    line(127,257,100,304);
    line(138,259,106,301);
    line(176,277,165,316);
    line(101,270,531,385);
    line(99,281,528,399);
    line(126,391,519,436);
    line(175,522,410,202);
    line(191,526,410,202);
    line(387,512,443,475);
    line(387,521,448,483);
    line(392,530,451,492);
    line(399,525,460,143);
    line(416,559,484,130);

    //frame
    noFill();
    stroke(242,237,231,255);
    strokeWeight(20)
    rect(0,0,664,682)

}


