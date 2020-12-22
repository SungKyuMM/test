const safetyNewsMongo = require('../mongoDB/safetyNewsMongo');

module.exports = {
    // 최신 안전소식 정보 View
    safePaging: async (req, res, next) => {                
        let count = await safetyNewsMongo.allCount();   // 전체 데이터 갯수
        let start = false;                              // 페이징 정보 변수들
        let end = false;
        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 10);
                
        if(count % 10 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let data = {
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        let post = await safetyNewsMongo.paging(data);
        res.render('safetyNews', {post: post, nowPage: nowPage, start: start, end: end, lastPageNum: lastPageNum});
    },
    
    // 최신 안전소식 정보 content view
    safeContent: async (req, res, next) => {
        let data = req.query.id;        
        let safeContent = await safetyNewsMongo.safeContent(data);
        
        res.render('safetyNewsContent', {safeContent: safeContent});
    }
}