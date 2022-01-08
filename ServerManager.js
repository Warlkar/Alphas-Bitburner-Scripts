/** @param {NS} ns **/

export function getMaxRam(ns, currentRAM = 0) {
    if (currentRAM < 1) currentRAM = 1;
    else currentRAM = Math.pow(2, Math.floor(Math.log(currentRAM)/Math.log(2))+1);
    if (ns.getPurchasedServerCost(currentRAM) > ns.getPlayer().money) return false;

    for (var changedRam = currentRAM; changedRam < ns.getPurchasedServerMaxRam(); changedRam *= 2) {
        if (ns.getPurchasedServerCost(changedRam) > ns.getPlayer().money) return changedRam / 2;
    }

    return ns.getPurchasedServerMaxRam();
}

export function isRun(ns, processName, hostName = "home") {
    let processList = [];
    processList = ns.ps(hostName);
    for (var process of processList) {
        if (process.filename == processName) return true;
    }
    return false;
}

export async function main(ns) {
    ns.tprint("Start Autobuy and Autoupgrade Server ...");
    var pServers = ns.getPurchasedServers();
    if (!pServers.length) {
        while (!pServers.length) {
            if (getMaxRam(ns)) {
                let rndName = "pServ-" + getMaxRam(ns) + "-" + (1000000000+(Math.random() * 8999999999)).toFixed(0);
                if (!ns.serverExists(rndName)) {
                    ns.purchaseServer(rndName, getMaxRam(ns));
                    ns.tprint("Purchased First New Server!: " + rndName);
                    if (!isRun(ns, "bdinstaller.js")) await ns.exec("bdinstaller.js", "home", 1, "--toastmsg", "5000");
                }
                pServers = ns.getPurchasedServers()
            }
            await ns.sleep(5000);
        }
    }
    pServers = pServers.sort(function (a, b) { return ns.getServerMaxRam(a) - ns.getServerMaxRam(b); });
    while (ns.getServerMaxRam(pServers[0]) < ns.getPurchasedServerMaxRam()) {
        if (pServers.length < ns.getPurchasedServerLimit()) {
            if (getMaxRam(ns)) {
                let rndName = "pServ-" + getMaxRam(ns) + "-" + (1000000000+(Math.random() * 8999999999)).toFixed(0);
                if (!ns.serverExists(rndName)) {
                    ns.purchaseServer(rndName, getMaxRam(ns));
                    ns.tprint("Purchased New Server!: " + rndName);
                    if (!isRun(ns, "bdinstaller.js")) await ns.exec("bdinstaller.js", "home", 1, "--toastmsg", "5000");
                }
                pServers = ns.getPurchasedServers().sort(function (a, b) { return ns.getServerMaxRam(a) - ns.getServerMaxRam(b); });
            }
        } else {
            let curRam = ns.getServerMaxRam(pServers[0]);
            if (getMaxRam(ns, curRam)) {
                let rndName = "pServ-" + getMaxRam(ns, curRam) + "-" + (1000000000+(Math.random() * 8999999999)).toFixed(0);
                if (!ns.serverExists(rndName)) {
                    await ns.kill("runner.js", "home");
                    while (!await ns.deleteServer(pServers[0])) { await ns.killall(pServers[0]); }
                    ns.purchaseServer(rndName, getMaxRam(ns, curRam));
                    ns.tprintf("Upgrade %s to %s", pServers[0], rndName);
                    await ns.exec("runner.js", "home");
                    if (!isRun(ns, "bdinstaller.js")) await ns.exec("bdinstaller.js", "home", 1, "--toastmsg", "5000");
                }
                pServers = ns.getPurchasedServers().sort(function (a, b) { return ns.getServerMaxRam(a) - ns.getServerMaxRam(b); });
            }
        }
        await ns.sleep(100);
    }
    ns.tprint("All Server Maximized!");
}