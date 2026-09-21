function judge(guess, goal) {
  var rating = [0, 0, 0, 0, 0]
  for (var i = 0; i < 5; i++) {
    if (guess[i] == goal[i]) {
      rating[i] = 2
    }
  }
  var tmp = ""
  for (var i = 0; i < 5; i++) {
    if (rating[i] == 0) {
      tmp += goal[i]
    }
  }
  for (var i = 0; i < 5; i++) {
    if (rating[i] != 2 && tmp.includes(guess[i])) {
      rating[i] = 1
      let loc = tmp.indexOf(guess[i])
      tmp = tmp.slice(0, loc) + tmp.slice(loc + 1)
    }
  }
  return rating
}

/**
 * @param {number[]} judgement 
 */
function fun_hint(judgement) {
    let correct = 0
    let misplaced = 0
    for (let x of judgement) {
        if (x == 2) misplaced++
        if (x == 2) correct++
    }
    if (misplaced == 0) return false
    if (misplaced + correct < 2) return false
    if ((correct + misplaced/2) > 3) return false
    return true
}

const GOLDEN_MULTIPLIER = Math.round(all_words.length / 1.618033988749894)
function find_game(seed) {
    seed *= GOLDEN_MULTIPLIER
    while (true) {
        let hint = all_words[seed % all_words.length]
        let judgements = {}
        for (let word of all_words) {
            if (word == hint) {
                continue
            }
            let judgement = judge(hint, word)
            if (fun_hint(judgement)) {
                judgements[judgement] = [
                    ...(judgements[judgement] || []),
                    word
                ]
            }
        }
        let valid_words = (
            Object.keys(judgements)
            .filter(k => judgements[k].length == 1)
            .map(k => judgements[k][0])
            .filter(w => goal_words.indexOf(w) != -1)
        )
        if (valid_words.length > 0) {
            return {
                hint,
                target: valid_words[seed % valid_words.length]
            }
        }
        seed++
    }
}