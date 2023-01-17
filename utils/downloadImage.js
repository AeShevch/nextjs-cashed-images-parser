import fs from "fs";
import {api} from "../app.js";

/**
 * @param {string} url
 * @param {string} filepath
 */
export async function downloadImage(url, filepath) {
  const resultPath = filepath.split(`/`).slice(0, -1).join(`/`);
  const filename = filepath.split(`/`).slice(-1).join(``);

  return new Promise((resolve, reject) => {
    api({
      url,
      method: 'GET',
      responseType: 'stream'
    })
      .then((response) => {
        fs.mkdirSync(resultPath, {recursive: true});

        response.data.pipe(fs.createWriteStream(`${resultPath}/${filename}`))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      })
      .catch(reject);
  });
}
