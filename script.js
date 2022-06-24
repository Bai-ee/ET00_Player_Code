
// If you want to create OBJKT's with different seeds,
// you can access the creator and viewer wallet ids.
// This values will only be injected once the piece has been minted
// they will not work locally.

// http://0.0.0.0:8000/?creator=tz1fNZaC8GHomZFYpEDuHob2u5reJBZsyP9D&viewer=tz1fNZaC8GHomZFYpEDuHob2u5reJBZsyP9D&objkt=135517

const creator = new URLSearchParams(window.location.search).get('creator')
// NOTE: if the user is viewing the page on hicetnunc while unsynced,
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

document.addEventListener("DOMContentLoaded", () => {

    for (var i = 0, presetElement; presetElement = presetElements[i]; i++) {
        presetElement.addEventListener('click', function() {
            for(var i = 0; i < presetElements.length; i++){
                presetElements[i].classList.remove('active');
            }
            this.classList.add('active');

            Tone.Transport.stop();
            loadPreset(this.dataset['value']);
            updatePlayClass();

            setTogglePlayGlowAndPartsActive();
        });
    }

    for (var i = 0, element; element = elements[i]; i++) {
        element.addEventListener("click", function (event) {
            Tone.Transport.stop();
            updateDurations();
            schedulePlayers();
            updatePlayClass();

            setTogglePlayGlowAndPartsActive();
        })
    }

    document.getElementById('masterUp').addEventListener("click", loopMasterUp);
    document.getElementById('masterDown').addEventListener("click", loopMasterDown);
    // console.log("init script");
});
function setTogglePlayGlowAndPartsActive() {
    var elem = document.querySelector("#play-toggle");

    if (Tone.Transport.state == "started" || player.state == "started") {
        if( document.querySelector('#glow-hover-play')) {
            document.querySelector('#glow-hover-play').id = "glow-hover-stop";
            elem.classList.remove("play")
            elem.classList.add("stop")
            slider_cont.classList.remove("play")
            slider_cont.classList.add("stop")
            boxes_cont.classList.add("pointer-events-none")

            for(var i = 0; i < parts.length; i++){
                parts[i].ref_box.classList.add("isnotactive");
            }
        }
    } else {
        if(document.querySelector('#glow-hover-stop')){
            document.querySelector('#glow-hover-stop').id = "glow-hover-play";
            elem.classList.remove("stop")
            elem.classList.add("play")
            slider_cont.classList.remove("stop")
            slider_cont.classList.add("play")
            boxes_cont.classList.remove("pointer-events-none")

            for(var i = 0; i < parts.length; i++){
                parts[i].isactive = false;
                parts[i].ref_box.classList.remove("isactive");
                parts[i].ref_box.classList.remove("isnotactive");
            }
        }
    }
}

function enableElements() {
    for (var i = 0, element; element = elements[i]; i++) {
        element.disabled = false
    }
}

let trackRepeatElement = document.getElementById("trackRepeat");
var trackRepeat = Number.parseInt(trackRepeatElement.innerHTML);

function loopMasterUp() {
    if(trackRepeat < 9){
        trackRepeat++;
        trackRepeatElement.innerHTML = trackRepeat;
        changeMasterLoop();
    }
}
function loopMasterDown() {
    if(trackRepeat > 0){
        trackRepeat--;
        trackRepeatElement.innerHTML = trackRepeat;
        changeMasterLoop();
    }
}

function changeMasterLoop(){
    Tone.Transport.stop();
    updateDurations();
    schedulePlayers();
    updatePlayClass();

    setTogglePlayGlowAndPartsActive();
}

const player = new Tone.Player().toDestination();
player.loop = true;


const buffers = parts.map(part => new Tone.Buffer({ url: trackDir + part.file }));

var activeBufferIndex = -1;
var renderedBufferIndex = 99;

Tone.loaded().then(function () {
    status.innerHTML = "MASTER TRACK"
    playToggle.disabled = false;
    enableElements();
    loadPreset(0);
    console.log("Tone loaded");
    console.log("LFG");
});

function loadPreset(index) {
    const preset = presets[index];
    for (var i = 0; i < parts.length ; i++) {
        parts[i].loop = preset[i] ?? 0;
        parts[i].refelem.innerHTML = parts[i].loop;
    }
    presetLoaded();
}

async function presetLoaded() {

    updateDurations();
    schedulePlayers();
}

function render() {
    console.log("Download")
    status.innerHTML = "Render"
    const renderingPromise = Tone.Offline(({ transport }) => {
        transport.bpm.value = bpm;

        var playhead = 0;

        for (var i=0; i<trackRepeat; i++) {
            buffers.forEach((buffer, i) => {
                if (parts[i].loop == 0) { return }

                var partPlayer = new Tone.Player(buffer)
                partPlayer.loop = parts[i].loop > 1;
                var loopLength = parts[i].length * parts[i].loop;
                partPlayer.toDestination().sync().start(playhead + "m").stop(playhead + loopLength + "m");
                playhead += loopLength
            });
        }

        transport.start();
    }, Tone.Time(totalLength()))

    renderingPromise.then(buffer => {
        status.innerHTML = "Master Track"
        makeDownload(buffer.get())
    });

    renderingPromise.then(() => {
        var downloadLink = document.getElementById("download-link");
        downloadLink.click();
    });
}


Tone.Transport.bpm.value = bpm;

var players = buffers.map((buffer, i) => {
    var partPlayer = new Tone.Player(buffer)
    partPlayer.loop = parts[i].loop > 1;
    partPlayer.toDestination().sync()
    return partPlayer;
});

function schedulePlayers() {
    players.forEach((partPlayer) => {partPlayer.unsync(); partPlayer.sync()});
    var playhead = 0;
    for (var i=0; i<trackRepeat; i++) {
        players.forEach((partPlayer, i) => {
            if (parts[i].loop == 0) { 
                return;
            }

            partPlayer.loop = parts[i].loop > 1;
            var loopLength = parts[i].length * parts[i].loop;
            partPlayer.start(playhead + "m").stop(playhead + loopLength + "m");
            playhead += loopLength
        }); 
    }   
}

var playerStartTime = 0;
var previewProgressElement;

function previewPart(index, element) {
    if (Tone.Transport.state == "started") {
        Tone.Transport.stop();
    }

    if (activeBufferIndex != index) {
        player.stop();
        activeBufferIndex = index;
        player.buffer = buffers[index];
    }
    
    if (player.state == "started") {
        playerStartTime = 0;
        player.stop()
    } else {
        playerStartTime = Tone.now();
        previewProgressElement = element;
        player.start();
    }

    resetPreviewProgress();
    updatePlayClass();
}

function resetPreviewProgress(index) {
    var durationElements = document.querySelectorAll(".previewProgress");
    
    for (var i = 0, element; element = durationElements[i]; i++) {
        element.value = 0;
    }
}

function previewProgress() {
    if (playerStartTime == 0 || player.state == "stopped") {
        return 0;
    }
    return (Tone.now() - playerStartTime) % player.buffer.duration / player.buffer.duration;
}



playToggle.onclick = function () {
    //---- START ----
    //when using the visualizer remove this comment and use pts.js play for the audio
    //startVisualizer();
    //or 
    //use this for not showing the visualizer and playing only the master-audio
    Tone.start();
    //---- END ----

    if (activeBufferIndex != renderedBufferIndex) {
        activeBufferIndex = renderedBufferIndex;
        playerStartTime = 0;
        player.stop();
        resetPreviewProgress();
    }

    if (Tone.Transport.state == "started") {
        Tone.Transport.stop();
    } else {
        Tone.Transport.start()
        Tone.Transport.scheduleOnce(autoStop, '+' + totalLength());
    }
    updatePlayClass();
    goToFirst();
}

autoStop = function() {
    Tone.Transport.stop();
    updatePlayClass();
    goToFirst();
}

function scrollToPart(idx){
    seamless.elementScrollIntoView(parts[idx].ref_box, {
        behavior: "smooth",
        block: "start",
        inline: "start",
    });
}

function goToFirst() {
    lastIndex = 0;
    scrollToPart(0);
    setTogglePlayGlowAndPartsActive();
    TweenLite.set(draggableSlider[0].target, {y:0, onUpdate:draggableSlider[0].update, onUpdateScope:draggableSlider[0]});
}

playToggle.dataset.index = renderedBufferIndex;

function updatePlayClass() {
    const isPlaying = Tone.Transport.state == "started" || player.state == "started";

    var previewElements = document.querySelectorAll(".preview");
    
    for (var i = 0, element; element = previewElements[i]; i++) {
        if (element.dataset.index == activeBufferIndex && isPlaying) {
            element.classList.remove("play")
            element.classList.add("stop")
        } else {
            element.classList.remove("stop")
            element.classList.add("play")
        }
    }
}

function updateDurations() {
    var durationElements = document.querySelectorAll(".previewDuration");
    
    for (var i = 0, element; element = durationElements[i]; i++) {
        let index = element.dataset.index;
        let duration = previewDuration(index);
        element.innerHTML = formatDuration(duration);
    }

    let totalDurationElement = document.querySelector("#totalDuration");
    let totalDuration = trackDuration();
    totalDurationElement.innerHTML = formatDuration(totalDuration);

    let progress_total = document.querySelector("#progress_total");
    // progress_total.innerHTML = formatDuration(totalDuration);

}

function previewDuration(index) {
    let duration = buffers[index].duration * parseInt(parts[index].loop);
    return duration
}
function mainLoopDuration() {
    return parts.reduce((sum, { loop }, index) => sum + buffers[index].duration * loop, 0);
}
function trackDuration() {
    return mainLoopDuration() * trackRepeat;
}

function trackLoopLength() {
    return parts.reduce((sum, { length, loop }) => sum + length * loop, 0) + 'm';
}

function totalLength() {
    return parts.reduce((sum, { length, loop }) => sum + length * loop, 0) * trackRepeat + 'm';
}

function formatDuration(duration) {
    let minutes = Math.floor(duration / 60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = Math.floor(duration - (minutes * 60));
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ":" + seconds;
}

function pointerEventsOn(){
    gsap.set("#flipMe, #flipMe_return, #flipMe_return_direx", {pointerEvents:"auto"});
}

function pointerEventsOff(){
    gsap.set("#flipMe, #flipMe_return, #flipMe_return_direx", {pointerEvents:"none"});
}

function preview() {
    pointerEventsOff()
}

function stopPreview() {
    pointerEventsOff()
}

document.getElementById("preview").addEventListener("mouseover", preview);
document.getElementById("preview").addEventListener("mouseout", stopPreview);

var tlFlipCard = gsap.timeline({paused: true});
tlFlipCard.to("#wrapper_cont", {duration:0.5, rotationY:"+=180",ease:"Back.easeInOut"})

let testBool = true;
let showDirections = false;
// gsap.set("#flipMe", {visibility:"hidden"});
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
    else if ((testBool == true) && (showDirections == true)) {

    } 
    else {

        pointerEventsOff();
        gsap.set("#flipMe_return_direx", {pointerEvents:"none", autoAlpha:0, visibility:"hidden"});

        gsap.set("#flipMe", {visibility:"visible"});
        console.log("toggle 3");
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
  
console.log(viewer + " viewer")
console.log(objkt + " objkt")

const progressElem_curr = document.getElementById('progress_current');
const progressElem = document.getElementById("progress");
let lastIndex = 0;
setInterval(() => {
    const progress = Tone.Transport.ticks / Tone.Time(totalLength()).toTicks();
    const width = Math.floor(progress * 100);

    let seconds = trackDuration() * progress;

    if(Number.isFinite(width)){

        let loopDuration = mainLoopDuration();
        var current = 0;
        let currentMainLoop = 1;
        while(seconds > (loopDuration * currentMainLoop))
        {
            current += loopDuration;
            currentMainLoop++;
        }

        if(seconds > 0){
            for(var i = 0; i < parts.length; i++){
                current += previewDuration(i);
                if(seconds < current){
                    if(!parts[i].isactive){
                        scrollToPart(i);
                        parts[lastIndex].isactive = false;
                        parts[lastIndex].ref_box.classList.remove("isactive");
                        parts[lastIndex].ref_box.classList.add("isnotactive");
                        parts[i].ref_box.classList.remove("isnotactive");
                        parts[i].ref_box.classList.add("isactive");
                        parts[i].isactive = true;
                        lastIndex = i;
                    }
                    break;
                }
            }
        }
    }

    if (playerStartTime > 0) {
        const previewWidth = Math.floor(previewProgress() * 100);
        previewProgressElement.value = previewWidth;
    }

}, 200);

validateToken(viewer, objkt)

