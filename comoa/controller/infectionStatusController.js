const infectionMongo = require('../mongoDB/infectionStatusMongo');

module.exports = {
    // 코로나 감염현황 그래프
    infectionGraph: async (req, res, next) => {
        let data = {create_dt: {$gte: new Date("2020-11-01")}};
        let infectionData = await infectionMongo.find(data);        
        
        res.render('t2', {infectionData: infectionData});
    }, 

    // 코로나 감염현황 페이징 리스트
    showInfection: async (req, res, next) => {

        let data = {};
        let count = 0;

        let startTime = req.query.startTime;                // 검색 시 시작 날짜
        let endTime = req.query.endTime;                    // 검색 시 마지막 날짜
        
        if(startTime != '') {                               // 검색한 후 페이지 로딩이라면 사용
            data = {
                create_dt: {                                // 날짜 지정
                    $gte: new Date(startTime), 
                    $lte: new Date(endTime + "T23:59:59")
                }
            }
        }
                
        count = await infectionMongo.count(data);           // 날짜에 속하는 데이터 갯수 출력          
        let start = false;                                  // 페이징 이전 버튼 활성
        let end = false;                                    // 페이징 디음 버튼 활성
        let nowPage = req.query.startPage;                  // 현재 페이지
        let lastPage = parseInt(count / 10);                // 마지막 페이지

        // 페이징을 위한 변수 설정등
        if(count % 10 != 0) lastPage += 1;

        if(nowPage > 1) start = true;
        if(lastPage > 1) end = true;
        if(lastPage == nowPage) end = false;

        let paginData = {                                   // 페이징한 데이터 JSON
            search: data,
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        // 데이터 출력
        let infection = await infectionMongo.infectionPaging(paginData);

        res.render('infection', {infection: infection, nowPage: nowPage, start: start, end: end, startTime: startTime, endTime: endTime, lastPage: lastPage});
    },

    // 코로나 감염현황 검색 기능
    searchInfection: async (req, res, next) => {
        let start = req.body.start;                                     // 검색 시작 날짜
        let end = req.body.end;                                         // 검색 마지막 날짜

        let data = {
            create_dt: {                                                // 날짜 지정
                $gte: new Date(start), 
                $lte: new Date(end + "T23:59:59")
            }
        }

        let count = await infectionMongo.count(data);                   // 검색 데이터 갯수
        let lastPage = parseInt(count / 10);                            // 마지막 페이지 번호

        if(count % 10 != 0) lastPage += 1;

        let paginData = {                                               // 검색 데이터 JSON 
            search: data,
            sort: -1,
            maxPage: 10,
            startPage: 0
        };

        let infectionList = await infectionMongo.dateSearch(paginData); // 데이터 출력
        res.json({list: infectionList, lastPage: lastPage});
    }
}