let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let string = "";
let evaluated = false; // Track if last input was '='
let previousAnswer = ""; // Store last evaluated result

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
            // Append the function to the string
            string += value; 
            input.value = string; // Update the display
            evaluated = false; // Reset evaluated flag
        }
        else if(value == ')' || value == '('){
            evaluateBrackets(value);
        } 
        else {
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
    try { //input is in degrees instead of radians
        // Replace trigonometric functions with their Math equivalents
        let expression = string
            .replace(/sin\(/g, 'Math.sin(Math.PI / 180 * (')
            .replace(/cos\(/g, 'Math.cos(Math.PI / 180 * (')
            .replace(/tan\(/g, 'Math.tan(Math.PI / 180 * (');

        // Evaluate the expression
        expression += ')';
        string = Function('"use strict";return (' + expression + ')')();
        input.value = string;
        previousAnswer = string; // Store result for next calculation
        evaluated = true; // Mark that an expression was evaluated
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
function evaluateBrackets(value){
    if(value == ')'){
        string += value;
        input.value = string;
    }
    else if(value == '('){
        string += value;
        input.value = string;
    }
}