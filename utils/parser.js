import {downloadImage} from "./downloadImage.js";
import fs from "fs";

export class Parser {
  /**
   * @param {string} cdnUrl - no trailing slash!
   */
  constructor(cdnUrl) {
    this._cdnUrl = cdnUrl;
    this._resultFolderName = (new URL(cdnUrl)).hostname;
  }

  /**
   * @param {string[]} sources
   */
  async getImages(sources) {
    const timeStamp = new Date().getTime();
    const imagesCount = sources.length;
    let succeed = 0;
    let failed = 0;

    console.log(`Pending...`);
    console.log();

    const resultDir = `${process.env.PWD}/result/${this._resultFolderName}/${timeStamp}`;
    fs.mkdirSync(resultDir, {recursive: true});

    await Promise.all(
      sources.map((src, i) =>
        downloadImage(
          `/_next/image/?url=${encodeURIComponent(this._cdnUrl + src)}&w=1920&q=100`,
          `${resultDir}${src}`
        )
          .then((fileName) => {
            console.log(fileName);
            succeed++;
          })
          .catch(() => {
            console.log(`Ошибка загрузки ${src}`);
            failed++;
          })
          .finally(() => {
            console.log();
            console.log(`Done: ${i + 1}/${imagesCount}`);
            console.log(`Succeed: ${succeed}`);
            console.log(`Failed: ${failed}`);
            console.log();
          }))
    );

  }
}
