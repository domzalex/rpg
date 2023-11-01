// Listening for specific keypresses for movement and enter/esc
window.addEventListener('keypress', (e) => {
    switch (e.key.toLowerCase()) {
        case 'e' :
            if (menuOpen == false && !battle.initiated && !shopMenuOpen && !inDialog) {
                menuOpen = true
            } else if (menuOpen == true && !itemOpen && !statusOpen) {
                menuOpen = false
            }
            break

    }
})






    window.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w' :
                if (!keyFiredW) {
                    keyFiredW = true
                    keyActive = 'w'
                    pressedKeys.push(e.key.toLowerCase())
                }
                keys.w.pressed = true
                lastKey = 'w'

                break
    
            case 'a' :
                if (!keyFiredA) {
                    keyFiredA = true
                    keyActive = 'a'
                    pressedKeys.push(e.key.toLowerCase())
                }
                keys.a.pressed = true
                lastKey = 'a'

                break
    
            case 's' :
                if (!keyFiredS) {
                    keyFiredS = true
                    keyActive = 's'
                    pressedKeys.push(e.key.toLowerCase())
                }
                keys.s.pressed = true
                lastKey = 's'
                
                break
    
            case 'd' :
                if (!keyFiredD) {
                    keyFiredD = true
                    keyActive = 'd'
                    pressedKeys.push(e.key.toLowerCase())
                }
                keys.d.pressed = true
                lastKey = 'd'
                
                break
    
            case 'enter' :
                if (!keyFiredEnter) {
                    keyFiredEnter = true
                    keyActive = 'enter'
                }
                
                break

            case 'escape' :
                if (!keyFiredEsc) {
                    keyFiredEsc = true
                    keyActive = 'esc'
                }
                
                break

        }
    
    })
    window.addEventListener('keyup', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w' :
                keyFiredW = false
                keys.w.pressed = false
                keyActive = ''
                moving = false
                for (let i = 0; i < pressedKeys.length; i++) {
                    if (pressedKeys[i] === 'w') {
                        pressedKeys.splice(i, 1)
                    }
                }
                break
    
            case 'a' :
                keyFiredA = false
                keys.a.pressed = false
                keyActive = ''
                moving = false
                for (let i = 0; i < pressedKeys.length; i++) {
                    if (pressedKeys[i] === 'a') {
                        pressedKeys.splice(i, 1)
                    }
                }
                break
    
            case 's' :
                keyFiredS = false
                keys.s.pressed = false
                keyActive = ''
                moving = false
                for (let i = 0; i < pressedKeys.length; i++) {
                    if (pressedKeys[i] === 's') {
                        pressedKeys.splice(i, 1)
                    }
                }
                break
    
            case 'd' :
                keyFiredD = false
                keys.d.pressed = false
                keyActive = ''
                moving = false
                for (let i = 0; i < pressedKeys.length; i++) {
                    if (pressedKeys[i] === 'd') {
                        pressedKeys.splice(i, 1)
                    }
                }
                break
    
            case 'enter' :
                if (keyFiredEnter) {
                    keyFiredEnter = false
                    keyActive = ''
                }
                
                break

            case 'escape' :
                if (!keyFiredEsc) {
                    keyFiredEsc = false
                    keyActive = ''
                }
                
                break
        }
    
    })