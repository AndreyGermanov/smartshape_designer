import { defineConfig } from "cypress";
import {rmSync,existsSync} from "fs";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        deleteFile(fileName) {
          console.log('deleting folder %s', fileName)

          return new Promise(async(resolve, reject) => {
            if (existsSync(fileName)) {
              rmSync(fileName)
            }
            resolve(null)
          })
        },
      })
    },
  },
});
