//async delay function to be used for any of my async/await setTimeout calls
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//no changes with this function since it works fine and seems straightfoward as is.
//may need to be refactored once enemies get more complex
function chooseEnemy() {
    const chosenEnemy = enemies[Math.floor(Math.random() * Object.keys(enemies).length)]
    // const chosenEnemy = enemies[2]
    enemyImg.src = chosenEnemy.img
    enemy.name = chosenEnemy.name
    enemy.maxHp = chosenEnemy.hp
    enemy.health = chosenEnemy.hp
    enemy.exp = chosenEnemy.exp
    enemy.atk = chosenEnemy.atk
    enemy.def = chosenEnemy.def
    enemy.spd = chosenEnemy.spd
    enemy.money = Math.floor(Math.random() * (30 - 4 + 1) + 4)
    enemy.weakness = chosenEnemy.weakness
    enemy.drop = chosenEnemy.drop

    document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 70) + 'px'
}

//tried an async function. is it better? idk
async function itemUseEndTurn() {
    battleMessage.innerHTML = ''

    await delay(500)
    battleMessage.style.display = 'none'
    characterTurn = false
    enemyTurn = true
    enemyAttack()
}

//removed the keyCheck since it's no longer needed. keeping setTimeout as reference and for
//deciding if it's more/less readable than the async/await with delay() function
function clearItemNoUseMessage() {
    battleMessage.style.display = 'flex'
    setTimeout(() => {
        battleMessage.innerHTML = ''
        battleMenu.style.display = 'flex'
    }, 1500)
}

//changed to use ternary operators
function attackAnimation() {
    characterTurn ? (basicAttack.moving = true) : (basicEnemyAttack.moving = true)
}

//changed to use as argument passed to tell whether it's the chracter or the enemy that attacked
function resetAttackAnimation(entity) {
    entity.moving = false
    entity.frames.val = 0
}

//changed to use returns to break out if conditions aren't met. also used a ternary operator
function damageCalc(magicType) {
    if (magicType) {
        if (character.stats.mp < magicType.mp) {
            alert('Not enough MP')
            return
        }
        character.stats.mp -= magicType.mp
        magicMultiplier = magicType.power
        magicWeaknessBoost = magicType.name == enemy.weakness ? 2 : 1
    }

    baseDamage = Math.round((((((((2 * character.stats.lvl) / 5) + 2) * ((character.stats.power * magicMultiplier) * (character.stats.atk / enemy.def))) / 50) + 2) * magicWeaknessBoost))
    calcDamage = Math.round(baseDamage + Math.random() * (baseDamage - 1) + 1)
    finalDamage = Math.round(calcDamage * character.equipment.weapon.attack)

    if (Math.random() < criticalChance) {
        finalDamage = Math.round(calcDamage * criticalBoost)
        battleMessage.innerHTML = `Critical hit! You hit the ${enemy.name} for ${finalDamage} points of damage!`
    } else {
        battleMessage.innerHTML = `${magicType && magicType.name == enemy.weakness ? 'Super effective! ' : ''}You hit the ${enemy.name} for ${calcDamage} points of damage!`
    }
}

//changed to utilize a step function rather than multiple nested setTimeouts
function moveEnemy(sprite, steps) {
    if (steps === undefined) {
        steps = 6
    }

    if (steps === 0) {
        if (enemy.health <= 0) {
            setTimeout(() => {
                fleeing = 'enemyTrue'
            }, 850)
        }
        return
    }

    sprite.position.x += (steps % 2 === 0) ? -30 : 30
    setTimeout(() => {
        moveEnemy(sprite, steps - 1)
    }, 100)
}

//this checks magic requirements and lowers opacity if unable to use
function checkMagicReq() {
    let index = 0
    document.querySelectorAll('.magicMenuItem').forEach(element => {
        if (character.stats.mp < Object.values(character.magic)[index].mp) {
            element.style.opacity = '0.5'
        } else {
            element.style.opacity = '1'
        }
        index += 1
    })
}

//once again attempting an async function given the multiple setTimeout calls.
//seems top be a bit more readable but i'm not sure if it could be done more concisely 
async function playerAttack(magicType) {
    attacking = true
    magicMultiplier = 1
    magicWeaknessBoost = 1
    battleMenu.style.display = 'none'

    await delay(500)
    attackAnimation()
    damageCalc(magicType)
    enemy.health -= finalDamage

    await delay(300)
    moveEnemy(enemy)

    await delay(700)
    battleMessage.style.display = 'flex'
    document.querySelector('#enemy-health').style.width = (enemy.health <= 0) ? '0px' : `${(enemy.health / enemy.maxHp) * 70}px`
    resetAttackAnimation(basicAttack)

    superEffectiveText = ''

    await delay(2000)
    battleMessage.style.display = 'none'
    if (enemy.health <= 0) {
        battleWon = true
        endBattle()
        fleeing = ''
        enemy.position.x = 355
    } else {
        attacking = false
        characterTurn = false
        enemyTurn = true
        enemyAttack()
    }
}

function enemyAttack() {
    attacking = true
    magicType = null

    battleMenu.style.display = 'none'
    baseDamage = Math.round((((((2 / 5) + 2) * ((enemy.atk) * (enemy.atk / character.stats.def))) / 50) + 2))
    calcDamage = Math.round(baseDamage + Math.random() * (baseDamage - 1) + 1)
    finalDamage = Math.round(calcDamage * character.equipment.armor.defense)
    setTimeout(() => {
        attackAnimation()

        setTimeout(() => {
            moveEnemy(battlePlayer)
        }, 300)

        if (Math.random() < criticalChance) {
            // slashCrit()
            finalDamage = Math.round((finalDamage * criticalBoost) * character.equipment.armor.defense)
            character.stats.hp -= finalDamage
            battleMessage.innerHTML = 'Critical hit! The ' + enemy.name + ' hits for ' + finalDamage + ' points of damage!'
        } else {
            // slash()
            character.stats.hp -= finalDamage
            battleMessage.innerHTML = `The ${enemy.name} attacks and deals ${finalDamage} points of damage!`
        }
        if (character.stats.hp < 0) {
            character.stats.hp = 0
        }

        setTimeout(() => {
            battleMessage.style.display = 'flex'
            resetAttackAnimation(basicEnemyAttack)
        }, 1000)

        setTimeout(() => {
            battleMessage.style.display = 'none'
            battleMenu.style.display = 'flex'
            attacking = false
            characterTurn = true
            enemyTurn = false
            if (character.stats.hp <= 0) {
                endBattle()
            }
        }, 2500)

    }, 500)
}

//included bulk variable assigning (=,=,=,=,etc) but I am not sure if it's a good idea or not.
//also included ternary operator again, and attempted to streamline the conditionals
function endBattle() {
    attacking = enemyChosen = speedCheck = battleEnd = characterTurn = battle.initiated = false;

    if (battleWon) {
        character.stats.exp += enemy.exp;
        character.money += enemy.money;
        battleMenu.style.display = battleMenuPane.style.display = 'none';
        hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem');
        window.cancelAnimationFrame(battleAnimationId);
        winScreenState = 'rewards';

        const dropChance = Math.random();
        document.querySelector('#item-drop').innerHTML = dropChance <= 0.15 ? `The ${enemy.name} dropped a ${enemy.drop}` : '';
        if (dropChance <= 0.15) {
            character.items.potions[enemy.drop].quantity += 1;
        }

        document.querySelector('#battle-transition').style.left = '0px';
        winScreen();
    } else {
        battleMenu.style.display = battleMenuPane.style.display = 'none';
        allowBattleMenuNav = false;
        hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem');
        window.cancelAnimationFrame(battleAnimationId);

        if (character.stats.hp <= 0) {
            character.stats.hp = character.stats.maxHp;
            character.stats.mp = character.stats.maxMp;
            loseScreen();
        } else {
            animate();
        }
    }
}

function checkLevelUp() {
    while (character.stats.exp >= character.stats.expToNext) {
        winScreenState = 'levelup'
        document.querySelector('#win-gains').style.display = "none"
        character.stats.lvl++
        character.stats.maxHp = Math.round(character.stats.maxHp * 1.1)
        character.stats.maxMp = Math.round(character.stats.maxMp * 1.1)
        character.stats.hp = character.stats.maxHp
        character.stats.mp = character.stats.maxMp
        character.stats.atk = Math.round(character.stats.atk * 1.1)
        character.stats.def = Math.round(character.stats.def * 1.1)
        character.stats.spd = Math.round(character.stats.spd * 1.1)
        character.stats.power = Math.round(character.stats.power * 1.1)
        character.stats.expToNext = Math.round(Math.pow(character.stats.lvl, 3))

        // Update 'expToNext' for the next level
        character.stats.expToNext = Math.round(Math.pow(character.stats.lvl + 1, 3))
    }
}

function winScreen() {
    let winScreenAnimationId = window.requestAnimationFrame(winScreen)

    battleMenu.style.display = 'flex'
    winScreenElement.style.display = "flex"
    levelUpModalElement.style.display = (winScreenState === 'levelup') ? 'flex' : 'none'
    winGainsElement.style.display = (winScreenState === 'rewards') ? 'flex' : 'none'

    document.querySelector('#exp-gain').innerHTML = 'EXP Gained: ' + enemy.exp
    document.querySelector('#money-gain').innerHTML = 'Money Gained: ' + enemy.money

    if (keyActive === 'enter') {
        keyActive = ''
        if (character.stats.exp >= character.stats.expToNext) {
            checkLevelUp()
        } else {
            winScreenCleanup(winScreenAnimationId)
        }
    }
}

function winScreenCleanup(animationId) {
    window.cancelAnimationFrame(animationId)
    document.querySelector('#battle-transition').style.opacity = '1'
    setTimeout(() => {
        document.querySelector('#battle-transition').style.opacity = '0'
        document.querySelector('#level-up-modal').style.display = 'none'
        document.querySelector('#win-gains').style.display = "none"
        document.querySelector('#win-screen').style.display = "none"
        battle.initiated = false
        inDialog = false
        setTimeout(() => {
            document.querySelector('#battle-transition').style.left = '-1280px'
            setTimeout(() => {
                document.querySelector('#battle-transition').style.opacity = '1'
            }, 1000)
        }, 1500)
        animate()
    }, 1000)
}

function loseScreen() {
    loseScreenAnimationId = window.requestAnimationFrame(loseScreen)

    battleMenu.style.display = 'flex'
    document.querySelector('#lose-screen').style.display = "flex"
    if (keyActive === 'enter') {
        keyActive = ''
        document.querySelector('#lose-screen').style.display = "none"
        window.cancelAnimationFrame(loseScreenAnimationId)
		battle.initiated = false
        inDialog = false
        animate()
    }   
}

function startBattle() {

	

    battleWon = false
    levelChecked = false

    if (enemyChosen === false) {
        chooseEnemy()
        enemyChosen = true
    }

    battleAnimationId = window.requestAnimationFrame(startBattle)

    battleBackground.draw()
    battlePlayer.draw()
    enemy.draw()

    //changed to one if statement to handle basic attack animations. will likely need changing once more animations are made
    if (basicAttack.moving || basicEnemyAttack.moving) {
        basicAttack.moving && basicAttack.draw();
        basicEnemyAttack.moving && basicEnemyAttack.draw();
    }

    //one-liner for handling the enemy/player fleeing animations
    (fleeing === 'playerTrue') ? (battlePlayer.position.x += 8) : (fleeing === 'enemyTrue' && (enemy.position.x -= 8))


    battleMenuPane.style.display = 'flex'

    // gamepadCheck()

    document.querySelector('#player-battle-health').innerHTML = `HP: ${character.stats.hp}`
    document.querySelector('#player-battle-magic').innerHTML = `MP: ${character.stats.mp}`

    // if (!speedCheck) {
    //     speedCheck = true
    //     if (character.stats.spd > enemy.spd) {
    //         characterTurn = true
    //     } else {
    //         enemyTurn = true
	// 		enemyAttack()
    //     }
    // }

    //combining the conditionals into a single one and attempting to see how it looks to have characterTurn be set to the condition
    if (!speedCheck && (characterTurn = character.stats.spd > enemy.spd)) {
        enemyTurn = !characterTurn;
        console.log(enemyTurn)
        if (enemyTurn) {
            enemyAttack();
        }
        speedCheck = true;
    }

    //handles selection/hover states for the main battle menu
    if (!magicMenuOpen && !battleItemMenuOpen && !attacking) {	
        if (!attacking) {
            if (keyActive === 'd' && hoverToggler.index < 3) {
                // blip()
                hoverSelectToggle(battleMenu, hoverToggler, index, 'plus', 'battleMenuItem')
                keyActive = ''
            } else if (keyActive === 'a' && hoverToggler.index > 0) {
                // blip()
                hoverSelectToggle(battleMenu, hoverToggler, index, 'minus', 'battleMenuItem')
                keyActive = ''
            }
        }
    }

    //opens magic attack menu in battle
    if (magicMenuOpen) {
        checkMagicReq()
    
        battleMenu.style.display = 'none'
        magicMenu.style.display = 'flex'
        magicReq.innerHTML = ` -${Object.values(character.magic)[hoverToggler.index].mp}MP`

        if (!attacking) {
            if (keyActive === 'd' && hoverToggler.index < 2) {
                // blip()
                hoverSelectToggle(magicMenu, hoverToggler, index, 'plus', 'magicMenuItem')
                keyActive = ''
            } else if (keyActive === 'a' && hoverToggler.index > 0) {
                // blip()
                hoverSelectToggle(magicMenu, hoverToggler, index, 'minus', 'magicMenuItem')
                keyActive = ''
            }
        }
    
        if (keyActive === 'enter' && !attacking) {
            keyActive = ''
            const magicType = character.magic[Object.keys(character.magic)[hoverToggler.index]]
            magicReq.innerHTML = ''
    
            if (character.stats.mp >= magicType.mp) {
                // select()
                magicMenu.style.display = 'none'
                magicMenuOpen = false
                hoverSelectToggle(magicMenu, hoverToggler, index, 'zero', 'magicMenuItem')
                playerAttack(magicType)
            } else {
                battleMessage.innerHTML = 'Not enough MP!'
                battleMessage.style.display = 'flex'
                setTimeout(() => (battleMessage.style.display = 'none'), 1500)
                hoverSelectToggle(magicMenu, hoverToggler, index, 'zero', 'magicMenuItem')
            }
            checkMagicReq()
        }

        if (keyActive === 'escape') {
            keyActive = ''
            // cancelSFX.play()
            document.querySelector('#battleMenu').style.display = 'flex'
            document.querySelector('#magicMenu').style.display = 'none'
            document.querySelector('#magic-req').innerHTML = ''
            magicMenuOpen = false
            hoverSelectToggle(magicMenu, hoverToggler, index, 'zero', 'magicMenuItem')
        }

    }

    //opens item menu in battle
    if (battleItemMenuOpen) {

        let potions = document.querySelectorAll('.potion')

        battleMenu.style.display = 'none'
        battleItemMenu.style.display = 'flex'
        
        const potionTypes = ['potion', 'bigPotion', 'magicPotion', 'bigMagicPotion']
        
        potions.forEach((item, index) => {
            item.innerHTML = `${character.items.potions[potionTypes[index]].name}<br>${character.items.potions[potionTypes[index]].quantity}`
            if (character.items.potions[potionTypes[index]].quantity === 0) {
                item.style.opacity = 0.5
            }
        })

        if (!attacking) {
            if (keyActive === 'd' && hoverToggler.index < 3) {
                // blip()
                hoverSelectToggle(battleItemMenu, hoverToggler, index, 'plus', 'potion battleItemMenuItem')
                keyActive = ''
            } else if (keyActive === 'a' && hoverToggler.index > 0) {
                // blip()
                hoverSelectToggle(battleItemMenu, hoverToggler, index, 'minus', 'potion battleItemMenuItem')
                keyActive = ''
            }
        }

        if (keyActive === 'enter') {
            keyActive = ''
            // select()

            battleItemMenu.style.display = 'none'
            battleMenu.style.display = 'none'

            const item = character.items.potions[potionTypes[hoverToggler.index]]

            if (item.quantity > 0) {
                if ((hoverToggler.index < 2 && character.stats.hp < character.stats.maxHp) ||
                    (hoverToggler.index >= 2 && character.stats.mp < character.stats.maxMp)) {
                    item.quantity--
                    const restoreValue = item.restore
                    if (hoverToggler.index < 2) {
                        character.stats.hp += restoreValue
                        if (character.stats.hp > character.stats.maxHp) {
                            character.stats.hp = character.stats.maxHp
                        }
                        battleMessage.innerHTML = 'HP has been restored!'
                    } else {
                        character.stats.mp += restoreValue
                        if (character.stats.mp > character.stats.maxMp) {
                            character.stats.mp = character.stats.maxMp
                        }
                        battleMessage.innerHTML = 'MP has been restored!'
                    }
                    battleMessage.style.display = 'flex'
                    setTimeout(itemUseEndTurn, 1500)
                } else {
                    battleMessage.innerHTML = (hoverToggler.index < 2) ? 'HP already at max!' : 'MP already at max!'
                    clearItemNoUseMessage()
                }
            } else {
                battleMessage.innerHTML = 'You do not have any of these!'
                clearItemNoUseMessage()
            }
        
            hoverSelectToggle(battleItemMenu, hoverToggler, index, 'zero', 'potion battleItemMenuItem')
            battleItemMenuOpen = false
        }

        if (keyActive === 'escape') {
            keyActive = ''
            // cancelSFX.play()
            battleMenu.style.display = 'flex'
            battleItemMenu.style.display = 'none'
            battleItemMenuOpen = false
            hoverSelectToggle(battleItemMenu, hoverToggler, index, 'zero', 'potion battleItemMenuItem')
        }
        
    }
    
    if (!magicMenuOpen && !battleItemMenuOpen) {
        if (keyActive === 'enter' && !attacking) {
            keyActive = ''
			// select()
            if (hoverToggler.index === 0) {
                playerAttack()
            }
            else if (hoverToggler.index === 1) {
                hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem')
                magicMenuOpen = true
				// checkMagicReq()
            }
            else if (hoverToggler.index === 2) {
                hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem')
                battleItemMenuOpen = true
            }
            else if (hoverToggler.index === 3) {
                if (Math.random() > 0.10) {
                    hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem')
                    characterTurn = false
                    enemyTurn = false
                    inDialog = false
                    document.querySelector('#battleMenu').style.display = 'none'
                    battleMessage.innerHTML = 'Managed to escape!'
                    battleMessage.style.display = 'flex'
                    battlePlayer.image = playerRight
                    fleeing = 'playerTrue'
                    setTimeout(() => {
                        endBattle()
                        battleMessage.style.display = 'none'
                        fleeing = ''
                        battlePlayer.position.x = 850
                    }, 1500)
                } else {
                    battleMessage.innerHTML = 'Failed to escape!'
                    battleMessage.style.display = 'flex'
                    attacking = true
                    setTimeout(() => {
                        hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem')
                        battleMessage.style.display = 'none'
                        attacking = false
                        characterTurn = false
                        enemyTurn = true
                        enemyAttack()
                    }, 1500)
                }
            }
            setTimeout(() => {
				hoverSelectToggle(battleMenu, hoverToggler, index, 'zero', 'battleMenuItem')
			}, 60)
        }
    }
  
}
