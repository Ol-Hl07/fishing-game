/* ===== SAVE / LOAD ===== */
function loadGame(){
  try{ return JSON.parse(localStorage.getItem("fishingGame")) }catch{ return null }
}
function saveGame(){
  localStorage.setItem("fishingGame", JSON.stringify(player));
}

/* ===== PLAYER ===== */
let player = loadGame() || {
  location: 0,
  fish: {},          // звичайна риба
  tonFish: 0,        // TON-риба
  coins: 0,
  tons: 0,
  rod: 0,            // індекс вудки
  gear: { net:false },
  lastTonCatch: 0
};

/* ===== DATA ===== */
const locations = [
  { name:"🌊 Озеро", bg:"https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    fish:[{n:"Карась",w:10},{n:"Окунь",w:9}] },
  { name:"🌅 Річка", bg:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    fish:[{n:"Короп",w:6},{n:"Щука",w:5}] },
  { name:"🌌 Море", bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:[{n:"Тунець",w:3},{n:"Марлін",w:2}] }
];

const rods = [
  {name:"Стара вудка", power:1, price:0},
  {name:"Добра вудка", power:2, price:50},
  {name:"Профі вудка", power:3, price:250},
  {name:"Турбо вудка", power:4, price:500},
  {name:"Легендарна вудка", power:5, ton:15, legendary:true}
];

const gearItems = [
  {id:"net", name:"Підсака", ton:5, tonBonus:0.05}
];

/* ===== UI ELEMENTS (анімації) ===== */
const rodEl = document.createElement("div");
rodEl.className = "rod"; rodEl.textContent = "🎣";
document.body.appendChild(rodEl);

const floatEl = document.createElement("div");
floatEl.className = "float"; floatEl.textContent = "🎈";
document.body.appendChild(floatEl);

const waterEl = document.createElement("div");
waterEl.className = "water";
waterEl.innerHTML = `<div class="wave"></div>`;
document.body.appendChild(waterEl);

/* ===== NAV ===== */
function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  const el=document.getElementById(id); if(el) el.classList.add("active");
}

/* ===== BACKGROUND ===== */
function setBackground(){
  document.body.style.backgroundImage = `url('${locations[player.location].bg}')`;
}

/* ===== GAME ===== */
function catchFish(){
  // анімація
  rodEl.classList.add("cast");
  floatEl.classList.add("show");

  setTimeout(()=>{
    // шанс TON-риби (1 раз/24 год)
    let tonChance = 0;
    if(rods[player.rod].legendary) tonChance += 0.10;
    if(player.gear.net) tonChance += 0.05;

    const now = Date.now();
    if(tonChance>0 && now-player.lastTonCatch>86400000 && Math.random()<tonChance){
      player.lastTonCatch = now;
      player.tonFish++;
      document.getElementById("catch").innerText = "💎 Спіймав TON-рибу!";
    }else{
      const list = locations[player.location].fish;
      const f = list[Math.min(Math.floor(Math.random()*rods[player.rod].power), list.length-1)];
      player.fish[f.n] = (player.fish[f.n]||0)+1;
      document.getElementById("catch").innerText = `🎣 Спіймав: ${f.n}`;
    }

    rodEl.classList.remove("cast");
    floatEl.classList.remove("show");
    saveGame(); render();
  },1500);
}

function sellFish(){
  // 10 дрібних = 1 монета, більша риба швидше
  let coins = 0;
  for(const k in player.fish){
    const f = locations.flatMap(l=>l.fish).find(x=>x.n===k);
    if(f) coins += Math.floor(player.fish[k]/f.w);
  }
  player.coins += coins;
  player.tons += player.tonFish;
  player.fish = {};
  player.tonFish = 0;

  document.getElementById("catch").innerText = `💰 +${coins} 🪙 | 💎 +TON`;
  saveGame(); render();
}

function changeLocation(i){
  player.location=i;
  setBackground();
  openScreen("fishing");
  saveGame(); render();
}

/* ===== SHOP ===== */
function buyRod(i){
  const r=rods[i];
  if(r.ton){
    if(player.tons>=r.ton){ player.tons-=r.ton; player.rod=i; }
  }else{
    if(player.coins>=r.price){ player.coins-=r.price; player.rod=i; }
  }
  saveGame(); render();
}

function buyGear(id){
  const g=gearItems.find(x=>x.id===id);
  if(!player.gear[id] && player.tons>=g.ton){
    player.tons-=g.ton; player.gear[id]=true;
  }
  saveGame(); render();
}

/* ===== RENDER ===== */
function render(){
  document.getElementById("locName").innerText = locations[player.location].name;

  document.getElementById("inv").innerHTML =
    Object.keys(player.fish).length
      ? Object.entries(player.fish).map(([k,v])=>`${k}: ${v}`).join("<br>")
      : "Порожньо";

  document.getElementById("locList").innerHTML =
    locations.map((l,i)=>`<button class="gray" onclick="changeLocation(${i})">${l.name}</button>`).join("");

  // Додаємо магазин у статистику (щоб не міняти HTML)
  document.getElementById("statsText").innerHTML =
    `🪙 Монети: ${player.coins}<br>
     💎 TON: ${player.tons}<br>
     🎣 Вудка: ${rods[player.rod].name}<hr>
     <b>🛒 Магазин</b><br>
     ${rods.map((r,i)=>
        r.ton
          ? `<button class="ton" onclick="buyRod(${i})">💎 ${r.name} — ${r.ton} TON</button>`
          : `<button class="gray" onclick="buyRod(${i})">${r.name} — ${r.price} 🪙</button>`
      ).join("")}
     <hr>
     ${gearItems.map(g=>
        player.gear[g.id]
          ? `<button class="locked">✅ ${g.name}</button>`
          : `<button class="ton" onclick="buyGear('${g.id}')">💎 ${g.name} — ${g.ton} TON</button>`
      ).join("")}`;
}

/* ===== START ===== */
setBackground();
render();
