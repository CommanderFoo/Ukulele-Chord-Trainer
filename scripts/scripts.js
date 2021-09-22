let chords = [

	["C", ["a"], [3]],
	["C7", ["a"], [1]],
	["Cm", ["a", "e", "c"], [3, 3, 3]],
	["Cm7", ["a", "e", "c", "g"], [3, 3, 3, 3]],
	["Cmaj7", ["a"], [2]],

	["D", ["e", "c", "g"], [2, 2, 2]],
	["D7", ["e", "g"], [2, 2]],
	["Dm", ["e", "c", "g"], [1, 2, 2]],
	["Dmaj7", ["a", "e", "c", "g"], [4, 2, 2, 2]],
	["Dm7", ["a", "e", "c", "g"], [3, 1, 2, 2]],

	["E", ["a", "e", "c", "g"], [2, 4, 4, 4]],
	["E7", ["a", "c", "g"], [2, 2, 1]],
	["Em", ["a", "e", "c"], [2, 3, 4]],
	["Emaj7", ["a", "c", "g"], [2, 3, 1]],
	["Em7", ["a", "c"], [2, 2]],

	["F", ["e", "g"], [1, 2]],
	["F7", ["e", "c", "g"], [1, 3, 2]],
	["Fm", ["a", "e", "g"], [3, 1, 1]],
	["Fmaj7", ["a", "e", "c", "g"], [3, 1, 4, 2]],
	["Fm7", ["a", "e", "c", "g"], [3, 1, 3, 1]],

	["G", ["a", "e", "c"], [2, 3, 2]],
	["G7", ["a", "e", "c"], [2, 1, 2]],
	["Gm", ["a", "e", "c"], [1, 3, 2]],
	["Gmaj7", ["a", "e", "c"], [2, 2, 2]],
	["Gm7", ["a", "e", "c"], [1, 1, 2]],

	["A", ["c", "g"], [1, 2]],
	["A7", ["c"], [1]],
	["Am", ["g"], [2]],
	["Amaj7", ["c", "g"], [1, 1]],
	["Am7", [], []],

	["B", ["a", "e", "c", "g"], [2, 2, 3, 4]],
	["B7", ["e", "c", "g"], [2, 3, 4]],
	["Bm", ["a", "e", "c", "g"], [2, 2, 2, 4]],
	["Bmaj7", ["a", "e", "c", "g"], [2, 2, 3, 3]],
	["Bm7", ["a", "e", "c", "g"], [2, 2, 2, 2]]

];

let selected_chords = chords
let speed = 10
let start = 0
let elapsed = 0
let selected = -1
let showing_chords = false

function clear_selected_chord(){
	document.querySelectorAll(".fret.enabled").forEach(elem => elem.classList.remove("enabled"))
}

function select_chord(chord){
	for(let s = 0, sl = chord[1].length; s < sl; ++ s){
		let the_string = document.querySelector(".string." + chord[1][s])
		let the_fret = the_string.querySelector(".fret-" + chord[2][s])

		if(!the_fret.classList.contains("enabled")){
			the_fret.classList.add("enabled")
		}

		let visual = document.querySelector("#current-chord")
		let img = visual.querySelector("img")
		let strong = visual.querySelector("strong")

		img.src = "images/chords/" + chord[0].toLowerCase() + ".png"
		strong.textContent = chord[0]

		visual.style.display = ""
	}
}

function get_random_chord(){
	let r = Math.floor(Math.random() * selected_chords.length)

	if(selected > -1){
		while(r == selected){
			r = Math.floor(Math.random() * selected_chords.length)
		}
	}

	selected = r

	return selected_chords[r]
}

function select_random_chord(ts){
	if(start == 0){
		start = ts
	}

	elapsed = ts - start

	if(elapsed >= (speed * 1000)){
		clear_selected_chord()
		select_chord(get_random_chord())

		elapsed = 0
		start = 0
		first_run = false
	}

	requestAnimationFrame(select_random_chord);
}

function save_selected_chords(){
	let saved_chords = []

	selected_chords.forEach(elem => {
		saved_chords.push(elem[0])
	})

	localStorage.setItem("saved_chords", JSON.stringify(saved_chords))
}

function load_selected_chords(){
	let saved_chords = localStorage.getItem("saved_chords")

	if(saved_chords){
		return JSON.parse(saved_chords)
	}

	return []
}

function remove_from_list(elem){
	let chord = elem.querySelector("img").src.match(/\/(\w+)\.png/i)[1]

	selected_chords = selected_chords.filter(item => item[0].toLowerCase() != chord)
	save_selected_chords()
}

function add_to_list(elem){
	if(elem.classList.contains("filler")){
		return
	}

	let chord = elem.querySelector("img").src.match(/\/(\w+)\.png/i)[1]
	let add_chord = null

	chords.forEach(e => {
		if(e[0].toLowerCase() == chord){
			add_chord = e;

			return;
		}
	})

	if(add_chord){
		let exists = false

		selected_chords.forEach(elem => {
			if(elem[0] == add_chord[0]){
				exists = true

				return;
			}
		})

		if(!exists){
			selected_chords.push(add_chord)
		}
	}

	save_selected_chords()
}

function disable_chord_graphics(){
	let disabled_chords = []

	chords.forEach(elem => {
		let has_chord = false

		selected_chords.forEach(c => {
			if(c[0] == elem[0]){
				has_chord = true
			}
		})

		if(!has_chord){
			disabled_chords.push(elem)
		}
	})

	document.querySelectorAll("#chords-popup span").forEach(elem => {
		let img = elem.querySelector("img")

		if(img){
			let img_chord = img.src.match(/\/(\w+)\.png/i)[1]

			disabled_chords.forEach(e => {
				if(img_chord == e[0].toLowerCase()){
					elem.classList.add("disabled")
				}
			})
		}
	})
}

function init(){
	speed = localStorage.getItem("chord_trainer_speed") || speed

	let speed_dropdown = document.querySelector("#speed")

	speed_dropdown.addEventListener("change", function(){
		speed = this.value
		localStorage.setItem("chord_trainer_speed", speed)
	})

	let option = document.querySelector("#speed option[value='" + speed + "']")

	if(option){
		document.querySelector("#speed").selectedIndex = option.index
	}

	let overlay = document.querySelector("#chords-overlay")

	document.querySelector("#select-chords").addEventListener("click", function(e){
		if(showing_chords){
			overlay.style.display = "none"
			showing_chords = false
			this.textContent = "Select Chords"
		} else {
			overlay.style.display = ""
			showing_chords = true
			this.textContent = "Hide Chords"
		}

		e.stopPropagation()
	})

	document.querySelector("body").addEventListener("click", (e) => {
		
		if(e.target.classList.contains("content")){
			overlay.style.display = "none"
			showing_chords = false
			document.querySelector("#select-chords").textContent = "Select Chords"
		}
	})

	let chord_spans = document.querySelectorAll("#chords-popup span")

	chord_spans.forEach((elem) => {

		if(!elem.classList.contains("filler")){
			elem.addEventListener("click", function(){
				if(elem.classList.contains("disabled")){
					elem.classList.remove("disabled")
					add_to_list(elem)
				} else {
					elem.classList.add("disabled")
					remove_from_list(elem)
				}
			})
		}

	})

	let saved_chords = load_selected_chords()

	if(saved_chords.length){
		selected_chords = []
	
		chords.forEach(elem => {
			saved_chords.forEach(c => {
				if(elem[0] == c){
					selected_chords.push(elem)
				}
			})
		})

		disable_chord_graphics()
	}

	setTimeout(() => {
		select_chord(get_random_chord())
		requestAnimationFrame(select_random_chord)
	}, 2000);
}