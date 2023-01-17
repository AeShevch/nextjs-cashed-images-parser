import {Parser} from "./utils/parser.js";
import imagesSrcList from "./data/b2b.js";

import {ConcurrencyManager} from "axios-concurrency";
import axios from "axios";

export const api = axios.create({
  baseURL: `https://b2b-shop.nbcomgroup.ru`,
  // baseURL: `https://www.iport.ru`,
  // baseURL: `https://www.nbcomputers.ru`
});

const MAX_CONCURRENT_REQUESTS = 5;

const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

const parser = new Parser( `https://cdn.nbcomgroup.ru`);

await parser.getImages(imagesSrcList);

manager.detach();
