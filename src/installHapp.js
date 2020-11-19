import { installDna, installUi } from "./utils";

export const installHapp = async (happ, agentPubKey) => {
    try {
        console.log(happ);
        await installDna(happ, agentPubKey)
        await installUi(happ);
    } catch(e) {
        throw new Error(e.message);
    }
}
