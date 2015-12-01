Game = {};

function Player(div_id, up_key, down_key, score, div_score) {
    this.div = document.getElementById(div_id);
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;
    this.offset = 5;
    this.y = Game.h / 2;
    this.speed = 10;
    this.up_key = up_key;
    this.down_key = down_key;
    this.score = score;
    this.div_score = document.getElementById(div_score);

    this.moveUp = function(){
        if(this.y > 0)
        this.y -= this.speed;
    };

    this.moveDown = function(){
        if(this.y + this.h < Game.h)
            this.y += this.speed;
    };

    this.update = function(){
        if (Key.isDown(this.up_key))    this.moveUp();
        if (Key.isDown(this.down_key))  this.moveDown();

    };
}

function Ball() {
    this.div = document.getElementById('ball');
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;

    this.x = Game.w / 2;
    this.y = Game.h / 2;
    this.angle = Math.random()*2*Math.PI;
    this.speed = 3;

    this.update = function(){
        // Check if ball reach vertical limits
        if (Game.ball.y > 480 || Game.ball.y < 0){
            Game.ball.angle = -Game.ball.angle;
            boing.play();
        }
        // Check if there is player 2
        if (this.x >= Game.w - (Game.p2.w + Game.p2.offset + this.w) && this.y > Game.p2.y && this.y < Game.p2.y + Game.p2.h){
            this.x = Game.w - (Game.p2.w + Game.p2.offset + this.w) - 1;
            this.angle = Math.PI - this.angle;
            Game.ball.speed += 1;
            ping.play();
        }
        // Check if there is player 1
        if (this.x < Game.p1.w + Game.p1.offset && this.y > Game.p1.y && this.y < Game.p1.y + Game.p1.h){
            this.x = Game.p1.w + Game.p1.offset + 1;
            this.angle = Math.PI - this.angle;
            ping.play();
        }

        this.x = this.x + this.speed * Math.cos(this.angle);
        this.y = this.y + this.speed * Math.sin(this.angle);
    }
}

var Key = {
  _pressed: {},

  A: 65,
  Q: 81,
  O: 79,
  L: 76,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

Game.init = function() {
    // Context init :
    Game.container = document.getElementById("pong-container");
    Game.w = Game.container.clientWidth;
    Game.h = Game.container.clientHeight;

    Game.p1 = new Player('p1', Key.A, Key.Q, 0, 'score1');
    Game.p1.div_score.innerHTML = Game.p1.score;
    Game.p2 = new Player('p2', Key.O, Key.L, 0, 'score2');
    Game.p2.div_score.innerHTML = Game.p2.score;
    Game.ball = new Ball();
    Game.fps = 50;
};

Game.reset = function() {

    Game.p1.div_score.innerHTML = Game.p1.score;
    Game.p2.div_score.innerHTML = Game.p2.score;

    Game.p1 = new Player('p1', Key.A, Key.Q, Game.p1.score, 'score1');
    Game.p2 = new Player('p2', Key.O, Key.L, Game.p2.score, 'score2');
    Game.ball = new Ball();
}

Game.update = function() {
    this.p1.update();
    this.p2.update();
    this.ball.update();

    // Game over in this case
    if (this.ball.x > Game.w){
        Game.p1.score++;
        gameOver.play();
        Game.reset();
        console.log("Palyer 1 Wins");
    } else if  (this.ball.x < 0){
        Game.p2.score++;
        gameOver.play();
        Game.reset();
        console.log("Palyer 2 Wins");
    }
};

Game.draw = function (){
    Game.p1.div.style.top =  Game.p1.y + "px";
    Game.p2.div.style.top =  Game.p2.y + "px";
    Game.ball.div.style.left =  Game.ball.x + "px";
    Game.ball.div.style.top =  Game.ball.y + "px";
};

Game.run = function() {
    Game.update();
    Game.draw();
};

// Init music 
var music = new Audio('music.mp3');
music.volume = .3;
music.loop = true;
music.play();

// init sounds
var boing = new Audio('boing.mp3');
var ping = new Audio('ping.mp3');
var gameOver = new Audio('gameOver.mp3');


window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

Game.init();
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);