// scroll from https://codepen.io/GreenSock/pen/PoNZxqX
// forum https://greensock.com/forums/topic/19420-infinite-carousel-with-draggable/

gsap.registerPlugin(CSSRulePlugin, Draggable);
// patch all methods for scroll polyfill (Safari)
seamless.polyfill();

const viewport = document.querySelector(".viewport");
const wrapper  = document.querySelector("#wrapper");
const boxes    = document.querySelector(".boxes");
const proxy    = document.createElement("div");
const boxes_cont = document.querySelector("#boxes_cont");
const slider_bg = document.querySelector("#slider_bg");
const numBoxes = parts.length;
const boxWidth  = "auto"; 
const imgWidth  = boxWidth  - 6;
const imgHeight = boxHeight - 14;
let viewWidth = innerWidth;
const wrapWidth = numBoxes * boxWidth;
const wrapVal = gsap.utils.wrap(0, wrapWidth);

//constant animations
const endRot = 180;

const startAnim = gsap.to("#circle", {
  rotation: "+=360", 
  ease: "power1.in", 
  duration: 0.5, 
  onComplete: () => loopAnim.play()
});
let ready = false;
const loopAnim = gsap.to("#circle", {
  rotation: "+=360", 
  ease: "none", 
  duration: 300, 
  onComplete: () => {
    if(ready) {
      stopAnim.play();
    } else {
      loopAnim.play(0);
    }
  },
  paused: true
});

//SELECTORS
let blobapath = document.querySelector(".blobAPath");
let blobBPath = document.querySelector(".blobBPath");
let blobB= document.querySelector(".blobb");
let currentScroll = 0;
let isScrollingDown = true;
let tween = gsap.to(".marquee__part", {xPercent: -100, repeat: -1, duration: 10, ease: "linear"}).totalProgress(0.5);
var hotSpot = document.getElementById("flipMe");
let nudge = true;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("preview").addEventListener("click", mouseClickPlayer);
  //INTERACTIONS
  window.addEventListener("scroll", function(){
    if ( window.pageYOffset > currentScroll ) {
      isScrollingDown = true;
    } else {
      isScrollingDown = false;
    }
    
    gsap.to(tween, {
      timeScale: isScrollingDown ? 1 : -1
    });
    currentScroll = window.pageYOffset
  });

  window.addEventListener("resize", resize);

  initMediaPlayer();
  initTimeline();
  mainTimline();

  boxes.onmousewheel = () =>{return false;}
});

function initMediaPlayer(){

  for (let i = 1; i <= numBoxes; i++) {
    const src = "component_bg_img.svg"
    const num = document.createElement("div");
    num.className = "num";
    num.innerText = "Part Name";
    num.marginLeft = "20px";

    const loopContainer = document.createElement("div");
    loopContainer.className = "repeat-container";
    const loopCounter = document.createElement("div");
    loopCounter.className = "repeat"
    loopCounter.innerHTML = parts[i-1].loop;
    parts[i-1].refelem = loopCounter;

    const loopText = document.createElement("p");
    loopText.className = "repeat-text";
    loopText.innerHTML = "Loop";

    loopContainer.appendChild(loopCounter);
    loopContainer.appendChild(loopText);

    const loopInteractions = document.createElement("div");
    loopInteractions.classList="loopinteract"

    const loopUp = document.createElement("button");
    loopUp.className = "up loopinteraction";
    const loopDown = document.createElement("button");
    loopDown.className = "down loopinteraction";

    loopUp.addEventListener('click', () => {
      if(parts[i-1].loop < 9){
        parts[i-1].loop++;
        parts[i-1].refelem.innerHTML = parts[i-1].loop;
        updateDurations();
      }
    });

    loopDown.addEventListener('click', () => {
      if(parts[i-1].loop > 0){
        parts[i-1].loop--;
        parts[i-1].refelem.innerHTML = parts[i-1].loop;
        updateDurations();
      }
    });

    const progress = document.createElement("progress");
    progress.className = "previewProgress";
    progress.value = 0;
    progress.max = 100;

    const index = i - 1;
    const preview = document.createElement("button");
    preview.classList.add("preview","play");
    preview.dataset.index = index;
    preview.onclick = function () { 
      previewPart(index, progress);
    }

    const duration = document.createElement("div");
    duration.className = "previewDuration";
    duration.dataset.index = index;
    
    const box = document.createElement("div");
    box.className = "box";
    parts[i-1].ref_box = box;

    switch(i) {
      case 1:
        num.innerText = "Loop 1";
        break;
        num.innerText = "Default";
    }

    gsap.set(box, { x: i * boxWidth, width: boxWidth, height: boxHeight });

  }

}

function updateProgress() {
  animation.progress(wrapVal(this.x) / wrapWidth);
}

function resize() {
  viewWidth = viewport.offsetWidth;
}

//TIMELINES
function initTimeline(){
  //SET TWEENS
  gsap.set("#circle", {autoAlpha:0, zIndex:-10})
  gsap.set("#vivaLogo, #header, #presets, #boxes_cont, #master_controls, .marquee, #footer", {autoAlpha:0});
  gsap.set("#header, #info_cta, #progress_cont, #pre2, #slider_cont", {autoAlpha:0});
  gsap.set("#flipMe", {autoAlpha:1});
  gsap.set("#content", {perspective:800});
  gsap.set("#wrapper_cont", {transformStyle:"preserve-3d"});
  gsap.set("#wrapper_back", {rotationY:-180});
  gsap.set(["#glow-card", "#wrapper_back"], {backfaceVisibility:"hidden"});
  gsap.set(".marquee__inner", {xPercent: -50});
  gsap.set("#wrapper", {width:300, height:250, autoAlpha:1});
  gsap.set("#wrapper_bg", {autoAlpha:0});
  gsap.set("#flipMe_return", {autoAlpha:0});
  gsap.set("#flipMe_return_direx", {autoAlpha:0});
  gsap.set("#content_back_img_direx", {autoAlpha:0});
  gsap.set("#stageBlock", {autoAlpha:1}); 
  gsap.set("#preview", {autoAlpha:0},0)
  gsap.set('.loader, #wrapper_bg p', {opacity: 0}); 
}
var tlStageBlock
function mainTimline() {
  tlStageBlock = gsap.timeline({delay:1});
  tlStageBlock.timeScale( 2 ); 
  tlStageBlock.to("#stageBlock", {duration:2, autoAlpha:0},0);
  tlStageBlock.from("#wrapper", {duration:1, autoAlpha:0}),1;
  tlStageBlock.to("#circle", {duration:2, autoAlpha:1},2.5);
  tlStageBlock.to("#header, #presets, #pre2, #boxes_cont, #master_controls, #progress_cont, .marquee, #footer, #slider_cont", {duration:3, stagger:0.35, autoAlpha:1, delay:1, ease:"Power4.easeInOut"},.5);
  tlStageBlock.to("#wrapper", {duration:0.25, height:"100%", width:"100%", ease:"Power1.easeOut"},0);
  tlStageBlock.to('.loader, #wrapper_bg p', {duration:0.25,opacity: 0},0);

  document.getElementById('wrapper_bg').style.display = "none";
  nudge = null;
  gsap.to("#slider_cont",{duration:1, autoAlpha:1, delay:2, oncomplete: () => {
    setSliderVisibility();
    initialSliderPositionAndBounds();
  }});
  tlStageBlock.addLabel("myLabel", ">");
}

function help(){ 
  gsap.to(".box", {duration:0.5,autoAlpha:0})
}

var tlExpand = null;

function mouseClickPlayer(){

  tlExpand = gsap.timeline();
  tlExpand.timeScale( 2 ); 
  tlExpand.to("#preview", {duration:0.25, autoAlpha:0},0)
  tlExpand.to("#wrapper", {duration:0.25, height:"100%", width:"100%", ease:"Power1.easeOut"},0)
  tlExpand.to('.loader, #wrapper_bg p', {duration:0.25,opacity: 0});
  tlExpand.to("#header, #presets, #pre2, #boxes_cont, #master_controls, #progress_cont, .marquee, #footer, #slider_cont", {duration:3, stagger:0.2, autoAlpha:1, delay:2, ease:"Power4.easeInOut"},1);
  tlStageBlock.seek("myLabel");

  document.getElementById('wrapper_bg').style.display = "none";
  nudge = null;
  gsap.to("#slider_cont",{duration:1, autoAlpha:1, delay:2, oncomplete: () => {
    setSliderVisibility();
    initialSliderPositionAndBounds();
  }});
}

function mouseClickOffPlayer(){
  console.log("YES");
  gsap.to("#wrapper", {duration:0.2, width:336, height:280})
}


function teaseBoxes(){
  var tlTease = gsap.timeline();
}

function sendLoadedTrack(percent){

  if(percent == 100){
    setTimeout(() => {
      mouseClickPlayer();
    },250);
  }
}

var draggableSlider = Draggable.create('#slider', {
  type: "y",
  trigger: "#slider",
  inertia: true,
  onDrag: updateSliderProgress,
  onThrowUpdate: updateSliderProgress,
  bounds: {minY: 0, maxY: getSliderHeight()},
  snap: {
    y: (y) => {
      return Math.round(y / boxHeight) * boxHeight;
    }
  }
});

Draggable.create(proxy, {
  type: "y",
  trigger: "#boxes_cont",
  inertia: true,
  onDrag: updateBoxesProgress,
  onThrowUpdate: updateBoxesProgress,
  snap: {
    y: (y) => {
      return Math.round(y / boxHeight) * boxHeight;
    }
  }
});

function getCssVariableWithoutPixel(name) {
  var val = getComputedStyle(document.documentElement).getPropertyValue(name);
  if(val.includes('px')) val = val.replace('px')
  return Number.parseFloat(val);
}

function getSliderHeight(){
  return slider_bg.offsetHeight - getCssVariableWithoutPixel('--slider-size');
}

var origin_sliderHeight = getSliderHeight();
var origin_slider_y = 0;
var origin_boxes_y = 0;
function updateBoxesProgress() {
  if(Tone.Transport.state == "started" || player.state == "started"){
    //while playing ... no draggable boxes
  }else{
    var val = Math.abs(origin_boxes_y - this.y);
    if(this.y > origin_boxes_y) val = val * -1;
    if(reverseScrolling) val = val * -1;

    var sliderHeight = getSliderHeight();
    var boxesHeight = ((boxes.offsetHeight + 30) - boxes_cont.offsetHeight);
    var factor = sliderHeight / boxesHeight;
    var newSliderY = draggableSlider[0].y + (val * factor);
    if(newSliderY < 0) newSliderY = 0;
    if(newSliderY > sliderHeight) newSliderY = sliderHeight;

    TweenLite.set(draggableSlider[0].target, {y:newSliderY, onUpdate:draggableSlider[0].update, onUpdateScope:draggableSlider[0]});

    seamless.windowScrollBy(boxes_cont, { top: val});
    origin_boxes_y = this.y;
    origin_slider_y = newSliderY;
  }
}

function updateSliderProgress() {
  var val = Math.abs(origin_slider_y - this.y);
  if(this.y < origin_slider_y) val = val * -1;

  var sliderHeight = getSliderHeight();
  var boxesHeight = ((boxes.offsetHeight + 30)  - boxes_cont.offsetHeight);
  var factor = boxesHeight / sliderHeight;

  seamless.windowScrollBy(boxes_cont, { top: val * factor});
  origin_slider_y = this.y;
  origin_boxes_y = val * factor;
}

function setSliderVisibility(){
  if(slider_bg.offsetHeight >= boxes.offsetHeight){
    slider_cont.classList.add("hide")
  }else{
    slider_cont.classList.remove("hide")
  }
}

function initialSliderPositionAndBounds() {
  var sliderHeight = getSliderHeight();
  draggableSlider[0].applyBounds({minY: 0, maxY:sliderHeight});
  var factor = sliderHeight / origin_sliderHeight;
  var newSliderY = origin_slider_y * factor;
  if(newSliderY < 0) newSliderY = 0;
  if(newSliderY > sliderHeight) newSliderY = sliderHeight;

  TweenLite.set(draggableSlider[0].target, {y:newSliderY, onUpdate:draggableSlider[0].update, onUpdateScope:draggableSlider[0]});
  origin_slider_y = newSliderY;
  origin_sliderHeight = sliderHeight;
}

function debounce(timer, func, timeout = 250){
  clearTimeout(timer);
  timer = setTimeout(func, timeout);
  return timer;
}

let debounceTimer = null;
window.addEventListener('resize', () => {
  debounceTimer = debounce(debounceTimer, () => {
    setSliderVisibility();
    initialSliderPositionAndBounds();
  })
})