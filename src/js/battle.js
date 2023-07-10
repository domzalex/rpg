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
    enemy.money = chosenEnemy.money
    enemy.weakness = chosenEnemy.weakness

    document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 70) + 'px'
}

function resetAttackAnimation() {
    // explosion.moving = false
    // explosion.frames.elapsed = 0
    // fireAttackAnimation.position.x = 750
    // fireAttackAnimation.position.y = 350
}

function attackAnimation() {
    // battlePlayer.moving = true
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
    baseDamage = Math.round(((((((2 * character.stats.lvl * 1) / 5) + 2) * ((character.stats.power * magicMultiplier) * (character.stats.atk / enemy.def))) / 50) + 2) * magicWeaknessBoost)
    battleMessage.innerHTML = `${superEffectiveText}You hit the ${enemy.name} for ${baseDamage} points of damage!`
    // battleMessage.innerHTML = 'You hit the ' + enemy.name + ' for ' + baseDamage + ' points of damage!'
    finalDamage = (baseDamage * character.equipment.weapon.attack)
    if (Math.random() < criticalChance) {
        finalDamage = Math.round(baseDamage * criticalBoost)
        battleMessage.innerHTML = 'Critical hit! You hit the ' + enemy.name + ' for ' + finalDamage + ' points of damage!'
    }
}

function playerAttack(magicType) {
    attacking = true
    resetAttackAnimation()
    attackAnimation()
    damageCalc(magicType)
    enemy.health -= finalDamage
    magicMultiplier = 1
    magicWeaknessBoost = 1
    battleMenu.style.display = 'none'
    setTimeout(() => {
        battleMessage.style.display = 'flex'
        if (enemy.health <= 0) {
            document.querySelector('#enemy-health').style.width = '0px'
        } else {
            document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 70) + 'px'
        }
    }, 1000)
    characterTurn = false
    superEffectiveText = ''
    setTimeout(() => {
        battleMessage.style.display = 'none'
        if (enemy.health <= 0) {
            battleWon = true
            attacking = false
            endBattle()
        } else {
            enemyTurn = true
        }
    }, 3000)
    
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
        winScreen()
        speedCheck = false
        battleEnd = false
        battle.initiated = false
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
        }
    }
}

function enemyAttack() {
    attacking = true
    magicType = null
    let damage
    if (Math.random() <= criticalChance) {
        damage = Math.round(((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2) * criticalBoost)
        battleMenu.style.display = 'none'
        setTimeout(() => {
            battleMessage.innerHTML = 'Critical hit! The ' + enemy.name + ' attacks and deals ' + Math.round((damage * character.equipment.armor.defense)) + ' points of damage!'
            battleMessage.style.display = 'flex'
            character.stats.hp -= Math.round((damage * character.equipment.armor.defense))
            if (character.stats.hp < 0) {
                character.stats.hp = 0
            }
        }, 1000)
    } else {
        damage = Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2)
        battleMenu.style.display = 'none'
        setTimeout(() => {
            battleMessage.innerHTML = 'The ' + enemy.name + ' attacks and deals ' + Math.round((damage * character.equipment.armor.defense)) + ' points of damage!'
            battleMessage.style.display = 'flex'
            character.stats.hp -= Math.round((damage * character.equipment.armor.defense))
            if (character.stats.hp < 0) {
                character.stats.hp = 0
            }
        }, 1000)
    }
    enemyTurn = false
    setTimeout(() => {
        battleMessage.style.display = 'none'
        battleMenu.style.display = 'flex'
        characterTurn = true
        attacking = false
        if (character.stats.hp <= 0) {
            endBattle()
        }
    }, 3000)
}

function checkLevelUp() {
    levelChecked = true
    if (character.stats.exp >= character.stats.expToNext) {
        document.querySelector('#level-up-modal').style.display = 'flex'
        character.stats.lvl++
        character.stats.maxHp = Math.round(character.stats.maxHp * 1.1)
        character.stats.maxMp = Math.round(character.stats.maxMp * 1.1)
        character.stats.hp = character.stats.maxHp
        character.stats.mp = character.stats.maxMp
        character.stats.atk = Math.round(character.stats.atk * 1.1)
        character.stats.def = Math.round(character.stats.def * 1.1)
        character.stats.spd = Math.round(character.stats.spd * 1.1)
        character.stats.power = Math.round(character.stats.power * 1.1)
        character.stats.expToNext = Math.round(character.stats.expToNext * 2) - Math.round(character.stats.expToNext / 4)
    } else {
        document.querySelector('#level-up-modal').style.display = 'none'
        document.querySelector('#win-screen').style.display = "none"
        window.cancelAnimationFrame(winScreenAnimationId)
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

    allowBattleMenuNav = true

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    battleAnimationId = window.requestAnimationFrame(startBattle)
    battleBackground.draw()
    
    battlePlayer.draw()
    enemy.draw()

    enemy.moving = true
    battlePlayer.moving = true

    battleMenuPane.style.display = 'flex'

    document.querySelector('#player-stats-battle').children[1].innerHTML = 'HP: ' + character.stats.hp
    document.querySelector('#player-stats-battle').children[2].innerHTML = 'MP: ' + character.stats.mp

    if (!speedCheck) {
        speedCheck = true
        if (character.stats.spd > enemy.spd) {
            characterTurn = true
        } else {
            enemyTurn = true
        }
    }

    if (characterTurn) {
        battleMenu.style.display = 'flex'
    } else if (enemyTurn && enemy.health > 0) {
        enemyAttack()
    }

    if (allowBattleMenuNav && !magicMenuOpen && !battleItemMenuOpen) {
        battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
        if (keys.d.pressed && !attacking) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (battleMenuIndex < 3) {
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                    battleMenuIndex += 1
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
                }
            }
        }
        if (keys.a.pressed && !attacking) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (battleMenuIndex > 0) {
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                    battleMenuIndex -= 1
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
                }
            }
        }
    }

    if (magicMenuOpen) {
        battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
        document.querySelector('#magic-menu').style.display = 'flex'
        if (keys.d.pressed && !attacking) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (magicMenuIndex < 2) {
                    document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                    magicMenuIndex += 1
                    document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
                }
            }
        }
        if (keys.a.pressed && !attacking) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (magicMenuIndex > 0) {
                    document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px transparent'
                    magicMenuIndex -= 1
                    document.querySelector('#magic-menu').children[magicMenuIndex].style.border = 'solid 5px white'
                }
            }
        }
        if (keyFiredEnter && !attacking) {
            
            magicType = character.magic[Object.keys(character.magic)[magicMenuIndex]]

            if (character.stats.mp >= magicType.mp) {
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
            
        }
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
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
        if (keyFiredEnter && !attacking) {
            keyFiredEnter = false
            if (battleMenuIndex === 0) {
                playerAttack()
            }
            else if (battleMenuIndex === 1) {
                magicMenuOpen = true
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
                    endBattle()
                } else {
                    alert('failed to flee!')
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
                    battleMenuIndex = 0
                    battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
                    characterTurn = false
                    enemyTurn = true
                }
            }
            battleMenu.children[battleMenuIndex].style.border = 'solid 5px transparent'
            battleMenuIndex = 0
            battleMenu.children[battleMenuIndex].style.border = 'solid 5px white'
        }
    }

    //opens item menu in battle
    if (battleItemMenuOpen) {
        document.querySelector('#battle-item-menu').style.display = 'flex'

        if (keys.d.pressed) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (battleItemIndex < 3) {
                    document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
                    battleItemIndex += 1
                    document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px white'
                }
            }
        }
        if (keys.a.pressed) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (battleItemIndex > 0) {
                    document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px transparent'
                    battleItemIndex -= 1
                    document.querySelector('#battle-item-menu').children[battleItemIndex].style.border = 'solid 5px white'
                }
            }
        }
        if (keyFiredEnter) {
            keyFiredEnter = false
            if (battleItemIndex == 0) {
                if (character.items.potions.potion.quantity > 0 && character.stats.hp < character.stats.maxHp) {
                    character.items.potions.potion.quantity--
                    character.stats.hp += character.items.potions.potion.restore
                    if (character.stats.hp > character.stats.maxHp) {
                        character.stats.hp = character.stats.maxHp
                    }
                    characterTurn = false
                    enemyTurn = true
                } else {
                    alert('cannot use this now/not enough quantity')
                }
            } else if (battleItemIndex == 1) {
                if (character.items.potions.bigPotion.quantity > 0 && character.stats.hp < character.stats.maxHp) {
                    character.items.potions.bigPotion.quantity--
                    character.stats.hp += character.items.potions.bigPotion.restore
                    if (character.stats.hp > character.stats.maxHp) {
                        character.stats.hp = character.stats.maxHp
                    }
                    characterTurn = false
                    enemyTurn = true
                } else {
                    alert('cannot use this now/not enough quantity')
                }
            } else if (battleItemIndex == 2) {
                if (character.items.potions.magicPotion.quantity > 0 && character.stats.mp < character.stats.maxMp) {
                    character.items.potions.magicPotion.quantity--
                    character.stats.mp += character.items.potions.magicPotion.restore
                    if (character.stats.mp > character.stats.maxMp) {
                        character.stats.mp = character.stats.maxMp
                    }
                    characterTurn = false
                    enemyTurn = true
                } else {
                    alert('cannot use this now/not enough quantity')
                }
            } else if (battleItemIndex == 3) {
                if (character.items.potions.bigMagicPotion.quantity > 0 && character.stats.mp < character.stats.maxMp) {
                    character.items.potions.bigMagicPotion.quantity--
                    character.stats.mp += character.items.potions.bigMagicPotion.restore
                    if (character.stats.mp > character.stats.maxMp) {
                        character.stats.mp = character.stats.maxMp
                    }
                    characterTurn = false
                    enemyTurn = true
                } else {
                    alert('cannot use this now/not enough quantity')
                }
            }
            battleItemMenuOpen = false
            battleItemIndex = 0
            document.querySelector('#battle-item-menu').style.display = 'none'
        }
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                battleItemMenuOpen = false
            }
        })
    } else {
        document.querySelector('#battle-item-menu').style.display = 'none'
    }

}

function winScreen() {
    winScreenAnimationId = window.requestAnimationFrame(winScreen)
    document.querySelector('#win-screen').style.display = "flex"
    document.querySelector('#exp-gain').innerHTML = 'EXP Gained: ' + enemy.exp
    document.querySelector('#money-gain').innerHTML = 'Money Gained: ' + enemy.money
    if (keyFiredEnter) {
        keyFiredEnter = false
        if (!levelChecked) {
            checkLevelUp()
        } else if (levelChecked) {
            document.querySelector('#level-up-modal').style.display = 'none'
            document.querySelector('#win-screen').style.display = "none"
            window.cancelAnimationFrame(winScreenAnimationId)
            animate()
        }
    }   
}

function loseScreen() {
    loseScreenAnimationId = window.requestAnimationFrame(loseScreen)
    document.querySelector('#lose-screen').style.display = "flex"
    if (keyFiredEnter) {
        keyFiredEnter = false
        document.querySelector('#lose-screen').style.display = "none"
        window.cancelAnimationFrame(loseScreenAnimationId)
        animate()
    }   
}

