const fs = require('fs');

module.exports = {
    fileUpload: (req, res, next) => {
        let file = req.file;
        console.log(file);

        res.json({url: '/uploads/'+file.filename });
    },

    fileDelete: (req, res, next) => {

        let src = req.body.src;
        src = src.substring(21);

        fs.unlink('./public' + src, (err) => {
            if(err) console.log(`Image Delte Error: ${err}`);
            else console.log('성공!!');
        });

        res.writeHead(302);
        res.end();
    }
}