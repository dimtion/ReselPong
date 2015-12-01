Game = {};

function Player(div_id, up_key, down_key) {
    this.div = document.getElementById(div_id);
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;

    this.y = Game.h / 2;
    this.speed = 10;
    this.up_key = up_key;
    this.down_key = down_key;

    this.moveUp = function(){
        if(this.y > 0)
        this.y -= this.speed;
    };

    this.moveDown = function(){
        if(this.y + this.h < Game.h)
            this.y += this.speed;
    };

    this.update = function(){
        if (Key.isDown(this.up_key)) {
            this.moveUp();
        }
        if (Key.isDown(this.down_key)) this.moveDown();
    };
}

function Ball() {
    this.div = document.getElementById('ball');
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;
    console.log(this.w)
    this.x = Game.w / 2;
    this.y = Game.h /2;
    this.angle = .9;
    this.speed = 4;
    this.update = function(){
        if (Game.ball.y > 480 || Game.ball.y < 0){
            Game.ball.angle = -Game.ball.angle;
        }
        // If there is somebody
        if (this.x > 490 && this.y > Game.p2.y && this.y < Game.p2.y + 50){
            this.x = 489;
            this.angle = 3.14 - this.angle;
            Game.ball.speed += 1;
        }
        if (this.x < 10 && this.y > Game.p1.y && this.y < Game.p1.y + 50){
            this.x = 11;
            this.angle = 3.14 - this.angle;
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


    Game.p1 = new Player('p1', Key.A, Key.Q);
    Game.p2 = new Player('p2', Key.O, Key.L);
    Game.ball = new Ball();
    Game.fps = 50;
};

Game.update = function() {
    this.p1.update();
    this.p2.update();
    this.ball.update();

    // Game over in this case
    if (this.ball.x > 500 || this.ball.x < 0){
        Game.init();
        console.log("GAME OVER");
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


window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

Game.init();
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);