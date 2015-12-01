Game = {};

function Player(div_id, up_key, down_key) {
    this.div = document.getElementById(div_id);
    this.w = this.div.clientWidth;
    this.h = this.div.clientHeight;
    this.offset = 5;
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
        }
        // Check if there is a player
        if (this.x >= Game.w - (Game.p2.w + Game.p2.offset + this.w) && this.y > Game.p2.y && this.y < Game.p2.y + Game.p2.h){
            console.log(this.x);
            this.x = Game.w - (Game.p2.w + Game.p2.offset + this.w) - 1;
            this.angle = Math.PI - this.angle;
            Game.ball.speed += 1;
        }
        // Else, the ball goes away
        if (this.x < Game.p1.w + Game.p1.offset && this.y > Game.p1.y && this.y < Game.p1.y + Game.p1.h){
            this.x = Game.p1.w + Game.p1.offset + 1;
            this.angle = Math.PI - this.angle;
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
    if (this.ball.x > Game.w || this.ball.x < 0){
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