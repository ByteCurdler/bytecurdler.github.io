let timer = document.getElementById("timer")

let startTime = Number(localStorage.startTime) || 0

document.getElementById("reset").onclick = () => {
  startTime = Date.now()
  localStorage.startTime = startTime
}

[...document.getElementsByClassName("add")].forEach(e => {
  e.onclick = () => {
    startTime += 1000 * Number(e.getAttribute("amount"))
    localStorage.startTime = startTime
  }
})

function lpad(s, d) {
  s = s.toString()
  while (s.length < d) {
    s = "0" + s
  }
  return s
}

// var startSfx = new Audio("match_start.ogg")
// var endSfx = new Audio("match_end.ogg")

const displayTimeOffset = 99.9999;

let lastTimeLeft = -999
function frame () {
  requestAnimationFrame(frame)
  
  let timeLeft = Math.max(0, startTime + 2.25*60*1000 - Date.now())
  if (lastTimeLeft > 0 && timeLeft <= 0) {
      // startSfx.play()
      
  }
  
  lastTimeLeft = timeLeft
  let dispTime = timeLeft + displayTimeOffset
  let minutes = Math.floor(dispTime/(60*1000))
  let seconds = Math.floor((dispTime/1000)%60)
  let part = Math.floor((dispTime/100)%10)
  timer.innerText = `${minutes}:${lpad(seconds, 2)}.${part}`
  
  timer.classList = (timeLeft <= 0) ? "gameover" : (dispTime <= 20000) ? "endgame" : ""
}

requestAnimationFrame(frame)