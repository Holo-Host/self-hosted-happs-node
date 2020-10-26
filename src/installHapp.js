import { installDna, installUi } from "./utils";

export const installHapp = async (happ, agentPubKey) => {
    try {
        await Promise.all([
            installDna(happ, agentPubKey),
            installUi(happ)
        ]);
    } catch(e) {
        throw new Error(e.message);
    }
}
