const replyMongo = require('../mongoDB/replyMongo');

module.exports = {
    insertReply: async (req, res, next) => {
        let body = req.body;
        let data = {
            content: body.content,
            board_id: body.id,
            reg_date: new Date,
            writer: {
                email: body.email,
                name: body.name
            }
        }
        
        let replies;
        let result = await replyMongo.replyInsert(data);
        if(result == 'ok')
            replies = await replyMongo.replyList();
        
        res.json({replies: replies});
    }
}