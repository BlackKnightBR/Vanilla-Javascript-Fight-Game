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