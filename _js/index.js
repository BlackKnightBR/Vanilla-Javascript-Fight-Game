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

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './_imagens/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	imageSrc: './_imagens/shop.png',
	scale: 2.75,
	framesMax: 6,
})

const player = new Fighter({
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
	},
	imageSrc: './_imagens/samuraiMack/idle.png',
	scale: 2.5,
	framesMax: 8,
	offset: {
		x: 215,
		y: 155
	}
})

const enemy = new Fighter({
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
	},
	imageSrc: './_imagens/kenji/idle.png',
	scale: 2.5,
	framesMax: 8
})


decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
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