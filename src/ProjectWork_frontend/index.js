const ic = require("ic0");
const fetch = require("isomorphic-fetch");

const { replica, HttpAgent } = ic;
var agent, backend;

const uploadBtn = document.getElementById("uploadBtn");

//Note we will use "ProjectWork_backend" in this JavaScript code a few times to call the backend
import { ProjectWork_backend } from "../declarations/ProjectWork_backend";

const backendCI = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

//1. LOCAL DATA
const documentList = [];

//2. EVENT LISTENERS

document.addEventListener(
  "DOMContentLoaded",
  async (e) => {
    e.preventDefault();

    agent = new HttpAgent({ host: "http://127.0.0.1:4943", fetch });
    await agent.fetchRootKey();
    backend = replica(agent)("bkyz2-fmaaa-aaaaa-qaaaq-cai");

    return false;
  },
  false
);

uploadBtn.addEventListener(
  "click",
  async (e) => {
    e.preventDefault();

    debugger;

    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.onload = async function () {
      const name = file.name;
      var blob = window.dataURLtoBlob(reader.result);
      const data = [...new Uint8Array(await blob.arrayBuffer())];

      await backend.call("store", `${name}`, data);

      updateLocalDocumentList(file);
      updateTable();
    };
    reader.readAsDataURL(file);

    return false;
  },
  false
);

//3. HELPER FUNCTIONS
function updateLocalDocumentList(file) {
  debugger;

  let value = file.name;
  documentList.push(value);
}

function updateTable() {
  debugger;

  document.getElementById("table-body").innerHTML = "";
  for (let key in documentList) {
    let tr = document.createElement("tr");

    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = key;

    let td = document.createElement("td");
    td.textContent = documentList[key];

    let td2 = document.createElement("td");
    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-secondary");
    button.textContent = "View";
    button.onclick = function () {
      displayPdf(documentList[key]);
    };
    td2.appendChild(button);

    tr.appendChild(th);
    tr.appendChild(td);
    tr.appendChild(td2);

    document.getElementById("table-body").appendChild(tr);
  }
}

async function displayPdf(fileName) {
  debugger;
  let fileObj = { filename: fileName };
  const res = await fetch(`/file?canisterId=${backendCI}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileObj),
  });

  const blob = await res.blob();

  var reader = new FileReader();
  reader.onload = async function () {
    document.getElementById("object").classList.remove("d-none");
    document.getElementById("iframe").classList.remove("d-none");
    document.getElementById("object").data = reader.result;
    document.getElementById("iframe").src = reader.result;
  };
  reader.readAsDataURL(blob);
}
