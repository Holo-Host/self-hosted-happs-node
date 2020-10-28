import { getListOfHapps } from "./listOfHapps"
import { installHapp } from "./installHapp"
import { createAgent } from "./utils"

const main = async () => {
    const listOfHapps = getListOfHapps();
    const agentPubKey = await createAgent();

    const promises = listOfHapps.map(happ => installHapp(happ, agentPubKey));
    await Promise.all(promises);

    console.log(`${listOfHapps.length} self hosted happs installation finished.`);
}

main()
    .then(()=> process.exit())
    .catch(e => {
        console.error(e.message);
        process.exit(1);
    });