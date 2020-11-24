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
            //console.log(`Downloaded file from ${downloadUrl} to ${fileName}`);
            resolve(fileName);
        })
        .on('error', (error) => {
            reject(error);
        })
    })
}

export const createAgent = async () => {
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );

        let agentPubKey = await adminWebsocket.generateAgentPubKey();
        console.log(agentPubKey);
        console.log(`Generated new agent ${agentPubKey.toString('base64')}`);
        return agentPubKey;
    } catch(e) {
        console.log(`Error while generating new agent: ${e.message}.`);
    }
}

export const listInstalledApps = async () => {
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );
        const apps = await adminWebsocket.listActiveApps();
        console.log("listActiveApps app result: ", apps)
        return apps
    } catch(e) {
        console.error(`Failed to get list of active happs with error: `, e);
        return;
    }
}

// NOTE: this code assumes a single DNA per hApp.  This will need to be updated when the hApp bundle
// spec is completed, and the hosted-happ config Yaml file will also need to be likewise updated
export const installDna = async (happ, agentPubKey) => {
    const dnaPath = await downloadFile(happ.dna_url);
    // Install via admin interface
    const installed_app_id = `${happ.app_id}:${happ.version}`;
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );
        const installed_app = await adminWebsocket.installApp({
            agent_key: agentPubKey,
            installed_app_id,
            dnas: [
                {
                    nick: happ.app_id,
                    path: dnaPath
                }
            ],
        });
        await adminWebsocket.activateApp({ installed_app_id: installed_app.installed_app_id });

    } catch(e) {
        console.error(`Failed to install dna ${happ.app_id} with error: `, e);
        return;
    }

    console.log(`Successfully installed dna ${installed_app_id} for key ${agentPubKey.toString('base64')}`);
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

export const startHappInterface = async () => {
    try {
        const adminWebsocket = await AdminWebsocket.connect(
            `ws://localhost:${ADMIN_PORT}`
        );

        console.log(`Starting app interface on port ${HAPP_PORT}`);
        await adminWebsocket.attachAppInterface({ port: HAPP_PORT });
    } catch(e) {
        console.log(`Error: ${e.message}, probably interface already started.`);
    }
}
