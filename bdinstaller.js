/** @param {import(".").NS } ns */

const argsShema = [
    ["limit", -1],
    ["verbosity", 2],
    ["toastmsg", 0]
]

export function autocomplete(data, args) {
    data.flags(argsShema);
    return [];
}

function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);

        scan(ns, server, child, list);
    }
}

export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}

export function getHackFileCount(ns) {
    var count = 0;
    if (ns.fileExists("BruteSSH.exe","home")) count++;
    if (ns.fileExists("FTPCrack.exe","home")) count++;
    if (ns.fileExists("relaySMTP.exe","home")) count++;
    if (ns.fileExists("HTTPWorm.exe","home")) count++;
    if (ns.fileExists("SQLInject.exe","home")) count++;
    return count;
}

export function varDumpArray(theArray, preDefine = "", afterDefine = "") {
    var tStr = "";
    for (var theValue of theArray) {
        tStr += preDefine + theValue + afterDefine;
    }
    return tStr;
}

function recursiveScan(ns, parent, server, target, route) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }
    return false;
}

export function sPrint(ns, msg = "", verbosity = 3, toast = 0) {
    switch(msg.split(" ", 1)[0].toLowerCase()) {
        case "debug":
            if (verbosity > 4) ns.tprint("ERROR " + msg.substring(msg.indexOf(" ") + 1));
            break;
        case "error":
            if (verbosity > 3) ns.tprint(msg);
            break;
        case "warning":
            if (verbosity > 2) ns.tprint(msg);
            break;
        case "info":
            if (verbosity > 1) ns.tprint(msg);
            break;
        case "success":
            ns.tprint(msg);
            break;
        default:
            msg = "SUCCESS " + msg;
            ns.tprint(msg);
    }
    if (toast && (msg.split(" ", 1)[0].toLowerCase() != "debug")) ns.toast(msg.substring(msg.indexOf(" ") + 1),msg.split(" ", 1)[0].toLowerCase(), toast);
    else if (toast && verbosity > 4) ns.toast(msg.substring(msg.indexOf(" ") + 1), "error", toast);
    ns.print(msg);
}

export async function HackThePlanet(ns, target) {
    if (ns.fileExists('BruteSSH.exe', 'home')) await ns.brutessh(target);
    if (ns.fileExists('FTPCrack.exe', 'home')) await ns.ftpcrack(target);
    if (ns.fileExists('relaySMTP.exe', 'home')) await ns.relaysmtp(target);
    if (ns.fileExists('HTTPWorm.exe', 'home')) await ns.httpworm(target);
    if (ns.fileExists('SQLInject.exe', 'home')) await ns.sqlinject(target);
    await ns.nuke(target);
}

export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("print");

    var options = ns.flags(argsShema);

	var checkProcess = ns.ps(ns.getHostname());
	for (var i=0;i<checkProcess.length;i++) {
		if (checkProcess[i].filename == ns.getScriptName() && JSON.stringify(checkProcess[i].args) !== JSON.stringify(ns.args)) {
			sPrint(ns, ns.vsprintf("ERROR %s is currently running on PID %i! please kill this script before you start again!", [checkProcess[i].filename, checkProcess[i].pid]), options.verbosity, options.toastmsg);
			ns.exit();
		}
	}

    if (options.limit > ns.getHackingLevel() || options.limit < 0) options.limit = ns.getHackingLevel();
    let allServers = list_servers(ns).filter(s => !ns.getServer(s).backdoorInstalled && (ns.hasRootAccess(s) || (ns.getServerRequiredHackingLevel(s) <= options.limit && getHackFileCount(ns) >= ns.getServerNumPortsRequired(s))));

    if (allServers.length) {
        var startServer = ns.getCurrentServer();
        sPrint(ns, "INFO found server: "+varDumpArray(allServers, ", ").substring(2), options.verbosity, options.toastmsg);

        while (allServers.length) {
            var target = allServers.shift();
            let route = [];
            sPrint(ns, ns.vsprintf("INFO Go from \"%s\" to \"%s\"", [ns.getCurrentServer(), target]), options.verbosity, options.toastmsg);
            if (!ns.serverExists(target)) {
                sPrint(ns, "ERROR Server don't exists more!", options.verbosity, options.toastmsg);
                continue;
            }
            recursiveScan(ns, '', ns.getCurrentServer(), target, route);
            for (const i in route) {
                await ns.sleep(10);
                sPrint(ns, ns.vsprintf("DEBUG jump from %s to %s", [ns.getCurrentServer(), route[i]]), options.verbosity, options.toastmsg);
                await ns.connect(route[i]);
            }
            if (!ns.hasRootAccess(target)) {
                sPrint(ns, "WARNING we need to hack the Server!", options.verbosity, options.toastmsg);
                await HackThePlanet(ns, target);
            }
            sPrint(ns, "INFO install backdoor now ...", options.verbosity, options.toastmsg);
            await ns.installBackdoor();
            sPrint(ns, "SUCCESS Backdoor installed!", options.verbosity, options.toastmsg);
            let tmpNewServerList = list_servers(ns).filter(s => !ns.getServer(s).backdoorInstalled && (ns.hasRootAccess(s) || (ns.getServerRequiredHackingLevel(s) <= options.limit && getHackFileCount(ns) >= ns.getServerNumPortsRequired(s))));
            let addedServer = tmpNewServerList.filter(s => !allServers.includes(s));
            let deltedServer = allServers.filter(s => !tmpNewServerList.includes(s));
            if (addedServer.length) sPrint(ns, "WARNING Serverlist has changed, new server added: "+varDumpArray(addedServer, ", ").substring(2), options.verbosity, options.toastmsg);
            if (deltedServer.length) sPrint(ns, "WARNING Serverlist has changed, old server deleted: "+varDumpArray(deltedServer, ", ").substring(2), options.verbosity, options.toastmsg);
            allServers = tmpNewServerList;
        }
        
        let route = [];
        sPrint(ns, ns.vsprintf("INFO Go from \"%s\" back to the startserver \"%s\"", [ns.getCurrentServer(), startServer]), options.verbosity, options.toastmsg);
        recursiveScan(ns, '', ns.getCurrentServer(), startServer, route);
        for (const i in route) {
            await ns.sleep(10);
            await ns.connect(route[i]);
        }
        sPrint(ns, "SUCCESS Ready with all, exit myself.", options.verbosity, options.toastmsg);
    } else {
        sPrint(ns, "WARNING Keine Server gefunden", options.verbosity, options.toastmsg);
    }
}