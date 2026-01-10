let TEMPLATES = {
  swapbutton: `
<label class="header-button" id="header-button-ID">
  <span class="header-button-txt">ID</span>
  <input type="radio" name="challenge" value="ID">
  <div class="header-button-subtitle">SUB</div>
</label>
`,
  flagText: `
<div class="section-flag">
  TXT
</div>
`,
  question: `
<div class="question">
  TXT
  <div class="question-options"></div>
</div>
`,
  questionOption: `
<label class="question-option">
  TXT
  <input type="radio" name="queQUE" value="ID">
</label>
`
}
let tmp = document.createElement("template")
/** @type {HTMLElement} */
function realizeTemplate(tmpl) {
    tmp.innerHTML = tmpl
    // debugger
    return tmp.content.firstElementChild
}

let sections = {
  EI: {
    name: "Equipment Inspection",
    questions: [
      {
        text: "All equipment in one zone?",
        options: ["no", "yes"],
        scores: [0, 20]
      }
    ]
  },
  PT: {
    name: "Precision Tokens",
    questions: [
      {
        text: "Number of precision tokens remaining:",
        options: ["0", "1", "2", "3", "4", "5", "6"],
        scores: [0, 10, 15, 25, 35, 50, 50],
        selected: 6
      }
    ]
  },
  GP: {
    name: "Gracious Professionalism®",
    questions: [
      {
        text: "Gracious Professionalism® displayed at the robot game table:",
        options: ["Developing", "Accomplished", "Exceeds"],
        scores: [0, 0, 0],
        selected: 1
      }
    ]
  },
  M01: {
    name: "Coral Nursery",
    default: true,
    flags: ["notouchy"],
    questions: [
      {
        text: "Coral tree hanging?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
      {
        text: "ALSO still in holder?",
        options: ["no", "yes"],
        scores: [0, 10],
        bonus: true
      },
      {
        text: "Coral buds flipped up?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
    ]
  },
  M02: {
    name: "Shark",
    questions: [
      {
        text: "Shark not touching cave?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
      {
        text: "Shark on mat AND at least partly in shark habitat?",
        options: ["no", "yes"],
        scores: [0, 10]
      },
    ]
  },
  M03: {
    name: "Coral Reef",
    flags: ["notouchy"],
    questions: [
      {
        text: "Reef flipped up, not touching mat?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
      {
        text: "Number of reef segments on mat and upright:",
        options: ["0", "1", "2", "3"],
        scores: [0, 5, 10, 15]
      },
    ]
  },
  M04: {
    name: "Scuba Diver",
    questions: [
      {
        text: "Diver not touching nursery?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
      {
        text: "Diver hanging from reef's support?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
    ]
  },
  M05: {
    name: "Angler Fish",
    questions: [
      {
        text: "Fish latched into shipwreck?",
        options: ["no", "yes"],
        scores: [0, 30]
      },
    ]
  },
  M06: {
    name: "Raise the Mast",
    flags: ["notouchy"],
    questions: [
      {
        text: "Mast completely raised?",
        options: ["no", "yes"],
        scores: [0, 30]
      },
    ]
  },
  M07: {
    name: "Kraken's Treasure",
    flags: ["notouchy"],
    questions: [
      {
        text: "Chest outside nest (heavy lined rectangle)?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
    ]
  },
  M08: {
    name: "Artificial Habitat",
    flags: ["notouchy"],
    questions: [
      {
        text: "Number of habitat segments flat and upright (crab above yellow base):",
        options: ["0", "1", "2", "3", "4"],
        scores: [0, 10, 20, 30, 40]
      },
    ]
  },
  M09: {
    name: "Unexpected Encounter",
    questions: [
      {
        text: "Creature released?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
      {
        text: "Creature at least partly in cold sea?",
        options: ["no", "yes"],
        scores: [0, 10]
      },
    ]
  },
  M10: {
    name: "Send out the Submersible",
    flags: ["notouchy"],
    questions: [
      {
        text: "Yellow flag down?",
        options: ["no", "yes"],
        scores: [0, 30]
      },
      {
        text: "Sub clearly closer to the other team?",
        options: ["no", "yes"],
        scores: [0, 10]
      },
    ]
  },
  M11: {
    name: "Sonar Discovery",
    questions: [
      {
        text: "Number of whales discovered:",
        options: ["0", "1", "2"],
        scores: [0, 20, 30]
      },
    ]
  },
  M12: {
    name: "Feed the Whale",
    flags: ["notouchy"],
    questions: [
      {
        text: "Number of krill at least partly in whale's mouth:",
        options: ["0", "1", "2", "3", "4", "5"],
        scores: [0, 10, 20, 30, 40, 50]
      },
    ]
  },
  M13: {
    name: "Change Shipping Lanes",
    questions: [
      {
        text: "Ship in new lane (closer to mat edge), touching mat?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
    ]
  },
  M14: {
    name: "Sample Collection",
    questions: [
      {
        text: "Water sample out of area?",
        options: ["no", "yes"],
        scores: [0, 5]
      },
      {
        text: "Seabed sample no longer touches seabed (its holder)?",
        options: ["no", "yes"],
        scores: [0, 10]
      },
      {
        text: "Plankton sample no longer touching kelp forest (its holder)?",
        options: ["no", "yes"],
        scores: [0, 10]
      },
      {
        text: "Trident piece no longer touching shipwreck?",
        options: ["no", "one", "both"],
        scores: [0, 20, 30]
      },
    ]
  },
  M15: {
    name: "Research Vessel",
    default: true,
    flags: ["notouchy"],
    questions: [
      {
        text: "Treasure chest in the cargo area?",
        options: ["no", "yes"],
        scores: [0, 5]
      },
      {
        text: "Trident parts in the cargo area?",
        options: ["none", "one", "both"],
        scores: [0, 5, 10]
      },
      {
        text: "Water sample in the cargo area?",
        options: ["no", "yes"],
        scores: [0, 5]
      },
      {
        text: "Seabed sample in the cargo area?",
        options: ["no", "yes"],
        scores: [0, 5]
      },
      {
        text: "Plankton sample in the cargo area?",
        options: ["no", "yes"],
        scores: [0, 5]
      },
      {
        text: "Port's latch at least partly in the loop on the vessel?",
        options: ["no", "yes"],
        scores: [0, 20]
      },
    ]
  }
}

let flagButtonEls = {
  notouchy: `<img class="buttonflag-notouchy" src="notouchy.png">`
}
let flagTexts = {
  notouchy: "No equipment may be touching any part of this mission model at the end of the match to score for this mission."
}

// temp
Object.entries(sections).forEach(kv => {
  if (!kv[1]) {
    kv[1] = sections[kv[0]] = {
      questions: []
    }
  }
  kv[1].questions?.forEach(q => {
    if (q.selected === undefined) {
      q.selected = 0
    }
  })
})

let header = document.getElementById("header")
Object.entries(sections).forEach(kv => {
  let k = kv[0], v = kv[1]
  let el = realizeTemplate(
    TEMPLATES.swapbutton
      .replaceAll("ID", k)
      .replaceAll("SUB", v.name || "")
  )
  header.appendChild(el)
  if (sections[k]?.default) {
    el.click()
  }
  let txt = el.getElementsByClassName("header-button-txt")[0]
  v.flags?.forEach?.(f => {
    txt.appendChild(realizeTemplate(flagButtonEls[f]))
  })
  el.getElementsByTagName("input")[0].oninput = swapTabEv
})

setTimeout(() => {
  swapTab(Object.keys(sections).filter(x => sections[x].default).at(-1))
  recalcScore()
}, 0)

function swapTabEv(ev) {
  swapTab(ev.target.value)
}

let main = document.getElementById("main")
function swapTab(id) {
  console.log(`swap to ${id}`)
  main.innerHTML = ""
  let section = sections[id]
  
  if (section.flags?.length) {
    section.flags.forEach(f => {
      let flagEl = realizeTemplate(
        TEMPLATES.flagText
          .replaceAll("TXT", flagTexts[f])
      )
      main.appendChild(flagEl)
    })
    main.appendChild(realizeTemplate("<hr>"))
  }
  
  section.questions.forEach((que, qi) => {
    let que_el = realizeTemplate(
      TEMPLATES.question.replaceAll("TXT", que.text)
    )
    let options = que_el.children[0]
    options.questionObj = que
    que.options.forEach((opt, i) => {
      let opt_el = realizeTemplate(
        TEMPLATES.questionOption
          .replaceAll("TXT", opt)
          .replaceAll("QUE", qi)
      )
      if (i == que.selected) {
        opt_el.click()
      }
      opt_el.getElementsByTagName("input")[0].oninput = optionClick
      opt_el.getElementsByTagName("input")[0].optData = {
        ind: i,
        que: que
      }
      options.appendChild(opt_el)
    })
    
    main.appendChild(que_el)
  })
}

function optionClick(ev) {
  let opt = ev.target.optData
  opt.que.selected = opt.ind
  recalcScore()
}

let scoreEl = document.getElementById("score")
function recalcScore() {
  let score = 0
  Object.values(sections).forEach(sec => {
    sec.questions?.forEach(que => {
      score += que.scores?.[que.selected] || 0
    })
  })
  scoreEl.innerText = score
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
});