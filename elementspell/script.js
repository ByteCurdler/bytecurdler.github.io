const ELEMENTS = { "H": "Hydrogen", "He": "Helium", "Li": "Lithium", "Be": "Beryllium", "B": "Boron", "C": "Carbon", "N": "Nitrogen", "O": "Oxygen", "F": "Fluorine", "Ne": "Neon", "Na": "Sodium", "Mg": "Magnesium", "Al": "Aluminium", "Si": "Silicon", "P": "Phosphorus", "S": "Sulfur", "Cl": "Chlorine", "Ar": "Argon", "K": "Potassium", "Ca": "Calcium", "Sc": "Scandium", "Ti": "Titanium", "V": "Vanadium", "Cr": "Chromium", "Mn": "Manganese", "Fe": "Iron", "Co": "Cobalt", "Ni": "Nickel", "Cu": "Copper", "Zn": "Zinc", "Ga": "Gallium", "Ge": "Germanium", "As": "Arsenic", "Se": "Selenium", "Br": "Bromine", "Kr": "Krypton", "Rb": "Rubidium", "Sr": "Strontium", "Y": "Yttrium", "Zr": "Zirconium", "Nb": "Niobium", "Mo": "Molybdenum", "Tc": "Technetium", "Ru": "Ruthenium", "Rh": "Rhodium", "Pd": "Palladium", "Ag": "Silver", "Cd": "Cadmium", "In": "Indium", "Sn": "Tin", "Sb": "Antimony", "Te": "Tellurium", "I": "Iodine", "Xe": "Xenon", "Cs": "Caesium", "Ba": "Barium", "La": "Lanthanum", "Ce": "Cerium", "Pr": "Praseodymium", "Nd": "Neodymium", "Pm": "Promethium", "Sm": "Samarium", "Eu": "Europium", "Gd": "Gadolinium", "Tb": "Terbium", "Dy": "Dysprosium", "Ho": "Holmium", "Er": "Erbium", "Tm": "Thulium", "Yb": "Ytterbium", "Lu": "Lutetium", "Hf": "Hafnium", "Ta": "Tantalum", "W": "Tungsten", "Re": "Rhenium", "Os": "Osmium", "Ir": "Iridium", "Pt": "Platinum", "Au": "Gold", "Hg": "Mercury", "Tl": "Thallium", "Pb": "Lead", "Bi": "Bismuth", "Po": "Polonium", "At": "Astatine", "Rn": "Radon", "Fr": "Francium", "Ra": "Radium", "Ac": "Actinium", "Th": "Thorium", "Pa": "Protactinium", "U": "Uranium", "Np": "Neptunium", "Pu": "Plutonium", "Am": "Americium", "Cm": "Curium", "Bk": "Berkelium", "Cf": "Californium", "Es": "Einsteinium", "Fm": "Fermium", "Md": "Mendelevium", "No": "Nobelium", "Lr": "Lawrencium", "Rf": "Rutherfordium", "Db": "Dubnium", "Sg": "Seaborgium", "Bh": "Bohrium", "Hs": "Hassium", "Mt": "Meitnerium", "Ds": "Darmstadtium", "Rg": "Roentgenium", "Cn": "Copernicium", "Nh": "Nihonium", "Fl": "Flerovium", "Mc": "Moscovium", "Lv": "Livermorium", "Ts": "Tennessine", "Og": "Oganesson" }
const ELEMENT_KEYS = Object.keys(ELEMENTS)
ELEMENT_KEYS.sort()
document.getElementById("list").innerText = ELEMENT_KEYS.join(", ")

function sanitize(html) {
  var decoder = document.createElement('div')
  decoder.innerText = html
  return decoder.innerHTML
}

function inputchange() {
  var input = sanitize(document.getElementById("input").value)
  var output = input
  var groups = elementGroup(input)
  groups.sort((b, a) => a.index - b.index)
  groups.forEach(g => {
    var el = document.createElement("span")
    el.classList = "element"
    el.innerText = g.el
    el.title = ELEMENTS[el.innerText]
    output = output.slice(0, g.index) + "\u200b" + el.outerHTML + "\u200b" + output.slice(g.index + g.el.length)
  })
  document.getElementById("output").innerHTML = output
  groups.sort((a, b) => a.index - b.index)
  document.getElementById("output2").innerHTML = groups.map(x => ELEMENTS[x.el]).join(", ")
}

inputchange()

function getIndicesOf(searchStr, str, caseSensitive = false) {
  // https://stackoverflow.com/a/3410557
  if (searchStr.length == 0) {
    return [];
  }
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + 1;
  }
  return indices;
}

function elementSearch(text) {
  var possibleGroups = [];
  var groupInfo = [];
  for (let i = 0; i < text.length; i++) {
    possibleGroups.push([])
  }
  let matches = []
  Object.keys(ELEMENTS).forEach((el) => {
    getIndicesOf(el, text).forEach((m) => {
      matches.push([el, m])
    })
  })
  matches.sort((a, b) => a[1] - b[1])
  let groupIndex = 0;
  matches.forEach(x => {
    for (let i = 0; i < x[0].length; i++) {
      possibleGroups[i + x[1]].push(groupIndex)
    }
    groupInfo.push({ el: x[0], index: x[1], id: groupIndex })
    groupIndex += 1
  })
  return [possibleGroups, groupInfo]

}

function groupsDebug(text) {
  let out = ""
  var groups = elementSearch(text)[0]
  groups.forEach((g, i) => {
    let str = text[i] + "│"
    g.forEach(x => {
      while (str.length < x + 2) {
        str += "╴"
      }
      str += "║"
    })
    out += str + "\n"
  })
  console.log(out)
}

function elementGroup(text) {
  var findings = elementSearch(text)
  let positions = findings[0]
  let groups = findings[1]
  let finalizedGroups = []
  for (var i = 0; i < groups.length; i++) {
    var group = groups[i]
    var collides = false
    for (var j = 0; j < group.el.length; j++) {
      if (positions[group.index + j].length > 1) {
        collides = true
        break
      }
    }
    if (collides) {
      var highestCollision = i
      var collisionEnd = group.index + group.el.length - 1
      for (var j = group.index; j <= collisionEnd + 1 && j < positions.length; j++) {
        if (positions[j].filter(x => x >= i && x <= highestCollision).length) {
          highestCollision = Math.max(...positions[j])
          collisionEnd = j
        }
      }
      // console.log(`Collision: ${group.index} - ${collisionEnd} (${text.slice(group.index, collisionEnd + 1)})`)
      var involvedGroups = groups.slice(i, highestCollision + 1)
      var best = {
        groups: [],
        usedLetters: 0
      }
      for (var j = 1; j < 2 ** involvedGroups.length; j++) {
        var selectedGroups = involvedGroups.filter((g, i) => (2 ** i) & j)
        var collides = false
        var selectedGroupIDs = selectedGroups.map(x => x.id)
        for (var k = group.index; k <= collisionEnd; k++) {
          if (positions[k].filter(x => selectedGroupIDs.includes(x)).length > 1) {
            collides = true
            break
          }
        }
        if (collides) {
          continue
        }
        var comboInfo = {
          groups: selectedGroups,
          usedLetters: selectedGroups.map(x => x.el.length).reduce((x, y) => x + y)
        }
        if (comboInfo.usedLetters > best.usedLetters || (comboInfo.usedLetters == best.usedLetters && comboInfo.groups.length < best.groups.length)) {
          best = comboInfo
        }
      }
      finalizedGroups = finalizedGroups.concat(best.groups)
      i = highestCollision // +1 on for loop's loop
    } else {
      finalizedGroups.push(group)
    }
  }
  return finalizedGroups
}