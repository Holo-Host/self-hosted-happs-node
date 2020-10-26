import { ADMIN_PORT, HAPP_PORT } from "./constants";
import { AdminWebsocket } from "@holochain/conductor-api";
import tmp from "tmp";
import unzipper from "unzipper";
import fs from "fs";

// Needs to return a promise

const installDna = async (happ, agentPubKey) => {
    // Import DNA from url to temp [TODO: unmock]
    let dnaPath = "/Users/pj/hc/holochain/elemental-chat/elemental-chat.dna.gz";
    // Install via admin interface
    let app, app_interface;
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );

        app = await adminWebsocket.installApp({
            agent_key: agentPubKey,
            app_id: happ.happId,
            dnas: [
                {
                    nick: happ.happId, 
                    path: dnaPath 
                }
            ],
        });

        await adminWebsocket.activateApp({ app_id: app.app_id });
        app_interface = await adminWebsocket.attachAppInterface({ port: HAPP_PORT });
    } catch(e) {
        throw new Error(`Failed to install dna ${happ.happId} with error ${e.message}`);
    }

    console.log(`Successfully installed dna ${app.app_id} on port ${app_interface.port}`);
    return app.cell_data[0][0];
}

const installUi = (happ, agentPubKey, cellId) => {
    // Import UI to temp [TODO: unmock]
    try {
        let uiPath = "/tmp/elemental-chat-ui.zip";
        let unpackPath = `/tmp/var/lib/self-hosted-happs/uis/${happ.happId}`;
        fs.createReadStream(uiPath).pipe(unzipper.Extract({ path: unpackPath }));

        // Update AGENT_KEY_VALUE and CELL_ID_VALUE in UI
        fs.readFile(`${unpackPath}/index.html`, 'utf8', (err,data) => {
            if (err) return console.log(err);

            let result = data.replace(/AGENT_KEY_VALUE/g, agentPubKey);
            result = result.replace(/CELL_ID_VALUE/g, cellId);
        
            fs.writeFile(`${unpackPath}/index.html`, result, 'utf8', (err) => {
                if (err) return console.log(err);
            });
        });
    } catch(e) {
        throw new Error(`Failed to install UI ${happ.happId} with error ${e.message}`);
    }
}

export const installHapp = async (happ, agentPubKey) => {
    try {
        const cellId = await installDna(happ, agentPubKey);
        installUi(happ, agentPubKey, cellId)
    } catch(e) {
        throw new Error(e.message);
    }
}

export const createAgent = async () => {
    const adminWebsocket = await AdminWebsocket.connect(
        `ws://localhost:${ADMIN_PORT}`
    );
    
    const keyBuffer = await adminWebsocket.generateAgentPubKey();
    console.log(`New agent has been created`);
    return keyBuffer;
}

