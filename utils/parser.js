import { downloadImage } from "./downloadImage.js";
import fs from "fs";
import { ConcurrencyManager } from "axios-concurrency";
import { MAX_CONCURRENT_REQUESTS, TERMINAL_COLOR } from "../const.js";
import { api } from "../app.js";

export class Parser {
  #cdnUrl;
  #resultFolderName;

  /**
   * @param {string} cdnUrl - no trailing slash!
   */
  constructor(cdnUrl) {
    this.#cdnUrl = cdnUrl;
    this.#resultFolderName = new URL(cdnUrl).hostname;
  }

  /**
   * @param {string[]} sources
   */
  async getImages(sources) {
    const imagesCount = sources.length;
    const resultDir = this.#createResultFolder();

    let succeed = 0;
    let failed = 0;

    console.log(TERMINAL_COLOR.GREEN, `Pending...`);
    console.log();

    const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);

    await Promise.all(
      sources.map((cdnImgPath, i) => {
        const downloadLink = `/_next/image/?url=${encodeURIComponent(
          this.#cdnUrl + cdnImgPath
        )}&w=1920&q=100`;

        return downloadImage(downloadLink, `${resultDir}${cdnImgPath}`)
          .then((createdFileName) => {
            this.#printSuccessLog(createdFileName);

            succeed++;
          })
          .catch((err) => {
            if (err.response) {
              this.#printErrorLog(err.response, cdnImgPath);
            } else console.log(err);

            failed++;
          })
          .finally(() =>
            this.#printFinallyLog(i + 1, imagesCount, succeed, failed)
          );
      })
    );

    manager.detach();
  }

  /**
   * @param {AxiosResponse} response
   * @param {string} cdnImgPath
   */
  #printErrorLog(response, cdnImgPath) {
    console.log(TERMINAL_COLOR.YELLOW, `Download failed: ${cdnImgPath}`);
    console.log(`${response.status}/${response.statusText}`);
    console.log(response.request.res.responseUrl);
  }

  /**
   * @param {string} createdFileName
   */
  #printSuccessLog(createdFileName) {
    console.log(TERMINAL_COLOR.GREEN, `Downloaded: ${createdFileName}`);
  }

  /**
   * @param {number} step
   * @param {number} imagesCount
   * @param {number} succeed
   * @param {number} failed
   */
  #printFinallyLog(step, imagesCount, succeed, failed) {
    console.log();
    console.log(`Done: ${step}/${imagesCount}`);
    console.log(TERMINAL_COLOR.GREEN, `Succeed: ${succeed}`);
    console.log(TERMINAL_COLOR.YELLOW, `Failed: ${failed}`);
    console.log();
  }

  /**
   * @return {string}
   */
  #createResultFolder() {
    const timeStamp = new Date().getTime();

    const resultDir = `${process.env.PWD}/result/${
      this.#resultFolderName
    }/${timeStamp}`;

    fs.mkdirSync(resultDir, { recursive: true });

    return resultDir;
  }
}
