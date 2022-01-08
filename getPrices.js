/** @param {NS} ns **/

export function getFloat2Money(fMoney = 0.0) {
    var tStr = "";
    if (fMoney >= 1000) tStr = formatNumber(1000, fMoney).toFixed(3).toString();
    else tStr = fMoney.toFixed(3);
    if (tStr.substring(tStr.length - 3) == "000") tStr = tStr.substring(0, tStr.length - 4);
    else if (tStr.substring(tStr.length - 2) == "00") tStr = tStr.substring(0, tStr.length - 2);
    else if (tStr.substring(tStr.length - 1) == "0") tStr = tStr.substring(0, tStr.length - 1);
    if (fMoney >= 1000) {
        return "$" + tStr + moneySuffix[logBaseValue(1000, fMoney) - 1];
    } else {
        return "$" + tStr;
    }
}

export function getFloatMemoryA(fMemory = 0.0) {
    var tStr = "";
    if (fMemory >= 1000) tStr = formatNumber(1024, fMemory).toFixed(3).toString();
    else tStr = fMemory.toFixed(3);
    if (tStr.substring(tStr.length - 3) == "000") tStr = tStr.substring(0, tStr.length - 4);
    else if (tStr.substring(tStr.length - 2) == "00") tStr = tStr.substring(0, tStr.length - 2);
    else if (tStr.substring(tStr.length - 1) == "0") tStr = tStr.substring(0, tStr.length - 1);
    if (fMemory >= 1000) {
        return tStr + memorySuffiyA[logBaseValue(1024, fMemory) - 1];
    } else {
        return tStr+ " GiB";
    }
}

export function getFloatMemoryB(fMemory = 0.0) {
    var tStr = "";
    if (fMemory >= 1000) tStr = formatNumber(1000, fMemory).toFixed(3).toString();
    else tStr = fMemory.toFixed(3);
    if (tStr.substring(tStr.length - 3) == "000") tStr = tStr.substring(0, tStr.length - 4);
    else if (tStr.substring(tStr.length - 2) == "00") tStr = tStr.substring(0, tStr.length - 2);
    else if (tStr.substring(tStr.length - 1) == "0") tStr = tStr.substring(0, tStr.length - 1);
    if (fMemory >= 1000) {
        return tStr + memorySuffiyB[logBaseValue(1000, fMemory) - 1];
    } else {
        return tStr+ " GB";
    }
}

let memorySuffiyA = [" TiB", " PiB"]
let memorySuffiyB = [" TB", " PB"]
let moneySuffix = ["k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"]

function logBaseValue(base, value) {
    return Math.floor(Math.log(value) / Math.log(base))
}
function formatNumber(base, value) {
    return value / Math.pow(base, logBaseValue(base, value))
}

export async function main(ns) {
    if (ns.args.length > 0) {
        for (var arg of ns.args) {
            let i = Math.pow(2, Math.floor(Math.log(arg)/Math.log(2)));
            if (i > ns.getPurchasedServerMaxRam()) i = ns.getPurchasedServerMaxRam();
            ns.tprintf("Server mit %s / %s RAM kostet %s ($%i)", getFloatMemoryA(i), getFloatMemoryB(i), getFloat2Money(ns.getPurchasedServerCost(i)), ns.getPurchasedServerCost(i));
        }
    } else {
        for (var i = 1; i <= ns.getPurchasedServerMaxRam(); i *= 2) {
            ns.tprintf("Server mit %s / %s RAM kostet %s ($%i)", getFloatMemoryA(i), getFloatMemoryB(i), getFloat2Money(ns.getPurchasedServerCost(i)), ns.getPurchasedServerCost(i));
        }
    }
}