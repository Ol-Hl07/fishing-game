/* ===== ДАНІ ===== */
const locations = [
  {
    name: "🌊 Озеро",
    bg: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    fish: ["Карась", "Окунь"]
  },
  {
    name: "🌅 Річка",
    bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    fish: ["Короп", "Щука"]
  },
  {
    name: "🌌 Море",
    bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish: ["Тунець", "Марлін"]
  }
];

/* ===== ГРАВЕЦЬ ===== */
let player = {
  location: 0,
  fish: {},
  coins: 0
};

/* ===== UI ЕЛЕМЕНТИ ===== */
const rodEl = document.createElement("div");
rodEl.className = "rod";
rodEl.textContent = "🎣";
document.body.appendChild(rodEl);

const floatEl = document.createElement("div");
floatEl.className = "float";
floatEl.textContent = "🎈";
document.body.appendChild(floatEl);

const waterEl = document.createElement("div");
waterEl.className = "water";
waterEl.innerHTML = `<div class="wave"></div>`;
document.body.appendChild(waterEl);

/* ===== НАВІГАЦІЯ ===== */
function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>{
    s.classList.remove("active");
  });
  const el = document.getElementById(id);
  if(el) el.classList.add("active");
}

/* ===== ФОН ===== */
function setBackground(){
  document.body.style.backgroundImage =
    `url('${locations[player.location].bg}')`;
}

/* ===== ГРА ===== */
function catchFish(){
  rodEl.classList.add("cast");
  floatEl.classList.add("show");

  setTimeout(()=>{
    const f = locations[player.location].fish;
    const fish = f[Math.floor(Math.random()*f.length)];

    player.fish[fish] = (player.fish[fish] || 0) + 1;

    document.getElementById("catch").innerText =
      `🎣 Спіймав: ${fish}`;

    rodEl.classList.remove("cast");
    floatEl.classList.remove("show");

    render();
  }, 1500);
}

function sellFish(){
  let total = 0;
  for(let k in player.fish){
    total += player.fish[k];
  }

  player.coins += Math.floor(total / 5);
  player.fish = {};

  document.getElementById("catch").innerText =
    `💰 Монети: ${player.coins}`;

  render();
}

function changeLocation(i){
  player.location = i;
  setBackground();
  openScreen("fishing");
  render();
}

/* ===== ВІДМАЛЬОВКА ===== */
function render(){
  document.getElementById("locName").innerText =
    locations[player.location].name;

  document.getElementById("inv").innerHTML =
    Object.keys(player.fish).length
      ? Object.entries(player.fish)
          .map(([k,v]) => `${k}: ${v}`)
          .join("<br>")
      : "Порожньо";

  document.getElementById("locList").innerHTML =
    locations.map((l,i)=>
      `<button class="gray" onclick="changeLocation(${i})">${l.name}</button>`
    ).join("");

  document.getElementById("statsText").innerHTML =
    `🪙 Монети: ${player.coins}<br>
     📍 Локація: ${locations[player.location].name}`;
}

/* ===== СТАРТ ===== */
setBackground();
render();
