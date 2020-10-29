import { installDna, installUi } from "./utils";

export const installHapp = async (happ) => {
    try {
        await installDna(happ)
        await installUi(happ);
    } catch(e) {
        throw new Error(e.message);
    }
}
