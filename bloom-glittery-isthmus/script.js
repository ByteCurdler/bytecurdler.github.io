// pretty please don't abuse the fact i have my tba key plain in code
// glitch only hosts static sites free so i cant do a server
let tbaKey = "t2Bw0RhfJlYK9h5c9gDLnlKZBgeJcEKjcsqoT59oaO9BTbxV97JHkq05JQXx5Gar"

function sortByKey(list, key) {
  return list.sort((a, b) => key(a) - key(b))
}

let main = document.getElementById("main")
function log(txt) {
  let line = document.createElement("p")
  line.innerText = txt
  main.appendChild(line)
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


function bar(size, color, small=false, parent=main) {
  let el = document.createElement("span")
  el.classList.add("bar")
  el.classList.add("section-" + color)
  el.style.width = (size * 500) + "px"
  parent.appendChild(el)
   
   
  // if (small) {
  //     el.classList.add("smallbar")
  // }
}


window.dat = (async () => {
  log("start")
  log("fetching events")
  let events = await getTBA("events/2025")
  //log(JSON.stringify(events))
  events = events.sort((a, b) => (a.week < b.week) ? -1 : 1)//.slice(0,4)
  
  let ratios = []
  
  let redscores = []
  let bluscores = []
  
  for (let event of events) {
    //log(JSON.stringify(event))
    let later = false; (event.start_date > "2025-03-15")
    if (!later) {
      let matches = (await getTBA(`event/${event.key}/matches`)).filter(m => m.comp_level == "qm")
      window.m = matches
      let matchCounts = {}
      for (let match of matches) {
        let win = match.winning_alliance
        matchCounts[win] = (matchCounts[win] || 0) + 1
        
        if (match.score_breakdown) {
          redscores.push(match.score_breakdown.red.totalPoints)
          bluscores.push(match.score_breakdown.blue.totalPoints)
        }
      }
      let total = matches.length - (matchCounts[""] || 0)
      
      if (total < 10) {
          continue
      }
      
        let el = document.createElement("span")
        el.classList.add("bar")
        el.style.width = ((total) * 500 / Math.max(1, total) / 2) + "px"
        main.appendChild(el)
      
      
      let name = document.createElement("span")
      name.innerText = (`Week ${event.week} ${event.key} ${event.name} ${event.start_date}`)
      main.appendChild(name)
      
      main.appendChild(document.createElement("br"))
      for (let key of sortByKey(
        Object.keys(matchCounts), k => (k + "z").charCodeAt(0))
      ) {
        //if (key == "") {continue}
        let el = document.createElement("span")
        el.classList.add("bar")
        el.classList.add("section-" + key)
        el.style.width = (matchCounts[key] * 500 / Math.max(1, total)) + "px"
        main.appendChild(el)
      }
      
      ratios.push(matchCounts["blue"] / total)
      //log(JSON.stringify(matchCounts))
      //error
      main.appendChild(document.createElement("br"))
    }
  }
  
  main.appendChild(document.createElement("br"))
  main.appendChild(document.createElement("br"))
  
  ratios = ratios.filter(x => (x != null && x != undefined && x == x))
  
  window.rat = ratios
  
  let cont = document.createElement("div")
  cont.classList.add("smallbar")
  for (let ratio of ratios.sort((a,b) => b-a)) {
    if (ratio < 0.5) {
        bar(ratio, "", true, cont)
        bar(0.5 - ratio, "red", true, cont)
        bar(0.5, "", true, cont)
    } else {
        bar(0.5, "", true, cont)
        bar(ratio - 0.5, "blue", true, cont)
        bar(1 - ratio, "", true, cont)
    }
    cont.appendChild(document.createElement("br"))
  }
  
  main.appendChild(cont)
  
  main.appendChild(document.createElement("br"))
  main.appendChild(document.createElement("br"))
  
  cont = document.createElement("div")
  cont.classList.add("smallbar")
  
  let blu = ratios.filter(x => x > 0.5).sort((a,b) => b-a).map(x => 1-x)
  let red = ratios.filter(x => x < 0.5).sort((a,b) => a-b)
  let len = Math.max(blu.length, red.length)
  
  for (let i = 0; i < len; i++) {
      let bluv = blu[i] || 0.5
      let redv = red[i] || 0.5
      
      bar(redv, "", null, cont)
      bar(0.5 - redv, "red", null, cont)
      bar(0.5 - bluv, "blue", null, cont)
      bar(bluv, "", null, cont)
      
    cont.appendChild(document.createElement("br"))
  }
  main.appendChild(cont)
  main.appendChild(document.createElement("br"))
  
  function median(list) {
    if (list.length % 2 == 0) {
      let half = list.length/2
      return (list[half-1] + list[half])/2
    } else {
      return list[Math.floor(list.length/2)]
    }
  }
  
  function avg(list) {
    return list.reduce((a,b) => a+b) / list.length
  }
  
  let txt = document.createElement("div")
  txt.innerText = `avg ${avg(red)}pts towards red`
  txt.innerText += ` and ${avg(blu)}pts towards blue`
  main.appendChild(txt)
  
  txt = document.createElement("div")
  txt.innerText = `median ${median(red)}pts towards red`
  txt.innerText += ` and ${median(blu)}pts towards blue`
  main.appendChild(txt)
  
  txt = document.createElement("div")
  txt.innerText = `avg ${avg(redscores)} score for red`
  txt.innerText += ` and ${avg(bluscores)} score for blue`
  main.appendChild(txt)
  
  txt = document.createElement("div")
  txt.innerText = `median ${median(redscores)} score for red`
  txt.innerText += ` and ${median(bluscores)} score for blue`
  main.appendChild(txt)
  
  window.red = red
  window.blu = blu
  
  
  window.ev = events
})()
