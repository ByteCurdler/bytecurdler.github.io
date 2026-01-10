const worldElement = document.getElementById("world")
const CONFIG = {
    perspective: "512px",
    grid_scale: 16,
    mouse_sensitivity: 0.3,
    physics_tick: 1 / 60
}

// these yoinked from https://github.com/mikolalysenko/voxel-raycast/blob/master/raycast.js
function traceRay_impl(
    voxels,
    px, py, pz,
    dx, dy, dz,
    max_d,
    hit_pos,
    hit_norm,
    EPSILON) {
    var t = 0.0
        , nx = 0, ny = 0, nz = 0
        , ix, iy, iz
        , fx, fy, fz
        , ox, oy, oz
        , ex, ey, ez
        , b, step, min_step
        , floor = Math.floor
    //Step block-by-block along ray
    while (t <= max_d) {
        ox = px + t * dx
        oy = py + t * dy
        oz = pz + t * dz
        ix = floor(ox) | 0
        iy = floor(oy) | 0
        iz = floor(oz) | 0
        fx = ox - ix
        fy = oy - iy
        fz = oz - iz
        b = voxels.get(ix, iy, iz)
        if (b) {
            if (hit_pos) {
                //Clamp to face on hit
                hit_pos[0] = fx < EPSILON ? +ix : (fx > 1.0 - EPSILON ? ix + 1.0 - EPSILON : ox)
                hit_pos[1] = fy < EPSILON ? +iy : (fy > 1.0 - EPSILON ? iy + 1.0 - EPSILON : oy)
                hit_pos[2] = fz < EPSILON ? +iz : (fz > 1.0 - EPSILON ? iz + 1.0 - EPSILON : oz)
            }
            if (hit_norm) {
                hit_norm[0] = nx
                hit_norm[1] = ny
                hit_norm[2] = nz
            }
            return b
        }
        //Check edge cases
        min_step = +(EPSILON * (1.0 + t))
        if (t > min_step) {
            ex = nx < 0 ? fx <= min_step : fx >= 1.0 - min_step
            ey = ny < 0 ? fy <= min_step : fy >= 1.0 - min_step
            ez = nz < 0 ? fz <= min_step : fz >= 1.0 - min_step
            if (ex && ey && ez) {
                b = voxels.get(ix + nx, iy + ny, iz) ||
                    voxels.get(ix, iy + ny, iz + nz) ||
                    voxels.get(ix + nx, iy, iz + nz)
                if (b) {
                    if (hit_pos) {
                        hit_pos[0] = nx < 0 ? ix - EPSILON : ix + 1.0 - EPSILON
                        hit_pos[1] = ny < 0 ? iy - EPSILON : iy + 1.0 - EPSILON
                        hit_pos[2] = nz < 0 ? iz - EPSILON : iz + 1.0 - EPSILON
                    }
                    if (hit_norm) {
                        hit_norm[0] = nx
                        hit_norm[1] = ny
                        hit_norm[2] = nz
                    }
                    return b
                }
            }
            if (ex && (ey || ez)) {
                b = voxels.get(ix + nx, iy, iz)
                if (b) {
                    if (hit_pos) {
                        hit_pos[0] = nx < 0 ? ix - EPSILON : ix + 1.0 - EPSILON
                        hit_pos[1] = fy < EPSILON ? +iy : oy
                        hit_pos[2] = fz < EPSILON ? +iz : oz
                    }
                    if (hit_norm) {
                        hit_norm[0] = nx
                        hit_norm[1] = ny
                        hit_norm[2] = nz
                    }
                    return b
                }
            }
            if (ey && (ex || ez)) {
                b = voxels.get(ix, iy + ny, iz)
                if (b) {
                    if (hit_pos) {
                        hit_pos[0] = fx < EPSILON ? +ix : ox
                        hit_pos[1] = ny < 0 ? iy - EPSILON : iy + 1.0 - EPSILON
                        hit_pos[2] = fz < EPSILON ? +iz : oz
                    }
                    if (hit_norm) {
                        hit_norm[0] = nx
                        hit_norm[1] = ny
                        hit_norm[2] = nz
                    }
                    return b
                }
            }
            if (ez && (ex || ey)) {
                b = voxels.get(ix, iy, iz + nz)
                if (b) {
                    if (hit_pos) {
                        hit_pos[0] = fx < EPSILON ? +ix : ox
                        hit_pos[1] = fy < EPSILON ? +iy : oy
                        hit_pos[2] = nz < 0 ? iz - EPSILON : iz + 1.0 - EPSILON
                    }
                    if (hit_norm) {
                        hit_norm[0] = nx
                        hit_norm[1] = ny
                        hit_norm[2] = nz
                    }
                    return b
                }
            }
        }
        //Walk to next face of cube along ray
        nx = ny = nz = 0
        step = 2.0
        if (dx < -EPSILON) {
            var s = -fx / dx
            nx = 1
            step = s
        }
        if (dx > EPSILON) {
            var s = (1.0 - fx) / dx
            nx = -1
            step = s
        }
        if (dy < -EPSILON) {
            var s = -fy / dy
            if (s < step - min_step) {
                nx = 0
                ny = 1
                step = s
            } else if (s < step + min_step) {
                ny = 1
            }
        }
        if (dy > EPSILON) {
            var s = (1.0 - fy) / dy
            if (s < step - min_step) {
                nx = 0
                ny = -1
                step = s
            } else if (s < step + min_step) {
                ny = -1
            }
        }
        if (dz < -EPSILON) {
            var s = -fz / dz
            if (s < step - min_step) {
                nx = ny = 0
                nz = 1
                step = s
            } else if (s < step + min_step) {
                nz = 1
            }
        }
        if (dz > EPSILON) {
            var s = (1.0 - fz) / dz
            if (s < step - min_step) {
                nx = ny = 0
                nz = -1
                step = s
            } else if (s < step + min_step) {
                nz = -1
            }
        }
        if (step > max_d - t) {
            step = max_d - t - min_step
        }
        if (step < min_step) {
            step = min_step
        }
        t += step
    }
    if (hit_pos) {
        hit_pos[0] = ox;
        hit_pos[1] = oy;
        hit_pos[2] = oz;
    }
    if (hit_norm) {
        hit_norm[0] = hit_norm[1] = hit_norm[2] = 0;
    }
    return 0
}

function traceRay(voxels, origin, direction, max_d = 64.0) {
    var px = +origin[0]
        , py = +origin[1]
        , pz = +origin[2]
        , dx = +direction[0]
        , dy = +direction[1]
        , dz = +direction[2]
        , ds = Math.sqrt(dx * dx + dy * dy + dz * dz)
    dx /= ds
    dy /= ds
    dz /= ds
    hit_pos = new Array(3)
    hit_norm = new Array(3)
    var hit = traceRay_impl(voxels, px, py, pz, dx, dy, dz, max_d, hit_pos, hit_norm, 1e-8)
    if (!hit) return false
    return {
        hit,
        pos: hit_pos,
        norm: hit_norm
    }
}

console.log("%cUsing CANNON.js version %c" + CANNON.version, "color: #27e9dd", "color: #27e9dd; font-weight: bold")


const lerp = (start, stop, amt) => amt * (stop - start) + start;

function clamp(x, min, max) {
    if (x < min) return min
    if (x > max) return max
    return x
}

const DEG_TO_RAD = Math.PI / 180

let playerPos = {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    update: function() {
        document.body.style.transform = `perspective(${CONFIG.perspective}) translate3d(0, -0px, ${CONFIG.perspective}) rotateX(${playerPos.pitch}deg) rotateY(${playerPos.yaw}deg)`
        worldElement.style.transform = `translate3d(${-playerPos.x * CONFIG.grid_scale}px, ${playerPos.y * CONFIG.grid_scale}px, ${-playerPos.z * CONFIG.grid_scale}px)`
    },
    walkAtAngle: function(angle, dist) {
        playerPos.x += Math.sin((angle + playerPos.yaw) * DEG_TO_RAD) * dist
        playerPos.z -= Math.cos((angle + playerPos.yaw) * DEG_TO_RAD) * dist
    },
    getWalkAngle: function(angle, dist) {
        x = Math.sin((angle + playerPos.yaw) * DEG_TO_RAD) * dist
        z = -Math.cos((angle + playerPos.yaw) * DEG_TO_RAD) * dist
        return new CANNON.Vec3(x, 0, z)
    }
}

function factorial(n) {
  if (n === 0) {
      return 0
  } else if (n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

let faceScale = 4

function make_face(x, y, z, rx = 0, ry = 0, tex = "warped_planks", brightness=1, autoappend = true) {
    var el = document.createElement("img")
    el.src = `tex/${tex}.png`
    el.style.transform = `translate3d(${x * 16}px, ${y * 16}px, ${z * 16}px) scale3d(${1/faceScale * 1.001}, ${1/faceScale * 1.001}, ${1/faceScale * 1.001}) translate(-${16*factorial(faceScale-1)}px, -${16*factorial(faceScale-1)}px) rotateX(${rx}deg) rotateY(${ry}deg)`
    el.style.transformOrigin = "center"
    el.classList.add("face")
    el.style.width = `${16*faceScale}px`
    el.style.height = `${16*faceScale}px`
    el.style.filter = `brightness(${brightness})`
    if (autoappend) worldElement.appendChild(el)
    return el
}

function make_block(x, y, z, tex = "warped_planks", autoappend = true) {
    var el = document.createElement("div")
    el.appendChild(make_face(x, -y, z + 0.5, 0, 0, tex, .788, false)) //f
    el.appendChild(make_face(x, -y, z - 0.5, 0, 180, tex, .788, false)) //b
    el.appendChild(make_face(x + 0.5, -y, z, 0, -90, tex, .592, false)) //r
    el.appendChild(make_face(x - 0.5, -y, z, 0, 90, tex, .592, false)) //l
    el.appendChild(make_face(x, -y - 0.5, z, 90, 0, tex, .984, false))
    el.appendChild(make_face(x, -y + 0.5, z, -90, 0, tex, .49, false))
    if (autoappend) worldElement.appendChild(el)
    return el
}

/**
 * A block.
 * @typedef {Object} Block
 * @property {HTMLElement} element - The element that this block is
*/

/**
 * @type {Object.<string, number>} Block
 */
var blocks = {
    get: function(x, y, z) {
        return blocks[[x, y, z].join(",")] || null
    },
    set: function(x, y, z, value = null) {
        var key = [x, y, z].join(",")
        if (value === null) {
            delete blocks[key]
        } else {
            blocks[key] = value
        }
    },
    create: function(x, y, z, info = {}) {
        if (blocks.get(x, y, z)) blocks.destroy(x, y, z)
        var blockBody = new CANNON.Body({ mass: 0, material: physicsContactMaterial })
        blockBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)))
        blockBody.position.set(x, y, z)
        physicsWorld.add(blockBody)
        blocks.set(x, y, z, {
            element: make_block(x, y, z, info.tex || "warped_planks"),
            body: blockBody,
            pos: [x, y, z]
        })
    },
    destroy: function(x, y, z) {
        var block = blocks.get(x, y, z)
        if (!block) return false
        block.element.remove()
        physicsWorld.remove(block.body)
        blocks.set(x, y, z, null)
        return true
    }
}

pressed = {}
window.addEventListener("keydown", (e) => {
    pressed[e.key.toLowerCase()] = true
})
window.addEventListener("keyup", (e) => {
    pressed[e.key.toLowerCase()] = false
})
window.addEventListener("mousedown", (e) => {
    document.body.requestPointerLock()
})
window.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement) {
        playerPos.pitch = clamp(playerPos.pitch - e.movementY * CONFIG.mouse_sensitivity, -90, 90)
        playerPos.yaw += e.movementX * CONFIG.mouse_sensitivity
    }
})

// cannon.js setup
let physicsWorld = new CANNON.World();
var solver = new CANNON.GSSolver();
physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e9;
physicsWorld.defaultContactMaterial.contactEquationRelaxation = 4;

solver.iterations = 7;
solver.tolerance = 0.1;
physicsWorld.solver = new CANNON.SplitSolver(solver);

physicsWorld.gravity.set(0, -14, 0);

physicsMaterial = new CANNON.Material("slipperyMaterial");
var physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    {
        friction: 0.0, // friction coefficient
        restitution: 0.0  // restitution
    }
);
physicsWorld.addContactMaterial(physicsContactMaterial);

let playerBody = new CANNON.Body({ mass: 5, material: physicsContactMaterial });
playerBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)));
playerBody.position.set(playerPos.x, playerPos.y, playerPos.z);
playerBody.fixedRotation = true
playerBody.updateMassProperties()
playerBody.linearDamping = 0.2;

let canJump = false;
const upAxis = new CANNON.Vec3(0, 1, 0);

physicsWorld.add(playerBody)

// cannon.js setup end

let lastTick = Date.now()
let lastPhysicsTick = Date.now()
function eventLoop() {
    requestAnimationFrame(eventLoop)
    var delta = (Date.now() - lastTick) / 1000
    lastTick += delta * 1000
    var tookStep = false
    while (Date.now() > lastPhysicsTick) {
        var pushVec = new CANNON.Vec3(0, 0, 0)
        if (pressed.w) {
            pushVec = pushVec.vadd(playerPos.getWalkAngle(0, 0.15))
        }
        if (pressed.a) {
            pushVec = pushVec.vadd(playerPos.getWalkAngle(-90, 0.15))
        }
        if (pressed.s) {
            pushVec = pushVec.vadd(playerPos.getWalkAngle(180, 0.15))
        }
        if (pressed.d) {
            pushVec = pushVec.vadd(playerPos.getWalkAngle(90, 0.15))
        }
        physicsWorld.contacts.forEach((contact) => {
            var contactNormal = new CANNON.Vec3();

            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if (contact.bi.id == playerBody.id)  // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal);
            else
                contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                canJump = true;
        })
        if (pressed[" "] && canJump) {
            playerBody.velocity.y = 6
        }
        playerBody.velocity = playerBody.velocity.vadd(pushVec)
        physicsWorld.step(CONFIG.physics_tick)
        playerBody.velocity.x *= canJump ? 0.95 : 0.98
        playerBody.velocity.z *= canJump ? 0.95 : 0.98
        canJump = false
        if (playerBody.position.y < -5) {
            playerBody.velocity.y = 15
        }
        lastPhysicsTick += CONFIG.physics_tick * 1000
        tookStep = true
    }
    if (tookStep) {
        playerPos.x = playerBody.position.x + 0.5
        playerPos.y = playerBody.position.y - 0.2
        playerPos.z = playerBody.position.z
    }
    playerPos.update()
    // sky
    var lerpFactor = playerPos.pitch / 180 + 0.5
    var lerpFactor1 = (clamp(lerpFactor, 0.5, 1) - 0.5) * 2
    var srcColor = [lerp(0x31, 0xb8, lerpFactor1), lerp(0x4e, 0xdf, lerpFactor1), lerp(0xa1, 0xe3, lerpFactor1)]
    var lerpFactor2 = clamp(lerpFactor, 0, 0.5) * 2
    var destColor = [lerp(0x31, 0xb8, lerpFactor2), lerp(0x4e, 0xdf, lerpFactor2), lerp(0xa1, 0xe3, lerpFactor2)]
    document.documentElement.style.background = `linear-gradient(0, rgb(${srcColor}), ${playerPos.pitch / -2.5 + 50}%, rgb(${destColor}))`
    //document.documentElement.style.background = `rgb(${destColor})`
}

for (var x = -4; x < 4; x++) {
    for (var z = -4; z < 4; z++) {
        blocks.create(x, -2, z, {
            tex: [
                "stone",
                "stone",
                "stone",
                "stone",
                "stone",
                "coal_ore",
                "iron_ore",
                "gold_ore",
            ][Math.floor(Math.random() * 8)]
        })
    }
}

for (var x = -4; x < 4; x++) {
    blocks.create(x, -1.5, 4, {
        tex: "warped_planks"
    })
    blocks.create(4, -1, x, {
        tex: "purpur_block"
    })
    blocks.create(x, -0.5, -4, {
        tex: "warped_planks"
    })
}

eventLoop()

/**
 * TODO!!!!
 * add mouse building/destroying
 */