const fs = require('fs');
const userMongo = require('../mongoDB/userMongo');
const replyMongo = require('../mongoDB/replyMongo');

module.exports = {
    // 게시글 사진 및 내 프로필 사진 등록
    fileUpload: (req, res, next) => {
        let file = req.file;                                // 요청 파일
        let type = req.body.type;                           // 프로필 사진, 게시글 사진 타입
        let url = '';

        if(type == 'profile') {                             // 프로필 이미지 기능
            url = '/profiles/';

            let mimetype = file.mimetype.split('/')[1];     // 확장자
            let name = req.user.email;                      // 로그인 사용자 이메일
            let fileName = name + '.' + mimetype;           // 파일이름
                        
            let query = {                                   // 사용자 프로필용 json
                email: req.user.email
            }

            let data = {                
                $set: {
                    profile: url + fileName
                }
            }
            
            let rQuery = {                                  // 댓글용 json
                "writer.email": req.user.email
            }

            let rData = {                
                $set: {
                    "writer.profile": url + fileName
                }
            }

            userMongo.updateOne(query, data);               // 사용자 프로필 사진 위치 수정
            replyMongo.replyUpdate(rQuery, rData);          // 댓글 사용자 프로필 사진 위치 수정

            req.user.profile = url + fileName;
            res.locals.loginUser.profile = url + fileName;

        } else url = '/uploads/';                           // 게시글 이미지 기능

        res.json({url: url + file.filename, status: "OK" });
    },

    // 게시글 사진 및 프로필 사진 삭제
    fileDelete: (req, res, next) => {
        let url = './public';

        if(req.body.type == 'profile') {                    // 프로필 이미지 기능
            let src = req.body.src;                         // 현 프로필 이미지 위치
            let query = {                                   // 사용자 프로필 이미지용 JSON
                email: req.user.email
            }

            let data = {                
                $set: {
                    profile: ''
                }
            }

            let rQuery = {                                  // 댓글 프로필 이미지용 JSON
                "writer.email": req.user.email
            }

            let rData = {                
                $set: {
                    "writer.profile": ''
                }
            }

            userMongo.updateOne(query, data);               // 사용자 프로필 사진 지우기
            replyMongo.replyUpdate(rQuery, rData);          // 댓글 사용자 프로필 사진 지우기

            req.user.profile = '';                          // passport session 프로필 이미지 정보 변경
            res.locals.loginUser.profile = '';              // locals session 사용자 프로필 이미지 정보 변경

            url += src;

        } else {                                            // 게시글 이미지 기능
            let src = req.body.src;                         // 현 게시글 이미지 위치
            src = src.substring(21);                        // 이미지 위치에서 파일 이름 부분만 추출

            url += src;
        }

        fs.unlink(url, (err) => {                            // 파일 삭제 처리
            if(err) console.log(`Image Delte Error: ${err}`);
            else console.log('성공!!');
        });

        res.json({status: "OK"});
    }
}