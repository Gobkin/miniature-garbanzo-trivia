const   TAX = 0.13,
        PHONE_PRICE = 99.99,
        ACCESSORY_PRICE = 9.99,
        SPENDING_THRESHOLD = 200;

var bankBalance = prompt("How much money do you have?");
var amount = 0;

calculateTax = function(amount){
    return amount*TAX;
}

formatAmount = function(amount){
    return "$"+amount.toFixed(2);
}

while(amount < bankBalance){
    amount = amount + PHONE_PRICE;

    if(amount < SPENDING_THRESHOLD){
        amount = amount +ACCESSORY_PRICE;
    }
}

amount = amount + calculateTax(amount);

console.log("YOUR PURCHSE"+formatAmount(amount));

if (amount > bankBalance){
    console.log("YOU CANT AFFORD!");
}