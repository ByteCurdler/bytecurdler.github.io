// pretty please don't abuse the fact i have my tba key plain in code
// glitch only hosts static sites free so i cant do a server
let tbaKey = "sDQ4XNNbnw4XAjRphDpgpaam2q4DOiA1CHIzOcmJsH1JNMPPQKAR07momn3Ebzed"

let cache = {}

async function getTeam(id) {
  if (cache[id]) {
    return cache[id]
  }
  let r = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${id}`, {headers:{"x-tba-auth-key": tbaKey}})
  let j = await r.json()
  if (j.Error) {
    j = {
      nonexistant: true
    }
  }
  cache[id] = j
  return j
}

let militarytime = true;

function getTimeNumber(date, flipmilitary) {
  let numhours = date.getHours()
  if (!militarytime != (!!flipmilitary)) {
    numhours = (numhours+11)%12+1
  }
  let hours = numhours.toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return Number.parseInt(hours + minutes);
}

function swapstyle() {
  currentTeam = -1;
  militarytime = !militarytime
  document.getElementById("timestyle").innerText = militarytime ? "military time" : "standard time"
}

let currentTeam = -1;
async function setTeamTime() {
  let teamnum = getTimeNumber(new Date())
  if (currentTeam == teamnum) return
  let dat = await getTeam(teamnum)
  let name, extra, oclock;
  if (dat.nonexistant) {
    let now = new Date();
    let numhours = now.getHours()
    let ampm = ""
    if (!militarytime) {
      ampm = " " + (numhours <= 11 ? "AM" : "PM")
      numhours = (numhours+11)%12+1
    }
    name = `${numhours}:${now.getMinutes().toString().padStart(2, '0')}${ampm}`
    extra = `(team ${teamnum} does not exist)`
    oclock = "";
  } else {
    name = dat.nickname.toUpperCase()
    if (name.startsWith("THE ")) {
      name = name.slice(4,)
    }
    if (name == `TEAM ${teamnum}`) {
      extra = ""
    } else {
      extra = `Team #${teamnum}`
    }
    let location = [dat.city, dat.state_prov, dat.country].filter(Boolean)
    if (location.length > 0) {
      if (extra.length > 0) {extra += ", "}
      extra += `from ${location.join(", ")}`
    }
    if (dat.rookie_year) {
      if (extra.length > 0) {extra += "\n"}
      extra += `Rookie year ${dat.rookie_year}`
    }
    if (dat.motto) {
      if (extra.length > 0) {extra += "\n"}
      extra += `"${dat.motto}"`
    }
    oclock = "o'clock";
  }
  document.getElementById("team").innerText = name
  if (dat.website && dat.website != "http://www.firstinspires.org/" && dat.website != "n/a") {
    let teamEl = document.getElementById("team");
    teamEl.innerHTML = `<a target="_blank" href=${JSON.stringify(dat.website)}>${teamEl.innerHTML}</a>`
  }
  document.getElementById("teamextra").innerText = extra
  document.getElementById("oclock").innerText = oclock
  currentTeam = teamnum
}

window.onload = async () => {
  await setTeamTime()
  document.getElementById("itis").innerText = "It is"
}

let stillProcessing = false

setInterval(async () => {
  if (!stillProcessing) {
    stillProcessing = true;
    try {
      await setTeamTime()
      let nextNum = getTimeNumber(new Date(Date.now()+30000))
      if (!cache[nextNum]) {
        await getTeam(nextNum)
      }
      let numOtherStyle = getTimeNumber(new Date(Date.now()), true)
      if (!cache[numOtherStyle]) {
        await getTeam(numOtherStyle)
      }
    } catch {}
    stillProcessing = false;
  }
}, 0)