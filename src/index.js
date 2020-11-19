import { getListOfHapps } from "./listOfHapps"
import { installHapp } from "./installHapp"
import { createAgent, startHappInterface } from "./utils"

const main = async () => {
    const listOfHapps = getListOfHapps();

    // Make sure app interface is started
    await startHappInterface();

    // Genetate new agent
    let agentPubKey = await createAgent();

    for (const happ of listOfHapps) {
        await installHapp(happ, agentPubKey);
    }

    console.log(`${listOfHapps.length} self hosted happs installation finished.`);
}

main()
    .then(()=> process.exit())
    .catch(e => {
        console.error(e.message);
        process.exit(1);
    });