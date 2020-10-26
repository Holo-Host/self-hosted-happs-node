
export const getListOfHapps = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return [
            {
                "happId": "elemental-chat",
                "uiUrl": "/tmp/elemental-chat-ui.zip",
                "dnaUrl": "/Users/pj/hc/holochain/elemental-chat/elemental-chat.dna.gz",
            }
        ];
    } else {
        // parse .yaml
        // [TODO: unmock]
        throw new Error(`Not implemented yet`);
    }
    
}