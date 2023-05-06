//
// parcel calls this via require() so it must be a CommonJS module

"use strict";

const { Optimizer } = require("@parcel/plugin");
const { blobToStream } = require("@parcel/utils");
const { Readable } = require("stream");
const { createReadStream } = require("fs");
const { createInterface } = require("readline");

module.exports = new Optimizer({
  // bundle: NamedBundle,
  // bundleGraph: BundleGraph<NamedBundle>,
  // contents: Blob,
  // map: ?SourceMap,
  // options: PluginOptions,
  // logger: PluginLogger,
  // config: ConfigType,
  // getSourceMapReference: (map: ?SourceMap) => Async<?string>,
  optimize({ config, contents, options, logger }) {
    // console.log("process.env", process.env);
    // console.log("options.env:", options.env);
    const { source: header } = require(options.env.npm_package_json);
    const input = blobToStream(contents);
    return {
      contents: userscriptHeaderInsertedStream(header, input, logger),
    };
  },
});

function userscriptHeaderInsertedStream(header, input, logger) {
  return Readable.from(
    (async function* () {
      try {
        logger.info({ message: "inserting userscript header" });
        const sourceLines = createInterface({
          input: createReadStream(header),
          crlfDelay: Infinity,
        });

        let beforeHeader = true;
        for await (const line of sourceLines) {
          if (beforeHeader) {
            if (/^\/\/ +==UserScript==$/i.test(line)) {
              beforeHeader = false;
              yield line + "\n";
            }
          } else {
            yield line + "\n";
            if (/^\/\/ +==\/UserScript==$/i.test(line)) {
              break;
            }
            // TODO: check @keyword names
          }
        }
        sourceLines.close();

        for await (let chunk of input) {
          yield chunk;
        }
      } catch (err) {
        console.error("thrown:", err);
        throw err;
      }
    })()
  );
}
