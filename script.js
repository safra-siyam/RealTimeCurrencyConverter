// importing currency codes list and API Key 
import { currency_list, api } from "./currencyCodes.js";


//Query DOM elements
const fromCurrencySelectTag = document.querySelector("#fromCurrency"); //to choose currencies
const toCurrencySelectTag = document.querySelector("#toCurrency");//to choose currencies

const resultTag = document.querySelector("#result");
const btn = document.querySelector("#btn");
const status = document.querySelector("#status");




//script to iterate through a list of currencies.

//To populate the Currency Dropdowns:
// append the curreny codes list to the list and select defaults 
currency_list.forEach((currency) => {
    const code = currency[0];
    const countryName = currency[1];

    //For each currency, a new <option> HTML element is created and configured:
    const newElement = document.createElement("option");
    newElement.value = code;
    newElement.textContent = `${code} - ${countryName}`;

    if (code === "USD")
        //If the currency code is "USD", the selected property of the <option> element is set to true, 
    //making it the default selected option in the first dropdown 
        newElement.selected = true;

    fromCurrencySelectTag.append(newElement);  //Appending to the First Dropdown

    const newElementTo = newElement.cloneNode(true); //Cloning for Second Dropdown

    if (code === "INR")
        newElementTo.selected = true;

    toCurrencySelectTag.append(newElementTo);
});





// Swap currencies functionalities on "click" 
document.getElementById("switchCurrency").onclick = () => {

    const fromValue = fromCurrencySelectTag.value;
    fromCurrencySelectTag.value = toCurrencySelectTag.value;
    toCurrencySelectTag.value = fromValue;

};




// handle "click" event for conversion 

//anonymous function to handle the click event on the Convert button
btn.onclick = () => {

    //code retrieves the input field element and the value entered by the user
    const numberInputField = document.getElementById("userValue");
    const userEnteredAmount = numberInputField.value;

    //code validates the user input to ensure that it is a numeric value greater than 0
    if(userEnteredAmount < 1 || isNaN(userEnteredAmount)) {
        //code sets the border color of the input field to red and displays an error message in the result tag
        numberInputField.style.border = "1px solid red";
        resultTag.style.color = "red";
        resultTag.textContent = "Error: Only numeric values greater than 0 are allowed.";
    }
    else {
        //code resets the border color of the input field and the text color of the result tag
        numberInputField.style.border = "1px solid gray";
        resultTag.style.color = "black";
        btn.textContent = "Processing: have patients...";

        //code disables the Convert button to prevent multiple clicks while the conversion is in progress
        btn.disabled = true;
        btn.style.color = "gray";
        btn.style.cursor = "not-allowed";

        //code calls the convertAmount function, passing the user-entered amount as an argument
        convertAmount(userEnteredAmount);
    }
}





// convert the amount to different currency using Fetch API 
function convertAmount(amount) {

    fetchData(`https://v6.exchangerate-api.com/v6/${api}/latest/USD`)
        .then(data => {
            //The request fetches the latest exchange rates with USD as the base currency.

            //The fetchData function (presumably defined elsewhere) is used to make a GET request to the Exchange Rate API.
            //The URL for the request is constructed using the API key and the base currency code "USD".
            //The response from the API is parsed as JSON and returned as a promise.
            //If the response is not successful (i.e., the status code is not in the range 200-299), an error is thrown.
            //The error message includes the HTTP status code.
            //If an error occurs during the fetch operation, the error message is displayed in the result tag.
            //The convertAmount function is called with the user-entered amount as an argument.
            //The convertAmount function uses the exchange rates data to calculate the converted amount and display the result.
            

            const fromRates = data.conversion_rates[fromCurrencySelectTag.value];
            const toRates = data.conversion_rates[toCurrencySelectTag.value];

            //The exchange rates for the selected currencies are retrieved from the data object using the currency codes.

            const perRate = (1 * (toRates / fromRates)).toFixed(2);
            const convertedAmount = (amount * (toRates / fromRates)).toFixed(2);

            //The conversion rate and the converted amount are calculated using the exchange rates and the user-entered amount.
            resultTag.style.color = "black";
            status.textContent = `1 ${fromCurrencySelectTag.value} = ${perRate} ${toCurrencySelectTag.value}`;
            resultTag.textContent = `${amount} ${fromCurrencySelectTag.value} = ${convertedAmount} ${toCurrencySelectTag.value}`;

            btn.disabled = false;
            btn.style.color = "black";
            btn.style.cursor = "pointer";
            btn.textContent = "Convert";
        })
        .catch(error => console.log(`Additional information about error: ${error}`));
}





// Fetch API Data with proper validation 

//The fetchData function is an asynchronous function that takes a URL as an argument.
async function fetchData(url) {

    try {
        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        //The response.ok property checks if the HTTP status code indicates a successful response 
        //(i.e., status codes in the range 200-299).


        //The await response.json() method is used to parse the response body as JSON, 
        //and the parsed data is stored in the data variable.
        const data = await response.json();
        return data;
    }
    catch (error) {
        resultTag.style.color = "red";
        resultTag.textContent = `Fetch API Error: ${error}`;

        throw error;
    }
}
