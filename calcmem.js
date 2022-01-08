/** @param {NS} ns **/
export function autocomplete(data, args) {
	if (args.length == 1) {
		return [...data.scripts];
	}
	if (args.length == 2) {
		return [...data.servers];
	}
}

export async function main(ns) {
	var scriptName = ns.args[0];
	var hostName = "";
	if (ns.args.length > 1) {
		hostName = ns.args[1];
	} else {
		hostName = ns.getHostname();
	}
	var scriptUsedRam = ns.getScriptRam(scriptName, ns.getHostname());
	var maxServerRam = ns.getServerMaxRam(ns.getHostname());
	var usedServerRam = ns.getServerUsedRam(ns.getHostname());
	var ownRam = ns.getScriptRam(ns.getScriptName(), ns.getHostname());
	var freeServerRam = maxServerRam - (usedServerRam - ownRam);
	var scriptMaxThreads = Math.floor(freeServerRam / scriptUsedRam);
	ns.tprint(scriptName + " needs " + scriptUsedRam + " GB");
	ns.tprint("Free RAM is " + freeServerRam + " GB on " + hostName);
	ns.tprint("you can start this Script with " + scriptMaxThreads + " max threads!");
}