var UploadManager = function (google, oauth2Client, fs_promisified, path) {

    var file = {
        folder1: {
            id: '',
            data: [
                { file: 'a.png' },
                { file: 'b.png' },
                {
                    folder3: {
                        id: '',
                        data: [
                            { file: 'c.png' },
                            { file: 'd.png' },
                            { file: 'e.png' },
                            { file: 'f.png' }
                        ]
                    }

                }
            ]

        },
        folder2: {
            id: '',
            data: []
        }

    };
    var parentPath = '',
        level = 0, cnt=0,
        folderUploadPromiseList =[], fileUploadPromiseList = [];



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
                    body: fs_promisified.createReadStream(`${parentPath}`)
                };
            return {
                resource: fileMetadata,
                media: media,
                fields: 'id'
            };
        };
    this.uploadFile = (fileName, parentPath, parentFolderId) => {
         return new Promise((resolve, reject) => {
        var fileDetails = generateFileDetails(fileName, parentPath, parentFolderId);
        var reqUrl = drive.files.create(fileDetails,
            function (err, file) {
                if (err) {
                    // Handle error
                    console.log(err);
                    reject(err)
                } else {
                    console.log('File:'+fileName+ 'Uploaded with Id: '+ file.id+' to '+parentPath);
                    resolve(file.id);
                }
            });
        console.info(reqUrl.uri.href);
         });
    }
    this.uploadFolder = function (folderName, fileId, parentPath) {
        return new Promise((resolve, reject) => {
        var that = this;
        var fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',

        };
        if (fileId) {
            fileMetadata.parents = [fileId];
            //parentPath = `${parentPath}/${folderName}`;
        } else {
            parentPath = `../BackEndServer/files/${folderName}`
        }
        var reqUrl = drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, function (err, file) {
            if (err) {console.error('Upload folder err'); reject(err)}
            else {
                var parentFolderId = file.id;
                console.log(`Folder:${folderName} Uploaded with Id:  ${file.id}`);
                //res.status(200).send('File successfully uploaded with id:' + file.id)
                fs_promisified.readdir(parentPath)
                    .then(files => {
                        files.forEach((file, index) => {
                            var fromPath = path.join(parentPath, file);
                            var x = (/\.(dcm|jpg|jpeg|nifti|png)$/i).test(file);
                            fs_promisified.stat(fromPath)
                                .then(fileStatus => {
                                    level++;
                                    if (fileStatus.isDirectory()) {
                                        
                                        folderUploadPromiseList.push(that.uploadFolder(file, parentFolderId, fromPath));
                                        resolve(parentFolderId);
                                    } else if (fileStatus.isFile()) {
                                        // console.info(file);
                                        // //base condition
                                        fileUploadPromiseList.push(that.uploadFile(file, fromPath, parentFolderId));
                                    }
                                })
                                .catch(err => {
                                    console.error('File statistics not found');
                                })


                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        });
        })

    }
    this.upload = function (file, res) {

        folderUploadPromiseList.push(this.uploadFolder(file));
        Promise.all(folderUploadPromiseList, fileUploadPromiseList)
        .then(result => {
            res.send('All Files uploaded successfully');
        })
        .catch(err =>{
             res.send('Error while uploading');
        })
    }
}
module.exports = UploadManager;

/**
 * var file = {
     folder1:{
         id : '',
         data: [            {file : 'a.png'},
            {file : 'b.png'},
        {
            folder3: [
                {file : 'c.png'},
                {file : 'd.png'},
                {file : 'e.png'},
                {file : 'f.png'}]
        }]

     },
     folder2:[]

}
 */