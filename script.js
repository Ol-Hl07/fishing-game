/* ===== SAVE ===== */
function loadGame(){
  try{ return JSON.parse(localStorage.getItem("fishingGame")) }
  catch{ return null }
}
function saveGame(){
  localStorage.setItem("fishingGame", JSON.stringify(player));
}

/* ===== PLAYER ===== */
let player = loadGame() || {
  fish:{},
  coins:0,
  level:1,
  location:0
};

/* ===== LOCATIONS ===== */
const locations=[
  {
    name:"🌊 Озеро",
    bg:"https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    fish:["Карась","Окунь"]
  },
  {
    name:"🌅 Річка",
    bg:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    fish:["Короп","Щука"]
  },
  {
    name:"🌌 Море",
    bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:["Тунець","Марлін"]
  }
];

/* ===== UI ===== */
const rodEl = document.createElement("div");
rodEl.className = "rod";
rodEl.innerText = "🎣";
document.body.appendChild(rodEl);

const floatEl = document.createElement("div");
floatEl.className = "float";
floatEl.innerText = "🎈";
document.body.appendChild(floatEl);

const water = document.createElement("div");
water.className = "water";
water.innerHTML = `<div class="wave"></div>`;
document.body.appendChild(water);

function setBackground(){
  document.body.style.backgroundImage =
    `url('${locations[player.location].bg}')`;
}

function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===== АНИМАЦИЯ ЛОВЛИ ===== */
function catchFish(){
  rodEl.classList.add("cast");
  floatEl.classList.add("show");

  setTimeout(()=>{
    const f = locations[player.location].fish;
    const fish = f[Math.floor(Math.random()*f.length)];
    player.fish[fish] = (player.fish[fish]||0)+1;
    document.getElementById("catch").innerText =
      `🎣 Спіймав: ${fish}`;

    rodEl.classList.remove("cast");
    floatEl.classList.remove("show");

    saveGame();
    render();
  },1500);
}

function sellFish(){
  let total = 0;
  for(let k in player.fish) total += player.fish[k];
  player.coins += Math.floor(total/5);
  player.fish = {};
  document.getElementById("catch").innerText = "💰 Продано";
  saveGame();
  render();
}

function changeLocation(i){
  player.location=i;
  setBackground();
  openScreen("fishing");
  saveGame();
  render();
}

function render(){
  document.getElementById("locName").innerText =
    locations[player.location].name;

  document.getElementById("inv").innerHTML =
    Object.keys(player.fish).length
      ? Object.entries(player.fish).map(([k,v])=>`${k}: ${v}`).join("<br>")
      : "Порожньо";

  document.getElementById("locList").innerHTML =
    locations.map((l,i)=>
      `<button class="gray" onclick="changeLocation(${i})">${l.name}</button>`
    ).join("");

  document.getElementById("statsText").innerHTML =
    `🪙 Монети: ${player.coins}<br>
     📍 Локація: ${locations[player.location].name}`;
}

/* ===== START ===== */
setBackground();
render();
