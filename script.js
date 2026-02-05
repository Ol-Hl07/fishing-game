/* ===== SAVE ===== */
function loadGame(){
  try{
    return JSON.parse(localStorage.getItem("fishingGame"));
  }catch{
    return null;
  }
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
const rods=[
  {name:"Стара вудка",power:1,price:0},
  {name:"Добра вудка",power:2,price:50},
  {name:"Профі вудка",power:3,price:250},
  {name:"Турбо вудка",power:4,price:500},
  {name:"Легендарна вудка",power:5,tonPrice:15,legendary:true}
];

const baitItems=[
  {name:"Черв'як",price:20,uses:5},
  {name:"Опариш",price:50,uses:10}
];

const feedItems=[
  {name:"Простий прикорм",price:40,casts:5},
  {name:"Преміум прикорм",price:120,casts:10}
];

const gearItems=[
  {id:"landingNet",name:"Підсака",tonPrice:5}
];

const rarityTable=[
  {key:"common",name:"⚪ Звичайна",chance:0.7,mult:1,cls:"r-common"},
  {key:"rare",name:"🔵 Рідкісна",chance:0.25,mult:1.5,cls:"r-rare"},
  {key:"legend",name:"🟣 Легендарна",chance:0.05,mult:3,cls:"r-legend"}
];

const locations=[
  {
    name:"🌊 Озеро",
    level:1,
    bg:"https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    fish:[
      {name:"Карась",weight:10},
      {name:"Окунь",weight:9}
    ]
  },
  {
    name:"🌿 Ставок",
    level:3,
    bg:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    fish:[
      {name:"Лин",weight:8},
      {name:"Карась великий",weight:7}
    ]
  },
  {
    name:"🌅 Річка",
    level:6,
    bg:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    fish:[
      {name:"Короп",weight:6},
      {name:"Щука",weight:5}
    ]
  },
  {
    name:"🌌 Море",
    level:10,
    bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:[
      {name:"Тунець",weight:3},
      {name:"Марлін",weight:2}
    ]
  },
  {
    name:"🌊 Океан",
    level:15,
    bg:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    fish:[
      {name:"Акула",weight:1}
    ]
  }
];

/* ===== HELPERS ===== */
function rollRarity(){
  let r=Math.random(),acc=0;
  for(let x of rarityTable){
    acc+=x.chance;
    if(r<=acc) return x;
  }
  return rarityTable[0];
}

function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setBackground(){
  document.body.style.backgroundImage =
    `url('${locations[player.location].bg}')`;
}

/* ===== GAME ===== */
function catchFish(){
  const rod=rods[player.rod];
  const now=Date.now();

  let tonChance=(rod.legendary?0.10:0)+(player.gear.landingNet?0.05:0);
  if(tonChance>0 && now-player.lastTonCatch>86400000 && Math.random()<tonChance){
    player.lastTonCatch=now;
    player.tonFish++;
    document.getElementById("catch").innerText="💎 Спіймав TON-рибу!";
    saveGame(); render(); return;
  }

  let power=rod.power;
  if(player.bait>0){power++;player.bait--}
  if(player.feed>0){power++;player.feed--}

  const rarity=rollRarity();
  const loc=locations[player.location];
  const fish=loc.fish[Math.min(Math.floor(Math.random()*power),loc.fish.length-1)];

  const key=`${fish.name}|${rarity.key}`;
  player.fish[key]=(player.fish[key]||0)+1;

  document.getElementById("catch").innerHTML=
    `🎣 ${fish.name} <span class="${rarity.cls}">(${rarity.name})</span>`;

  saveGame(); render();
}

function sellFish(){
  let coins=0;
  for(let k in player.fish){
    const [name,rar]=k.split("|");
    const r=rarityTable.find(x=>x.key===rar);
    for(let l of locations){
      let f=l.fish.find(x=>x.name===name);
      if(f) coins+=Math.floor((player.fish[k]/f.weight)*r.mult);
    }
  }
  player.coins+=coins;
  player.tons+=player.tonFish;
  player.fish={}; player.tonFish=0;

  document.getElementById("catch").innerText=
    `💰 +${coins} 🪙 | 💎 +TON`;

  saveGame(); render();
}

/* ===== SHOP ===== */
function buyRod(i){
  const r=rods[i];
  if(r.tonPrice){ alert("TON буде пізніше"); return; }
  if(player.coins>=r.price){
    player.coins-=r.price;
    player.rod=i;
  }
  saveGame(); render();
}
function buyBait(i){
  const b=baitItems[i];
  if(player.coins>=b.price){
    player.coins-=b.price;
    player.bait+=b.uses;
  }
  saveGame(); render();
}
function buyFeed(i){
  const f=feedItems[i];
  if(player.coins>=f.price){
    player.coins-=f.price;
    player.feed+=f.casts;
  }
  saveGame(); render();
}
function buyGear(id){
  const g=gearItems.find(x=>x.id===id);
  if(!player.gear[id] && player.tons>=g.tonPrice){
    player.tons-=g.tonPrice;
    player.gear[id]=true;
  }
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

/* ===== RENDER ===== */
function render(){
  document.getElementById("locName").innerText=locations[player.location].name;

  let inv=[];
  for(let k in player.fish){
    const [n,r]=k.split("|");
    const rr=rarityTable.find(x=>x.key===r);
    inv.push(`${n} <span class="${rr.cls}">(${rr.name})</span>: ${player.fish[k]}`);
  }
  if(player.tonFish>0) inv.push(`💎 TON-риба: ${player.tonFish}`);
  document.getElementById("inv").innerHTML=inv.length?inv.join("<br>"):"Порожньо";

  document.getElementById("locList").innerHTML=
    locations.map((l,i)=>
      player.level>=l.level
        ? `<button class="gray" onclick="changeLocation(${i})">${l.name}</button>`
        : `<button class="locked">${l.name} (lvl ${l.level})</button>`
    ).join("");

  document.getElementById("shopRods").innerHTML=
    rods.map((r,i)=>r.tonPrice
      ? `<button class="ton">💎 ${r.name} — ${r.tonPrice} TON</button>`
      : `<button class="gray" onclick="buyRod(${i})">${r.name} — ${r.price} 🪙</button>`
    ).join("");

  document.getElementById("shopBait").innerHTML=
    baitItems.map((b,i)=>
      `<button class="gray" onclick="buyBait(${i})">${b.name} — ${b.price} 🪙 (+${b.uses})</button>`
    ).join("");

  document.getElementById("shopFeed").innerHTML=
    feedItems.map((f,i)=>
      `<button class="gray" onclick="buyFeed(${i})">${f.name} — ${f.price} 🪙 (${f.casts} закидів)</button>`
    ).join("");

  document.getElementById("shopGear").innerHTML=
    gearItems.map(g=>player.gear[g.id]
      ? `<button class="locked">✅ ${g.name}</button>`
      : `<button class="ton" onclick="buyGear('${g.id}')">💎 ${g.name} — ${g.tonPrice} TON</button>`
    ).join("");

  document.getElementById("statsText").innerHTML=
    `🪙 Монети: ${player.coins}<br>
     💎 TON: ${player.tons}<br>
     ⭐ Рівень: ${player.level}<br>
     🎣 Вудка: ${rods[player.rod].name}`;
}

/* ===== START ===== */
setBackground();
render();
