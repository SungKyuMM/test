const fs = require('fs');
const userMongo = require('../mongoDB/userMongo');
const replyMongo = require('../mongoDB/replyMongo');

module.exports = {
    fileUpload: (req, res, next) => {
        let file = req.file;
        let type = req.body.type;
        let url = '';

        if(type == 'profile') {
            url = '/profiles/';

            let mimetype = file.mimetype.split('/')[1];
            let name = req.user.email;
            let fileName = name + '.' + mimetype;
            
            let query = {
                email: req.user.email
            }

            let data = {                
                $set: {
                    profile: url + fileName
                }
            }

            let rQuery = {
                "writer.email": req.user.email
            }

            let rData = {                
                $set: {
                    "writer.profile": url + fileName
                }
            }

            userMongo.updateOne(query, data);
            replyMongo.replyUpdate(rQuery, rData);

            req.user.profile = url + fileName;
            res.locals.loginUser.profile = url + fileName;

        } else url = '/uploads/';

        console.log(type);

        res.json({url: url + file.filename, status: "OK" });
    },

    fileDelete: (req, res, next) => {
        let url = './public';

        if(req.body.type == 'profile') {
            let src = req.body.src;
            let query = {
                email: req.user.email
            }

            let data = {                
                $set: {
                    profile: ''
                }
            }

            let rQuery = {
                "writer.email": req.user.email
            }

            let rData = {                
                $set: {
                    "writer.profile": ''
                }
            }

            userMongo.updateOne(query, data);
            replyMongo.replyUpdate(rQuery, rData);

            req.user.profile = '';
            res.locals.loginUser.profile = '';

            url += src;

        } else {
            let src = req.body.src;
            src = src.substring(21);

            url += src;
        }

        fs.unlink(url, (err) => {
            if(err) console.log(`Image Delte Error: ${err}`);
            else console.log('성공!!');
        });

        res.json({status: "OK"});
    }
}