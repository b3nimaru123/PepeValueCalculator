function onButtonClick(objs = [], inputBox) {
    var Input = document.getElementById(inputBox)

    Input.style.display = 'block'
    Input.style.width = '350px'

    for (let i = 0; i < objs.length; i++) {
        var CertainObject = document.getElementById(objs[i])
        if (Values.includeLottery == true) {
            var Lottery = document.getElementById('lottery_chance')
            var Profit = document.getElementById('profit')
            Lottery.style.display = 'block';
            Profit.style.display = 'block';
        }

        CertainObject.innerHTML = getText(objs[i])
    }

}
function init(self, objs = [], recalc = []) {
    var Self = document.getElementById(self)

    for (let i = 0; i < recalc.length; i++) {
        var Recalculate = document.getElementById(recalc[i])
        Recalculate.style.display = 'block'
        Recalculate.style.width = '250px'
    }
    for (let i = 0; i < objs.length; i++) {
        var CertainObject = document.getElementById(objs[i])
        CertainObject.innerHTML = getText(objs[i])
    }

    Self.style.display = 'none'
}

function focusLost(index, obj, index2) {
    var Obj = document.getElementById(obj).value
    if (!index2 == '') {
        let text = String(Obj)
        const values = text.split(",", 2)
        Values[index] = parseInt(values[0])
        Values[index2] = parseInt(values[1])
    }
    Values[index] = parseInt(Obj)
}

function getText(type) {
    if (type == 'level') {
        return format(calculate(type)) + ' Xp required for the next Level at Level: ' + format(Values.level)
    }
    if (type == 'job_level') {
        return format(calculate(type)) + ' Job Xp required for the next Job Level at Job Level: ' + format(Values.job_level)
    }
    if (type == 'job' || type == 'job_tier') {
        if (type == 'job_tier') {
            return 'With Job: ' + jobs_list[Values.job] + ' and Donator Tier: ' + tier_list[Values.tier]
        } else {
            return 'With Job: ' + jobs_list[Values.job]
        }
    }
    if (type == 'xp_normal') {
        if (Values.event > 1) {
            return format(calculate(type)) + ' Xp gained on /work shift' + ' (x' + format(Values.event) + ' Xp Event)'
        }
        return format(calculate(type)) + ' Xp gained on /work shift'
    }
    if (type == 'xp_job') {
        if (Values.event > 1) {
            return format(calculate(type)) + ' Job Xp gained on /work shift' + ' (x' + format(Values.event) + ' Xp Event)'
        }
        return format(calculate(type)) + ' Job Xp gained on /work shift'
    }
    if (type == 'salary') {
        return '¥ ' + format(calculate(type)) + ' Shards Salary gained on /work shift'
    }
    if (type == 'profit') {
        profit, profitPercent = calculate(type)
        return format(profit) + ' Profit from winning the Lottery' + ' (' + format(profitPercent) + '%)'
    }
    if (type == 'lottery_chance') {
        return round(formatChance()) + '% Chance to win the lottery with: ' + format(Values.your_tickets) + ' (' + format(Values.approximate_Tickets) + ' Total)'
    }
}

function formula(type) {
    if (type == 'level') {
        if (Values.level <= 0) {
            return Math.round(100 / 0.95 * 1 * 2 * 0.75 + 100 / 0.95 * 1 - 1 * 2 * 0.75)
        }
        else {
            return Math.round(100 / 0.95 * Values.level * 2 * 0.75 + 100 / 0.95 * Values.level - 1 * 2 * 0.75)
        }
    }
    if (type == 'job_level') {
        if (Values.job_level <= 0) {
            return Math.round(100 / 0.95 * 1 * 2 * 0.75 + 100 / 0.95 * 1 - 1 * 2 * 0.75) * 1.1
        }
        else {
            return Math.round(100 / 0.95 * Values.job_level * 2 * 0.75 + 100 / 0.95 * Values.job_level - 1 * 2 * 0.75)
        }
    }
    if (type == 'xp_normal') {
        if (Values.job_level <= 0) {
            return Math.round(Salary() / 1500 * 1 * 1.5 * 2 * Mults.xp_mult) * Values.event
        }
        else {
            return Math.round(Salary() / 1500 * Values.level * 1.5 * 2 * Mults.xp_mult) * Values.event
        }
    }
    if (type == 'xp_job') {
        if (Values.job_level <= 0) {
            return Math.round(Salary() / 1500 * 1 * 1.5 * 2 * Mults.xp_mult * 0.8) * Values.event
        }
        else {
            return Math.round(Salary() / 1500 * Values.job_level * 1.5 * 2 * Mults.xp_mult * 0.8) * Values.event
        }
    }
    if (type == 'salary') {
        let job_mult = Values.job_level / 100 * 10
        if (Values.job_level <= 0) {
            return Math.round(Salary() * 1 * 0.5 * Mults.money_mult)
        }
        else {
            return Math.round(Salary() * (job_mult + 1) * 0.5 * Mults.money_mult)
        }
    }
    if (type == 'profit') {
        if (Values.your_tickets <= 0 || Values.approximate_Tickets <= 0 || Values.your_tickets <= 0 && Values.approximate_Tickets <= 0) {
            console.error(error[1])
            return error[1];
        }
        price = Math.round((Values.approximate_Tickets * 1000) * 0.85)
        profit = Math.round(price - Values.your_tickets * 1000)
        profitPercent = Math.round((profit / (Values.approximate_Tickets * 1000)) * 100)

        return profit, profitPercent
    }
}

function calculate(type) {
    return Math.floor(formula(type))
}

function formatChance() {
    return (Values.your_tickets / Values.approximate_Tickets) * 100
}

function Salary() {
    return 10000 + (5000 * Values.job)
}

function format(val) {
    for (let i = 0; i < suffixes.length - 1; i++) {
        if (parseInt(val) < 1000) {
            return String(val)
        }
        else if (parseInt(val) <= 0) {
            return String(1)
        }
        else if (parseInt(val) < Math.pow(10, (i * 3))) {
            return String(Math.floor(val / ((Math.pow(10, (i - 1) * 3)) / 100)) / (100) + suffixes[i - 1])
        }
    }
}

function round(val) {
    return String(parseFloat(val.toFixed(4)))
}

let suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "Ud",
    "Dd",
    "Td",
    "Qad",
    "Qid",
    "Sxd",
    "Spd",
    "Ocd",
    "Nod",
    "Vg",
    "Uvg",
    "Dvg",
    "Tvg",
    "Qavg",
    "Qivg",
    "Sxvg",
    "Spvg",
    "Ocvg",
    "Novg",
    "Tg",
    "Utg",
    "Dtg",
    "Ttg",
    "Qatg",
    "Qitg",
    "Sxtg",
    "Sptg",
    "Octg",
    "Notg",
    "Qag",
    "Uqag",
    "Dqag",
    "Tqag",
    "Qaqag",
    "Qiqag",
    "Sxqag",
    "Spqag",
    "Ocqag",
    "Noqag",
    "Qig",
    "Uqig",
    "Dqig",
    "Tqig",
    "Qaqig",
    "Qiqig",
    "Sxqig",
    "Spqig",
    "Ocqig",
    "Noqig",
    "Sxg",
    "Usxg",
    "Dsxg",
    "Tsxg",
    "Qasxg",
    "Qisxg",
    "Sxsxg",
    "Spsxg",
    "Ocsxg",
    "Nosxg",
    "Spg",
    "Uspg",
    "Dspg",
    "Tspg",
    "Qaspg",
    "Qispg",
    "Sxspg",
    "Spspg",
    "Ocspg",
    "Nospg",
    "Ocg",
    "Uocg",
    "Docg",
    "Tocg",
    "Qaocg",
    "Qiocg",
    "Sxocg",
    "Spocg",
    "Ococg",
    "Noocg",
    "Nog",
    "Unog",
    "Dnog",
    "Tnog",
    "Qanog",
    "Qinog",
    "Sxnog",
    "Spnog",
    "Ocnog",
    "Nonog",
    "Ce",
    "Uce",
]

let jobs_list = [
    "Janitor",
    "Discord Mod",
    "Roblox Dev",
    "Police",
    "Influencer",
]
let money_boost = {
    "Donator": 1.5,
    "Super Donator": 1.7,
    "Ultra Donator": 2,
}
let xp_boost = {
    "Donator": 1.2,
    "Super Donator": 1.3,
    "Ultra Donator": 1.5,
}
let tier_list = [
    "Donator",
    "Super Donator",
    "Ultra Donator",
]

let Values = {
    level: 1,
    job_level: 1,
    job: 0,
    your_tickets: 1,
    approximate_Tickets: 100,
    tier: 0,
    event: 1,
    includeLottery: false,
}
let Mults = {
    money_mult: money_boost[tier_list[Values.tier]],
    xp_mult: xp_boost[tier_list[Values.tier]],
}

let error = ["JobNotInListError", "TriedToDivideByZeroError"]