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
    bg: './img/map-pastel.png'
}
let character = {
    position: {
        x: 590,
        y: 350
    },
    money: 0,
    stats: {
        lvl: 1,
        maxHp: 30,
        hp: 30,
        maxMp: 20,
        mp: 20,
        exp: 0,
        expToNext: 40,
        atk: 15,
        power: 15,
        def: 10,
        spd: 10
    },
    magic: {
        fire: {
            name: 'fire',
            power: 1.5,
            mp: 3
        },
        lightning: {
            name: 'lightning',
            power: 1.75,
            mp: 6
        },
        wind: {
            name: 'wind',
            power: 1.25,
            mp: 1
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
                quantity: 5,
                restore: 30
            },
            bigPotion: {
                quantity: 5,
                restore: 100
            },
            magicPotion: {
                quantity: 5,
                restore: 10
            },
            bigMagicPotion: {
                quantity: 5,
                restore: 30
            }
        }
    }

}
let merchant = {
    dialog: {
        0: 'Hello, traveler.',
        1: 'My name is merchant, and I sell items.',
        2: 'Would you like to buy something?'
    },
    items: {
        0: {
            name: 'Big Potion',
            cost: 100
        },
        1: {
            name: 'Big Mana Potion',
            cost: 100
        },
        2: {
            name: 'Armor Set',
            cost: 500
        },
        3: {
            name: 'BIG Sword',
            cost: 500
        },
    }
}
const enemies = {
    0: {
        name: 'Neutral Slime',
        img: 'img/enemy-wind-weak.png',
        hp: 50,
        atk: 10,
        def: 15,
        spd: 8,
        exp: 30,
        money: 13,
        weakness: 'wind'
    },
    1: {
        name: 'Water Slime',
        img: 'img/enemy-lightning-weak.png',
        hp: 80,
        atk: 25,
        def: 30,
        spd: 5,
        exp: 60,
        money: 30,
        weakness: 'lightning'
    },
    2: {
        name: 'Grass Slime',
        img: 'img/enemy-fire-weak.png',
        hp: 30,
        atk: 7,
        def: 10,
        spd: 20,
        exp: 20,
        money: 15,
        weakness: 'fire'
    }
}

// Initiates canvas context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Sets main screen offset for movable background to reference as well as game screen size
let offset = {
    x: -3470,
    y: -1250
}
canvas.width = 1280
canvas.height = 800

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
let itemIndex = 0
let battleMenuIndex = 0
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
let keyFiredW = false
let keyFiredA = false
let keyFiredS = false
let keyFiredD = false
let keyFiredEnter = false
let keyFiredShift = false
let attacking = false
let useMagic = false
let pressedKeys = []
let whichCollision = collisions
let collisionsSet = false
let npcDialog = false
let inDialog = false
let npcIterator = 0
let yesNo = false
let index = 0
let shopMenuOpen = false
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
let moving = true
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
const battleBg = new Image()
battleBg.src = './img/battle-bg.png'
const enemyImg = new Image()

// Player sprite images
const playerDown = new Image()
playerDown.src = './img/player-down.png'
const playerUp = new Image()
playerUp.src = './img/player-up.png'
const playerLeft = new Image()
playerLeft.src = './img/player-left.png'
const playerRight = new Image()
playerRight.src = './img/player-right.png'
const merchantImage = new Image()
merchantImage.src = './img/merchant.png'

// Sprite list
let player = new Sprite({
    position: {
        x: canvas.width / 2 - 40,
        y: canvas.height / 2 - 40
    },
    image: playerDown,
    frames: {
        max: 8
    },
    sprites: {
        up: playerUp,
        down: playerDown,
        left: playerLeft,
        right: playerRight
    }
})
const battlePlayer = new Sprite({
    position: {
        x: 850,
        y: 265
    },
    image: playerLeft,
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
        max: 1
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
const battleBackground = new Sprite({
    position: {
        x: -2365,
        y: -1775
    },
    image: battleBg
})


player.moving = false

// All elements that are moved
let movables = [background, ...boundaries, ...battleZones]


// BATTLE CODE VARIABLES //

const hpBarWidth = 70
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
const battleMenuPane = document.querySelector('#battle-pane')
const battleMenu = document.querySelector('#battle-menu')
const magicMenu = document.querySelector('#magic-menu')
let battleAnimationId
let winScreenAnimationId