
// If you want to create OBJKT's with different seeds,
// you can access the creator and viewer wallet ids.
// This values will only be injected once the piece has been minted
// they will not work locally.

// http://0.0.0.0:8000/?creator=tz1fNZaC8GHomZFYpEDuHob2u5reJBZsyP9D&viewer=tz1fNZaC8GHomZFYpEDuHob2u5reJBZsyP9D&objkt=135517

const creator = new URLSearchParams(window.location.search).get('creator')
// NOTE: if the user is viewing the page while unsynced,
// the viewer variable will return a string of value "false" (NOT a boolean)
const viewer = new URLSearchParams(window.location.search).get('viewer')
const owner = new URLSearchParams(window.location.search).get("owner");
// The ID of the OBJKT is also passed via the URL parameters
const objkt = new URLSearchParams(window.location.search).get('objkt')

var isOwned = false;
let playToggle = document.querySelector("#play-toggle");
let downloadButton = document.querySelector("#download");
let purchaseElement = document.querySelector("#purchase");
let status = document.querySelector("#status");
let slider_cont = document.querySelector("#slider_cont");
let presetElements = [];
let elements = [];

Tone.loaded().then(function () {
    playToggle.disabled = false;
});

function render() {
}

var audio = document.getElementById("myAudio"); 
audio.pause();

audio.addEventListener("ended", function(e){
    updatePlayClass();

}, false);

function playAudio() { 
    if (playToggle.classList == "play") {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayClass();
} 

function updatePlayClass() {

        if (playToggle.classList == "play") {
            playToggle.classList.remove("play")
            playToggle.classList.add("stop")
        } else {
            playToggle.classList.remove("stop")
            playToggle.classList.add("play")
        }
}

function pointerEventsOn(){
    gsap.set("#flipMe, #flipMe_return, #flipMe_return_direx", {pointerEvents:"auto"});
}

function pointerEventsOff(){
    gsap.set("#flipMe, #flipMe_return, #flipMe_return_direx", {pointerEvents:"none"});
}

var tlFlipCard = gsap.timeline({paused: true});
tlFlipCard.to("#wrapper_cont", {duration:0.5, rotationY:"+=180",ease:"Back.easeInOut"})

let testBool = true;
let showDirections = false;

function toggle() {


    var delay = 0.25;

    if ((testBool == true) && (showDirections == false)) {

        pointerEventsOff();
        gsap.set("#flipMe", {pointerEvents:"none", autoAlpha:0, visibility:"hidden"});
        gsap.to("#flipMe_return", {duration:0, autoAlpha:0});

        tlFlipCard.play();
        gsap.set("#content_back_img", {autoAlpha:0});  
        gsap.set("#content_back_img_direx", {autoAlpha:1});  
        gsap.to("#flipMe_return_direx", {duration:0.5, opacity:1, delay:.5,visibility:"visible", onComplete:pointerEventsOn});

    } 
    else if ((testBool == true) && (showDirections == true)) {} 
    else {

        pointerEventsOff();
        gsap.set("#flipMe_return_direx", {pointerEvents:"none", autoAlpha:0, visibility:"hidden"});
        gsap.set("#flipMe", {visibility:"visible"});
        pointerEventsOff();
        gsap.to("#flipMe", {duration:0.5, opacity:1, delay:.5,visibility:"visible", onComplete:pointerEventsOn});
        tlFlipCard.reverse();
    }

    testBool = !testBool;
}

downloadButton.onclick = function () {
    render();
}

function makeDownload(buffer) {

    var newFile = URL.createObjectURL(bufferToWave(buffer, 0, buffer.length));

    var downloadLink = document.getElementById("download-link");
    downloadLink.href = newFile;
    downloadLink.download = downloadName;

}

//HICETNUNC VERIFICATION

function validateToken(viewer, objkt){

  const url = 'https://api.tzkt.io/v1/bigmaps/511/keys?key.address=' + viewer + '&key.nat=' + objkt + '&select=value';
  axios.get(url)
  .then(result => {
      let count = result.data ?? [];
      isOwned = count.length > 0;

      console.log(isOwned + " isOwned")

      if(isOwned){

                /* this is an example of showing or hiding content based on the token ownership */
                console.log("DOWNLOADS ENABLE")
          
                downloadButton.style.display = 'block';
                purchaseElement.style.display = 'none';
          
              } else {
          
                console.log("COLLECT TO DOWNLOAD")
          
                downloadButton.style.display = 'none';
                purchaseElement.style.display = 'block';
          
              }

  })
  .catch(err => console.log('error', err));
}

// setInterval(() => {
//   const progress = Tone.Transport.ticks / Tone.Time(totalLength()).toTicks();
//   const width = Math.floor(progress * 300);
//   // document.getElementById("progress").style.width = width + 'px';

//   if (playerStartTime > 0) {
//       const previewWidth = Math.floor(previewProgress() * 100);
//       previewProgressElement.style.width = previewWidth + '%';
//   }
  

// }, 16);

      console.log(viewer + " viewer")
      console.log(objkt + " objkt")


validateToken(viewer, objkt);
// async function getTokenOwner(viewer, contract, objkt){
  
//   // console.log("hit the getTokenOwner")
//   // console.log(contract + " contract")
//   // console.log(objkt + " objkt")
//   // console.log(viewer + " viewer")

//     return new Promise((resolve, reject) => {
//       const url = `https://api.ithacanet.tzkt.io/v1/contracts/${contract}/bigmaps/assets.ledger/keys?key.eq=${objkt}&limit=1&select=value`
//   // console.log("hit the return")
//   // console.log(contract + " contract")
//   // console.log(objkt + " objkt")
//   // console.log(viewer + " viewer")

//       if (contract && objkt && viewer) {

//         fetch(url)
//           .then(response => response.text())
//           .then(resultText => {
//             const resultList = JSON.parse(resultText);

//             console.log(resultList);
//             if (resultList && resultList.length > 0) {
//               const result = resultList[0];
//               resolve(result);
//             } else {
//               resolve(null);
//             }
//           });
//       } else {
//         resolve(null);
//       }
//     });
//   }

//   function handleTokenOwnershipValidated(isOwner) {

//     if(isOwner){

//       /* this is an example of showing or hiding content based on the token ownership */

//       console.log("DOWNLOADS ENABLED")

//       downloadButton.style.display = 'block';
//       purchaseElement.style.display = 'none';

//     } else {

//       console.log("COLLECT TO DOWNLOAD")

//       downloadButton.style.display = 'block';
//       purchaseElement.style.display = 'none';

//     }

//   }
  
//   document.addEventListener("DOMContentLoaded", async () => {

//     const urlParams = new URLSearchParams(window.location.search);

//   //   console.log(urlParams)

//     if (urlParams) {
        
//       const viewer = urlParams.get('viewer');
//       const contract = urlParams.get('contract');
//       const objkt = urlParams.get('objkt');

//       console.log(viewer + " viewer")
//       console.log(contract + " contract")
//       console.log(objkt + " objkt")

//       const owner = await getTokenOwner(viewer, contract, objkt);
//       const isOwner = viewer && owner && viewer === owner;

//       console.log(owner + " owner")
//       console.log(isOwner + " isOwner")

//       handleTokenOwnershipValidated(isOwner);
//     }

//   });