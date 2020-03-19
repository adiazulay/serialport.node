const path = require("path");
const fs = require("fs-extra");
const glob = require('glob');

// copy platform compatible node binary to library
function loadLibrary(libraryName, destPath) {
  try {
    // Try load node. If fail, copy platform compatible node to dest path
    const _temp = require(destPath);
    console.log('using default', destPath);
  } catch (e) {
    // Copy pre-compiled node binary to dest path
    const parentFolder = path.join(__dirname, "native");

    const nodepregypFiles = glob(`${parentFolder}/${libraryName}*${process.arch}*.node`, {
        sync: true
      });
      let srcNodeFile = null;
      nodepregypFiles.forEach((file) => {
        try {
          const _temp = require(file);
          srcNodeFile = file;
          console.log('using', file);
        } catch (e) {
        }
      });

      if (!srcNodeFile) {
        console.log('[Warn]', 'no library available after trying files', nodepregypFiles);
      } else {
        // copy library node
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(srcNodeFile, destPath);
      }
  }
}

const detectionNodeDestPath = path.join(__dirname, `../usb-detection/build/Release/detection.node`);
loadLibrary('detector', detectionNodeDestPath);

const serialportNodeDestPath = path.join(__dirname, `../@serialport/bindings/build/Release/bindings.node`);
loadLibrary('serialport', serialportNodeDestPath);

exports.detector = require("usb-detection");
exports.SerialPort = require("serialport");