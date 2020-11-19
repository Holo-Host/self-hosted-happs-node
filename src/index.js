import { getListOfHapps } from "./listOfHapps"
import { installHapp } from "./installHapp"
import { createAgent, startHappInterface, listInstalledApps } from "./utils"

const main = async () => {
    const listOfHapps = getListOfHapps();

    // Make sure app interface is started
    await startHappInterface();

    // Generate new agent
    const agentPubKey = await createAgent();

    const installed = await listInstalledApps();
    let installedMap = {};
    for (let happ of installed) {
        const happ_id = happ.split(':', 1)[0];
        installedMap[happ_id] = true;
    }
    for (const happ of listOfHapps) {
        if (installedMap[happ.app_id]) {
            console.log(`${happ.app_id} already installed`)
        } else {
            await installHapp(happ, agentPubKey);
        }
    }

    console.log(`${listOfHapps.length} self hosted happs installation finished.`);
}

main()
    .then(()=> process.exit())
    .catch(e => {
        console.error(e.message);
        process.exit(1);
    });
