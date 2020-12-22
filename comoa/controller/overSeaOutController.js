const overSeaOutMongo = require('../mongoDB/overseaOutBreakMongo');
const codeService = require('../service/worldCodeService');

module.exports = {
    // 세게 지도 코로나 현황 그래프
    worldStatus: async (req, res, next) => {

        // 오늘 날짜 변수
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        
        let now = new Date(year + '-' + month + '-' + day);                 // Date형식으로 변환   
        let data = {create_dt: {$gte: now}};                                // 데이터 검색용 JSON

        let world = await overSeaOutMongo.find(data);                       // 오늘 세계 코로나 데이터 출력
        
        // 최신 날짜 데이터가 API에 없는 경우 전날 데이터 불러오기
        if(Object.keys(world).length == 0) {
            let yesterDate = now.getTime() - (1 * 24 * 60 * 60 * 1000);
            now.setTime(yesterDate);
            
            data = {create_dt: {$gte: now}};
            world = await overSeaOutMongo.find(data);
        }        

        let codeData = await codeService(world);                            // 세계 코로나 데이터에 국가 코드 부여
        let worldData = codeData['world'];                                  // 국가 코드가 부여된 코로나 정보 데이터
        let covidData = codeData['covid'];                                  // 국가 코드당 코로나 심각도 데이터

        res.render('world', {worldData: worldData, covidData: covidData});
    },

    // 페이징 세게 코로나 데이터 리스트
    showOverseaout: async (req, res, next) => {
        let data = {};
        let count = 0;

        let startTime = req.query.startTime;                // 검색 시 시작 날짜
        let endTime = req.query.endTime;                    // 검색 시 마지막 날짜
        let area_nm = req.query.area;                       // 검색 시 지역명
        let nation_nm = req.query.nation;                   // 검색 시 나라명
        
        if(startTime != '') {                               // 검색한 후 페이지 로딩이라면 사용
            data['create_dt'] = {                           // 날짜 지정
                    $gte: new Date(startTime), 
                    $lte: new Date(endTime + "T23:59:59")
                }
        }

        if(area_nm != '') data['area_nm'] = area_nm;        // 지역 검색명 저장
        if(nation_nm != '') data['nation_nm'] = nation_nm;  // 나라 검색명 저장

        count = await overSeaOutMongo.count(data);          // 검색 전후 데이터 총 갯수

        let start = false;                                  // 페이징 이전 버튼 활성
        let end = false;                                    // 페이징 디음 버튼 활성
        let nowPage = req.query.startPage;                  // 현재 페이지
        let lastPage = parseInt(count / 30);                // 마지막 페이지

        if(count % 30 != 0) lastPage += 1;

        if(nowPage > 1) start = true;
        if(lastPage > 1) end = true;
        if(lastPage == nowPage) end = false;

        let paginData = {                                   // 페이징한 데이터 JSON
            search: data,
            sort: -1,
            maxPage: 30,
            startPage: (nowPage-1) * 30
        };

        // 검색 전후 데이터, 지역명 Select, 나라명 Select 데이터 출력        
        let overseaout = await overSeaOutMongo.overseaoutPaging(paginData);
        let areaSelect = await overSeaOutMongo.overseaoutDistinct("area_nm");
        let nationSelect = await overSeaOutMongo.overseaoutDistinct("nation_nm");

        res.render('overseaout', {overseaout: overseaout, nowPage: nowPage, start: start, end: end, startTime: startTime, endTime: endTime, area: area_nm, nation: nation_nm, lastPage: lastPage, areaSelect: areaSelect, nationSelect: nationSelect});
    }, 

    // 지역명 선택시 해당 나라명만 Select에 출력 기능
    areaGroup: async (req, res, next) => {
        let key = req.body.key;                             // 선택 지역명

        let data = {
            create_dt: { $gte: new Date("2020-12-20") }
        }

        if(key != 'null') data['area_nm'] = key;            // 지역명이 null이라면 전체 나라명이 뜰 수 있게 처리

        let result = await overSeaOutMongo.find(data);      // 데이터 출력

        res.json({list: result});
    },

    // 세계 코로나 리스트 검색
    searchOverSeaOut: async (req, res, next) => {
        let start = req.body.start;
        let end = req.body.end;
        let area = req.body.area;
        let nation = req.body.nation;

        let data = {
            create_dt: {
                $gte: new Date(start), 
                $lte: new Date(end + "T23:59:59")
            }
        }

        if(area != '') data['area_nm'] = area;
        if(nation != '') data['nation_nm'] = nation;

        let count = await overSeaOutMongo.count(data);

        let lastPage = parseInt(count / 30);

        if(count % 30 != 0) lastPage += 1;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 30,
            startPage: 0
        };

        let overseaout = await overSeaOutMongo.overseaoutPaging(paginData);

        res.json({list: overseaout, lastPage: lastPage});
    }
}