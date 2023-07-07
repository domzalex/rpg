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
for (let i = 0; i < npcData.length; i+= 100) {
    npcMap.push(npcData.slice(i, 100 + i))
}
for (let i = 0; i < npcData.length; i+= 100) {
    npcMap.push(npcData.slice(i, 100 + i))
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
// function createNPC() {
//     npcs = []
//     npcMap.forEach((row, i) => {
//         row.forEach(((symbol, j) => {
//             if (symbol === 63) {
//                 npcs.push(new NPC({position: {
//                     x: j * NPC.width + (offset.x),
//                     y: i * NPC.height + (offset.y)
//                 }}))
//             }
//         }))
//     })
// }
// function createNPCdialog() {
//     npcDialogHitboxes = []
//     npcMap.forEach((row, i) => {
//         row.forEach(((symbol, j) => {
//             if (symbol === 63) {
//                 npcDialogHitboxes.push(new NPCDialogHitbox({position: {
//                     x: j * NPCDialogHitbox.width + (offset.x),
//                     y: i * NPCDialogHitbox.height + (offset.y)
//                 }}))
//                 console.log('new dialog hitbox')
//             }
//         }))
//     })
// }
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
// npcMap.forEach((row, i) => {
//     row.forEach(((symbol, j) => {
//         if (symbol === 63) {
//             npcs.push(new NPC({position: {
//                 x: j * NPC.width + offset.x,
//                 y: i * NPC.height + offset.y
//             }}))
//         }
//     }))
// })
// npcMap.forEach((row, i) => {
//     row.forEach(((symbol, j) => {
//         if (symbol === 63) {
//             npcs.push(new NPC({position: {
//                 x: j * NPC.width + offset.x,
//                 y: i * NPC.height + offset.y
//             }}))
//             npcDialogHitboxes.push(new NPCDialogHitbox({position: {
//                 x: j * NPCDialogHitbox.width + (offset.x - 10),
//                 y: i * NPCDialogHitbox.height + (offset.y - 10)
//             }}))
//         }
//     }))
// })