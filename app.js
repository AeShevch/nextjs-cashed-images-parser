import { Parser } from "./utils/parser.js";
import images from "./data/iport.js";

import axios from "axios";
import { BASE_URL, CDN_URL } from "./const.js";

export const api = axios.create({ baseURL: BASE_URL.IPORT });

const parser = new Parser(CDN_URL.IPORT);
await parser.getImages(images);

