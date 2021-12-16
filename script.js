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

// Use global values to operate and return result
function operate(a = previousValue, op = currentOperator, b = currentValue) {
	// Exit without operation if b is an empty string
	if (b === "") return a;

	// Convert numeric strings to number
	a = Number(a);
	b = Number(b);

	// Use operator to determine operation
	switch (op) {
		case "÷":
			if (b === 0) {
				return "ERROR";
			} else {
				return a / b;
			}
		case "×":
			return a * b;
		case "−":
			return a - b;
		case "+":
			return a + b;
		default:
			return a;
	}
}

// Update displayCurrent and CurrentValue with button input
function updateNumber(number) {
	// Reset on new input if following total
	if (resetReady) allClear();

	currentValue += number;
	displayCurrent.textContent = currentValue;
}

// Update currentOperator then operate on subsequent updates
function updateOperator(operator) {
	// Clear reset flag if following total
	if (resetReady) resetReady = false;

	// Do nothing unless a value has been staged
	if (currentValue || previousValue) {
		// Evaluate on subsequent calls and re-cast as strings
		if (currentOperator) currentValue = String(operate());

		// Handle division by zero error by resetting
		if (currentValue === "ERROR") {
			allClear();
		} else {
			// Update global and displayed variables
			previousValue = currentValue;
			currentOperator = operator;
			displayCurrent.textContent = currentValue;
			currentValue = "";
			displayRunning.textContent = `${previousValue} ${currentOperator}`;
		}
	}
}

// Update displayed totals
function updateTotal() {
	// Do nothing unless an operator has been staged
	if (currentOperator) {
		// Evaluate and re-cast as strings
		currentValue = String(operate());

		// Handle division by zero error by resetting
		if (currentValue === "ERROR") {
			allClear();
		} else {
			// Update global and displayed variables
			previousValue = currentValue;
			displayCurrent.textContent = currentValue;
			currentValue = "";
			displayRunning.textContent = "";
			resetReady = true;
		}
	}
}

// CNeedt input methods to values, display, and operate()
numbers.forEach((button) =>
	button.addEventListener("click", () => updateNumber(button.textContent))
);

operators.forEach((button) =>
	button.addEventListener("click", () => updateOperator(button.textContent))
);

clear.addEventListener("click", allClear);

total.addEventListener("click", updateTotal);
