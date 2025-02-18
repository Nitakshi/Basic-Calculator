let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let string = "";
let evaluated = false;
let previousAnswer = ""; 
let isRadians = true;

Array.from(buttons).forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.innerHTML;

        if (value === '=') {
            evaluateExpression();
        } else if (value === 'AC') {
            clearInput();
        } else if (value === 'DEL') {
            deleteInput();
        } else if (['+', '-', '*', '/'].includes(value)) {
            evaluateOperator(value);
        } else if (value === 'sin(' || value === 'cos(' || value === 'tan(') {
            string += value; 
            input.value = string;
            evaluated = false;
        } else if (value === ')') {
            string += value;
            input.value = string;
            evaluated = false; 
        } else if (value === '(') {
            string += value;
            input.value = string;
            evaluated = false; 
        } else if (value === 'π') {
            string += 'Math.PI';
            input.value = string;
            evaluated = false;
        } else if (value === 'RAD') {
            isRadians = true; // Set mode to radians
            alert("Switched to Radians");
        } else if (value === 'DEG') {
            isRadians = false; // Set mode to degrees
            alert("Switched to Degrees");
        }  else if (value === 'nC' || value === 'nC<sup>r</sup>') {
            // Handle combinations (nCr)
            let n = prompt("Enter n (total items):");
            let r = prompt("Enter r (items to choose):");
            if (n !== null && r !== null) {
                let result = nCr(parseInt(n), parseInt(r));
                input.value = result;
                string = ""; // Clear the string after calculation
            }
        } else {
            if (evaluated) {
                // If a number is entered after '=', start a fresh calculation
                string = value;
            } else {
                string += value;
            }
            input.value = string;
            evaluated = false;
        }
    });
});

function evaluateExpression() {
    try {
        let expression = string
            .replace(/sin\(/g, 'Math.sin(' + (isRadians ? '' : 'Math.PI / 180 * ')) //Math.sin() -> return answer in radians
            .replace(/cos\(/g, 'Math.cos(' + (isRadians ? '' : 'Math.PI / 180 * '))
            .replace(/tan\(/g,'Math.tan(' + (isRadians ? '': 'Math.PI/180 *'));

        string = Function('"use strict";return (' + expression + ')')(); //creates a new function dynamically
        input.value = string;
        previousAnswer = string; 
        evaluated = true;
    } catch (error) {
        alert('Error: ' + error.message);
        string = "";
        input.value = string;
        evaluated = false;
    }
}

function clearInput() {
    string = "";
    input.value = string;
    previousAnswer = "";
    evaluated = false;
}

function deleteInput() {
    string = string.substring(0, string.length - 1);
    input.value = string;
}

function evaluateOperator(value) {
    if (evaluated) {
        // If an operator is clicked after '=', continue using the last answer
        string = previousAnswer + value;
    } else if (!string || ['+', '-', '*', '/'].includes(string.slice(-1))) {
        // Prevent invalid operations like "++" or starting with an operator
        return;
    } else {
        string += value;
    }
    input.value = string;
    evaluated = false;
}

function nCr(n, r) {
    if (r > n) return 0; // nCr is 0 if r > n
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function factorial(num) {
    if (num < 0) return 0; // Factorial of negative number is not defined
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
}
/*
/.../ → Defines a regular expression.
sin → Matches the literal string "sin".
\( → Matches an opening parenthesis "(".
Why \( and not just (?
( is a special character in RegEx (used for grouping).
The backslash \ escapes it, so it matches a literal "(".
g → The global flag, meaning it replaces all occurrences of "sin(", not just the first one.
 */
