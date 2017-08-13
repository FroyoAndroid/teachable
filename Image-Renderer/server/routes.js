const express = require('express')
const router = express.Router()
const path = require('path')
const storage = require('./services/storage')()

router.get('/api/images', function (req, res) {
  var fileList  = storage.getJPEGFiles();
  return res.json(fileList);
})

router.get('/api/images/:image', function (req, res) {
  return res.json(storage.getImageData(req.params.image))
})

router.get('/api/nifti-bytes/:image', function (req, res) {
  console.log('222 : '  + storage.getBytes(req.params.image).length);
  res.send(storage.getBytes(req.params.image))
})

router.get('/api/nifti-header/:image', function (req, res) {
  return res.json(storage.getHeaders(req.params.image))
})

router.get('/api/jpegImages/:image', function (req, res) {
  return res.json(storage.getJPEGImageData(req.params.image))
})

router.get('/api/jpeg-bytes/:image', function (req, res) {
  return storage.getJPEGBytes((req.params.image), function(data){
    return res.send({"data":data});
  });
})

router.get('/api/jpeg-header/:image', function (req, res) {
  return res.json(storage.getJPEGHeaders(req.params.image))
})

router.get('/api/dicomImages/:image', function (req, res) {
  return res.json(storage.getDICOMImageData(req.params.image))
})

router.get('/api/dicom-bytes/:image', function (req, res) {
  return storage.getDICOMBytes((req.params.image), function(data){
    return res.send({"data":data});
  });
})

router.get('/api/dicom-header/:image', function (req, res) {
  return res.json(storage.getDICOMHeaders(req.params.image))
})

router.all('*', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/index.html'))
})

module.exports = router