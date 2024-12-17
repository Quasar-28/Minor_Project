// Creating an HTMLAudio Element
let currentSong = new Audio();

let songs;
let currFolder;

//Function for songtime
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Define the decodeHTMLEntities function
function decodeHTMLEntities(text) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = text;
  return tempElement.textContent || tempElement.innerText || "";
}

// async function to get songs from songs folder
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5501/${folder}/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `
           <li>
               <img class="invert" width="34" src="/img/music.svg" alt="">
               <div class="info">
                   <div>${decodeURIComponent(song)}</div>
                   
               </div>
               <div class="playnow">
                   <span style = "padding: 8px">Play Now</span>
                   <img class="invert" src="/img/play.svg" alt="">
               </div>
           </li>`;
  }

  //attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerText)
      // playMusic(e.querySelector(".info").firstElementChild.innerText)
      // let track = decodeHTMLEntities(e.querySelector(".info").firstElementChild.innerHTML)
      // playMusic(track)
      // playMusic(e.querySelector(".info").firstElementChild.innerHTML.replace("&amp;", "&"))
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs;
}

// Functional expression to play tracks
const playMusic = (track, pause = false) => {
  let encodedTrack = decodeHTMLEntities(track);
  // console.log(encodedTrack)
  currentSong.src = `/${currFolder}/` + encodedTrack;
  if (!pause) {
    currentSong.play();
    play.src = "/img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Function to display album
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5501/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-1)[0];
      // Get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  width="60" height="60" color="#000000" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#3BE477" />
                  <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
                </svg>
              </div>

              <img src="/songs/${folder}/cover.jpg" alt="">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
          </div>`;
    }
  }

  // let folders = []
  // Array.from(anchors).forEach(async (e) => {
  //   // console.log(e.href)
  //   if (e.href.includes("/songs/")) {
  //     let folder = e.href.split("/").slice(-1)[0];
  //     //Get the metadata of the folder
  //     let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
  //     let response = await a.json();
  //     console.log(response);
  //     cardContainer.innerHTML =
  //       cardContainer.innerHTML +
  //       `<div data-folder="${folder}" class="card">
  //           <div class="play">
  //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" color="#000000" fill="none">
  //               <circle cx="12" cy="12" r="10" fill="#3BE477" />
  //               <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
  //             </svg>
  //           </div>
  //           <img src="/songs/${folder}/cover.jpg" alt="">
  //           <h2>${response.title}</h2>
  //           <p>${response.description}</p>
  //       </div>`;
  //   }
  // });

  // Load the playlist on click event on card
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(decodeURIComponent(songs[0]));
    });
  });
}

// Main function
async function main() {
  // Get the list of all the songs
  await getSongs("songs/ncs");
  let defaultSong = decodeURIComponent(songs[0]);
  playMusic(defaultSong, true);
  // For displaying all the albums on the page
  displayAlbums();

  // Attach an event listener to play , previous and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });
  // Listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // EventListener for seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // Click event on hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  //Click event on close icon
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //Eventlistener for prev  button
  previous.addEventListener("click", () => {
    // console.log("prev button clicked ")
    let index = songs.indexOf(
      currentSong.src.split("/").slice(-1)[0].replace("&", "%26")
    );
    // // console.log(songs,index)
    if (index - 1 >= 0) {
      playMusic(decodeURIComponent(songs[index - 1]));
    }
  });
  //EventListener for next button
  next.addEventListener("click", () => {
    // console.log("next button clicked ")
    let index = songs.indexOf(
      currentSong.src.split("/").slice(-1)[0].replace("&", "%26")
    );
    if (index + 1 < songs.length) {
      playMusic(decodeURIComponent(songs[index + 1]));
    }
  });

  //Event for volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //EventListener for mute
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("/img/volume.svg")) {
      e.target.src = e.target.src.replace("/img/volume.svg", "/img/mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("/img/mute.svg", "/img/volume.svg");
      currentSong.volume =
        parseFloat(
          document.querySelector(".range").getElementsByTagName("input")[0]
            .value
        ) / 100;
    }
  });
}
main();
