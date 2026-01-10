let timer = document.getElementById("timer")

let startTime = Number(localStorage.startTime) || 0

document.getElementById("reset").onclick = () => {
  startTime = Date.now()
  localStorage.startTime = startTime
}

document.getElementById("reset_frc").onclick = () => {
  startTime = Date.now() - 15000
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

var startSfx = new Audio("match_start.ogg")
var endSfx = new Audio("match_end.ogg")

let lastTimeLeft = -999
function frame () {
  requestAnimationFrame(frame)
  
  let timeLeft = Math.max(0, startTime + 2.5*60*1000 - Date.now())
  if (lastTimeLeft > 0 && timeLeft <= 0) {
      startSfx.play()
      
  }
  lastTimeLeft = timeLeft
  let minutes = Math.floor(timeLeft/(60*1000))
  let seconds = Math.floor((timeLeft/1000)%60)
  let part = Math.floor((timeLeft/100)%10)
  timer.innerText = `${minutes}:${lpad(seconds, 2)}.${part}`
}

requestAnimationFrame(frame)