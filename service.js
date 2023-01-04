const { google } = require('googleapis');
const process = require('process');
require('dotenv').config()


const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
    },
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

    if (res.data.files.length == 0) {
        return null;
    }

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
    return files.status;
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

const moveAllFiles = async (fileList, currentFolderId, res) => {
    const statuses = []
    const folderId = await createFolder(currentFolderId);
    for (const fileName of fileList) {
        await findFileId(fileName).then(async (fileId) => {
            if (!fileId) {
                statuses.push({ "fileName": fileName, "status": 404 })
            }
            else {
                await moveFiles(fileId, currentFolderId, folderId).then((status) => {
                    statuses.push({ "fileName": fileName, "status": status })
                })
            }
        });
    }
    res.render('result', {
        data: statuses
    });
}

module.exports = moveAllFiles;