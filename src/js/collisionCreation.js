// Function for collision checking
function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
        rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y < rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height > rectangle2.position.y
    )
}
// Generates collision maps for overworld
function createCollisions(setCollisionMap) {
    if (!collisionsSet) {
        collisionsMap = []
        for (let i = 0; i < setCollisionMap.length; i+= 80) {
            collisionsMap.push(setCollisionMap.slice(i, 80 + i))
        }
        createBoundaries()
    }
}
for (let i = 0; i < battleZonesData.length; i+= 80) {
    battleZonesMap.push(battleZonesData.slice(i, 80 + i))
}

// Populates overworld collision maps
function createBoundaries() {
    boundaries = []
    collisionsMap.forEach((row, i) => {
        row.forEach(((symbol, j) => {
            if (symbol === 2684357776 || symbol === 3216) { //original value 41
                boundaries.push(new Boundary({position: {
                    x: j * Boundary.width + (offset.x + 20),
                    y: i * Boundary.height + (offset.y)
                }}))
            }
        }))
    })
}

let npc1 = new NPC({
	position: {
		x: 1920 + offset.x,
		y: 6315 + offset.y
	},
	image: merchantImage,
	frames: {
        max: 1
    },
	type: 'tutorial',
	dialog: {
		0: `Greetings, traveller...`,
		1: `It's not often I see someone else in this forest.`,
        2: `I don't know what you're doing here...`,
        3: `...but this is a dangerous place.`,
        4: `There are monsters in the thick patches of grass.`,
        5: `There isn't much I can do for you, but...`,
        6: `Here are a few health potions... in case you need them.`,
        7: `Anyway, I'll be here, where it's safe.`,
        8: `Good luck.`
	},
    talkedTo: false
})
let npc1Col = new NPCDialogHitbox({
    position: {
		x: 1920 + offset.x - 10,
		y: 6315 + offset.y - 10
	}
})

let npc2 = new NPC({
	position: {
		x: 4000 + offset.x,
		y: 4000 + offset.y
	},
	image: merchantImage,
	frames: {
        max: 1
    },
    icon: merchantIconImg,
	type: 'merchant',
	dialog: {
		0: 'Hello, traveller.',
		1: 'Should you have the funds, I have the goods...',
		2: `Care to take a look?`
	},
    items: {
        0: {
            name: 'big potion',
			effect: `Restores 100HP`,
            cost: 100
        },
        1: {
            name: 'big magic potion',
			effect: `Restores 50MP`,
            cost: 150
        },
        2: {
            name: 'armor set',
			effect: `Increases defense by 50%`,
            cost: 500
        },
        3: {
            name: 'big sword',
			effect: `Increases main attack by 50%`,
            cost: 500
        },
		4: {
			effect: 'leave shop'
		}
    }
})
let npc2Col = new NPCDialogHitbox({
    position: {
		x: 4000 + offset.x - 10,
		y: 4000 + offset.y - 10
	}
})

const npcList = [npc1, npc2]
const npcCol = [npc1Col, npc2Col]


function checkCollisionChange() {
    if (!collisionsSet) {
        switch (whichCollision) {
            case collisions :
                createCollisions(collisions)
                collisionsSet = true
                break

            case secretForestCollisions :
                createCollisions(secretForestCollisions)
                collisionsSet = true
                break
        }
    }
}
battleZonesMap.forEach((row, i) => {
    row.forEach(((symbol, j) => {
        if (symbol === 7544) { // original value 51
            battleZones.push(new BattleZone({position: {
                x: j * BattleZone.width + offset.x,
                y: i * BattleZone.height + offset.y
            }}))
        }
    }))
})
