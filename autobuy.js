/** @param {import(".").NS } ns */

export function myMoney(ns) {
    return ns.getServerMoneyAvailable("home");
}

export async function main(ns) {
    var char = await ns.getPlayer();
    var sLVL = 0;
    for (var sFile of ns.getOwnedSourceFiles()) {
        if (sFile.n = 4) {
            sLVL = sFile.lvl;
        }
    }
    if (sLVL > 0) {
        if (sLVL > 2) {
            while(!ns.fileExists("NUKE.exe", "home") || !ns.fileExists("b1t_flum3.exe", "home")) {
                if (!ns.isBusy()) {
                    if (!ns.fileExists("NUKE.exe", "home")) {
                        ns.tprint("WARN Auto Create missing NUKE.exe!");
                        ns.createProgram("NUKE.exe");
                    } else if (!ns.fileExists("b1t_flum3.exe", "home")) {
                        ns.tprint("WARN Auto Create missing b1t_flum3.exe!");
                        ns.createProgram("b1t_flum3.exe");
                    } else if (!ns.fileExists("fl1ght.exe", "home")) {
                        ns.tprint("WARN Auto Create missing fl1ght.exe!");
                        ns.createProgram("fl1ght.exe");
                    }
                }
            }
        }
        if (!char.tor || !ns.fileExists("BruteSSH.exe","home") || !ns.fileExists("FTPCrack.exe","home") || !ns.fileExists("relaySMTP.exe","home") || !ns.fileExists("HTTPWorm.exe","home") || !ns.fileExists("SQLInject.exe","home") || !ns.fileExists("ServerProfiler.exe","home") || !ns.fileExists("DeepscanV1.exe","home") || !ns.fileExists("DeepscanV2.exe","home") || !ns.fileExists("AutoLink.exe","home") || !ns.fileExists("Formulas.exe","home")) {
            ns.tprint("INFO Start Autobuy ...");
            while(!char.tor || !ns.fileExists("BruteSSH.exe","home") || !ns.fileExists("FTPCrack.exe","home") || !ns.fileExists("relaySMTP.exe","home") || !ns.fileExists("HTTPWorm.exe","home") || !ns.fileExists("SQLInject.exe","home") || !ns.fileExists("ServerProfiler.exe","home") || !ns.fileExists("DeepscanV1.exe","home") || !ns.fileExists("DeepscanV2.exe","home") || !ns.fileExists("AutoLink.exe","home") || !ns.fileExists("Formulas.exe","home")) {
                char = await ns.getPlayer()
                if (!char.tor) {
                    if (myMoney(ns) > 200000) {
                        ns.purchaseTor();
                        ns.tprint("INFO Auto purchase TOR Router!")
                    }
                } else {
                    if (myMoney(ns) > 5000000000 && !ns.fileExists("Formulas.exe","home")) {
                        ns.tprint("INFO purchased missing Formulas.exe!");
                        ns.purchaseProgram("Formulas.exe");
                    } else if (myMoney(ns) > 250000000 && !ns.fileExists("SQLInject.exe","home")) {
                        ns.tprint("INFO purchased missing SQLInject.exe!");
                        ns.purchaseProgram("SQLInject.exe");
                    } else if (myMoney(ns) > 30000000 && !ns.fileExists("HTTPWorm.exe","home")) {
                        ns.tprint("INFO purchased missing HTTPWorm.exe!");
                        ns.purchaseProgram("HTTPWorm.exe");
                    } else if (myMoney(ns) > 25000000 && !ns.fileExists("DeepscanV2.exe","home")) {
                        ns.tprint("INFO purchased missing DeepscanV2.exe!");
                        ns.purchaseProgram("DeepscanV2.exe");
                    } else if (myMoney(ns) > 5000000 && !ns.fileExists("relaySMTP.exe","home")) {
                        ns.tprint("INFO purchased missing relaySMTP.exe!");
                        ns.purchaseProgram("relaySMTP.exe");
                    } else if (myMoney(ns) > 1500000 && !ns.fileExists("FTPCrack.exe","home")) {
                        ns.tprint("INFO purchased missing FTPCrack.exe!");
                        ns.purchaseProgram("FTPCrack.exe");
                    } else if (myMoney(ns) > 1000000 && !ns.fileExists("AutoLink.exe","home")) {
                        ns.tprint("INFO purchased missing AutoLink.exe!");
                        ns.purchaseProgram("AutoLink.exe");
                    } else if (myMoney(ns) > 500000 && !ns.fileExists("BruteSSH.exe","home")) {
                        ns.tprint("INFO purchased missing BruteSSH.exe!");
                        ns.purchaseProgram("BruteSSH.exe");
                    } else if (myMoney(ns) > 500000 && !ns.fileExists("DeepscanV1.exe","home")) {
                        ns.tprint("INFO purchased missing DeepscanV1.exe!");
                        ns.purchaseProgram("DeepscanV1.exe");
                    } else if (myMoney(ns) > 500000 && !ns.fileExists("ServerProfiler.exe","home")) {
                        ns.tprint("INFO purchased missing ServerProfiler.exe!");
                        ns.purchaseProgram("ServerProfiler.exe");
                    }
                }
                await ns.sleep(100);
            }
            ns.tprint("INFO Stop Autobuy ... all Software Purchased!");
        } else {
            ns.tprint("ERROR you have all buyable executefiles!");
        }
    } else {
        ns.tprint("ERROR for Autobuy you need the Singularity API!");
    }
}