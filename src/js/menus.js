// Function that generates player stats to be used in menu
function populateStats() {
    document.querySelector('#player-level').innerHTML = 'Lvl: ' + character.stats.lvl
    document.querySelector('#player-exp').innerHTML = 'EXP: ' + character.stats.exp
    document.querySelector('#player-health').innerHTML = 'HP: ' + character.stats.hp
    document.querySelector('#player-magic').innerHTML = 'MP: ' + character.stats.mp
    document.querySelector('#player-money').innerHTML = 'Money: ' + character.money
    document.querySelector('#player-exp-next').innerHTML = 'EXP to Lvl: ' + character.stats.expToNext
    document.querySelector('#player-atk').innerHTML = 'ATK: ' + character.stats.atk
    document.querySelector('#player-def').innerHTML = 'DEF: ' + character.stats.def
    document.querySelector('#player-spd').innerHTML = 'SPD: ' + character.stats.spd
    document.querySelector('#player-power').innerHTML = 'Power: ' + character.stats.power
}
// Menu loop code
function animateMenu() {

    

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    const menuAnimationId = window.requestAnimationFrame(animateMenu)
    // menu.draw()
    populateStats()
    document.querySelector('#menu').style.display = 'flex'

    if (keys.a.pressed) {

        if (!keyFiredA) {
            keyFireda = true
            keys.a.pressed = false
            if (menuIndex > 0) {
				blip()
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
                menuIndex -= 1
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
            }
        }
    }
    if (keys.d.pressed) {
		
        if (!keyFiredD) {
            keyFiredD = true
            keys.d.pressed = false
            if (menuIndex < 2) {
				blip()
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
                menuIndex += 1
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
            }
        }
    }

    if (menuIndex === 2 && keyFiredEnter) {
		selectSFX.play()
        createSaveFile()
        document.querySelector('#save-alert').style.opacity = '1'
        setTimeout(() => {
            document.querySelector('#save-alert').style.opacity = '0'
        }, 2000)
    } else if (menuIndex === 0 && keyFiredEnter) {
		select()
        itemOpen = true
    }

    if (itemOpen) {
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        document.querySelector('#menu').style.display = 'none'
        itemIndex = 0
        animateMenuItems()
    }

    if (!menuOpen && !itemOpen) {
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        document.querySelector('#menu').style.display = 'none'
        animate()
    }
}
// Activates items list within menu loop
function animateMenuItems() {

    

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    
    const menuItemAnimationId = window.requestAnimationFrame(animateMenuItems)
    
    populateStats()
    populateItems()
    itemsPane.style.display = 'flex'

    // Handles specific item to hover over
    if (keys.s.pressed) {
		
        if (!keyFiredS) {
            keyFiredS = true
            keys.s.pressed = false
            if (itemIndex < 3) {
				blip()
                itemsPane.children[itemIndex].className = 'item'
                itemIndex += 1
                itemsPane.children[itemIndex].className = 'item item-hovered'
            }
        }
    }
    if (keys.w.pressed) {
        if (!keyFiredW) {
            keyFiredW = true
            keys.w.pressed = false
            if (itemIndex > 0) {
				blip()
                itemsPane.children[itemIndex].className = 'item'
                itemIndex -= 1
                itemsPane.children[itemIndex].className = 'item item-hovered'
            }
        }
    }


    // Handles item selection/use
    window.addEventListener('keypress', (e) => {
        switch (e.key) {
            case 'Enter' :
				
                if (keyFiredEnter && itemOpen === true) {
                    keyFiredEnter = false
                    if (itemIndex === 0 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.potion.quantity > 0)) {
						select()
                        character.stats.hp += character.items.potions.potion.restore
                        character.items.potions.potion.quantity -= 1
                        if (character.stats.hp > character.stats.maxHp) {
                            character.stats.hp = character.stats.maxHp
                        }
                    }
                    else if (itemIndex === 1 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.bigPotion.quantity > 0)) {
						select()
                        character.stats.hp += character.items.potions.bigPotion.restore
                        character.items.potions.bigPotion.quantity -= 1
                        if (character.stats.hp > character.stats.maxHp) {
                            character.stats.hp = character.stats.maxHp
                        }
                    }
                    else if (itemIndex === 2 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.magicPotion.quantity > 0)) {
						select()
                        character.stats.mp += character.items.potions.magicPotion.restore
                        character.items.potions.magicPotion.quantity -= 1
                        if (character.stats.mp > character.stats.maxMp) {
                            character.stats.mp = character.stats.maxMp
                        }
                    }
                    else if (itemIndex === 3 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.bigMagicPotion.quantity > 0)) {
						select()
                        character.stats.mp += character.items.potions.bigMagicPotion.restore
                        character.items.potions.bigMagicPotion.quantity -= 1
                        if (character.stats.mp > character.stats.maxMp) {
                            character.stats.mp = character.stats.maxMp
                        }
                    }
                }
        }

    })
    

    // Handles exiting of item screen
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
			cancelSFX.play()
            itemOpen = false
            itemsPane.children[itemIndex].className = 'item'
            itemsPane.children[0].className = 'item item-hovered'
        }
    })
    if (!itemOpen) {
        itemsPane.style.display = 'none'
        window.cancelAnimationFrame(menuItemAnimationId)
        animateMenu()
    }

}
// Populates item list within menu loop
const itemsPane = document.querySelector('#all-items')
function populateItems() {
    itemsPane.children[0].children[1].innerHTML = character.items.potions.potion.quantity
    itemsPane.children[1].children[1].innerHTML = character.items.potions.bigPotion.quantity
    itemsPane.children[2].children[1].innerHTML = character.items.potions.magicPotion.quantity
    itemsPane.children[3].children[1].innerHTML = character.items.potions.bigMagicPotion.quantity
}



