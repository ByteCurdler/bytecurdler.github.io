function dailyIndex() {
  var startTime = 1667520000000
  var today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  return (today.getTime() - startTime) / (1000 * 60 * 60 * 24)
}

const buttons = {
  "cont": document.getElementById("continue"),
  "daily": document.getElementById("daily"),
  "random": document.getElementById("random"),
}

if (localStorage.state) {
  let hint = JSON.parse(localStorage.state).hint
  buttons.cont.style.display = ""
  document.getElementById("withword").innerText = `"${hint}"`
}

buttons.cont.onclick = () => {
  location = "game.html"
}

buttons.daily.onclick = () => {
  localStorage.state = JSON.stringify({
    ...find_game(dailyIndex()),
    current: "",
    active: true,
    starttime: Date.now()
  })
  location = "game.html"
}

buttons.random.onclick = () => {
  localStorage.state = ""
  location = "game.html"
}