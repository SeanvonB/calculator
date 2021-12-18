// Globals
const numbers = document.querySelectorAll(".btn.number");
const operators = document.querySelectorAll(".btn.operator");
const back = document.querySelector(".btn.back");
const clear = document.querySelector(".btn.clear");
const decimal = document.querySelector(".btn.decimal");
const displayCurrent = document.querySelector(".display .current");
const displayRunning = document.querySelector(".display .running");
const sign = document.querySelector(".btn.sign");
const total = document.querySelector(".btn.total");
let currentOperator = null;
let currentValue = "";
let previousValue = "";
let resetReady = false;

// Clear and reset calculator
function allClear() {
	displayCurrent.textContent = "";
	displayRunning.textContent = "";
	currentOperator = null;
	currentValue = "";
	previousValue = "";
	resetReady = false;
}

// Use global values to operate and return rounded result
function operate(a = previousValue, op = currentOperator, b = currentValue) {
	if (b === "") return a;

	a = Number(a);
	b = Number(b);

	switch (op) {
		case "÷":
			if (b === 0) {
				return "ZeroDivisionError";
			} else {
				return roundNumber(a / b);
			}
		case "×":
			return roundNumber(a * b);
		case "−":
			return roundNumber(a - b);
		case "+":
			return roundNumber(a + b);
		default:
			return a;
	}
}

// Delete most recent number input
function deleteNumber() {
	currentValue = currentValue.slice(0, -1);
	displayCurrent.textContent = currentValue;
}

// Identify valid key inputs and apply them to appropriate buttons
function keyBindings(e) {
	switch (e.key) {
		case "Delete":
		case "Escape":
			clear.click();
			clear.classList.add("active");
			break;
		case "Backspace":
			back.click();
			back.classList.add("active");
			break;
		case "Divide":
		case "/":
			e.preventDefault(); // Prevent default Quick Find shortcut
			operators[0].click();
			operators[0].classList.add("active");
			break;
		case "Multiply":
		case "*":
			operators[1].click();
			operators[1].classList.add("active");
			break;
		case "Subtract":
		case "-":
			operators[2].click();
			operators[2].classList.add("active");
			break;
		case "Add":
		case "+":
			operators[3].click();
			operators[3].classList.add("active");
			break;
		case "=":
		case "Enter":
			total.click();
			total.classList.add("active");
			break;
		case "7":
			numbers[0].click();
			numbers[0].classList.add("active");
			break;
		case "8":
			numbers[1].click();
			numbers[1].classList.add("active");
			break;
		case "9":
			numbers[2].click();
			numbers[2].classList.add("active");
			break;
		case "4":
			numbers[3].click();
			numbers[3].classList.add("active");
			break;
		case "5":
			numbers[4].click();
			numbers[4].classList.add("active");
			break;
		case "6":
			numbers[5].click();
			numbers[5].classList.add("active");
			break;
		case "1":
			numbers[6].click();
			numbers[6].classList.add("active");
			break;
		case "2":
			numbers[7].click();
			numbers[7].classList.add("active");
			break;
		case "3":
			numbers[8].click();
			numbers[8].classList.add("active");
			break;
		case "0":
			numbers[9].click();
			numbers[9].classList.add("active");
			break;
		case ".":
		case "Decimal":
			numbers[10].click();
			numbers[10].classList.add("active");
			break;
		default:
			return;
	}
}

// Round number to 3 decimal places
function roundNumber(number) {
	return Math.round((number + Number.EPSILON) * 1000) / 1000;
}

// Switch positive to negative and vice versa
function switchSign() {
	if (currentValue === "") currentValue += "0";
	if (currentValue.slice(0, 1) === "-") {
		currentValue = currentValue.slice(1);
	} else currentValue = `-${currentValue}`;

	displayCurrent.textContent = currentValue;
}

// Update currentValue
function updateNumber(number) {
	// Reset on new input if preceded by updateTotal
	if (resetReady) allClear();

	// Limit to 10 characters to prevent overflow
	if (currentValue.replace(".", "").length >= 10) return;

	if (currentValue === "0") currentValue = "";
	if (currentValue === "-0") currentValue = "-";
	if (number === ".") {
		if (currentValue.includes(".")) return;
		if (currentValue === "" || currentValue === "-") currentValue += "0";
	}

	currentValue += number;
	displayCurrent.textContent = currentValue;
}

// Update currentOperator, call operate(), and update state
function updateOperator(operator) {
	// Clear reset flag if preceded by updateTotal
	if (resetReady) resetReady = false;

	if (currentValue || previousValue) {
		// Operate on subsequent calls
		if (currentOperator) currentValue = String(operate());
		if (currentValue === "ZeroDivisionError") {
			allClear();
			displayRunning.textContent = "Don't divide by zero.";
			return;
		}

		// Convert to scientific notation if result could overflow
		if (currentValue.replace(".", "").length >= 10) {
			currentValue = String(Number(currentValue).toExponential(3));
		}

		// Update state
		if (currentValue.slice(-1) === ".") currentValue += "0";
		previousValue = currentValue;
		currentOperator = operator;
		displayCurrent.textContent = currentValue;
		currentValue = "";
		displayRunning.textContent = `${previousValue} ${currentOperator}`;
	}
}

// Call operate() and update state
function updateTotal() {
	if (currentOperator) {
		currentValue = String(operate());
		if (currentValue === "ZeroDivisionError") {
			allClear();
			displayRunning.textContent = "Don't divide by zero.";
			return;
		}

		// Convert to scientific notation if result could overflow
		if (currentValue.replace(".", "").length >= 10) {
			currentValue = String(Number(currentValue).toExponential(3));
		}

		// Update state
		if (currentValue.slice(-1) === ".") currentValue += "0";
		previousValue = currentValue;
		displayCurrent.textContent = currentValue;
		currentValue = "";
		displayRunning.textContent = "";
		resetReady = true;
	}
}

// Remove active class to end keydown animation
function removeActive() {
	let active = document.querySelectorAll(".active");
	active.forEach((element) => element.classList.remove("active"));
}

// AddEventListeners
numbers.forEach((button) =>
	button.addEventListener("click", () => updateNumber(button.textContent))
);
operators.forEach((button) =>
	button.addEventListener("click", () => updateOperator(button.textContent))
);
back.addEventListener("click", deleteNumber);
clear.addEventListener("click", allClear);
sign.addEventListener("click", switchSign);
total.addEventListener("click", updateTotal);
window.addEventListener("keydown", keyBindings);
window.addEventListener("keyup", removeActive);
