import { getListOfHapps } from "./listOfHapps"
import { installHapp } from "./installHapp"
import { createAgent, startHappInterface, listInstalledApps, installUi } from "./utils"

const main = async () => {
    const listOfHapps = getListOfHapps();

    // Make sure app interface is started
    await startHappInterface();

    // Generate new agent
    const agentPubKey = await createAgent();

    const installed = await listInstalledApps();
    for (const happ of listOfHapps) {
        if (installed.includes(`${happ.app_id}:${happ.version}`)) {
            console.log(`${happ.app_id} already installed, just downloading UI`)
            try {
                await installUi(happ);
            } catch(e) {
                throw new Error(e);
            }
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
