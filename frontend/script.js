// vores diver
const profil = document.getElementById("profil")
const startSide = document.getElementById("start_side")

// vores knapper
const profBut = document.getElementById("prof_but")
const backBut = document.getElementById("back_but")
const genreBut = document.querySelectorAll(".genre_but")

// database arrays

startSide.hidden = false
profBut.hidden = true

profBut.addEventListener("click", () => {
    profil.hidden = false  
})

backBut.addEventListener("click", () => {
    profil.hidden = true 
})  

genreBut.forEach((allButton) => {
    allButton.addEventListener("click", () => {
        startSide.hidden = true
        profBut.hidden = false
    })
})  

onGetTracks()
