const ic = require("ic0");
const fs = require("fs");
const path = require("path");
const fetch = require("isomorphic-fetch");

const { replica, HttpAgent } = ic;

const run = async () => {
  // local
  const agent = new HttpAgent({ host: "http://127.0.0.1:4943", fetch });
  await agent.fetchRootKey();
  const backend = replica(agent)("bkyz2-fmaaa-aaaaa-qaaaq-cai");

  // Production
  // const agent = new HttpAgent({ host: "https://icp-api.io", fetch });
  // await agent.fetchRootKey();
  // const backend = replica(agent)("q56hh-gyaaa-aaaab-qaiaq-cai");

  // convert all files in ./assets to number[]
  const files = await Promise.all(
    fs.readdirSync(path.join(__dirname, "assets")).map(async (file) => {
      const data = await fs.promises.readFile(
        path.join(__dirname, "assets", file)
      );
      return [file, new Uint8Array(data)];
    })
  );
  console.log(files);

  for (const [name, data] of files) {
    await backend.call("store", `${name}`, data);
    console.log(`Uploaded ${name}`);
  }
};

run();
