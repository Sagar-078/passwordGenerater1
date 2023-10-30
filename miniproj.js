const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data_length_Number]");
const passwordDisply = document.querySelector("[data-PasswordDisply]");
const dataCopyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheckbox = document.querySelector("#upperCase");
const lowerCaseCheckbox = document.querySelector("#lowerCase");
const numberCheckbox = document.querySelector("#numberCase");
const symbleCheckbox = document.querySelector("#SymbleCase");
const indicater = document.querySelector("[data-indicater]");
const generatebtn = document.querySelector(".GenerateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbles = '~`!@#$%^&*()-_+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to gray
setIndicater("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //for slider , it takes how much color 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicater(color){
    indicater.style.backgroundColor = color;
    // shadow
    indicater.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer 
function getrandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generaterandomNumber(){
    return getrandomInteger(0, 9);
}

// ascii value of a is 97 & z 123
function generateLowercase(){
    return String.fromCharCode(getrandomInteger(97, 123));
}

// ascii value of is A is 65 & Z is 91
function generateUppercase(){
    return String.fromCharCode(getrandomInteger(65, 91));
}

// in upper i have creat a string of symble
function generateSymble(){
    const randNum = getrandomInteger(0, symbles.length);
    return symbles.charAt(randNum);
}

// calculate strength of the password
function calcuStrength(){
    let hasUpper = false;
    let haslower = false;
    let hasNum = false;
    let hasSymble = false;
    
    if(upperCaseCheckbox.checked) hasUpper = true;
    if(lowerCaseCheckbox.checked) haslower = true;
    if(numberCheckbox.checked) hasNum = true;
    if(symbleCheckbox.checked) hasSymble = true;


    if(hasUpper && haslower && (hasNum && hasSymble) && password.length >= 8){
        setIndicater("#0f0");
    }else if(
        (haslower|| hasUpper) && (hasNum || hasSymble) && password.length >= 6){
        setIndicater("#ff0");
    }else{
        setIndicater("#f00");
    }

}

// creat copy content
 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisply.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copymsg span visible , and it do in css
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000); 
}


// for change value when slider move
inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

// for copy btn add Event listener where 
dataCopyButton.addEventListener('click', () =>{
    if(passwordDisply.value)
        copyContent();
})



// for count and add event listener in check box
// for creat a function handleCheckBoxChange for count checked box 
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });

    // spacial condition for check box if all check box ticked but lenth is 1 then if we click generate password
    // then it return 4 length of password
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}
// for see the check box will change or not  if change call this function handleCheckBoxChange
allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})



// creating a function for suffol password 
function shufflePassword(array){
    //it knows fisher yates method
    for(let i=array.length-1; i> 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}




// add eventlistener on generatebtn 
generatebtn.addEventListener('click', () =>{
    //incase of non of the check box selected
    if(checkCount <= 0) return;

    // if password length less then check count means length of password less then number of check box
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    //for find new password
    
    // first empty old password
    password = "";

    // let's put the stuff mentioned by checkbox\
    // means which check box is checked or ticked mentioned
    // creat a array type 
    let funcArr =[];
    if(upperCaseCheckbox.checked){
        funcArr.push(generateUppercase);
    }

    if(lowerCaseCheckbox.checked){
        funcArr.push(generateLowercase);
    }

    if(numberCheckbox.checked){
        funcArr.push(generaterandomNumber);
    }

    if(symbleCheckbox.checked){
        funcArr.push(generateSymble);
    }

    // compulsory addition means which checkbox ticked store in passoword  \
    for(let i=0; i< funcArr.length; i++){
        password += funcArr[i]();
    }
    

    // remaining addition
    for(let i=0; i< passwordLength-funcArr.length; i++){
        let rendomIndex = getrandomInteger(0, funcArr.length);
        password += funcArr[rendomIndex]();
    }
    

    // shuffle the password means altranate all the charecter
    password = shufflePassword(Array.from(password));
    

    // disply password in ui or disply this password in passwordDisply
    passwordDisply.value = password;
    

    // after the disply password then show strength of password for that call calcustrength()
    calcuStrength();
    

})