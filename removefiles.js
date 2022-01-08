/** @param {NS} ns **/
export function autocomplete(data, args) {
	return [...data.scripts];
}

export async function main(ns) {
	var files = [], arg = [];
	for (arg of ns.args) {
		files = ns.ls(ns.getCurrentServer(), arg);
		var file = "";
		for (file of files) {
			ns.tprint("remove \"" + file + "\"");
			ns.rm(file, ns.getCurrentServer());
		}
	}
}