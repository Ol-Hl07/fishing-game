let player = {
  fish: 55,
  level: 7,
  rod: 1,
  gear: [],
  bait: null
};

const rods = [
  { id: 1, name: "Стара вудка", bonus: 1, rare: 0, price: 0 },
  { id: 2, name: "Деревʼяна вудка", bonus: 2, rare: 5, price: 45 },
  { id: 3, name: "Профі вудка", bonus: 3, rare: 15, price: 120 }
];

const gearList = [
  { id: 1, name: "Простий гачок", rare: 2, price: 20 }
];

const baitList = [
  { id: 1, name: "Червʼяк", chance: 10, uses: 5, price: 15 }
];let fish = localStorage.getItem("fish")
  ? parseInt(localStorage.getItem("fish"))
  : 0;

let level = localStorage.getItem("level")
  ? parseInt(localStorage.getItem("level"))
  : 1;

let rodLevel = localStorage.getItem("rodLevel")
  ? parseInt(localStorage.getItem("rodLevel"))
  : 1;

let autoFish = localStorage.getItem("autoFish")
  ? parseInt(localStorage.getItem("autoFish"))
  : 0;

function fishForClick() {
  return rodLevel + level - 1;
}

function levelNeed() {
  return level * 10;
}

function rodPrice() {
  return rodLevel * 15;
}

function autoFishPrice() {
  return autoFish * 25 + 25;
}

function catchFish() {
  fish += fishForClick();

  if (fish >= levelNeed()) {
    level++;
  }

  save();
  render();
}

function buyRod() {
  if (fish >= rodPrice()) {
    fish -= rodPrice();
    rodLevel++;
    save();
    render();
  } else {
    alert("❌ Недостатньо риби");
  }
}

function buyAutoFish() {
  if (fish >= autoFishPrice()) {
    fish -= autoFishPrice();
    autoFish++;
    save();
    render();
  } else {
    alert("❌ Недостатньо риби");
  }
}

function autoFishing() {
  if (autoFish > 0) {
    fish += autoFish;
    save();
    render();
  }
}

function save() {
  localStorage.setItem("fish", fish);
  localStorage.setItem("level", level);
  localStorage.setItem("rodLevel", rodLevel);
  localStorage.setItem("autoFish", autoFish);
}

function render() {
  document.getElementById("result").innerText =
    "🐟 Риба: " + fish +
    " | ⭐ Рівень: " + level +
    " | 🎣 Вудка: " + rodLevel +
    " | 🤖 Авто: " + autoFish;

  document.querySelector("button[onclick='buyRod()']").innerText =
    "🛒 Купити вудку (" + rodPrice() + " 🐟)";

  document.querySelector("button[onclick='buyAutoFish()']").innerText =
    "🤖 Купити авто-рибалку (" + autoFishPrice() + " 🐟)";
}

setInterval(autoFishing, 3000);
render();
