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


function itemUseEndTurn() {
    battleMessage.innerHTML = ''
    setTimeout(() => {
        battleMessage.style.display = 'none'
        setTimeout(() => {
            keyCheck = false
        }, 100)
        characterTurn = false
        enemyTurn = true
        enemyAttack()
    }, 500)
}
function clearItemNoUseMessage() {
    battleMessage.style.display = 'flex'
    setTimeout(() => {
        battleMessage.style.display = 'none'
        battleMessage.innerHTML = ''
        setTimeout(() => {
            keyCheck = false
        }, 100)
    }, 1500)
}


function resetAttackAnimation() {
    basicAttack.moving = false
    basicAttack.frames.val = 0
	basicEnemyAttack.moving = false
    basicEnemyAttack.frames.val = 0
}
function attackAnimation() {
	if (characterTurn) {
		basicAttack.moving = true
	}
	if (enemyTurn) {
		basicEnemyAttack.moving = true
	}
}

function damageCalc(magicType) {
    if (magicType == null) {
        magicMultiplier = 1
    } else {
        if (character.stats.mp >= magicType.mp) {
            character.stats.mp -= magicType.mp
            magicMultiplier = magicType.power
            if (magicType.name == enemy.weakness) {
                superEffectiveText = 'Super effective! '
                magicWeaknessBoost = 2
            } else {
                magicWeaknessBoost = 1
            }
        } else {
            alert('not enough MP')
        }
        
    }
    baseDamage = Math.round((((((((2 * character.stats.lvl) / 5) + 2) * ((character.stats.power * magicMultiplier) * (character.stats.atk / enemy.def))) / 50) + 2) * magicWeaknessBoost))
    calcDamage = Math.round(baseDamage + Math.random() * (baseDamage - 1) + 1)
    finalDamage = Math.round(calcDamage * character.equipment.weapon.attack)
    if (Math.random() < criticalChance) {
		slashCrit()
        finalDamage = Math.round(calcDamage * criticalBoost)
        battleMessage.innerHTML = 'Critical hit! You hit the ' + enemy.name + ' for ' + finalDamage + ' points of damage!'
    } else {
        slash()
        battleMessage.innerHTML = `${superEffectiveText}You hit the ${enemy.name} for ${calcDamage} points of damage!`
    }
}

function moveEnemy(sprite) {

    sprite.position.x += 15
    setTimeout(() => {
        sprite.position.x -= 30
        setTimeout(() => {
            sprite.position.x += 30
            setTimeout(() => {
                sprite.position.x -= 30
                setTimeout(() => {
                    sprite.position.x += 30
                    setTimeout(() => {
                        sprite.position.x -= 15
                    }, 100)
                }, 100)
            }, 100)
        }, 100)
    }, 100)

    if (enemy.health <= 0) {
        setTimeout(() => {
            fleeing = 'enemyTrue'
        }, 850)
    }
	
}

function playerAttack(magicType) {
    attacking = true
    magicMultiplier = 1
    magicWeaknessBoost = 1
    battleMenu.style.display = 'none'

	setTimeout(() => {
		attackAnimation()
		damageCalc(magicType)
		enemy.health -= finalDamage
	}, 500)

	setTimeout(() => {
		moveEnemy(enemy)
	}, 800)

    setTimeout(() => {
		
        battleMessage.style.display = 'flex'
        if (enemy.health <= 0) {
            document.querySelector('#enemy-health').style.width = '0px'
        } else {
            document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 70) + 'px'
        }
		resetAttackAnimation()
		
    }, 1500)
	
    
    superEffectiveText = ''
    setTimeout(() => {
        battleMessage.style.display = 'none'
        if (enemy.health <= 0) {
            battleWon = true
            // attacking = false
            endBattle()
            fleeing = ''
            enemy.position.x = 355
        } else {
			attacking = false
			characterTurn = false
            enemyTurn = true
			enemyAttack()
        }
    }, 3500)
    
}

function endBattle() {
    attacking = false
    enemyChosen = false
    characterTurn = false
    if (battleWon) {
        character.stats.exp = character.stats.exp + enemy.exp
        character.money = character.money + enemy.money
        battleMenu.style.display = 'none'
        battleMenuPane.style.display = 'none'
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
        battleMenuIndex = 0
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
        window.cancelAnimationFrame(battleAnimationId)
        winScreenState = 'rewards'
        if (Math.random() <= 0.15) {
            document.querySelector('#item-drop').innerHTML = `The ${enemy.name} dropped a ${enemy.drop}`
            if (enemy.drop == 'potion') {
                character.items.potions.potion.quantity += 1
            } else if (enemy.drop == 'magicPotion') {
                character.items.potions.magicPotion.quantity += 1
            }
        } else {
            document.querySelector('#item-drop').innerHTML = ''
        }
        winScreen()
        speedCheck = false
        battleEnd = false
    } else {
        battleMenu.style.display = 'none'
        battleMenuPane.style.display = 'none'
        allowBattleMenuNav = false
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
        battleMenuIndex = 0
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
        window.cancelAnimationFrame(battleAnimationId)
        if (character.stats.hp <= 0) {
            loseScreen()
        } else {
            animate()
        }
        speedCheck = false
        battleEnd = false
        battle.initiated = false
        if (character.stats.hp <= 0) {
            character.stats.hp = character.stats.maxHp
            character.stats.mp = character.stats.maxMp
        }
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
            slashCrit()
            finalDamage = Math.round((finalDamage * criticalBoost) * character.equipment.armor.defense)
            character.stats.hp -= finalDamage
            battleMessage.innerHTML = 'Critical hit! The ' + enemy.name + ' hits for ' + finalDamage + ' points of damage!'
        } else {
            slash()
            character.stats.hp -= finalDamage
            battleMessage.innerHTML = `The ${enemy.name} attacks and deals ${finalDamage} points of damage!`
        }
        if (character.stats.hp < 0) {
            character.stats.hp = 0
        }

        setTimeout(() => {
            battleMessage.style.display = 'flex'
            resetAttackAnimation()
        }, 1000)

        setTimeout(() => {
            battleMessage.style.display = 'none'
            battleMenu.style.display = 'flex'
            attacking = false
            characterTurn = true
            
            if (character.stats.hp <= 0) {
                endBattle()
            }
            attacking = false
            enemyTurn = false
        }, 2500)

    }, 500)
    
    
}

function checkLevelUp() {
    if (character.stats.exp >= character.stats.expToNext) {
        document.querySelector('#level-up-modal').style.display = 'flex'
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
        // character.stats.expToNext = Math.round(((6 / 5) * Math.pow(character.stats.lvl, 3)) - (15 * (Math.pow(character.stats.lvl, 2))) + (100 * character.stats.lvl) - 140)
        if (character.stats.exp >= character.stats.expToNext) {
            checkLevelUp()
        }
    } else {
        winScreenState = 'exit'
    }
    levelChecked = true
}

function startBattle() {

	function checkMagicReq() {
		let index = 0
		document.querySelectorAll('.battle-magic').forEach(element => {
			if (character.stats.mp < Object.values(character.magic)[index].mp) {
				element.style.opacity = '0.5'
			} else {
				element.style.opacity = '1'
			}
			index += 1
		})
	}

    battleWon = false
    levelChecked = false

    if (enemyChosen === false) {
        chooseEnemy()
        enemyChosen = true
    }

    allowBattleMenuNav = true

    battleAnimationId = window.requestAnimationFrame(startBattle)
    battleBackground.draw()
    
    battlePlayer.draw()
    enemy.draw()

    enemy.moving = true
    battlePlayer.moving = true

    if (fleeing === 'playerTrue') {
        battlePlayer.position.x += 8
    }
    if (fleeing === 'enemyTrue') {
        enemy.position.x -= 8
    }

    battleMenuPane.style.display = 'flex'

    gamepadCheck()

    document.querySelector('#player-battle-health').innerHTML = `HP: ${character.stats.hp}`
    document.querySelector('#player-battle-magic').innerHTML = `MP: ${character.stats.mp}`

    if (!speedCheck) {
        speedCheck = true
        if (character.stats.spd > enemy.spd) {
            characterTurn = true
        } else {
            enemyTurn = true
			enemyAttack()
        }
    }

    if (characterTurn && !attacking) {
        battleMenu.style.display = 'flex'
    } 

    if (allowBattleMenuNav && !magicMenuOpen && !battleItemMenuOpen && !attacking) {
        battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
			
        if (keyFiredD && keyActive === 'd' && !attacking && !keyCheck) {
            keyFiredD = false
            if (battleMenuIndex < 3) {
                blip()
                battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                battleMenuIndex += 1
                battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
            }
        }

        
        if (keyFiredA && keyActive === 'a' && !attacking && !keyCheck) {
            keyFiredA = false
            if (battleMenuIndex > 0) {
                blip()
                battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                battleMenuIndex -= 1
                battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
            }
        }
    }

    if (magicMenuOpen) {

		checkMagicReq()

        document.querySelector('#battle-menu').style.display = 'none'
        document.querySelector('#battle-item-menu').style.display = 'none'
		document.querySelector('#magic-menu').style.display = 'flex'
        battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
		document.querySelector('#magic-req').innerHTML = ` -${Object.values(character.magic)[magicMenuIndex].mp}MP`
			
        if (keyFiredD && keyActive === 'd') {
            keyFiredD = false
            if (magicMenuIndex < 2) {
                blip()
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                magicMenuIndex += 1
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
            }
        }
			
        if (keyFiredA && keyActive === 'a') {
            keyFiredA = false
            if (magicMenuIndex > 0) {
                blip()
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                magicMenuIndex -= 1
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
            }
        }
        if (keyFiredEnter && !attacking) {
            
            magicType = character.magic[Object.keys(character.magic)[magicMenuIndex]]
			document.querySelector('#magic-req').innerHTML = ''

            if (character.stats.mp >= magicType.mp) {
				select()
                keyFiredEnter = false
                magicMenu.style.display = 'none'
                magicMenuOpen = false
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                magicMenuIndex = 0
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
                playerAttack(magicType)
            } else {
                battleMessage.innerHTML = 'Not enough MP!'
                battleMessage.style.display = 'flex'
                setTimeout(() => {
                    battleMessage.style.display = 'none'
                }, 1500)
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                magicMenuIndex = 0
                document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
            }

			checkMagicReq()
            
        }
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && magicMenuOpen) {
				cancelSFX.play()
                magicMenuOpen = false
            }
        })
    } else {
        document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
        magicMenuIndex = 0
        document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
        document.querySelector('#magic-menu').style.display = 'none'
    }
    
    if (!magicMenuOpen && !battleItemMenuOpen) {
        if (keyFiredEnter && !attacking && !keyCheck) {
            keyFiredEnter = false
			select()
            if (battleMenuIndex === 0) {
                playerAttack()
            }
            else if (battleMenuIndex === 1) {
                magicMenuOpen = true
				checkMagicReq()
            }
            else if (battleMenuIndex === 2) {
                battleItemMenuOpen = true
            }
            else if (battleMenuIndex === 3) {
                if (Math.random() > 0.10) {
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                    battleMenuIndex = 0
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
                    characterTurn = false
                    enemyTurn = false
                    inDialog = false
                    document.querySelector('#battle-menu').style.display = 'none'
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
                        battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                        battleMenuIndex = 0
                        battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
                        battleMessage.style.display = 'none'
                        attacking = false
                        characterTurn = false
                        enemyTurn = true
                        enemyAttack()
                    }, 1500)
                }
            }
            setTimeout(() => {
				battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
				battleMenuIndex = 0
				battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
			}, 60)
        }
    }

	if (basicAttack.moving) {
		basicAttack.draw()
	}
	if (basicEnemyAttack.moving) {
		basicEnemyAttack.draw()
	}

    //opens item menu in battle
    if (battleItemMenuOpen) {

        document.querySelector('#battle-menu').style.display = 'none'
        document.querySelector('#battle-item-menu').style.display = 'flex'
		document.querySelector('#magic-menu').style.display = 'none'

        document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px white'

        document.querySelectorAll('.potion')[0].innerHTML = `Health Potion<br>${character.items.potions.potion.quantity}`
        document.querySelectorAll('.potion')[1].innerHTML = `Health Potion +<br>${character.items.potions.bigPotion.quantity}`
        document.querySelectorAll('.potion')[2].innerHTML = `Magic Potion<br>${character.items.potions.magicPotion.quantity}`
        document.querySelectorAll('.potion')[3].innerHTML = `Magic Potion +<br>${character.items.potions.bigMagicPotion.quantity}`

        let i = 0

        document.querySelectorAll('.potion').forEach((item) => {
            if (Object.values(character.items.potions)[i].quantity == 0) {
                item.style.opacity = 0.5
            }
            i++
        })

        if (keyFiredD && !keyCheck && keyActive === 'd') {
            keyFiredD = false
            if (battleItemIndex < 3) {
                blip()
                document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
                battleItemIndex += 1
                document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px white'
            }
        }
        if (keyFiredA && !keyCheck && keyActive === 'a') {
            keyFiredA = false
            if (battleItemIndex > 0) {
                blip()
                document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
                battleItemIndex -= 1
                document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px white'
            }
        }
        if (keyFiredEnter && !keyCheck) {
            keyFiredEnter = false
            keyCheck = true
			select()
            if (battleItemIndex == 0) {
                if (character.items.potions.potion.quantity > 0 && character.stats.hp < character.stats.maxHp) {
                    character.items.potions.potion.quantity--
                    character.stats.hp += character.items.potions.potion.restore
                    if (character.stats.hp > character.stats.maxHp) {
                        character.stats.hp = character.stats.maxHp
                    }
                    battleMessage.innerHTML = 'HP has been restored!'
                    battleMessage.style.display = 'flex'
                    setTimeout(() => {
                        itemUseEndTurn()
                    }, 1500)
                } else {
                    if (character.items.potions.potion.quantity == 0) {
                        battleMessage.innerHTML = 'You do not have any of these!'
                    } else if (character.stats.hp == character.stats.maxHp) {
                        battleMessage.innerHTML = 'HP already at max!'
                    }
                    clearItemNoUseMessage()
                }
            } else if (battleItemIndex == 1) {
                if (character.items.potions.bigPotion.quantity > 0 && character.stats.hp < character.stats.maxHp) {
                    character.items.potions.bigPotion.quantity--
                    character.stats.hp += character.items.potions.bigPotion.restore
                    if (character.stats.hp > character.stats.maxHp) {
                        character.stats.hp = character.stats.maxHp
                    }
                    battleMessage.innerHTML = 'HP has been restored!'
                    battleMessage.style.display = 'flex'
                    setTimeout(() => {
                        itemUseEndTurn()
                    }, 1500)
                } else {
                    if (character.items.potions.bigPotion.quantity == 0) {
                        battleMessage.innerHTML = 'You do not have any of these!'
                    } else if (character.stats.hp == character.stats.maxHp) {
                        battleMessage.innerHTML = 'HP already at max!'
                    }
                    clearItemNoUseMessage()
                }
            } else if (battleItemIndex == 2) {
                if (character.items.potions.magicPotion.quantity > 0 && character.stats.mp < character.stats.maxMp) {
                    character.items.potions.magicPotion.quantity--
                    character.stats.mp += character.items.potions.magicPotion.restore
                    if (character.stats.mp > character.stats.maxMp) {
                        character.stats.mp = character.stats.maxMp
                    }
                    battleMessage.innerHTML = 'MP has been restored!'
                    battleMessage.style.display = 'flex'
                    setTimeout(() => {
                        itemUseEndTurn()
                    }, 1500)
                } else {
                    if (character.items.potions.magicPotion.quantity == 0) {
                        battleMessage.innerHTML = 'You do not have any of these!'
                    } else if (character.stats.mp == character.stats.maxMp) {
                        battleMessage.innerHTML = 'MP already at max!'
                    }
                    clearItemNoUseMessage()
                }
            } else if (battleItemIndex == 3) {
                if (character.items.potions.bigMagicPotion.quantity > 0 && character.stats.mp < character.stats.maxMp) {
                    character.items.potions.bigMagicPotion.quantity--
                    character.stats.mp += character.items.potions.bigMagicPotion.restore
                    if (character.stats.mp > character.stats.maxMp) {
                        character.stats.mp = character.stats.maxMp
                    }
                    battleMessage.innerHTML = 'MP has been restored!'
                    battleMessage.style.display = 'flex'
                    setTimeout(() => {
                        itemUseEndTurn()
                    }, 1500)
                } else {
                    if (character.items.potions.bigMagicPotion.quantity == 0) {
                        battleMessage.innerHTML = 'You do not have any of these!'
                    } else if (character.stats.mp == character.stats.maxMp) {
                        battleMessage.innerHTML = 'MP already at max!'
                    }
                    clearItemNoUseMessage()
                }
            }
            document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
            battleItemMenuOpen = false
            battleItemIndex = 0
            document.querySelector('#battle-item-menu').style.display = 'none'
        }
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && battleItemMenuOpen) {
				cancelSFX.play()
                battleItemMenuOpen = false
                document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
                battleItemIndex = 0
            }
        })
    } else {
        document.querySelector('#battle-item-menu').style.display = 'none'
    }

    if (keyFiredEsc && keyActive === 'esc') {
        keyFiredEsc = false
        if (battleItemMenuOpen) {
            cancelSFX.play()
            battleItemMenuOpen = false
            document.querySelector('#battle-menu').style.display = 'flex'
            document.querySelector('#battle-item-menu').style.display = 'none'
            document.querySelector('#magic-menu').style.display = 'none'
            document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
            battleItemIndex = 0
        }
        if (magicMenuOpen) {
            cancelSFX.play()
            document.querySelector('#battle-menu').style.display = 'flex'
            document.querySelector('#battle-item-menu').style.display = 'none'
            document.querySelector('#magic-menu').style.display = 'none'
            document.querySelector('#magic-req').innerHTML = ''
            magicMenuOpen = false
        }
    }

}

function winScreen() {

    gamepadCheck()

    let winScreenAnimationId = window.requestAnimationFrame(winScreen)
    document.querySelector('#win-screen').style.display = "flex"
    if (winScreenState === 'rewards') {
        document.querySelector('#level-up-modal').style.display = 'none'
        document.querySelector('#win-gains').style.display = "flex"
    }
    if (winScreenState === 'levelup') {
        document.querySelector('#level-up-modal').style.display = 'flex'
        document.querySelector('#win-gains').style.display = "none"
    }
    document.querySelector('#exp-gain').innerHTML = 'EXP Gained: ' + enemy.exp
    document.querySelector('#money-gain').innerHTML = 'Money Gained: ' + enemy.money

    if (keyFiredEnter && keyActive === 'enter') {
        if (!levelChecked) {
            keyFiredEnter = false
            winScreenState = 'levelup'
            checkLevelUp()
        } else {
            document.querySelector('#level-up-modal').style.display = 'none'
            document.querySelector('#win-gains').style.display = "none"
            document.querySelector('#win-screen').style.display = "none"
            battle.initiated = false
            inDialog = false
            window.cancelAnimationFrame(winScreenAnimationId)
            animate()
        }
    }   
    if (winScreenState === 'exit') {
        document.querySelector('#level-up-modal').style.display = 'none'
        document.querySelector('#win-gains').style.display = "none"
        document.querySelector('#win-screen').style.display = "none"
        battle.initiated = false
        inDialog = false
        window.cancelAnimationFrame(winScreenAnimationId)
        animate()
    }
}

function loseScreen() {

    gamepadCheck()

    loseScreenAnimationId = window.requestAnimationFrame(loseScreen)
    document.querySelector('#lose-screen').style.display = "flex"
    if (keyFiredEnter) {
        keyFiredEnter = false
        document.querySelector('#lose-screen').style.display = "none"
        window.cancelAnimationFrame(loseScreenAnimationId)
		battle.initiated = false
        inDialog = false
        animate()
    }   
}

