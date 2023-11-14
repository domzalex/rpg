// MAIN GAME VARIABLES //

// Objects to hold character data and important game state
let gameState = {
    mainActive: true,
    battleActive: false,
    menuActive: false,
    shopSelect: 0,
    currentScreen: 0,
    progression: 0
}
let currentMap = {
    // bg: './img/map-pastel.png'
    bg: './img/mapNEWdemo.png'
}
let character = {
    position: {
        x: 590,
        y: 350
    },
    money: 0,
    stats: {
        lvl: 5,
        maxHp: 30,
        hp: 20,
        maxMp: 20,
        mp: 20,
        exp: 100,
        expToNext: 125,
        atk: 15,
        power: 15,
        def: 10,
        spd: 10
    },
    magic: {
        fire: {
            name: 'fire',
            power: 3.5,
            mp: 10
        },
        lightning: {
            name: 'lightning',
            power: 5,
            mp: 16
        },
        wind: {
            name: 'wind',
            power: 2.5,
            mp: 8
        }
    },
    equipment: {
        armor: {
            defense: 1,
            quantity: 0
        },
        weapon: {
            attack: 1,
            quantity: 0
        }
    },
    items: {
        potions: {
            potion: {
                quantity: 1,
                restore: 30,
                name: 'Potion'
            },
            bigPotion: {
                quantity: 0,
                restore: 100,
                name: 'Potion +'
            },
            magicPotion: {
                quantity: 0,
                restore: 20,
                name: 'Magic Potion'
            },
            bigMagicPotion: {
                quantity: 1,
                restore: 50,
                name: 'Magic Potion +'
            }
        }
    }

}
const enemies = {
    0: {
        name: 'Neutral Slime',
        img: 'img/enemy-wind-weak-2.png',
        hp: 30,
        atk: 15,
        def: 60,
        spd: 80,
        exp: 70,
        money: 13,
        weakness: 'wind',
        drop: 'potion'
    },
    1: {
        name: 'Water Slime',
        img: 'img/enemy-lightning-weak-2.png',
        hp: 50,
        atk: 20,
        def: 35,
        spd: 50,
        exp: 100,
        money: 30,
        weakness: 'lightning',
        drop: 'potion'
    },
    2: {
        name: 'Grass Slime',
        img: 'img/enemy-fire-weak-2.png',
        hp: 20,
        atk: 25,
        def: 15,
        spd: 20,
        exp: 50,
        money: 15,
        weakness: 'fire',
        drop: 'magicPotion'
    }
}

// Initiates canvas context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Sets main screen offset for movable background to reference as well as game screen size
let offset = {
    x: -2350,
    y: -1330
}
// -1500, -6200, -3800
canvas.width = 1280
canvas.height = 720

// Functions to create and read save files
function createSaveFile() {
    localStorage.clear()
    localStorage.setItem('offset', JSON.stringify(offset))
    localStorage.setItem('character', JSON.stringify(character))
}
// if (localStorage.length > 0) {
//     offsetData = localStorage.getItem('offset')
//     offset = JSON.parse(offsetData)
//     characterData = localStorage.getItem('character')
//     character = JSON.parse(characterData)
// } else {}


// Initiating primary variables
let stepCounter = 0
let menuOpen = false
let menuIndex = 0
let itemOpen = false
const itemsPane = document.querySelector('#all-items')
let itemIndex = 0
let inBattle = false
let winScreenState = ''
let battleMenuIndex = 0
let hoverToggler = {
    index: 0
}
let opacityToggler = {
    index: 0
}
const winScreenElement = document.querySelector('#win-screen')
const levelUpModalElement = document.querySelector('#level-up-modal')
const winGainsElement = document.querySelector('#win-gains')
let battleItemMenuOpen = false
let battleItemIndex = 0
let battleEnd = false
let battleMessage = document.querySelector('#battle-dialog')
let allowBattleMenuNav = false
let magicMenuOpen = false
let magicMenuIndex = 0
let speedCheck = false
let characterTurn = false
let enemyTurn = false
// let keyFiredW = false
// let keyFiredA = false
// let keyFiredS = false
// let keyFiredD = false
// let keyFiredE = false
// let keyFiredEnter = false
// let keyFiredEsc = false
let attacking = false
let useMagic = false
let frameCancel = false
let keyActive = ''
let pressedKeys = []
let whichCollision = collisions
let keyCheck = false
let collisionsSet = false
let npcDialog = false
let inDialog = false
let npcIterator = 0
let yesNo = false
let index = 0
let shopMenuOpen = false
let statusOpen = false
let bgmusic = false
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    e: {
        pressed: false
    },
    shift: {
        pressed: false
    }
}
let spd = 5
let moving = false
const battle = {
    initiated: false
}
let collisionsMap = []
let boundaries = []
let npcs = []
const battleZonesMap = []
const battleZones = []
const npcMap = []
const npcDialogHitboxes = []

// General images for overworld, battle scene, menu scene, etc.
let backgroundImage = new Image()
backgroundImage.src = currentMap.bg
let foregroundImage = new Image()
foregroundImage.src = './img/mapNEWdemoTOP.png'
const battleBg = new Image()
battleBg.src = './img/battle-bg-pastel.png'
const enemyImg = new Image()
const basicAttackImg = new Image()
basicAttackImg.src = './img/basic-attack.png'
const basicEnemyAttackImg = new Image()
basicEnemyAttackImg.src = './img/basic-enemy-attack.png'
const merchantIconImg = new Image()
merchantIconImg.src = './img/merchantIcon.png'

// Player sprite images
const playerDown = new Image()
playerDown.src = './img/player-down-4.png'
const playerUp = new Image()
playerUp.src = './img/player-up-4.png'
const playerLeft = new Image()
playerLeft.src = './img/player-left-4.png'
const playerRight = new Image()
playerRight.src = './img/player-right-4.png'

const playerIdleDown = new Image()
playerIdleDown.src = './img/player-down-idle.png'
const playerIdleUp = new Image()
playerIdleUp.src = './img/player-up-idle.png'
const playerIdleLeft = new Image()
playerIdleLeft.src = './img/player-left-idle.png'
const playerIdleRight = new Image()
playerIdleRight.src = './img/player-right-idle.png'

// const playerBattle = new Image()
// playerBattle.src = './img/player-battle.png'
const merchantImage = new Image()
merchantImage.src = './img/merchant.png'

// Sprite list
let player = new Sprite({
    position: {
        x: canvas.width / 2 - 40,
        y: canvas.height / 2 - 40
    },
    image: playerIdleDown,
    facing: 'down',
    frames: {
        max: 6
    },
    sprites: {
        up: playerUp,
        down: playerDown,
        left: playerLeft,
        right: playerRight,
    },
    idleSprites: {
        idleUp: playerIdleUp,
        idleDown: playerIdleDown,
        idleLeft: playerIdleLeft,
        idleRight: playerIdleRight
    },
})
const battlePlayer = new Sprite({
    position: {
        x: 850,
        y: 270
    },
    image: playerLeft,
    frames: {
        max: 6
    }
})
const basicAttack = new Sprite({
	position: {
		x: 355,
		y: 270
	},
	image: basicAttackImg,
	frames: {
		max: 8
	}
})
const basicEnemyAttack = new Sprite({
	position: {
		x: 850,
		y: 270
	},
	image: basicEnemyAttackImg,
	frames: {
		max: 8
	}
})
let enemy = new Sprite({
    position: {
        x: 355,
        y: 270
    },
    image: enemyImg,
    frames: {
        max: 8
    },
    name: '',
    maxHp: 20,
    health: 20,
    atk: 5,
    def: 5,
    spd: 5,
    exp: 50,
    money: 25
})
let background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})
let foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})
const battleBackground = new Sprite({
    position: {
        x: -3520,
        y: -3455
    },
    image: battleBg
})


player.moving = false

// All elements that are moved
let movables = [background, ...boundaries, ...battleZones]



// Audio

const blipSFX = new Audio('./sfx/blip.mp3')
function blip() {
	const blipSFX = new Audio('./sfx/blip.mp3')
	blipSFX.play()
}
const selectSFX = new Audio('./sfx/select.mp3')
function select() {
	const selectSFX = new Audio('./sfx/select.mp3')
	selectSFX.play()
}
const cancelSFX = new Audio('./sfx/cancel.mp3')
function cancel() {
	const cancelSFX = new Audio('./sfx/cancel.mp3')
	cancelSFX.play()
}

const slashSFX = new Audio('./sfx/slash.mp3')
function slash() {
	const slashSFX = new Audio('./sfx/slash.mp3')
	slashSFX.play()
}
const slashCritSFX = new Audio('./sfx/slash_crit.mp3')
function slashCrit() {
	const slashCritSFX = new Audio('./sfx/slash_Crit.mp3')
	slashCritSFX.play()
}

const tallGrassSFX = new Audio('./sfx/tall-grass.mp3')
function tallGrass() {
	const tallGrassSFX = new Audio('./sfx/tall-grass.mp3')
	tallGrassSFX.play()
}


// BATTLE CODE VARIABLES //

const hpBarWidth = 70
const battleItemMenu = document.querySelector('#battleItemMenu');
const magicReq = document.querySelector('#magic-req');
let fleeing
let explosionToggle = false
let magicType = null
let baseDamage
let magicMultiplier = 1
let magicWeaknessBoost = 1
let finalDamage
let criticalChance = 0.15
let criticalBoost = 1.5
let battleWon
let enemyChosen = false
let levelChecked
let readyMagicAnimation = false
let superEffectiveText = ''
const battleMenuPane = document.querySelector('#battleMenuPane')
const battleMenu = document.querySelector('#battleMenu')
const magicMenu = document.querySelector('#magicMenu')
let playerHealth = document.querySelector('#player-health')
let playerMagic = document.querySelector('#player-magic')
let battleAnimationId


// function gamepadCheck() {
//     const gamepad = navigator.getGamepads()[0]
//     if (gamepad && gamepad.connected) {
//         const axes = gamepad.axes
//         const buttons = gamepad.buttons
//         if (inDialog || shopMenuOpen || menuOpen || itemOpen || yesNo) {
//             if ((!keyFiredW && !keyFiredA && !keyFiredS && !keyFiredD && !keyFiredEnter && !keyFiredEsc) && keyActive == '') {
//                 if (buttons[12].pressed) {
//                     keyFiredW = true
//                     keyActive = 'w'
//                 }
//                 if (buttons[13].pressed) {
//                     keyFiredS = true
//                     keyActive = 's'
//                 }
//                 if (buttons[14].pressed) {
//                     keyFiredA = true
//                     keyActive = 'a'
//                 }
//                 if (buttons[15].pressed) {
//                     keyFiredD = true
//                     keyActive = 'd'
//                 }
//                 if (buttons[1].pressed) {
//                     keyFiredEnter = true
//                     keyActive = 'enter'
//                 }
//                 if (buttons[0].pressed) {
//                     keyFiredEsc = true
//                     keyActive = 'esc'
//                 }
//             }
//             if (!buttons[12].pressed && keyActive === 'w') {
//                 keyFiredW = false
//                 keyActive = ''
//             }
//             if (!buttons[13].pressed && keyActive === 's') {
//                 keyFiredS = false
//                 keyActive = ''
//             }
//             if (!buttons[14].pressed && keyActive === 'a') {
//                 keyFiredA = false
//                 keyActive = ''
//             }
//             if (!buttons[15].pressed && keyActive === 'd') {
//                 keyFiredD = false
//                 keyActive = ''
//             }
//             if (!buttons[1].pressed && keyActive === 'enter') {
//                 keyFiredEnter = false
//                 keyActive = ''
//             }
//             if (!buttons[0].pressed && keyActive === 'esc') {
//                 keyFiredEsc = false
//                 keyActive = ''
//             }
//         }
//         else if (!inDialog) {
//             if (gamepad.buttons[12].pressed || ((axes[1] < -0.75) && (axes[0] > -1))) {

//                 keyFiredW = true
//                 keys.w.pressed = true
//                 lastKey = 'w'
//                 pressedKeys.push('w')
                
//             } else {
    
//                 keyFiredW = false
//                 keys.w.pressed = false
//                 for (let i = 0; i < pressedKeys.length; i++) {
//                     if (pressedKeys[i] === 'w') {
//                         pressedKeys.splice(i, 1)
//                     }
//                 }
    
//             }
//             if (gamepad.buttons[13].pressed || ((axes[1] > 0.75) && (axes[0] > -1))) {
                
//                 keyFiredS = true
//                 keys.s.pressed = true
//                 lastKey = 's'
//                 pressedKeys.push('s')
    
//             } else {
    
//                 keyFiredS = false
//                 keys.s.pressed = false
//                 for (let i = 0; i < pressedKeys.length; i++) {
//                     if (pressedKeys[i] === 's') {
//                         pressedKeys.splice(i, 1)
//                     }
//                 }
    
//             }
//             if (gamepad.buttons[14].pressed || ((axes[0] < -0.75) && (axes[1] < 0.75 && axes[1] > -0.75))) {
    
//                 keyFiredA = true
//                 keys.a.pressed = true
//                 lastKey = 'a'
//                 pressedKeys.push('a')
    
//             } else {
    
//                 keyFiredA = false
//                 keys.a.pressed = false
//                 for (let i = 0; i < pressedKeys.length; i++) {
//                     if (pressedKeys[i] === 'a') {
//                         pressedKeys.splice(i, 1)
//                     }
//                 }
    
//             }
//             if (gamepad.buttons[15].pressed || (axes[0] > 0.75 && (axes[1] < 0.75 && axes[1] > -0.75))) {
    
//                 keyFiredD = true
//                 keys.d.pressed = true
//                 lastKey = 'd'
//                 pressedKeys.push('d')
    
//             } else {
    
//                 keyFiredD = false
//                 keys.d.pressed = false
//                 for (let i = 0; i < pressedKeys.length; i++) {
//                     if (pressedKeys[i] === 'd') {
//                         pressedKeys.splice(i, 1)
//                     }
//                 }
                
//             }
//             if (!keyFiredEnter && keyActive === '') {
//                 if (buttons[1].pressed) {
//                     keyFiredEnter = true
//                     keyActive = 'enter'
//                 }
//             }
//             if (!buttons[1].pressed && keyActive === 'enter') {
//                 keyFiredEnter = false
//                 keyActive = ''
//             }
            
//         } 





//         if (!keyFiredE) {
//             if (gamepad.buttons[9].pressed) {
//                 keyFiredE = true
//                 if (menuOpen == false && !battle.initiated && !shopMenuOpen && !inDialog) {
//                     menuOpen = true
//                 } else if (menuOpen == true && !itemOpen) {
//                     menuOpen = false
//                 }
//             }
//         }
//         if (!gamepad.buttons[9].pressed) {
//             keyFiredE = false
//         }

//     };
// }