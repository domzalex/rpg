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
    
    const menuAnimationId = window.requestAnimationFrame(animateMenu)
    populateStats()
    document.querySelector('#menu-buttons').style.display = 'flex'
    document.querySelector('#menu').style.display = 'flex'

    // gamepadCheck()

    if (keyActive === 'w') {
        keyActive = ''
        if (menuIndex > 0) {
            // blip()
            document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
            menuIndex -= 1
            document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        }
    }
    
    if (keyActive === 's') {
        keyActive = ''
        if (menuIndex < 2) {
            // blip()
            document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
            menuIndex += 1
            document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        }
    }
    
    if (menuIndex === 1 && keyActive === 'enter') {
        // selectSFX.play()
        keyActive = ''
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        document.querySelector('#menu-buttons').style.display = 'none'
        menuIndex = 0
        
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        animateStatus()
    }

    else if (menuIndex === 2 && keyActive === 'enter') {
		// selectSFX.play()
        keyActive = ''
        createSaveFile()
        document.querySelector('#save-alert').style.opacity = '1'
        setTimeout(() => {
            document.querySelector('#save-alert').style.opacity = '0'
        }, 2000)
    } else if (menuIndex === 0 && keyActive === 'enter') {
        keyActive = ''
		// select()
        itemOpen = true
    }

    if (itemOpen) {
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        document.querySelector('#menu-buttons').style.display = 'none'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        itemIndex = 0
        document.querySelector('#menu-dialog').style.display = 'flex'
        document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[0].quantity} Owned`
        animateMenuItems()
    }

    if (!menuOpen && !itemOpen) {
        inDialog = false
        document.querySelector('#menu-dialog').style.display = 'none'
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        document.querySelector('#menu').style.display = 'none'
        animate()
    }

    if (keyActive === 'esc') {
        keyActive = ''
        menuOpen = false
    }

}
// Activates items list within menu loop
function animateMenuItems() {

    const menuItemAnimationId = window.requestAnimationFrame(animateMenuItems)

    // gamepadCheck()
    
    populateStats()
    populateItems()
    document.querySelector('#menu').style.display = 'flex'
    document.querySelector('#save-alert').style.opacity = '0'
    itemsPane.style.display = 'flex'

    // Handles specific item to hover over
		
    if (keyActive === 's') {
        keyActive = ''
        if (itemIndex < 3) {
            // blip()
            itemsPane.children[itemIndex].className = 'menu-button'
            itemIndex += 1
            itemsPane.children[itemIndex].className = 'menu-button menu-hovered'
            document.querySelector('#menu-dialog').style.color = 'white'
            document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
        }
    }
    if (keyActive === 'w') {
        keyActive = ''
        if (itemIndex > 0) {
            // blip()
            itemsPane.children[itemIndex].className = 'menu-button'
            itemIndex -= 1
            itemsPane.children[itemIndex].className = 'menu-button menu-hovered'
            document.querySelector('#menu-dialog').style.color = 'white'
            document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
        }
    }


    // Handles item selection/use
				
    if (itemOpen === true && keyActive === 'enter') {
        keyActive = ''
        if (itemIndex === 0 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.potion.quantity > 0)) {
            // select()
            character.stats.hp += character.items.potions.potion.restore
            character.items.potions.potion.quantity -= 1
            if (character.stats.hp > character.stats.maxHp) {
                character.stats.hp = character.stats.maxHp
            }
            document.querySelector('#menu-dialog').style.color = 'rgb(88, 193, 61)'
            document.querySelector('#menu-dialog').innerHTML = `Health restored`
            setTimeout(() => {
                document.querySelector('#menu-dialog').style.color = 'white'
                document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
            }, 1500)
        }
        else if (itemIndex === 1 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.bigPotion.quantity > 0)) {
            // select()
            character.stats.hp += character.items.potions.bigPotion.restore
            character.items.potions.bigPotion.quantity -= 1
            if (character.stats.hp > character.stats.maxHp) {
                character.stats.hp = character.stats.maxHp
            }
            document.querySelector('#menu-dialog').style.color = 'rgb(88, 193, 61)'
            document.querySelector('#menu-dialog').innerHTML = `Health restored`
            setTimeout(() => {
                document.querySelector('#menu-dialog').style.color = 'white'
                document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
            }, 1500)
        }
        else if (itemIndex === 2 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.magicPotion.quantity > 0)) {
            // select()
            character.stats.mp += character.items.potions.magicPotion.restore
            character.items.potions.magicPotion.quantity -= 1
            if (character.stats.mp > character.stats.maxMp) {
                character.stats.mp = character.stats.maxMp
            }
            document.querySelector('#menu-dialog').style.color = 'rgb(88, 193, 61)'
            document.querySelector('#menu-dialog').innerHTML = `Magic restored`
            setTimeout(() => {
                document.querySelector('#menu-dialog').style.color = 'white'
                document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
            }, 1500)
        }
        else if (itemIndex === 3 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.bigMagicPotion.quantity > 0)) {
            // select()
            character.stats.mp += character.items.potions.bigMagicPotion.restore
            character.items.potions.bigMagicPotion.quantity -= 1
            if (character.stats.mp > character.stats.maxMp) {
                character.stats.mp = character.stats.maxMp
            }
            document.querySelector('#menu-dialog').style.color = 'rgb(88, 193, 61)'
            document.querySelector('#menu-dialog').innerHTML = `Magic restored`
            setTimeout(() => {
                document.querySelector('#menu-dialog').style.color = 'white'
                document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
            }, 1500)
        }
        else {
            document.querySelector('#menu-dialog').style.color = 'red'
            document.querySelector('#menu-dialog').innerHTML = `Cannot use this now`
            setTimeout(() => {
                document.querySelector('#menu-dialog').style.color = 'white'
                document.querySelector('#menu-dialog').innerHTML = `${Object.values(character.items.potions)[itemIndex].quantity} Owned`
            }, 1500)
        }
    }
    

    // Handles exiting of item screen
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
			// cancelSFX.play()
            itemOpen = false
            itemsPane.children[itemIndex].className = 'menu-button'
            itemsPane.children[0].className = 'menu-button menu-hovered'
        }
    })
    if (!itemOpen) {
        itemsPane.style.display = 'none'
        window.cancelAnimationFrame(menuItemAnimationId)
        animateMenu()
    }

    if (keyActive === 'escape') {
        keyActive = ''
        // cancelSFX.play()
        itemOpen = false
        itemsPane.children[itemIndex].className = 'menu-button'
        itemsPane.children[0].className = 'menu-button menu-hovered'
        itemsPane.style.display = 'none'
        document.querySelector('#menu-dialog').innerHTML = ``
        window.cancelAnimationFrame(menuItemAnimationId)
        animateMenu()
    }

}
// Populates item list within menu loop
function populateItems() {
    itemsPane.children[0].getElementsByTagName('span').innerHTML = character.items.potions.potion.quantity
    itemsPane.children[1].getElementsByTagName('span').innerHTML = character.items.potions.bigPotion.quantity
    itemsPane.children[2].getElementsByTagName('span').innerHTML = character.items.potions.magicPotion.quantity
    itemsPane.children[3].getElementsByTagName('span').innerHTML = character.items.potions.bigMagicPotion.quantity
}

function animateStatus() {
    const statusAnimationId = window.requestAnimationFrame(animateStatus)

    statusOpen = true

    // gamepadCheck()
    
    populateStats()
    document.querySelector('#menu').style.display = 'flex'
    document.querySelector('#save-alert').style.opacity = '0'
    document.querySelector('#player-stats').style.display = 'flex'

    if (keyActive === 'escape') {
        keyActive = ''
        window.cancelAnimationFrame(statusAnimationId)
        statusOpen = false
        document.querySelector('#player-stats').style.display = 'none'
        animateMenu()
    }

}



