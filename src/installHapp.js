import { installDna, installUi } from "./utils";

export const installHapp = async (happ, agentPubKey) => {
    try {
        await installDna(happ, agentPubKey)
        await installUi(happ);
    } catch(e) {
        throw new Error(e);
    }
}
