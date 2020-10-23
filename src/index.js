import { getListOfHapps } from ./listOfHapps
import { createAgent, installHapp } from ./installHapp

try {
    const listOfHapps = getListOfHapps();
    const agentPubKey = createAgent();

    const promises = listOfHapps.map(happ => installHapp(happ, agentPubKey));
    await Promise.all(promises);

    console.log("Self hosted happs installed successfully");
} catch (e) {
    console.error(e.message);
}