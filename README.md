Node script that for installation of self hosted happs on HPOS from configuration file.

Build:
```sh
npm install
npm run build
```

Usage:
```
  node dist/main.js config.yaml
```
where config.yaml is of a format:
```yaml
---
- installed_app_id: elemental-chat
  ui_url: https://s3.eu-central-1.wasabisys.com/elemetal-chat-tests/elemental-chat.zip
  dna_url: https://s3.eu-central-1.wasabisys.com/elemetal-chat-tests/elemental-chat.dna.gz

```
