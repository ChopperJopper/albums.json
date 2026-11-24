// vores diver
const profil = document.getElementById("profil")
const startSide = document.getElementById("start_side")
const searchInput = document.getElementById("search_bar")
const searchResult = document.getElementById("search_result")
const trackList = document.getElementById("track_list")
const mainDiv = document.getElementById("main_div")
const forside = document.getElementById("for_side")
const sangTitel = document.getElementById("sang_titel")
// vores knapper
const profBut = document.getElementById("prof_but")
const backBut = document.getElementById("back_but")
const genreBut = document.querySelectorAll(".genre_but")
const profilButs = document.getElementById("profil_buts")
const nextBut = document.getElementById("next_but")
const prevBut = document.getElementById("prev_but")

let que = []
let queposition = 0
// database arrays

startSide.hidden = false;
forside.hidden = true;
profilButs.hidden = true;
loadGenre();

searchInput.addEventListener("input", search);

  

async function search() {
  const text = searchInput.value.trim();

  // Skjul resultater hvis feltet er tomt
  if (text === "") {
    trackList.innerHTML = "";
    searchResult.hidden = true;
    return;
  }

  // Søger direkte i databasen via vores backend-endpoint
  const resultat = await fetch(`/api/tracks/search?q=${encodeURIComponent(text)}`);
  const tracks = await resultat.json();

  // Vis resultatområdet og ryd gamle resultater
  searchResult.hidden = false;
  trackList.innerHTML = "";

  for (const track of tracks) {
    addSongSearch(track);
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
  forside.hidden = false;
  const resultat = await fetch(`/api/genres/${genreId}/randomtrack`);
  que = await resultat.json()
  console.log(que);
  sangTitel.innerHTML = que[queposition].title;
  nextBut.addEventListener("click", () => {
        queposition = queposition + 1;
        sangTitel.innerHTML = que[queposition].title;
  })
  prevBut.addEventListener("click", () => {
        queposition = queposition - 1;
        sangTitel.innerHTML = que[queposition].title;
  })
}

async function profilBut(){
  const resultat = await fetch(`/api/users`)
  const users = await resultat.json()

  for (const user of users) {
    const button = document.createElement("button");
    button.textContent = user.name;
    button.addEventListener("click", function() {
      loadProfil(user.id)
      button.hidden = true;
    });
   profilButs.appendChild(button)
  } 
}

  function loadProfil(userId) {
  console.log("valgt bruger med id", userId)
  profilButs.hidden = true;
  profilButs.innerHTML = "";
  }

profBut.addEventListener("click", () => {
    profil.hidden = false; 
    forside.hidden = true; 
    profilButs.hidden = false;
    profilBut();
});

backBut.addEventListener("click", () => {
    profil.hidden = true;
    forside.hidden = false; 
    profilButs.innerHTML = "";
});




