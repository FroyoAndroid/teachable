var UploadManager = function (google, oauth2Client, fs_promisified, path) {
    // configuring google drive 
    var drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        }),
        generateFileDetails = (file, parentPath, parentFolderId) => {
            var fileDetails = {},
                fileMetadata = {
                    'name': file,
                    parents: [parentFolderId]
                },
                fileExt = path.extname(file),
                mime = (/\.(dcm|jpg|jpeg|nifti|png)$/i).test(file) ? `image/${fileExt.substring(1)}` : '',
                media = {
                    mimeType: mime,
                    body: fs_promisified.createReadStream(`${parentPath}/${file}`)
                };
            return {
                resource: fileMetadata,
                media: media,
                fields: 'id'
            };
        };
    this.uploadFile = (file, parentPath, parentFolderId) => {
        var fileDetails = generateFileDetails(file, parentPath, parentFolderId);
        var reqUrl = drive.files.create(fileDetails,
            function (err, file) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    console.log('File Uploaded with Id: ', file.id);
                }
            });
        console.info(reqUrl.uri.href)
    }
    this.uploadFolder = function (folderName) {
        return new Promise(resolve, reject => {
            var that = this;
            var fileMetadata = {
                    'name': folderName,
                    'mimeType': 'application/vnd.google-apps.folder'
                },
                parentPath = `../BackEndServer/files/${folderName}`,
                reqUrl = drive.files.create({
                    resource: fileMetadata,
                    fields: 'id'
                }, function (err, file) {
                    if (err) console.error('Upload folder err');
                    else {
                        var parentFolderId = file.id;
                        console.log(`Folder:${folderName} Uploaded with Id:  ${file.id}`);
                        //res.status(200).send('File successfully uploaded with id:' + file.id)
                        fs_promisified.readdir(parentPath)
                            .then(files => {
                                files.forEach((file, index) => {
                                    var fromPath = path.join(parentPath, file);
                                    var x = (/\.(dcm|jpg|jpeg|nifti|png)$/i).test(file);
                                    //fs_promisified.stat(fromPath)
                                    //.then(fileStatus => {
                                    if (!x) {
                                        that.uploadFolder(file);
                                    } else if (x) {
                                        console.info(file);
                                        that.uploadFile(file, parentPath, parentFolderId);
                                    }
                                    // })
                                    // .catch(err => {
                                    //     console.error('File statistics not found');
                                    // })


                                });
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                });
        })

    }
    this.upload = function (file) {
        this.uploadFolder(file);
    }
}
module.exports = UploadManager;