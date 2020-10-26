
export const getListOfHapps = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return [
            {
                "app_id": "elemental-chat",
                "ui_url": "https://s3.eu-central-1.wasabisys.com/elemetal-chat-tests/elemental-chat.zip",
                "dna_url": "https://s3.eu-central-1.wasabisys.com/elemetal-chat-tests/elemental-chat.dna.gz",
            }
        ];
    } else {
        // parse .yaml
        // [TODO: unmock]
        throw new Error(`Not implemented yet`);
    }
    
}