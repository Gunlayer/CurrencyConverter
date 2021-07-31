"use strict";
const json = `{
    "exchangeRates": [
      {
        "code": "USD",
        "rate": 1
      },
      {
        "code": "EUR",
        "rate": 0.8
      },
      {
        "code": "GBP",
        "rate": 0.71
      },
      {
        "code": "MDL",
        "rate": 18.00
      }
    ]
  }
  `;
class Converter {
    constructor() {
        this.curenciesInput = [];
        this.curenciesOutput = [];
        this.selectIn = document.querySelector("#in");
        this.selectOut = document.querySelector("#out");
        this.result = document.querySelector("#outputValue");
        this.input = document.querySelector("#inputValue");
        this.sortCurrencies();
        this.insertCurrency(this.curenciesInput, this.selectIn);
        this.insertCurrency(this.curenciesOutput, this.selectOut);
        this.convert(this.selectIn, this.selectOut, this.input, this.result);
        this.swap(this.selectIn, this.selectOut, this.input, this.result);
    }
    sortCurrencies() {
        this.curenciesInput = JSON.parse(json).exchangeRates.sort((a, b) => a.code > b.code ? 1 : -1);
        this.curenciesOutput = JSON.parse(json).exchangeRates.sort((a, b) => a.code > b.code ? 1 : -1);
    }
    insertCurrency(array, select) {
        array.forEach(item => {
            select.insertAdjacentHTML("beforeend", this.render(item))
        });

    }
    
    render(item) {
        return `<option value="${item.code}" data-rate="${item.rate}">${item.code}</option>`
    }
    convert(selectIn, selectOut, input, result) {
        let convertValue = () => {
            let rateIn = selectIn.options[this.selectIn.selectedIndex].getAttribute("data-rate");
            let rateOut = selectOut.options[this.selectOut.selectedIndex].getAttribute("data-rate");
            if (isNaN(input.value)) {
                this.removeInvisibleClass();
            } else if (rateIn == rateOut) {
                this.addInvisibleClass();
                result.value = input.value;
            } else {
                this.addInvisibleClass();
                result.value = (input.value / rateIn * rateOut).toFixed(2);
            }
        }
        input.oninput = convertValue;
        selectOut.oninput = convertValue
        selectIn.oninput = convertValue;
    }

    reConvertValues(selectIn, selectOut, input, result) {
        let rateIn = selectIn.options[selectIn.selectedIndex].getAttribute("data-rate");
        let rateOut = selectOut.options[selectOut.selectedIndex].getAttribute("data-rate");
        if (isNaN(input.value)) {
            this.removeInvisibleClass();
        } else {
            this.addInvisibleClass();
            result.value = (input.value / rateIn * rateOut).toFixed(2);
        }
    }
    removeInvisibleClass() {
        document.querySelector(".error-msg").classList.remove("invisible");
        document.querySelector("#inputValue").classList.add("error");
    }
    addInvisibleClass() {
        document.querySelector(".error-msg").classList.add("invisible");
        document.querySelector("#inputValue").classList.remove("error");
    }

    update(array, value) {
        let tmp = undefined;
        for (let i = 0; i < array.length; i++) {
            if (array[i].code == value) {

                tmp = array[i]
                array.splice(i, 1);
            }
        }
        array.unshift(tmp);
    }
    removeCurrency(str, array) {
        array.forEach(item => {
            document.querySelector(str).querySelector("option").remove();
        });

    }
    swap(selectIn, selectOut, input, result) {
        const btn = document.querySelector(".btn")
        btn.addEventListener("click", () => {

            let valueOut = selectOut.options[selectOut.selectedIndex].value;
            let valueIn = selectIn.options[selectIn.selectedIndex].value

            this.update(this.curenciesInput, valueIn);
            this.update(this.curenciesOutput, valueOut);

            let temp = this.curenciesOutput;
            this.curenciesOutput = this.curenciesInput;
            this.curenciesInput = temp;

            this.removeCurrency("#in", this.curenciesInput);
            this.removeCurrency("#out", this.curenciesOutput);

            this.insertCurrency(this.curenciesInput, this.selectIn);
            this.insertCurrency(this.curenciesOutput, this.selectOut);

            this.reConvertValues(selectIn, selectOut, input, result);
        });
    }
}
new Converter();
