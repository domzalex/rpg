/////////////////////////
//                     //
// MAIN GAME LOOP CODE //
//                     //
/////////////////////////


function animate() {

    //begins the main animation event
    const animationId = window.requestAnimationFrame(animate)
    
    //checks for current screen
    checkCollisionChange()


    //sets all movable objects that move on player directional input
    movables = [background, foreground, ...boundaries, ...npcList, ...npcCol, ...battleZones]


    //draws the character, all of the onscreen graphical elements, and the world boundaries/hitboxes/etc from 'bottom' to 'top'
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })

    
	npcList.forEach(npc => {
		npc.draw()
	})
    npcCol.forEach(col => {
        col.draw()
    })

	player.draw()

    foreground.draw()

    //sets player moving variable to handle if player is moving or not
    player.moving = true


    if (!moving) {
        if (player.facing === 'down') {
            player.image = player.idleSprites.idleDown
        } else if (player.facing === 'up') {
            player.image = player.idleSprites.idleUp
        } else if (player.facing === 'left') {
            player.image = player.idleSprites.idleLeft
        } else if (player.facing === 'right') {
            player.image = player.idleSprites.idleRight
        }
        
    }
    

	for (let i = 0; i < npcList.length; i++) {
		const npc = npcList[i]
		if (rectangleCollision({rectangle1: player, rectangle2: {...npc}})) {
			console.log('entering dialog with NPC')
		}
	}

    gamepadCheck()



    if (keys.w.pressed && pressedKeys[pressedKeys.length - 1] === 'w') {
        if (inDialog == false) {
            player.facing = 'up'
            player.image = player.sprites.up
            moving = true
			for (let i = 0; i < npcList.length; i++) {
                const npc = npcList[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...npc,
                            position: {
                                x: npc.position.x,
                                y: npc.position.y + 1
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y + 1
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            if (moving) {
                offset.y += spd
                movables.forEach((movable) => {
                    movable.position.y += spd
                })
            }
        } 
    }
    else if (keys.a.pressed && pressedKeys[pressedKeys.length - 1] === 'a') {
        if (inDialog == false) {
            player.facing = 'left'
            player.image = player.sprites.left
            moving = true
			for (let i = 0; i < npcList.length; i++) {
                const npc = npcList[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...npc,
                            position: {
                                x: npc.position.x + 1,
                                y: npc.position.y
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x + 1,
                                y: boundary.position.y
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            if (moving) {
                offset.x += spd
                movables.forEach((movable) => {
                    movable.position.x += spd
                })
            }
        }  
    }
    else if (keys.s.pressed && pressedKeys[pressedKeys.length - 1] === 's') {
        if (inDialog == false) {
            player.facing = 'down'
            player.image = player.sprites.down
            moving = true
			for (let i = 0; i < npcList.length; i++) {
                const npc = npcList[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...npc,
                            position: {
                                x: npc.position.x,
                                y: npc.position.y - 1
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 1
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            if (moving) {
                offset.y -= spd
                movables.forEach((movable) => {
                    movable.position.y -= spd
                })
            }
        }
    }
    else if (keys.d.pressed && pressedKeys[pressedKeys.length - 1] === 'd') {
        if (inDialog == false) {
            player.facing = 'right'
            player.image = player.sprites.right
            moving = true
			for (let i = 0; i < npcList.length; i++) {
                const npc = npcList[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...npc,
                            position: {
                                x: npc.position.x - 1,
                                y: npc.position.y
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i]
                if (
                    rectangleCollision({
                        rectangle1: player,
                        rectangle2: {
                            ...boundary,
                            position: {
                                x: boundary.position.x - 1,
                                y: boundary.position.y
                            }
                        }
                    })
                ) {
                    moving = false
                    break
                }
            }
            if (moving) {
                offset.x -= spd
                movables.forEach((movable) => {
                    movable.position.x -= spd
                })
            }
        }
    }
    




    //handles battle zone collision checks
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {

        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
                (Math.min(
                    player.position.x + player.width, 
                    battleZone.position.x + battleZone.width
                ) - 
                Math.max(player.position.x, battleZone.position.x)) * 
                (Math.min(
                    player.position.y + player.height, 
                    battleZone.position.y + battleZone.height
                ) - 
                Math.max(player.position.y, battleZone.position.y))
            if (rectangleCollision({rectangle1: player, rectangle2: battleZone})) {
                stepCounter++
            }

            //Conditions for starting battle. Makes it feel a bit more natural using the step counter: minimum threshold for walking needed to trigger a battle; if too many steps taken without battle it will trigger
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) && 
                overlappingArea > (player.width * player.height) / 2 &&
                ((Math.random() < 0.02 &&
                stepCounter >= 200) ||
                (stepCounter >= 1000))
            ) {
                stepCounter = 0
                battle.initiated = true
                inDialog = true
                keyFiredW = false
                keyFiredA = false
                keyFiredS = false
                keyFiredD = false
                window.cancelAnimationFrame(animationId)
                battlePlayer.image = playerIdleLeft
                document.querySelector('#battle-transition').style.left = '0px'
                setTimeout(() => {
                    document.querySelector('#battle-transition').style.left = '-1280px'
                }, 1000)
                setTimeout(() => {
                    startBattle()
                }, 1000)
                break
            }
        }
    }


    //triggers the main menu to open
    if (menuOpen == true) {
        inDialog = true
        window.cancelAnimationFrame(animationId)
        animateMenu()
    }


    //triggers 2nd merchant dialog (yes or no to open shop menu) THIS MUST GO BEFORE THE MERCHANT COLLISION CHECK idk why
    if (yesNo) {
        if (index == 0) {
            document.querySelector('#yes').style.border = 'solid 5px white'
            document.querySelector('#no').style.border = 'solid 5px transparent'
        } else {
            document.querySelector('#no').style.border = 'solid 5px white'
            document.querySelector('#yes').style.border = 'solid 5px transparent'
        }
        if (keyActive === 'd' && keyFiredD && index == 0) {
            index++
            keyFiredD = false
        } else if (keyActive === 'a' && keyFiredA && index == 1) {
            index--
            keyFiredA = false
        }
        if (keyFiredEnter && index == 0) {
            index = 0
            shopMenuOpen = true
            npcIterator = 0
            yesNo = false
            keyFiredEnter = false
            document.querySelector('#merchant-options-one').style.display = 'none'
            document.querySelector('#merchant-options-two').style.display = 'flex'
        } else if (keyFiredEnter && index == 1) {
            index = 0
            document.querySelector('#yes').style.border = 'solid 5px white'
            document.querySelector('#no').style.border = 'solid 5px transparent'
            npcIterator = 0
            yesNo = false
            inDialog = false
            keyFiredEnter = false
            document.querySelector('#npc-dialog').style.display = 'none'
            document.querySelector('#npc-message').style.display = 'none'
            document.querySelector('#merchant-options-one').style.display = 'none'
        }
    }


    //initializes the actual shop menu
    if (shopMenuOpen) {
        document.querySelector('#merchant-options-one').style.display = 'none'
        document.querySelector('#merchant-options-two').style.display = 'flex'
        document.querySelector('#menu-dialog').style.display = 'flex'
        document.querySelector('#menu-dialog').innerHTML = `Money: $${character.money}`
        document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigPotion.quantity}`
        let shopOptions = document.querySelectorAll('.shop-item')
        shopOptions[index].className = 'shop-item menu-button menu-hovered'

        //sets all the cost/amount owned per item selection (TEMPORARY)
        if (index == 0) {
            document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigPotion.quantity}`
            document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
        } else if (index == 1) {
            document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigMagicPotion.quantity}`
            document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
        } else if (index == 2) {
            document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.equipment.armor.quantity}`
            document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
        } else if (index == 3) {
            document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.equipment.weapon.quantity}`
            document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
        } else {
            document.querySelector('#shop-amount-owned').innerHTML = `Owned: 0`
            document.querySelector('#shop-cost').innerHTML = `Cost: $0`
			document.querySelector('#shop-message').innerHTML = 'Leave shop'
        }

        //handles selection of items and purchase of items
        if (keyActive === 'w' && keyFiredW && index > 0) {
			blip()
            shopOptions[index].className = 'shop-item menu-button'
            index--
            shopOptions[index].className = 'shop-item menu-button menu-hovered'
			document.querySelector('#shop-message').style.color = 'rgb(88, 193, 61)'
			document.querySelector('#shop-message').innerHTML = `${npc2.items[index].effect}`
            keyFiredW = false
        }
        if (keyActive === 's' && keyFiredS && index < shopOptions.length - 1) {
			blip()
            shopOptions[index].className = 'shop-item menu-button'
            index++
            shopOptions[index].className = 'shop-item menu-button menu-hovered'
			document.querySelector('#shop-message').style.color = 'rgb(88, 193, 61)'
			document.querySelector('#shop-message').innerHTML = `${npc2.items[index].effect}`
            keyFiredS = false
        }
        if (keyFiredEnter && index == 0) {
			select()
			keyFiredEnter = false
            if (character.money >= npc2.items[index].cost) {
                character.money -= npc2.items[index].cost
                character.items.potions.bigPotion.quantity++
            } else {
				document.querySelector('#shop-message').style.color = '#B7522E'
				document.querySelector('#shop-message').innerHTML = `Not enough money!`
            }
        }
        else if (keyFiredEnter && index == 1) {
			select()
			keyFiredEnter = false
            if (character.money >= npc2.items[index].cost) {
                character.money -= npc2.items[index].cost
                character.items.potions.bigMagicPotion.quantity++
            } else {
				document.querySelector('#shop-message').style.color = '#B7522E'
				document.querySelector('#shop-message').innerHTML = `Not enough money!`
            }
        }
        else if (keyFiredEnter && index == 2) {
			select()
			keyFiredEnter = false
            if (character.money >= npc2.items[index].cost) {
                character.money -= npc2.items[index].cost
                character.items.equipment.armor.defense = 0.5
            } else {
                document.querySelector('#shop-message').style.color = '#B7522E'
				document.querySelector('#shop-message').innerHTML = `Not enough money!`
            }
        }
        else if (keyFiredEnter && index == 3) {
			select()
			keyFiredEnter = false
            if (character.money >= npc2.items[index].cost) {
                character.money -= npc2.items[index].cost
                character.items.equipment.weapon.attack = 1.5
            } else {
                document.querySelector('#shop-message').style.color = '#B7522E'
				document.querySelector('#shop-message').innerHTML = `Not enough money!`
            }
        }
        else if (keyFiredEnter && index == shopOptions.length - 1) {
			select()
			keyFiredEnter = false
            shopOptions[index].className = 'shop-item menu-button'
            index = 0
            shopMenuOpen = false
            keyFiredEnter = false
            inDialog = false
            document.querySelector('#menu-dialog').style.display = 'none'
            document.querySelector('#npc-message').style.display = 'none'
            document.querySelector('#merchant-options-two').style.display = 'none'
            document.querySelector('#npc-dialog').style.display = 'none'
        }
    }


    //handles merchant collision and dialog init
    for (let i = 0; i < npcList.length; i++) {
        const npc = npcList[i]
        if (keyFiredEnter &&
            rectangleCollision({
                rectangle1: player,
                rectangle2: {
                    ...npc,
                    position: {
                        x: npc.position.x + 10,
                        y: npc.position.y + 10
                    }
                }
            })
        ) { blip()
            if (npc.type === 'merchant') {
                if (npcIterator == (Object.keys(npc.dialog).length)) {
                    inDialog = true
                    document.querySelector('#npc-dialog').style.display = 'flex'
                    document.querySelector('#npcDialogIcon').style.backgroundImage = `none`
                    document.querySelector('#npc-message').style.display = 'none'
                    document.querySelector('#merchant-options-one').style.display = 'flex'
                    keyFiredEnter = false
                    yesNo = true
                } else {
                    inDialog = true
                    document.querySelector('#npc-dialog').style.display = 'flex'
                    document.querySelector('#npcDialogIcon').style.backgroundImage = `url('./img/merchantIcon.png')`
                    document.querySelector('#npc-message').style.display = 'inline-block'
                    document.querySelector('#npc-message-container').style.display = 'flex'
                    document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
                    keyFiredEnter = false
                    npcIterator++
                }
            } else if (npc.type === 'tutorial') {
                if (!npc.talkedTo) {
                    if (npcIterator == (Object.keys(npc.dialog).length)) {
                        npc.talkedTo = true
                        inDialog = false
                        character.items.potions.potion.quantity += 3
                        document.querySelector('#npc-dialog').style.display = 'none'
                        document.querySelector('#npc-message').style.display = 'none'
                        keyFiredEnter = false
                        npcIterator = 0
                    } else {
                        inDialog = true
                        document.querySelector('#npc-dialog').style.display = 'flex'
                        document.querySelector('#npc-message').style.display = 'flex'
                        document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
                        keyFiredEnter = false
                        npcIterator++
                    }
                } else {
                    if (npcIterator == (Object.keys(npc.dialog).length)) {
                        inDialog = false
                        document.querySelector('#npc-dialog').style.display = 'none'
                        document.querySelector('#npc-message').style.display = 'none'
                        keyFiredEnter = false
                        npcIterator = 0
                    } else {
                        inDialog = true
                        npcIterator = Object.keys(npc.dialog).length - 1
                        document.querySelector('#npc-dialog').style.display = 'flex'
                        document.querySelector('#npc-message').style.display = 'flex'
                        document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
                        keyFiredEnter = false
                        npcIterator++
                    }
                }
            }
            
        }
    }

}

// if (player.facing === 'down' && player.moving == false) {
//     player.image = player.sprites.idleDown
// } else {

// }


// Run main game loop
animate()