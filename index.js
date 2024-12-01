const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc"); 

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    const percent = ((passwordLength - min) * 100) / (max - min);
    inputSlider.style.background = `linear-gradient(to right, var(--vb-violet) ${percent}%, var(--lt-violet) ${percent}%)`;
}




function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber() {
    return String.fromCharCode(getRndInteger(48, 57)); 
}

function generateRandomLowerCase() {
    return String.fromCharCode(getRndInteger(97, 122)); 
}

function generateRandomUpperCase() {
    return String.fromCharCode(getRndInteger(65, 90));
}

function generateRandomSymbol() {
    const symbols = "!@#$%^&*()_+=-{}[]|;:,.<>/?";
    return symbols[getRndInteger(0, symbols.length - 1)];
}

function calcStrength() {
    const hasUpper = upperCaseCheck.checked;
    const hasLower = lowerCaseCheck.checked;
    const hasNum = numbersCheck.checked;
    const hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); 
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); 
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed to copy";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword() {
    const array = [...password]; 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array.join(""); 
}

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (password) copyContent();
});

function handleCheckBoxChange() {
    checkCount = Array.from(allCheckBox).filter((checkbox) => checkbox.checked).length;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    const funcArr = [];
    if (upperCaseCheck.checked) funcArr.push(generateRandomUpperCase);
    if (lowerCaseCheck.checked) funcArr.push(generateRandomLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateRandomSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        const randomIndex = getRndInteger(0, funcArr.length - 1);
        password += funcArr[randomIndex]();
    }

    password = shufflePassword();

    passwordDisplay.value = password;
    calcStrength();
});
