let fish = localStorage.getItem("fish")
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

function catchFish() {
  fish += rodLevel;

  if (fish >= level * 5) {
    level++;
  }

  save();
  render();
}

function buyRod() {
  if (fish >= 10) {
    fish -= 10;
    rodLevel++;
    save();
    render();
  } else {
    alert("❌ Недостатньо риби");
  }
}

function buyAutoFish() {
  if (fish >= 20) {
    fish -= 20;
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
}

setInterval(autoFishing, 3000);
render();
