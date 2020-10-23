
export const getListOfHapps = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return [
            {
                happ-id = "elemental-chat";
                ui-url = "/tmp/elemental-chat-ui.zip";
                dna-urls = "/tmp/elemental-chat-dna.gz";
            }
        ];
    } else {
        // parse .yaml
        // [TODO: unmock]
        throw new Error(`Not implemented yet`);
    }
    
}