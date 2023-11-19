/////////////////////////
//                     //
// MAIN GAME LOOP CODE //
//                     //
/////////////////////////




//this handles repetitive changing of hover states on all sorts of elements.
function hoverSelectToggle(item, toggler, index, addsub, cls) {
    item.children[toggler.index].className = `${cls}`
    switch (addsub) {
        case 'plus' :
            toggler.index += 1
            break
        case 'minus' :
            toggler.index -= 1
            break
        case 'zero' :
            toggler.index = 0
            break
        case '' :
            toggler.index = index
            break
    }
    item.children[toggler.index].className = `${cls} hovered`
    return toggler[index]
}

function animate() {

    //begins the main animation event
    const animationId = window.requestAnimationFrame(animate)
    
    //checks for current screen
    checkCollisionChange()

    //sets all movable objects that move on player directional input
    movables = [background, foreground, ...boundaries, ...npcList, ...npcCol, ...battleZones]

    //draws the character and all of the onscreen graphical elements from 'bottom' to 'top'
    background.draw()
	player.draw()
    // foreground.draw()

    //sets player moving variable to handle if player is moving or not
    player.moving = true

    //sets player idle sprite when not moving
    if (!moving) {
        const idleSprites = {
            'down': 'idleDown',
            'up': 'idleUp',
            'left': 'idleLeft',
            'right': 'idleRight'
        };
        player.image = player.idleSprites[idleSprites[player.facing]]
    }
    

	// for (let i = 0; i < npcList.length; i++) {
	// 	const npc = npcList[i]
	// 	if (rectangleCollision({rectangle1: player, rectangle2: {...npc}})) {
	// 		console.log('entering dialog with NPC')
	// 	}
	// }

    // gamepadCheck()

    //Logic for character movement, and collisions for both scene boundaries as well as battle zones
    const directions = ['w', 'a', 's', 'd']

    for (const direction of directions) {
        if (keyActive === direction && pressedKeys[pressedKeys.length - 1] === direction && !inDialog) {
            const directionMap = {
                'w': { facing: 'up', position: { x: 0, y: 1 } },
                'a': { facing: 'left', position: { x: 1, y: 0 } },
                's': { facing: 'down', position: { x: 0, y: -1 } },
                'd': { facing: 'right', position: { x: -1, y: 0 } }
            };

            const move = directionMap[direction]
            moving = true

            for (const movable of [...npcList, ...boundaries]) {
                const newPosition = {
                    x: movable.position.x + move.position.x,
                    y: movable.position.y + move.position.y
                };
                if (rectangleCollision({rectangle1: player, rectangle2: { ...movable, position: newPosition }})) {
                    moving = false
                    break
                }
            }

            if (moving) {
                player.facing = move.facing
                player.image = player.sprites[move.facing]
                offset.x += spd * move.position.x
                offset.y += spd * move.position.y
                movables.forEach((movable) => {
                    movable.position.x += spd * move.position.x
                    movable.position.y += spd * move.position.y
                });
            }

            //battle zone collision check and battle init
            // for (const battleZone of battleZones) {
            //     const overlappingArea = (
            //         (Math.min(
            //             player.position.x + player.width,
            //             battleZone.position.x + battleZone.width
            //         ) -
            //         Math.max(
            //             player.position.x,
            //             battleZone.position.x
            //         )) *
            //         (Math.min(
            //             player.position.y + player.height,
            //             battleZone.position.y + battleZone.height
            //         ) -
            //         Math.max(
            //             player.position.y,
            //             battleZone.position.y)
            //         ))
        
            //     if (rectangleCollision({ rectangle1: player, rectangle2: battleZone })) {
            //         stepCounter++
            //     }
        
            //     if (
            //         rectangleCollision({ rectangle1: player, rectangle2: battleZone }) &&
            //         overlappingArea > (player.width * player.height) / 2 &&
            //         ((Math.random() < 0.02 && stepCounter >= 200) || (stepCounter >= 1000))
            //     ) {
            //         stepCounter = 0
            //         battle.initiated = true
            //         inDialog = true
            //         keyActive = ''
            //         window.cancelAnimationFrame(animationId)
            //         battlePlayer.image = playerIdleLeft
            //         document.querySelector('#battle-transition').style.left = '0px'
            //         setTimeout(() => {
            //             document.querySelector('#battle-transition').style.left = '-1300px'
            //             setTimeout(() => {
            //                 document.querySelector('#battle-transition').style.opacity = '0'
            //             }, 1500)
            //         }, 1000)
            //         setTimeout(startBattle, 1000)
            //         break
            //     }
            // }

        } 
    }

    //triggers the main menu to open
    if (menuOpen == true) {
        inDialog = true
        window.cancelAnimationFrame(animationId)
        animateMenu()
    }

    //triggers 2nd merchant dialog (yes or no to open shop menu) THIS MUST GO BEFORE THE MERCHANT COLLISION CHECK idk why
    // if (yesNo) {
    //     if (index == 0) {
    //         document.querySelector('#yes').style.border = 'solid 5px white'
    //         document.querySelector('#no').style.border = 'solid 5px transparent'
    //     } else {
    //         document.querySelector('#no').style.border = 'solid 5px white'
    //         document.querySelector('#yes').style.border = 'solid 5px transparent'
    //     }
    //     if (keyActive === 'd' && keyFiredD && index == 0) {
    //         index++
    //         keyFiredD = false
    //     } else if (keyActive === 'a' && keyFiredA && index == 1) {
    //         index--
    //         keyFiredA = false
    //     }
    //     if (keyFiredEnter && index == 0) {
    //         index = 0
    //         shopMenuOpen = true
    //         npcIterator = 0
    //         yesNo = false
    //         keyFiredEnter = false
    //         document.querySelector('#merchant-options-one').style.display = 'none'
    //         document.querySelector('#merchant-options-two').style.display = 'flex'
    //     } else if (keyFiredEnter && index == 1) {
    //         index = 0
    //         document.querySelector('#yes').style.border = 'solid 5px white'
    //         document.querySelector('#no').style.border = 'solid 5px transparent'
    //         npcIterator = 0
    //         yesNo = false
    //         inDialog = false
    //         keyFiredEnter = false
    //         document.querySelector('#npc-dialog').style.display = 'none'
    //         document.querySelector('#npc-message').style.display = 'none'
    //         document.querySelector('#merchant-options-one').style.display = 'none'
    //     }
    // }

    // if (yesNo) {
    //     const yesBorder = 'solid 5px ' + (index == 0 ? 'white' : 'transparent');
    //     const noBorder = 'solid 5px ' + (index == 1 ? 'white' : 'transparent');
    
    //     document.querySelector('#yes').style.border = yesBorder;
    //     document.querySelector('#no').style.border = noBorder;
    
    //     if (keyActive === 'd' && keyFiredD && index == 0) {
    //         index++;
    //         keyFiredD = false;
    //     } else if (keyActive === 'a' && keyFiredA && index == 1) {
    //         index--;
    //         keyFiredA = false;
    //     }
    
    //     if (keyFiredEnter) {
    //         if (index == 0) {
    //             shopMenuOpen = true;
    //             npcIterator = 0;
    //             document.querySelector('#merchant-options-one').style.display = 'none';
    //             document.querySelector('#merchant-options-two').style.display = 'flex';
    //         } else if (index == 1) {
    //             document.querySelector('#yes').style.border = yesBorder;
    //             document.querySelector('#no').style.border = noBorder;
    //             npcIterator = 0;
    //             inDialog = false;
    //             document.querySelector('#npc-dialog').style display = 'none';
    //             document.querySelector('#npc-message').style.display = 'none';
    //             document.querySelector('#merchant-options-one').style.display = 'none';
    //         }
    //         index = 0;
    //         yesNo = false;
    //         keyFiredEnter = false;
    //     }
    // }


    //initializes the actual shop menu
    // if (shopMenuOpen) {
    //     document.querySelector('#merchant-options-one').style.display = 'none'
    //     document.querySelector('#merchant-options-two').style.display = 'flex'
    //     document.querySelector('#menu-dialog').style.display = 'flex'
    //     document.querySelector('#menu-dialog').innerHTML = `Money: $${character.money}`
    //     document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigPotion.quantity}`
    //     let shopOptions = document.querySelectorAll('.shop-item')
    //     shopOptions[index].className = 'shop-item menu-button menu-hovered'

    //     //sets all the cost/amount owned per item selection (TEMPORARY)
    //     if (index == 0) {
    //         document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigPotion.quantity}`
    //         document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
    //     } else if (index == 1) {
    //         document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.items.potions.bigMagicPotion.quantity}`
    //         document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
    //     } else if (index == 2) {
    //         document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.equipment.armor.quantity}`
    //         document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
    //     } else if (index == 3) {
    //         document.querySelector('#shop-amount-owned').innerHTML = `Owned: ${character.equipment.weapon.quantity}`
    //         document.querySelector('#shop-cost').innerHTML = `Cost: $${npc2.items[index].cost}`
    //     } else {
    //         document.querySelector('#shop-amount-owned').innerHTML = `Owned: 0`
    //         document.querySelector('#shop-cost').innerHTML = `Cost: $0`
	// 		document.querySelector('#shop-message').innerHTML = 'Leave shop'
    //     }

    //     //handles selection of items and purchase of items
    //     if (keyActive === 'w' && keyFiredW && index > 0) {
	// 		blip()
    //         shopOptions[index].className = 'shop-item menu-button'
    //         index--
    //         shopOptions[index].className = 'shop-item menu-button menu-hovered'
	// 		document.querySelector('#shop-message').style.color = 'rgb(88, 193, 61)'
	// 		document.querySelector('#shop-message').innerHTML = `${npc2.items[index].effect}`
    //         keyFiredW = false
    //     }
    //     if (keyActive === 's' && keyFiredS && index < shopOptions.length - 1) {
	// 		blip()
    //         shopOptions[index].className = 'shop-item menu-button'
    //         index++
    //         shopOptions[index].className = 'shop-item menu-button menu-hovered'
	// 		document.querySelector('#shop-message').style.color = 'rgb(88, 193, 61)'
	// 		document.querySelector('#shop-message').innerHTML = `${npc2.items[index].effect}`
    //         keyFiredS = false
    //     }
    //     if (keyFiredEnter && index == 0) {
	// 		select()
	// 		keyFiredEnter = false
    //         if (character.money >= npc2.items[index].cost) {
    //             character.money -= npc2.items[index].cost
    //             character.items.potions.bigPotion.quantity++
    //         } else {
	// 			document.querySelector('#shop-message').style.color = '#B7522E'
	// 			document.querySelector('#shop-message').innerHTML = `Not enough money!`
    //         }
    //     }
    //     else if (keyFiredEnter && index == 1) {
	// 		select()
	// 		keyFiredEnter = false
    //         if (character.money >= npc2.items[index].cost) {
    //             character.money -= npc2.items[index].cost
    //             character.items.potions.bigMagicPotion.quantity++
    //         } else {
	// 			document.querySelector('#shop-message').style.color = '#B7522E'
	// 			document.querySelector('#shop-message').innerHTML = `Not enough money!`
    //         }
    //     }
    //     else if (keyFiredEnter && index == 2) {
	// 		select()
	// 		keyFiredEnter = false
    //         if (character.money >= npc2.items[index].cost) {
    //             character.money -= npc2.items[index].cost
    //             character.items.equipment.armor.defense = 0.5
    //         } else {
    //             document.querySelector('#shop-message').style.color = '#B7522E'
	// 			document.querySelector('#shop-message').innerHTML = `Not enough money!`
    //         }
    //     }
    //     else if (keyFiredEnter && index == 3) {
	// 		select()
	// 		keyFiredEnter = false
    //         if (character.money >= npc2.items[index].cost) {
    //             character.money -= npc2.items[index].cost
    //             character.items.equipment.weapon.attack = 1.5
    //         } else {
    //             document.querySelector('#shop-message').style.color = '#B7522E'
	// 			document.querySelector('#shop-message').innerHTML = `Not enough money!`
    //         }
    //     }
    //     else if (keyFiredEnter && index == shopOptions.length - 1) {
	// 		select()
	// 		keyFiredEnter = false
    //         shopOptions[index].className = 'shop-item menu-button'
    //         index = 0
    //         shopMenuOpen = false
    //         keyFiredEnter = false
    //         inDialog = false
    //         document.querySelector('#menu-dialog').style.display = 'none'
    //         document.querySelector('#npc-message').style.display = 'none'
    //         document.querySelector('#merchant-options-two').style.display = 'none'
    //         document.querySelector('#npc-dialog').style.display = 'none'
    //     }
    // }


    //handles merchant collision and dialog init
    // for (let i = 0; i < npcList.length; i++) {
    //     const npc = npcList[i]
    //     if (keyFiredEnter &&
    //         rectangleCollision({
    //             rectangle1: player,
    //             rectangle2: {
    //                 ...npc,
    //                 position: {
    //                     x: npc.position.x + 10,
    //                     y: npc.position.y + 10
    //                 }
    //             }
    //         })
    //     ) { blip()
    //         if (npc.type === 'merchant') {
    //             if (npcIterator == (Object.keys(npc.dialog).length)) {
    //                 inDialog = true
    //                 document.querySelector('#npc-dialog').style.display = 'flex'
    //                 document.querySelector('#npcDialogIcon').style.backgroundImage = `none`
    //                 document.querySelector('#npc-message').style.display = 'none'
    //                 document.querySelector('#merchant-options-one').style.display = 'flex'
    //                 keyFiredEnter = false
    //                 yesNo = true
    //             } else {
    //                 inDialog = true
    //                 document.querySelector('#npc-dialog').style.display = 'flex'
    //                 document.querySelector('#npcDialogIcon').style.backgroundImage = `url('./img/merchantIcon.png')`
    //                 document.querySelector('#npc-message').style.display = 'inline-block'
    //                 document.querySelector('#npc-message-container').style.display = 'flex'
    //                 document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
    //                 keyFiredEnter = false
    //                 npcIterator++
    //             }
    //         } else if (npc.type === 'tutorial') {
    //             if (!npc.talkedTo) {
    //                 if (npcIterator == (Object.keys(npc.dialog).length)) {
    //                     npc.talkedTo = true
    //                     inDialog = false
    //                     character.items.potions.potion.quantity += 3
    //                     document.querySelector('#npc-dialog').style.display = 'none'
    //                     document.querySelector('#npc-message').style.display = 'none'
    //                     keyFiredEnter = false
    //                     npcIterator = 0
    //                 } else {
    //                     inDialog = true
    //                     document.querySelector('#npc-dialog').style.display = 'flex'
    //                     document.querySelector('#npc-message').style.display = 'flex'
    //                     document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
    //                     keyFiredEnter = false
    //                     npcIterator++
    //                 }
    //             } else {
    //                 if (npcIterator == (Object.keys(npc.dialog).length)) {
    //                     inDialog = false
    //                     document.querySelector('#npc-dialog').style.display = 'none'
    //                     document.querySelector('#npc-message').style.display = 'none'
    //                     keyFiredEnter = false
    //                     npcIterator = 0
    //                 } else {
    //                     inDialog = true
    //                     npcIterator = Object.keys(npc.dialog).length - 1
    //                     document.querySelector('#npc-dialog').style.display = 'flex'
    //                     document.querySelector('#npc-message').style.display = 'flex'
    //                     document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator]
    //                     keyFiredEnter = false
    //                     npcIterator++
    //                 }
    //             }
    //         }
            
    //     }
    // }

    // for (let i = 0; i < npcList.length; i++) {
    //     const npc = npcList[i];
    //     if (keyFiredEnter && rectangleCollision(player, { ...npc, position: { x: npc.position.x + 10, y: npc.position.y + 10 } })) {
    //         blip();
    //         inDialog = true;
    //         document.querySelector('#npc-dialog').style.display = 'flex';
    //         document.querySelector('#npc-message').style.display = npc.type === 'tutorial' ? 'flex' : 'inline-block';
    //         document.querySelector('#npc-message').innerHTML = npc.dialog[npcIterator];
    //         keyFiredEnter = false;
    //         if (npc.type === 'merchant') {
    //             if (npcIterator === Object.keys(npc.dialog).length) {
    //                 document.querySelector('#npcDialogIcon').style.backgroundImage = 'none';
    //                 document.querySelector('#merchant-options-one').style.display = 'flex';
    //                 yesNo = true;
    //             } else {
    //                 document.querySelector('#npcDialogIcon').style.backgroundImage = `url('./img/merchantIcon.png')`;
    //                 npcIterator++;
    //             }
    //         } else if (npc.type === 'tutorial') {
    //             if (!npc.talkedTo && npcIterator === Object.keys(npc.dialog).length) {
    //                 npc.talkedTo = true;
    //                 character.items.potions.potion.quantity += 3;
    //             } else {
    //                 npcIterator++;
    //             }
    //         } else {
    //             if (npcIterator === Object.keys(npc.dialog).length) {
    //                 npcIterator = 0;
    //                 inDialog = false;
    //             } else {
    //                 npcIterator = npc.talkedTo ? npc.dialog.length - 1 : 0;
    //             }
    //         }
    //     }
    // }

}

// if (player.facing === 'down' && player.moving == false) {
//     player.image = player.sprites.idleDown
// } else {

// }


// Run main game loop
animate()