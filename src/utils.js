import tmp from "tmp";
import request from "request";
import url from "url";
import extract from "extract-zip";
import fs from "fs";
import { UI_STORE_FOLDER, ADMIN_PORT, HAPP_PORT } from "./constants";
import { AdminWebsocket } from "@holochain/conductor-api";

// Download from url to tmp file
// return tmp file path
const downloadFile = async (downloadUrl) => {
    const fileName = tmp.tmpNameSync();
    let file = fs.createWriteStream(fileName);

    // Clean up url
    let urlObj = new URL(downloadUrl);
    urlObj.protocol = "https";
    downloadUrl = urlObj.toString();

    return new Promise((resolve, reject) => {
        let stream = request({
            uri: downloadUrl
        })
        .pipe(file)
        .on('finish', () => {
            // console.log(`Downloaded file from ${downloadUrl} to ${fileName}`);
            resolve(fileName);
        })
        .on('error', (error) => {
            reject(error);
        })
    })
}

// NOTE: this code assumes a single DNA per hApp.  This will need to be updated when the hApp bundle
// spec is completed, and the hosted-happ config Yaml file will also need to be likewise updated
export const installDna = async (happ) => {
    const dnaPath = await downloadFile(happ.dna_url);
    // Install via admin interface
    let app, appInterface, agentPubKey;
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );

        agentPubKey = await adminWebsocket.generateAgentPubKey();
console.log(`Generated new agent ${agentPubKey.hash.toString('base64')}`);
        app = await adminWebsocket.installApp({
            agent_key: agentPubKey,
            app_id: happ.app_id,
            dnas: [
                {
                    nick: happ.app_id, 
                    path: dnaPath 
                }
            ],
        });

        await adminWebsocket.activateApp({ app_id: app.app_id });
        appInterface = await adminWebsocket.attachAppInterface({ port: HAPP_PORT });
    } catch(e) {
        console.error(`Failed to install dna ${happ.app_id} with error ${e.message}. Maybe this dna is already installed?`);
        return;
    }

    console.log(`Successfully installed dna ${app.app_id} on port ${appInterface.port} for key ${agentPubKey.hash.toString('base64')}`);
}

export const installUi = async (happ) => {
    const unpackPath = `${UI_STORE_FOLDER}/${happ.app_id}`;

    try {
        // First make sure to clean up unpackPath
        try{
            fs.rmdirSync(unpackPath, { recursive: true });
        } catch(e) {}

        const uiPath = await downloadFile(happ.ui_url);
        await extract(uiPath, { dir: unpackPath })
    } catch(e) {
        console.error(`Failed to install UI ${happ.app_id} with error ${e.message}`);
    }

    console.log(`Successfully installed UI ${happ.app_id} in ${unpackPath}`);
}
