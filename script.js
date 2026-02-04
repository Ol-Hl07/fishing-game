let fish = localStorage.getItem("fish")
  ? parseInt(localStorage.getItem("fish"))
  : 0;

let level = localStorage.getItem("level")
  ? parseInt(localStorage.getItem("level"))
  : 1;

let rodLevel = localStorage.getItem("rodLevel")
  ? parseInt(localStorage.getItem("rodLevel"))
  : 1;

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

function save() {
  localStorage.setItem("fish", fish);
  localStorage.setItem("level", level);
  localStorage.setItem("rodLevel", rodLevel);
}

function render() {
  document.getElementById("result").innerText =
    "🐟 Риба: " + fish +
    " | ⭐ Рівень: " + level +
    " | 🎣 Вудка: " + rodLevel;
}

render();
