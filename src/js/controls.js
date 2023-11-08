const allKeys = ['w', 'a', 's', 'd', 'enter', 'escape', 'e']

allKeys.forEach(key => {
    if (key !== 'e') {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === key && pressedKeys.slice(-1).toString() != key) {
                pressedKeys.push(key)
                keyActive = key
            }
        })
        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === key) {
                for (let i = 0; i < pressedKeys.length; i++) {
                    if (pressedKeys[i] === key) {
                        pressedKeys.splice(i, 1)
                    }
                }
                keyActive = pressedKeys.slice(-1).toString()
                moving = false
            }
        })
    }
    else {
        window.addEventListener('keypress', (e) => {
            if (e.key.toLowerCase() === 'e') {
                //one-liner to toggle menuOpen variable
                menuOpen = !(menuOpen && !itemOpen && !statusOpen) && (!menuOpen || (!battle.initiated && !shopMenuOpen && !inDialog))
            }
        })
    }
})