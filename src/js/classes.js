class Sprite {
    constructor({
        position,
        velocity,
        image,
        facing,
        frames = { max: 1 },
        sprites,
        idleSprites,
        maxHp,
        health,
        atk,
        def,
        spd,
        exp,
        money
    }) {
        this.position = position
        this.image = image
        this.facing = facing
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
        this.idleSprites = idleSprites
        this.maxHp = maxHp
        this.health = health
        this.atk = atk
        this.def = def
        this.spd = spd
        this.exp = exp
        this.money = money
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        
        // if (!this.moving) {
        //     this.sprites = this.idleSprites
        //     return
        // }

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 6 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Boundary {
    static width = 80
    static height = 80
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 5
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class BattleZone {
    static width = 80
    static height = 80
    constructor({position}) {
        this.position = position
        this.width = 80
        this.height = 80
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}
class NPC {
    static width = 80
    static height = 80
    constructor({
		position,
		image,
        frames = { max: 1 },
        dialog,
		type,
        items,
        talkedTo
	}) {
        this.position = position
		this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
		this.dialog = dialog
		this.type = type
        this.items = items
        this.talkedTo = talkedTo
        this.width = 80
        this.height = 80
    }
    draw() {
		ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        ctx.fillStyle = 'rgba(255,0,0,0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}
class NPCDialogHitbox {
    static width = 80
    static height = 80
    constructor({position}) {
        this.position = position
        this.width = 100
        this.height = 100
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0)'
        ctx.fillRect(this.position.x, this.position.y, (this.width), (this.height))
    }

}