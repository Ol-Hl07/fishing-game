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
  tonFish:0,
  coins:0,
  tons:0,
  level:1,
  location:0,
  rod:0,
  bait:0,
  feed:0,
  gear:{ landingNet:false },
  lastTonCatch:0
};

/* ===== DATA ===== */
const locations=[
  {
    name:"🌊 Озеро",
    level:1,
    bg:"https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    fish:[{name:"Карась",weight:10},{name:"Окунь",weight:9}]
  },
  {
    name:"🌿 Ставок",
    level:3,
    bg:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    fish:[{name:"Лин",weight:8},{name:"Карась великий",weight:7}]
  },
  {
    name:"🌅 Річка",
    level:6,
    bg:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    fish:[{name:"Короп",weight:6},{name:"Щука",weight:5}]
  },
  {
    name:"🌌 Море",
    level:10,
    bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:[{name:"Тунець",weight:3},{name:"Марлін",weight:2}]
  },
  {
    name:"🌊 Океан",
    level:15,
    bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:[{name:"Акула",weight:1}]
  }
];

/* ===== UI ===== */
function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setBackground(){
  document.body.style.backgroundImage =
    `url('${locations[player.location].bg}')`;
}

/* ===== GAME (СПРОЩЕНА ДЛЯ UI-ТЕСТУ) ===== */
function catchFish(){
  const f=locations[player.location].fish;
  const fish=f[Math.floor(Math.random()*f.length)];
  player.fish[fish.name]=(player.fish[fish.name]||0)+1;
  document.getElementById("catch").innerText=`🎣 Спіймав: ${fish.name}`;
  saveGame(); render();
}

function sellFish(){
  let total=0;
  for(let k in player.fish) total+=player.fish[k];
  player.coins+=Math.floor(total/5);
  player.fish={};
  document.getElementById("catch").innerText=`💰 Продано`;
  saveGame(); render();
}

function changeLocation(i){
  if(player.level>=locations[i].level){
    player.location=i;
    setBackground();
    openScreen("fishing");
  }
  saveGame(); render();
}

function render(){
  document.getElementById("locName").innerText=locations[player.location].name;

  document.getElementById("inv").innerHTML=
    Object.keys(player.fish).length
      ? Object.entries(player.fish).map(([k,v])=>`${k}: ${v}`).join("<br>")
      : "Порожньо";

  document.getElementById("locList").innerHTML=
    locations.map((l,i)=>
      player.level>=l.level
        ? `<button class="gray" onclick="changeLocation(${i})">${l.name}</button>`
        : `<button class="locked">${l.name} (lvl ${l.level})</button>`
    ).join("");

  document.getElementById("statsText").innerHTML=
    `🪙 Монети: ${player.coins}<br>
     📍 Локація: ${locations[player.location].name}`;
}

/* ===== START ===== */
setBackground();
render();
