const errorB = document.getElementById("errors")
const pInput = document.getElementById("pInput")
const qInput = document.getElementById("qInput")
const kInput = document.getElementById("kInput")
const dInput = document.getElementById("dInput")
const nLabel = document.getElementById("nLabel")
const phinLabel = document.getElementById("phinLabel")

const d1Label = document.getElementById("d1")
const d2Label = document.getElementById("d2")
const d3Label = document.getElementById("d3")
const d4Label = document.getElementById("d4")


// From https://stackoverflow.com/a/49842625
function isPrime(num) { // returns boolean
    if (num <= 1) return false; // negatives
    if (num % 2 == 0 && num > 2) return false; // even numbers
    const s = Math.sqrt(num); // store the square to loop faster
    for(let i = 3; i <= s; i += 2) { // start from 3, stop at the square, increment in twos
        if(num % i === 0) return false; // modulo shows a divisor was found
    }
    return true;
}

//From https://www.w3resource.com/javascript-exercises/javascript-math-exercise-8.php
function gcd_two_numbers(x, y) {
    // Check if both x and y are of type number, if not, return false.
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
        return false;
    
    // Take the absolute values of x and y to ensure positivity.
    x = Math.abs(x);
    y = Math.abs(y);
    
    // Iterate using the Euclidean algorithm to find the GCD.
    while(y) {
        // Store the value of y in a temporary variable t.
        var t = y;
        // Calculate the remainder of x divided by y and assign it to y.
        y = x % y;
        // Assign the value of t (previous value of y) to x.
        x = t;
    }
    // Return the GCD, which is stored in x after the loop.
    return x;
}


function updateInfo() {
    let errorText = ""
    let p = Number(pInput.value)
    let q = Number(qInput.value)
    let errorp = isPrime(p)
    let errorq = isPrime(q)
    
    if (errorp && errorq){
        nLabel.textContent = p * q
        phinLabel.textContent = (p-1) * (q-1)
    }

    let k = Number(kInput.value)
    let n = Number(nLabel.textContent)
    let phin = Number(phinLabel.textContent)
    let d = Number(dInput.value)


    let errork1 = isPrime(k)
    let errork2 = k > phin
    let errork3 = gcd_two_numbers(k,phin) === 1

    if (errorp && errorq && errork1 && errork2 && errork3) {
        let counter = 0
        let dRes = []
        let i = 0
        while (counter < 4 && i < 500) {
            let tempd = (1 + (i*phin)) / k
            if (Number.isInteger(tempd)) {
                dRes.push(tempd)
                counter++
            }
            i++
        }
        d1Label.textContent = dRes[0]
        d2Label.textContent = dRes[1]
        d3Label.textContent = dRes[2]
        d4Label.textContent = dRes[3]
    }

    let errord = ((d * k) % phin) === 1

    
    errorText += errorp ? "" : "p no es un número primo.\n"
    errorText += errorq ? "" : "q no es un número primo.\n"
    errorText += errork1 ? "" : "k no es un número primo.\n"
    errorText += errork2 ? "" : "k no puede ser menor a φ(n).\n" + phin
    errorText += errork3 ? "" : "k no es coprimo con φ(n).\n"
    errorText += errord ? "" : "d no es un número válido.\n"
    errorB.textContent = errorText
}
