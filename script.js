let fish = localStorage.getItem("fish")
  ? parseInt(localStorage.getItem("fish"))
  : 0;

let level = localStorage.getItem("level")
  ? parseInt(localStorage.getItem("level"))
  : 1;

function catchFish() {
  fish++;

  if (fish % 5 === 0) {
    level++;
  }

  localStorage.setItem("fish", fish);
  localStorage.setItem("level", level);

  document.getElementById("result").innerText =
    "🐟 Риба: " + fish + " | ⭐ Рівень: " + level;
}
