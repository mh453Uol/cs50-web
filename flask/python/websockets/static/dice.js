//const template = Handlebars.compile("<li>You rolled a {{ value }}</li>");
//const template = Handlebars.compile(`<img src='./static/img/Dice-{{face}}.svg' class="dice-img"></img>`);

const handlebarTemplate = document.getElementById("result").innerHTML;
const template = Handlebars.compile(handlebarTemplate);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#roll').onclick = () => {
        const rollAmount = document.getElementById('roll-amount').value;

        const rolls = roll(rollAmount);

        document.querySelector('#rolls').innerHTML += renderRoll(template, rolls)
    }
});

function roll(amount = 0) {
    rolls = [];

    for (let i = 0; i < amount; i++) {
        rolls.push(rollDice());
    }

    return roll;
}

function rollDice() {
    const roll = Math.floor((Math.random() * 6) + 1);
    return roll;
}

function renderRoll(template, rolls) {
    return template({
        'values': this.rolls,
        'total': this.rolls.reduce((a, b) => a + b)
    });
}