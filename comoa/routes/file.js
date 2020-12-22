var express = require('express');
var router = express.Router();

const multer = require('multer');

// 게시글 업로드 multer 설정
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

// 프로필 사진 업로드 multer 설정
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

// 게시글 파일 업로드
router.post('/fileUpload', upload.single('file'), fileController.fileUpload);

// 사진 파일 삭제
router.delete('/fileDelete', fileController.fileDelete);

// 프로필 사진 파일 업로드
router.post('/profileUpload', profile.single('file'), fileController.fileUpload);

// 프로필 사진 파일 삭제(초기화)
router.delete('/profileReset', fileController.fileDelete)

module.exports = router;