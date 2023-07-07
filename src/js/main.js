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
    movables = [background, ...boundaries, ...battleZones]


    //draws the character, all of the onscreen graphical elements, and the world boundaries/hitboxes/etc from 'bottom' to 'top'
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    // npcs.forEach((npc) => {
    //     npc.draw()
    // })
    // npcDialogHitboxes.forEach((npcDialogBox) => {
    //     npcDialogBox.draw()
    // })
    player.draw()


    //sets player moving variable to handle if player is moving or not
    let moving = true
    player.moving = false


    //handles main character movement
    if (keys.w.pressed && pressedKeys[pressedKeys.length - 1] === 'w') {
        if (inDialog == false) {
            player.image = player.sprites.up
            player.moving = true
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
            player.image = player.sprites.left
            player.moving = true
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
            player.image = player.sprites.down
            player.moving = true
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
            player.image = player.sprites.right
            player.moving = true
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
                window.cancelAnimationFrame(animationId)
                battle.initiated = true
                startBattle()
                stepCounter = 0
                break
            }
        }
    }


    //triggers the main menu to open
    if (menuOpen == true) {
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
        if (keys.d.pressed && index == 0) {
            index++
        } else if (keys.a.pressed && index == 1) {
            index--
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
            document.querySelector('#npc-message').style.display = 'none'
            document.querySelector('#merchant-options-one').style.display = 'none'
        }
    }


    //initializes the actual shop menu
    if (shopMenuOpen) {
        document.querySelector('#merchant-options-one').style.display = 'none'
        document.querySelector('#merchant-options-two').style.display = 'flex'
        document.querySelector('#shop-money').innerHTML = `Money: $${character.money}`
        document.querySelector('#shop-amount-owned').innerHTML = `Amount Owned: ${character.items.potions.bigPotion.quantity}`
        let shopOptions = document.querySelectorAll('.shop-item')
        shopOptions[index].style.border = 'solid 5px white'

        //sets all the cost/amount owned per item selection (TEMPORARY)
        if (index == 0) {
            document.querySelector('#shop-amount-owned').innerHTML = `Amount Owned: ${character.items.potions.bigPotion.quantity}`
            document.querySelector('#shop-money').innerHTML = `Money: $${character.money}<br>Cost: $${merchant.items[index].cost}`
        } else if (index == 1) {
            document.querySelector('#shop-amount-owned').innerHTML = `Amount Owned: ${character.items.potions.bigMagicPotion.quantity}`
            document.querySelector('#shop-money').innerHTML = `Money: $${character.money}<br>Cost: $${merchant.items[index].cost}`
        } else if (index == 2) {
            document.querySelector('#shop-amount-owned').innerHTML = `Amount Owned: ${character.equipment.armor.quantity}`
            document.querySelector('#shop-money').innerHTML = `Money: $${character.money}<br>Cost: $${merchant.items[index].cost}`
        } else if (index == 3) {
            document.querySelector('#shop-amount-owned').innerHTML = `Amount Owned: ${character.equipment.weapon.quantity}`
            document.querySelector('#shop-money').innerHTML = `Money: $${character.money}<br>Cost: $${merchant.items[index].cost}`
        } else {
            document.querySelector('#shop-amount-owned').innerHTML = ``
            document.querySelector('#shop-money').innerHTML = `Money: $${character.money}`
        }

        //handles selection of items and purchase of items
        if (keyFiredW && index > 0) {
            index--
            shopOptions[index + 1].style.border = 'solid 5px transparent'
            keyFiredW = false
        } else if (keyFiredS && index < shopOptions.length - 1) {
            index++
            shopOptions[index - 1].style.border = 'solid 5px transparent'
            keyFiredS = false
        }
        if (keyFiredEnter && index == 0) {
            if (character.money >= merchant.items[index].cost) {
                character.money -= merchant.items[index].cost
                character.items.potions.bigPotion.quantity++
            } else {
                alert('not enough money')
            }
        }
        else if (keyFiredEnter && index == 1) {
            if (character.money >= merchant.items[index].cost) {
                character.money -= merchant.items[index].cost
                character.items.potions.bigMagicPotion.quantity++
            } else {
                alert('not enough money')
            }
        }
        else if (keyFiredEnter && index == 2) {
            if (character.money >= merchant.items[index].cost) {
                character.money -= merchant.items[index].cost
                character.items.equipment.armor.defense = 0.5
            } else {
                alert('not enough money')
            }
        }
        else if (keyFiredEnter && index == 3) {
            if (character.money >= merchant.items[index].cost) {
                character.money -= merchant.items[index].cost
                character.items.equipment.weapon.attack = 1.5
            } else {
                alert('not enough money')
            }
        }
        else if (keyFiredEnter && index == shopOptions.length - 1) {
            shopOptions[index].style.border = 'solid 5px transparent'
            index = 0
            shopMenuOpen = false
            keyFiredEnter = false
            inDialog = false
            document.querySelector('#npc-message').style.display = 'none'
            document.querySelector('#merchant-options-two').style.display = 'none'
        }
    }


    //handles merchant collision and dialog init
    for (let i = 0; i < npcDialogHitboxes.length; i++) {
        const dialogNPC = npcDialogHitboxes[i]
        if (keyFiredEnter &&
            rectangleCollision({
                rectangle1: player,
                rectangle2: {
                    ...dialogNPC,
                    position: {
                        x: dialogNPC.position.x + 10,
                        y: dialogNPC.position.y + 10
                    }
                }
            })
        ) { 
            if (npcIterator == (Object.keys(merchant.dialog).length)) {
                inDialog = true
                document.querySelector('#npc-message').style.display = 'none'
                document.querySelector('#merchant-options-one').style.display = 'flex'
                keyFiredEnter = false
                yesNo = true
            } else {
                inDialog = true
                document.querySelector('#npc-message').style.display = 'flex'
                document.querySelector('#npc-message').innerHTML = merchant.dialog[npcIterator]
                keyFiredEnter = false
                npcIterator++
            }
            
        }
    }


}


// Run main game loop
animate()