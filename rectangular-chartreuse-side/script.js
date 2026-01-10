// pretty please don't abuse the fact i have my tba key plain in code
// glitch only hosts static sites free so i cant do a server
let tbaKey = "t2Bw0RhfJlYK9h5c9gDLnlKZBgeJcEKjcsqoT59oaO9BTbxV97JHkq05JQXx5Gar"

function sortByKey(list, key) {
  return list.sort((a, b) => key(a) - key(b))
}

let logel = document.getElementById("log")
function log(txt) {
  logel.innerText = txt
}
function logUnsafe(txt) {
  logel.innerHTML = txt
}

let sanitizerEl = document.createElement("div")
function sanitize(txt) {
  sanitizerEl.innerText = txt
  return sanitizerEl.innerHTML
}

let cache = {}

async function getTBA(path) {
  if (cache[path]) {
    return cache[path]
  }
  let r = await fetch(`https://www.thebluealliance.com/api/v3/${path}`, {headers:{"x-tba-auth-key": tbaKey}})
  let j = await r.json()
  return j
}

function go() {
  let events = document.getElementById("events")?.value ?? ""
  events = events.split(",").map(x => x.trim())
  console.log(events)
  if (events == "") {
    log("no events entered")
  } else {
    checkClosest(events)
  }
}

async function checkClosest (eventNames) {
  let done = new Array(eventNames.length).fill(false)
  function updateDoneLog() {
    log(done.map(d => (d ? "#" : "_")).join(""))
  }
  updateDoneLog()
  console.log("waiting")
  let events = await Promise.all(eventNames.map((en, i) => {
    console.log("making", en)
    return (async () => {
      console.log("doing", en)
      let ret = await getTBA(`event/${en}/teams/simple`)
      done[i] = true
      updateDoneLog()
      return ret
    })()
  }))
  console.log("done", events)
  let teamnums = events
    .map(teamlist => teamlist.map(team => team.team_number))
    .flat()
    .sort((a,b)=>a-b);
  let bestPairs = []
  let allPairs = {}
  let closestDiff = 9999999
  for (let i = 0; i < teamnums.length-1; i++) {
    let pair = [teamnums[i], teamnums[i+1]]
    let diff = pair[1] - pair[0]
    if (diff < closestDiff) {
      closestDiff = diff
      bestPairs = [pair]
    } else if (diff <= closestDiff) {
      bestPairs.push(pair)
    }
    if (!allPairs[diff]) {
      allPairs[diff] = []
    }
    allPairs[diff].push(pair)
  }
  
  log(JSON.stringify(bestPairs))
  
  let teaminfo = {}
  events.flat().forEach(team => {
    teaminfo[team.team_number] = team
  })
  
  let output = ""
  for (let amount of Object.keys(allPairs).sort((a,b) => Number(a) - Number(b))) {
    output += `<div class='section-header'>${amount}</div>`
    output += allPairs[amount].map(
      p => `<div class="eqlen r"><i>${sanitize(teaminfo[p[0]].nickname)}</i> ${p[0]}</div>
            <span class='splitter'>/</span>
            <div class="eqlen l">${p[1]} <i>${sanitize(teaminfo[p[1]].nickname)}</i></div>`
    ).join("<br>")
  }
  logUnsafe(output)
  return
}

go()