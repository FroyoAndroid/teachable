const path = require('path')
const fs = require('fs')
const nifti = require('nifti-reader-js')
const storagePath = path.join(__dirname, '/../../storage')
const base64Img = require('base64-img');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const FileReader = require('filereader')

const storage = {

  __getNiftiData (filePath) {
    let data = new ArrayBuffer() // an ArrayBuffer
    let niftiHeader = null,
      niftiImage = null,
      niftiExt = null

    data = nifti.Utils.toArrayBuffer(fs.readFileSync(filePath))
    if (nifti.isCompressed(data)) {
      data = nifti.decompress(data)
    }
    if (nifti.isNIFTI(data)) {
      niftiHeader = nifti.readHeader(data)
      niftiImage = nifti.readImage(niftiHeader, data)
      if (nifti.hasExtension(niftiHeader)) {
        niftiExt = nifti.readExtensionData(niftiHeader, data)
      }
    }

    var niftObj = {
      header: niftiHeader,
      arrayBuffer: niftiImage,
      ext: niftiExt,
    };

    console.log(' niftObj ' + JSON.stringify(niftObj));
    return niftObj;
  },
  _getFiles () {
    let index = 0
    return fs.readdirSync(storagePath).filter(file => {
      return path.extname(file) === '.gz' || path.extname(file) === '.nii'
    }).map((file) => {
      index++
      return {
        index,
        name: file,
      }
    })
  },
  _getImageData (index) {
    const files = storage._getFiles().
      filter((file) => file.index === parseInt(index))
    return storage.__getNiftiData(`${storagePath}/${files[0].name}`)
  },
  
  _getHeaders (key) {
    const files = storage._getFiles().
      filter((file) => file.index === parseInt(key))
    return storage.__getNiftiData(`${storagePath}/${files[0].name}`).header
  },
  _getBytes (key) {
    const files = storage._getFiles().
      filter((file) => file.index === parseInt(key))
    return new Buffer(storage.__getNiftiData(`${storagePath}/${files[0].name}`).arrayBuffer)
  },

  _getJPEGFiles () {
    let index = 0
    return fs.readdirSync(storagePath).filter(file => {
      return path.extname(file) === '.jpeg' || path.extname(file) === '.png' || path.extname(file) === '.jpg' || path.extname(file) === '.tif' || path.extname(file) === '.dcm'
    }).map((file) => {
      index++
      return {
        index,
        name: file,
      }
    })
  },

  __getJPEGData (filePath, callback) {
    console.log('filePath11 ' + filePath);
    let data = new ArrayBuffer() // an ArrayBuffer
    let imageHeader = null,
      imageData = null

    //function readFile(filePath, callback){
      base64Img.base64(filePath, function(err, data) {
          if (err) {
              throw err;
          } else {
              imageData = data;
              var jpegObj = {
                arrayBuffer: imageData,
              };
              callback(jpegObj);
          }
      });
  },
  _getJPEGImageData (index) {
    const files = storage._getJPEGFiles().
      filter((file) => file.index === parseInt(index))
    return storage.__getJPEGData(`${storagePath}/${files[0].name}`)
  },
  _getJPEGBytes (key, callback) {
    const files = storage._getJPEGFiles().
      filter((file) => file.name === key)
      
      var path = `${storagePath}\\${key}`;
      storage.__getJPEGData(path, function(OBJ){
        console.log(' OBJ.arrayBuffer ' + JSON.stringify(OBJ.arrayBuffer).length);
        callback(OBJ.arrayBuffer);
      });
      
  },

  _getJPEGHeaders (key) {
    const files = storage._getJPEGFiles().
      filter((file) => file.name === key)
      var path = `${storagePath}\\${key}`;
    return storage.__getJPEGData(path).header
  },


  _getDICOMFiles () {
    let index = 0
    return fs.readdirSync(storagePath).filter(file => {
      return path.extname(file) === '.dcm'
    }).map((file) => {
      index++
      return {
        index,
        name: file,
      }
    })
  },

  __getDICOMData (filePath, callback) {
    console.log('filePath11 ' + filePath);
    let data = new ArrayBuffer() // an ArrayBuffer
    let imageHeader = null,
      imageData = null

    //function readFile(filePath, callback){
      base64Img.base64(filePath, function(err, data) {
          if (err) {
              throw err;
          } else {
              imageData = data;
              var jpegObj = {
                arrayBuffer: imageData,
              };
              callback(jpegObj);
          }
      });
  },
  _getDICOMImageData (index) {
    const files = storage._getDICOMFiles().
      filter((file) => file.index === parseInt(index))
    return storage.__getJPEGData(`${storagePath}/${files[0].name}`)
  },
  _getDICOMBytes (key, callback) {
    const files = storage._getDICOMFiles().
      filter((file) => file.name === key)
      
      var path = `${storagePath}\\${key}`;
      storage.__getJPEGData(path, function(OBJ){
        console.log(' OBJ.arrayBuffer ' + JSON.stringify(OBJ.arrayBuffer).length);
        callback(OBJ.arrayBuffer);
      });
      
  },

  _getDICOMHeaders (key) {
    const files = storage._getDICOMFiles().
      filter((file) => file.name === key)
      var path = `${storagePath}\\${key}`;
    return storage.__getJPEGData(path).header
  },
}

module.exports = () => {
  return {
    getFiles: storage._getFiles(),
    getImageData: storage._getImageData,
    getHeaders: storage._getHeaders,
    getBytes: storage._getBytes,

    getJPEGFiles: storage._getJPEGFiles,
    getJPEGImageData: storage._getJPEGImageData,
    getJPEGBytes: storage._getJPEGBytes,
    getJPEGHeaders: storage._getJPEGHeaders,


    getDICOMFiles: storage._getDICOMFiles,
    getDICOMImageData: storage._getDICOMImageData,
    getDICOMBytes: storage._getDICOMBytes,
    getDICOMHeaders: storage._getDICOMHeaders,
  }
}