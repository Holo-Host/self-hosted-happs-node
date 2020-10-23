import { ADMIN_PORT, HAPP_PORT } from "./constants";
import { AdminWebsocket } from "@holochain/conductor-api";
import tmp from "tmp";
import unzip from "unzip",
import fs from "fs";

// Needs to return a promise

const installDna = async (happ, agentPubKey) => {
    // Import DNA from url to temp [TODO: unmock]
    let dnaPath = "/tmp/elemental-chat.dna.gz";
    // Install via admin interface
    const adminWebsocket = await AdminWebsocket.connect(
        `ws://localhost:${ADMIN_PORT}`
    );
    
    const app = await adminWebsocket.installApp({
        agent_key: agentPubKey,
        app_id: happ.happ-id,
        dnas: {
            nick: happ.happ-id, 
            path: dnaPath 
        },
    });

    await adminWebsocket.activateApp({ app_id: happ.happ-id });
    await adminWebsocket.attachAppInterface({ HAPP_PORT });

    console.log(`Successfully installed dna ${happ.happ-id} on port ${HAPP_PORT}`);
    return app.cell_data[0][0];
}

const installUi = (happ, agentPubKey, cellId) => {
    // Import UI to temp [TODO: unmock]
    let uiPath = "/tmp/elemental-chat-ui.zip";
    let unpackPath = `/var/lib/self-hosted-happs/uis/${happ.happ-id}`;
    fs.createReadStream(uiPath).pipe(unzip.Extract({ path: unpackPath }));

    // Update AGENT_KEY_VALUE and CELL_ID_VALUE in UI
    fs.readFile(`${unpackPath}/index.html`, 'utf8', (err,data) => {
        if (err) return console.log(err);

        let result = data.replace(/AGENT_KEY_VALUE/g, agentPubKey);
        result = result.replace(/CELL_ID_VALUE/g, cellId);
      
        fs.writeFile(`${unpackPath}/index.html`, result, 'utf8', (err) => {
            if (err) return console.log(err);
        });
    });
}

export const installHapp = async (happ, agentPubKey) => {
    const cellId = await installDna(happ, agentPubKey);
    installUi(agentPubKey, cellId);
}

export const createAgent = async () => {
    const adminWebsocket = await AdminWebsocket.connect(
        `ws://localhost:${ADMIN_PORT}`
    );
    
    return await adminWebsocket.generateAgentPubKey();
}

