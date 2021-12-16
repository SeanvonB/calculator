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

	if (currentValue === "0") currentValue = "";
	if (currentValue === "-0") currentValue = "-";
	if (number === ".") {
		if (currentValue.includes(".")) return;
		if (currentValue === "") currentValue += "0";
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

		// Update state
		if (currentValue.slice(-1) === ".") currentValue += "0";
		previousValue = currentValue;
		displayCurrent.textContent = currentValue;
		currentValue = "";
		displayRunning.textContent = "";
		resetReady = true;
	}
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
