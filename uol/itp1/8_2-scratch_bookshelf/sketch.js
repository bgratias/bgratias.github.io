/// <reference path="/Users/bgmacbook/Documents/UoL Computer Science/ITP1/p5.intellisense/p5.global-mode.d.ts" />

var bookShelf;
var books;

var reportNo = 0;

function setup()
{
	angleMode(DEGREES);
	
	bookShelf = {x: 80, y:10, width: 340, height: 115};

	createCanvas(800, 600);

	books = [
		["ITP1","ITP2","CMath","WebDev","FCS","DMath"],
		["Foundation Maths","Precalc w Limits","Discreet Math","Eloquent JS","Automata Theory"],
		["Moby Dick", "The Leopard", "Republic", "The Little Prince", "Don Quixote","The Hobbit","The Great Gatsby"],
		["Relativity","Arabian Nights","Kim","Ulysses","Frankenstein","Treasure Island","Tom Sawyer"],
		["Teasure Island","Sherlock Holmes","Green Gables","Looking Glass","The Firm"]
	];

	run();
}

function run(){

	background(250,240,230);

	drawBookShelf();

	addReport();
}

function addReport(){

	textSize(15);
	textStyle(BOLD);
	textAlign(LEFT);

	if(reportNo == 1){
		report1();
	}
	else if(reportNo == 2){
		report2();
	}
	else if(reportNo == 3){
		report3();
	}
	else if(reportNo == 4){
		report4();
	}
	else {
		report5()};
}


function drawBookShelf(){
	for(i=0; i < books.length; i++){
		drawShelf(i);
		drawBooks(i);
	}
}

function randomFill(){
	fill(random(0,255),random(0,255),random(0,255));	
}

function drawShelf(shelf){
	fill(120);
	rect(bookShelf.x, bookShelf.y + shelf * bookShelf.height, bookShelf.width, bookShelf.height);
	fill(50);
	rect(bookShelf.x + 10, bookShelf.y + 5 + shelf * bookShelf.height, bookShelf.width-20, bookShelf.height - 10);
}

function drawBooks(shelf){
	startNextBook = bookShelf.x + 10;

	for(j=0; j < books[shelf].length; j++){
		randomFill();
		bookHeight = random(70, bookShelf.height - 10);
		bookWidth = random(20,50);
		rect(startNextBook, bookShelf.y - 5 + (bookShelf.height-bookHeight) + shelf * bookShelf.height, bookWidth, bookHeight);
		
		textSize(8);
		textStyle(BOLD);
		textAlign(CENTER);
		fill(0);
		push();
			translate(startNextBook + bookWidth, bookShelf.y + (shelf+1) * bookShelf.height);
			rotate(270);
				text(books[shelf][j], 4 + bookHeight/2, 4 - bookWidth/2);
		pop();
		
		startNextBook += bookWidth;
	}
}
function report1(){

	text("The first book on each shelf:", bookShelf.x + bookShelf.width + 40, 100);
	textStyle(NORMAL);
	for(i=0; i < books.length; i++){
		text(books[i][0], bookShelf.x + bookShelf.width + 60, 150 + i * 20);
	}
}

function report2(){

	var totalBooks = 0;

	text("The total number of books:", bookShelf.x + bookShelf.width + 40, 100);
	textStyle(NORMAL);
	for(i=0; i < books.length; i++){
		text(books[i].length,bookShelf.x + bookShelf.width + 60,150 + i * 20);
		totalBooks = totalBooks + books[i].length;
	}
	text(totalBooks,bookShelf.x + bookShelf.width + 60, 180 + i * 20);

};

function report3(){

	text("All the books:", bookShelf.x + bookShelf.width + 40, 30);
	textStyle(NORMAL);
	textSize(9);
	for(i=0; i < books.length; i++){
		for(j=0; j < books[i].length; j++){
			text(books[i][j],bookShelf.x + bookShelf.width + 50, 60 + i * 100 + j * 12);
		}
	}
}

function report4(){
	
	text("All the books on a RANDOM shelf:", bookShelf.x + bookShelf.width + 40, 100);
	textStyle(NORMAL);
	shelf = int(random(0,books.length));
	text("Shelf: " + shelf, bookShelf.x + bookShelf.width + 50, 130);
	for( j = 0; j < books[shelf].length; j++){
		text(books[shelf][j], bookShelf.x + bookShelf.width + 60, 160 + j * 20);
	}
}

function report5(){

	text("Location of a RANDOM book:", bookShelf.x + bookShelf.width + 40, 100);
	textStyle(NORMAL);
	shelf = int(random(0,books.length));
	book = int(random(0, books[shelf].length));
	text("Shelf: " + shelf, bookShelf.x + bookShelf.width + 50, 130);
	text("Book Location: " + book, bookShelf.x + bookShelf.width + 50, 150);
	
	text(books[shelf][book], bookShelf.x + bookShelf.width + 50, 180);
}

function mousePressed(){
	reportNo ++;
	if(reportNo > 5){
		reportNo = 1
	}
	run();
}