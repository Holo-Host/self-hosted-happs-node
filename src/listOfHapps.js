import yaml from "js-yaml";
import fs from "fs";

export const getListOfHapps = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        throw new Error(`No configuration file passed.`);
    } else {
        let fileContents = fs.readFileSync(args[0], 'utf8');
        return yaml.safeLoad(fileContents) || [];
    }
    
}