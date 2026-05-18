const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

let angkaPertama = "";
let angkaKedua = "";
let operator = "";
let sedangInputAngkaKedua = false;

// Update display
function updateDisplay(value) {
  display.textContent = value;
}

// Hitung hasil
function hitung(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      return b !== 0 ? a / b : "Error";

    default:
      return b;
  }
}

// Proses input
function handleInput(value) {
  // Tombol C
  if (value === "C") {
    angkaPertama = "";
    angkaKedua = "";
    operator = "";
    sedangInputAngkaKedua = false;

    updateDisplay("0");
    return;
  }

  // Tombol operator
  if (["+", "-", "*", "/"].includes(value)) {
    if (angkaPertama !== "") {
      operator = value;
      sedangInputAngkaKedua = true;
    }

    return;
  }

  // Tombol =
  if (value === "=") {
    if (angkaPertama && angkaKedua && operator) {
      const hasil = hitung(angkaPertama, angkaKedua, operator);

      updateDisplay(hasil);

      angkaPertama = hasil.toString();
      angkaKedua = "";
      operator = "";
      sedangInputAngkaKedua = false;
    }

    return;
  }

  // Input angka atau titik
  if (!sedangInputAngkaKedua) {
    angkaPertama += value;
    updateDisplay(angkaPertama);
  } else {
    angkaKedua += value;
    updateDisplay(angkaKedua);
  }
}

// EVENT DELEGATION
buttons.addEventListener("click", function (event) {
  const target = event.target;

  if (target.tagName === "BUTTON") {
    const value = target.dataset.value;
    handleInput(value);
  }
});

// KEYBOARD SUPPORT
document.addEventListener("keydown", function (event) {
  const key = event.key;

  // Angka
  if (!isNaN(key)) {
    handleInput(key);
  }

  // Operator
  if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key);
  }

  // Titik desimal
  if (key === ".") {
    handleInput(".");
  }

  // Enter = hasil
  if (key === "Enter") {
    handleInput("=");
  }

  // Escape = clear
  if (key === "Escape") {
    handleInput("C");
  }
});
