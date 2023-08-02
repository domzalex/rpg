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
        for (let i = 0; i < setCollisionMap.length; i+= 100) {
            collisionsMap.push(setCollisionMap.slice(i, 100 + i))
        }
        createBoundaries()
    }
}
for (let i = 0; i < battleZonesData.length; i+= 100) {
    battleZonesMap.push(battleZonesData.slice(i, 100 + i))
}

// Populates overworld collision maps
function createBoundaries() {
    boundaries = []
    collisionsMap.forEach((row, i) => {
        row.forEach(((symbol, j) => {
            if (symbol === 41) {
                boundaries.push(new Boundary({position: {
                    x: j * Boundary.width + (offset.x),
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
	type: 'information',
	dialog: {
		0: 'test',
		1: 'how are you?'
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
	type: 'merchant',
	dialog: {
		0: 'POOP',
		1: 'I LOVE POOP?'
	}
})

const npcList = [npc1, npc2]



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
        if (symbol === 51) {
            battleZones.push(new BattleZone({position: {
                x: j * BattleZone.width + offset.x,
                y: i * BattleZone.height + offset.y
            }}))
        }
    }))
})
