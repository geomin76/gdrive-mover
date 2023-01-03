const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const process = require('process');

const KEYFILEPATH = path.join(process.cwd(), 'creds.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const service = google.drive({ version: 'v3', auth });

const findFileId = async (fileName) => {
    // https://developers.google.com/drive/api/guides/search-files
    const res = await service.files.list({
        q: `name = \'${fileName}\' and mimeType != \'application/vnd.google-apps.folder\'`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });

    return res.data.files[0].id
}

const moveFiles = async (fileId, currentFolderId, newFolderId) => {
    const files = await service.files.update({
        fileId: fileId,
        addParents: newFolderId,
        removeParents: currentFolderId,
        fields: 'id, parents',
        enforceSingleParent: true
    });
    console.log(files.status);
}

const createFolder = async (currentFolderId) => {
    const date = new Date();
    const folderName = `photos-${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}${date.getUTCHours()}${date.getUTCMinutes()}${date.getUTCSeconds()}${date.getUTCMilliseconds()}`

    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        'parents': [currentFolderId]
    };
    const folder = await service.files.create({
        resource: fileMetadata,
        fields: 'id',
    });

    return folder.data.id;
}

const moveAllFiles = async (fileList, currentFolderId) => {
    const folderId = await createFolder(currentFolderId);
    fileList.forEach(function(fileName, index) {
        findFileId(fileName).then((fileId) => {
            moveFiles(fileId, currentFolderId, folderId);
        });
    })
}

module.exports = moveAllFiles;