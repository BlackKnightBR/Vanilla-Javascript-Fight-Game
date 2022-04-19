const canvas = document.querySelector('#écranPrincipal');
const c = canvas.getContext('2d');
const enemyHealtBar = document.querySelector('#barreDeSantéEnnemie');
const playerHealtBar = document.querySelector('#barreDeSantéDuJoueur');
const timerElement = document.querySelector('#minuteur');
const gravity = 10;
let timer = 60;
let timeId


//Lista de comandos usados no jogo
const keys = {
	a: {
		pressed: false
	},
	
	d: {
		pressed: false
	},
	
	s: {
		pressed: false
	},
	
	w: {
		pressed: false
	},
	
	ArrowUp: {
		pressed: false
	},
	
	ArrowLeft: {
		pressed: false
	},
	
	ArrowRight: {
		pressed: false
	}
}

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
constructor({position, velocity, color, offset}) {
		this.position = position
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50
		}
		this.color = color
		this.isAttacking = false
		this.healtBar = 100
	}
	
	draw() {
		c.fillStyle = this.color.body;
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
		
		//Atack box
		if(this.isAttacking){
			c.fillStyle = this.color.hit;
			c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
		} 
	}
	
	update() {
		this.draw()
		
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		
		//Movimento no eixo Y
		this.position.y += this.velocity.y;
		this.position.y += gravity;
		
		//A gravidade sempre vai afetar os jogadores, 0 código paenas impede que os jogadores saiam da tela
		if(this.position.y + this.height >= canvas.height) this.position.y = canvas.height - this.height;
		if(this.position.y <= 0) this.position.y = 0;
		
		//Movimento no eixo X
		this.position.x += this.velocity.x;
		
		if(this.position.x + this.width >= canvas.width) this.position.x = canvas.width - this.width;
		if(this.position.x <= 0) this.position.x = 0;
	}
	
	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false	
		}, 100)
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: {
		body: 'green',
		hit: 'red'
	},
	offset: {
		x: 0,
		y: 0
	}
})

const enemy = new Sprite({
	position: {
		x: 1024 - 50,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: {
		body: 'yellow',
		hit: 'blue'
	},
	offset: {
		x: -50,
		y: 0
	}
})


function rectangularCollision({rectangle1,rectangle2}) {
	//Revisar
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

function determineWinner({player, enemy, timeId}){
	
	let displayElement = document.querySelector('#présentoir')
	
	clearTimeout(timeId);
	displayElement.style.display = 'flex'
	if ( player.healtBar === enemy.healtBar){
		displayElement.innerHTML = 'tie'
	} else if(player.healtBar > enemy.healtBar ){
		displayElement.innerHTML = 'player 1 wins'
	} else if(player.healtBar < enemy.healtBar){
		displayElement.innerHTML = 'player 2 wins'
	}
}


function decreaseTimer(){
	timeId = setTimeout(decreaseTimer, 1000)
	if(timer> 0) {
		timer--
		timerElement.innerHTML = timer
	}
	if(timer === 0){
		determineWinner({player, enemy, timeId})
	}
	
}

decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()
	
	player.velocity.x = 0
	enemy.velocity.x = 0
	
	if(keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -5
	} else if(keys.d.pressed && player.lastKey === 'd'){ 
		player.velocity.x = 5
	}

	
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -5
	} else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){ 
		enemy.velocity.x = 5
	}
	
	if( rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
	}) && player.isAttacking){	
		player.isAttacking = false
		enemy.healtBar -= 10
		enemyHealtBar.style.width = enemy.healtBar + '%'
		console.log('Hit')
	}
	
	if( rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
	}) && enemy.isAttacking){	
		enemy.isAttacking = false
		player.healtBar -= 10
		playerHealtBar.style.width = player.healtBar + '%'
		console.log('Enemy Hit ')
	}
	
	if(player.healtBar === 0 || enemy.healtBar === 0){
		determineWinner({player, enemy , timeId})
	}
}

animate();

window.addEventListener('keydown', (event) => {
	//console.log(event); - log completo do evento 'keydown'
	//console.log(event.key); //Exibe o caracter da tecla
	
	switch(event.key){
		case 'd':
			keys.d.pressed = true
			player.lastKey = 'd'
			break
		case 'a':
			keys.a.pressed = true
			player.lastKey = 'a'
			break
		case 'w':
			player.velocity.y = -20
			break
		case ' ':
			player.attack()
			break
		//Enemy keys
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastKey = 'ArrowRight'
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastKey = 'ArrowLeft'
			break
		case 'ArrowUp':
			enemy.velocity.y = -20
			break
		case ',':
			enemy.attack()
			break
	}
});

window.addEventListener('keyup', (event) => {
	//console.log(event); - log completo do evento 'keydown'
	//console.log(event.key); //Exibe o caracter da tecla
	
	switch(event.key){
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 'w':
			player.velocity.y = 0
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowUp':
			enemy.velocity.y = 0
			break
	}
});