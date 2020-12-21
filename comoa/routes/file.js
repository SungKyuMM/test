var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, res, cb) => {            
            cb(null, './public/uploads');
        }, 

        filename: (req, file, cb) => {            
            let mimetype = file.mimetype.split('/')[1];
            let name = Math.random().toString(36);
            let fileName = name + '.' + mimetype;
            cb(null, fileName);
        }
    }),
});

const profile = multer({
    storage: multer.diskStorage({
        destination: (req, res, cb) => {            
            cb(null, './public/profiles');
        }, 

        filename: (req, file, cb) => {            
            let mimetype = file.mimetype.split('/')[1];
            let name = req.user.email;
            let fileName = name + '.' + mimetype;
            cb(null, fileName);
        }
    }),
});

const fileController = require('../controller/fileController');

router.post('/fileUpload', upload.single('file'), fileController.fileUpload);

router.delete('/fileDelete', fileController.fileDelete);

router.post('/profileUpload', profile.single('file'), fileController.fileUpload);

router.delete('/profileReset', fileController.fileDelete)

module.exports = router;