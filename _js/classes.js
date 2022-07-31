class Sprite {
constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0 , y: 0}}) {
		this.position = position
		this.height = 150
		this.width = 50
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 5
		this.offset = offset
	}
	
	draw() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width/ this.framesMax ),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,			
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale, 
			this.image.height * this.scale
			)
	}
	
	update() {
		this.draw()
		
		this.framesElapsed ++
		
		if(this.framesElapsed % this.framesHold === 0){
			if(this.framesCurrent < this.framesMax -1){
				this.framesCurrent++
			} else {
				this.framesCurrent = 0
			}	
		}
		
	}
}

class Fighter extends Sprite {
	constructor({position, velocity, color, imageSrc, scale = 1, framesMax = 1, offset = {x: 0 , y: 0}}) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset,
		})
		
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
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 5
	}

	
	update() {
		this.draw()
		
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		
		//Movimento no eixo Y
		this.position.y += this.velocity.y;
		this.position.y += gravity;
		
		//A gravidade sempre vai afetar os jogadores, 0 código paenas impede que os jogadores saiam da tela
		if(this.position.y + this.height >= canvas.height - 96) this.position.y = canvas.height - 96 - this.height;
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