import { getListOfHapps } from "./listOfHapps"
import { createAgent, installHapp } from "./installHapp"

const main = async () => {
    const listOfHapps = getListOfHapps();
    const agentPubKey = await createAgent();

    const promises = listOfHapps.map(happ => installHapp(happ, agentPubKey));
    await Promise.all(promises);

    console.log("Self hosted happs installed successfully");
}

main()
    .then(()=> process.exit())
    .catch(e => {
        console.error(e.message);
        process.exit(1);
    });