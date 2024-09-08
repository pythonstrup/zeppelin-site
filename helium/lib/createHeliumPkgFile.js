import Promise from "bluebird";
import stringify from 'json-stringify-pretty-compact';
import {getMavenHandler} from "./getMavenArtifactInfo.js";
import {fetchHelium} from "./fetchHeliumPkgInfo.js";
import * as fs from "fs";
import {getBasicMavenHandler} from "./getBasicMavenArtifactInfo.js";

const pushPkgInfoToTmp = async function() {
    // const response = await fetch('https://zeppelin.apache.org/helium.json')
    // const data = await response.json();
    // return data[0];
    return {};
}

async function addDependenciesToJson(callback, target) {
    const result = await callback(() => {});
    return addDependencies(result, target);
}

function addDependencies(dependencies, target) {
    for (const key of Array.from(new Set(Object.keys(dependencies))).sort()) {
        target[key] = dependencies[key];
    }
    return target;
}
const getParsedJsonStr = (key, dependencies) => `    "${key}"` + ': ' + stringify(dependencies[key]).split('\n').join('\n    ') + ',\n';
const delay = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

export function create() {
    pushPkgInfoToTmp()
    .then(async (response) => addDependenciesToJson(getBasicMavenHandler, response))
    .then(async (response) => addDependenciesToJson(getMavenHandler, response))
    .then(async (response) => addDependenciesToJson(fetchHelium, response))
    .then(async (response) => {
        await delay(8000)
        fs.writeFileSync('./helium.json', stringify([response]), (err) => {
            console.log("error!!!");
        })
    });
}