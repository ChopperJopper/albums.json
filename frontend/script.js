// vores diver
const profil = document.getElementById("profil")
const startSide = document.getElementById("start_side")
const searchInput = document.getElementById("search_bar")
const searchResult = document.getElementById("search_result")
const trackList = document.getElementById("track_list")
// vores knapper
const profBut = document.getElementById("prof_but")
const backBut = document.getElementById("back_but")
const genreBut = document.querySelectorAll(".genre_but")

// database arrays

startSide.hidden = false
loadGenre()

searchInput.addEventListener("input", search);

  

async function search() {
  const text = searchInput.value.trim().toLowerCase();

  // Tøm listen
 

  // Skjul resultater hvis feltet er tomt
  if (text === "") {
    trackList.innerHTML = "";
    searchResult.hidden = true;
    return;
  }
  searchResult.hidden = false;

  // Gå alle album og alle sange igennem
  const resultat = await fetch('/api/tracks')
  const tracks = await resultat.json()

  trackList.innerHTML = "";

  for (const track of tracks) {
    if (track.title.toLowerCase().startsWith(text)) {
      addSongSearch(track);
    }
  }
}
function addSongSearch(track) {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.textContent = track.title;


  button.addEventListener("click", function(){
    valgSang(track.id)
  });
  li.appendChild(button);
  trackList.appendChild(li);
}

function valgSang(trackId){ // logger hvilket id vi har valgt.
  console.log(trackId)
}

async function loadGenre() {
  const resultat = await fetch('/api/genres')
  const genres = await resultat.json()

  for(const genre of genres)
    addGenre(genre)
}
function addGenre(genre) {
  const button = document.createElement("button");
  button.textContent = genre.name;

  button.addEventListener("click", function () {
    vaelgGenre(genre.id)
  })

  startSide.appendChild(button);
}

async function vaelgGenre(genreId) {
  console.log("Valgt genre med id", genreId);
  startSide.hidden = true;
  const resultat = await fetch(`/api/genres/${genreId}/randomtrack`);

  console.log(resultat);
}

profBut.addEventListener("click", () => {
    profil.hidden = false  
})

backBut.addEventListener("click", () => {
    profil.hidden = true 
})  


