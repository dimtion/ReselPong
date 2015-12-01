// ResEl, The Game

// Configuration :

var BALL_INIT_SPEED = 3;
var BALL_SPEED_UP = .3;

var PLAYER_INIT_SPEED = 10;
var PLAYER_OFFSET = 5;  // In PX

// SOUNDS
var boing = new Audio('boing.mp3');
var ping = new Audio('ping.mp3');
var gameOver = new Audio('gameOver.mp3');
var music = new Audio('music.mp3');
var MUSIC_VOLUME = .3;  // min 0, max 1

Game = {
    fps: 60,
};

function Player(div_id, up_key, down_key, score, div_score) {
    this.div = document.getElementById(div_id);
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;

    this.offset = PLAYER_OFFSET;
    this.y = Game.h / 2 + this.offset;
    this.speed = PLAYER_INIT_SPEED;
    this.up_key = up_key;
    this.down_key = down_key;
    this.score = score;
    this.div_score = document.getElementById(div_score);

    this.moveUp = function(){
        if(this.y - this.offset > 0)
        this.y -= this.speed;
    };

    this.moveDown = function(){
        if(this.y + this.h + this.offset < Game.h)
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
    this.angle = Math.random() *2 * Math.PI;
    this.speed = BALL_INIT_SPEED;

    this.is_in_front_p2 = function(){
        return this.y > Game.p2.y && (this.y + this.h / 2) < Game.p2.y + Game.p2.h;
    }

    this.is_in_front_p1 = function(){
        return this.y > Game.p1.y && (this.y + this.h / 2) < Game.p1.y + Game.p1.h;
    }
    this.horizontal_bounce = function(){
        this.angle = Math.PI - this.angle;
        Game.ball.speed += BALL_SPEED_UP;
        ping.play();
    }

    this.update = function(){
        // Check if ball reach vertical limits
        if (Game.ball.y > Game.h - this.h){
            Game.ball.angle = -Game.ball.angle;
            boing.play();
            Game.ball.y = Game.h - this.h - 1;
        } else if (Game.ball.y < 0){
            Game.ball.angle = -Game.ball.angle;
            boing.play();
            Game.ball.y = 1;
        }
        // Check if there is player 2
        if (this.x >= Game.w - (Game.p2.w + Game.p2.offset + this.w) && this.is_in_front_p2()){
            this.x = Game.w - (Game.p2.w + Game.p2.offset + this.w) - 1;
            this.horizontal_bounce();
        }
        // Check if there is player 1
        if (this.x < Game.p1.w + Game.p1.offset && this.is_in_front_p1()){
            this.x = Game.p1.w + Game.p1.offset + 1;
            this.horizontal_bounce();
        }

        this.x += + this.speed * Math.cos(this.angle);
        this.y += + this.speed * Math.sin(this.angle);
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

    music.volume = MUSIC_VOLUME;
    music.loop = true;
    music.play();

    Game.reset();
};

Game.reset = function() {
    var score_p1 = Game.p1 ? Game.p1.score : 0;
    var score_p2 = Game.p2 ? Game.p2.score : 0;

    Game.p1 = new Player('p1', Key.A, Key.Q, score_p1, 'score1');
    Game.p2 = new Player('p2', Key.O, Key.L, score_p2, 'score2');
    Game.ball = new Ball();

    Game.p1.div_score.innerHTML = Game.p1.score;
    Game.p2.div_score.innerHTML = Game.p2.score;
}

Game.update = function() {
    this.p1.update();
    this.p2.update();
    this.ball.update();

    // Game over in this case
    if (this.ball.x > Game.w){
        Game.p1.score++;
        gameOver.play();
        console.log("Palyer 1 Wins");
        Game.reset();
    } else if  (this.ball.x < 0){
        Game.p2.score++;
        gameOver.play();
        console.log("Palyer 2 Wins");
        Game.reset();
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

// Create keypress listeners
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// Start game
Game.init();
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);