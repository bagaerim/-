const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("resultsContainer");
const detailsSection = document.getElementById("detailsSection");
const detailsContainer = document.getElementById("detailsContainer");

let beverages = [];

async function loadBeverageData() {
    try {
        // 이 경로는 'beverages.json' 파일의 실제 위치에 따라 달라집니다.
        // HTML 파일과 같은 폴더에 있다면 'beverages.json' 그대로 두세요.
        const response = await fetch('beverages.json');
        if (!response.ok) {
            // 404 (Not Found) 오류가 발생하면 이 부분이 실행됩니다.
            throw new Error(`HTTP 오류! 상태: ${response.status} - JSON 파일을 찾을 수 없거나 접근할 수 없습니다.`);
        }
        beverages = await response.json();
        console.log("음료 데이터가 성공적으로 로드되었습니다:", beverages);
        // 데이터 로드 후, 검색 필드를 비워두고 Enter를 치거나 검색 버튼을 눌러 초기 목록을 볼 수 있도록 유도
        // 또는 loadBeverageData() 호출 직후 searchBeverage()를 호출하여 초기 목록을 표시할 수도 있습니다.
    } catch (error) {
        console.error("음료 데이터를 불러오는 중 오류 발생:", error);
        resultsContainer.innerHTML = `<p>음료 데이터를 불러오는 데 실패했습니다. 오류: ${error.message}. JSON 파일 경로 및 내용을 확인해주세요.</p>`;
    }
}

// searchBeverage 함수 수정: JSON 키 이름에 맞춤
function searchBeverage() {
    const query = searchInput.value.trim();

    resultsContainer.innerHTML = "";
    detailsSection.style.display = "none";

    if (!query) {
        // 검색어를 입력하지 않았을 때 모든 음료를 표시하려면 이 부분을 수정합니다.
        // 현재는 "검색어를 입력해 주세요." 메시지만 뜹니다.
        resultsContainer.innerHTML = "<p>검색어를 입력해 주세요.</p>";
        return;
    }

    // JSON 데이터의 '음료종류'와 '음료회사' 키를 사용하여 필터링
    const matched = beverages.filter(bev =>
        (bev['음료종류'] && bev['음료종류'].toLowerCase().includes(query.toLowerCase())) ||
        (bev['음료회사'] && bev['음료회사'].toLowerCase().includes(query.toLowerCase()))
    );

    if (matched.length === 0) {
        resultsContainer.innerHTML = `<p>"${query}"에 대한 결과가 없습니다.</p>`;
        return;
    }

    matched.forEach(bev => {
        const div = document.createElement("div");
        div.classList.add("beverage");
        // 검색 결과 목록에 '음료종류'를 표시
        div.textContent = bev['음료종류'];

        div.addEventListener("click", () => showDetails(bev));

        resultsContainer.appendChild(div);
    });
}

// showDetails 함수: JSON 키 이름에 맞게 정확히 매핑됨
function showDetails(bev) {
    detailsContainer.innerHTML = ""; // 초기화
    detailsSection.style.display = "block";

    const title = document.createElement("h3");
    title.textContent = bev['음료종류'] || '음료 정보 없음';

    const companyName = document.createElement("p");
    companyName.innerHTML = `<strong>회사:</strong> ${bev['음료회사'] || '정보 없음'}`;

    // 이미지 URL을 위한 img 태그 생성
    // JSON에 '이미지' 키가 존재하는지 확인 (새로운 키 이름으로 가정)
    if (bev['이미지']) {
        const img = document.createElement("img");
        img.src = bev['이미지']; // JSON의 '이미지' 값을 사용
        img.alt = bev['음료종류'] || '음료 이미지'; // 이미지의 대체 텍스트
        img.style.maxWidth = "250px";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "10px 0";

        detailsContainer.appendChild(img);
    }

    const description = document.createElement("p");
    // 키 이름에 공백과 특수문자가 있으므로 대괄호 표기법 사용
    description.innerHTML = `<strong>주의사항:</strong> ${bev['주의사항 (향료에 대한 주의보단 당뇨, 비만, 뼈 건강 악화에 대한 주의가 더 많음)'] || '정보 없음'}`;

    const flavoringsTitle = document.createElement("h4");
    flavoringsTitle.textContent = "합성 향료";

    const ul = document.createElement("ul");
    if (bev['합성향료']) {
        // '합성향료'가 문자열일 경우 콤마로 분리하여 배열로 만듭니다.
        const flavoringsArray = typeof bev['합성향료'] === 'string' ? bev['합성향료'].split(',') : [bev['합성향료']];
        flavoringsArray.forEach(f => {
            const li = document.createElement("li");
            li.textContent = f.trim();
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "정보 없음";
        ul.appendChild(li);
    }

    const otherInfo = document.createElement("p");
    otherInfo.innerHTML = `<strong>기타 정보:</strong> ${bev['기타'] || '정보 없음'}`;

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(companyName);
    // 이미지 추가는 위에서 if 문 안에서 처리됩니다.
    detailsContainer.appendChild(description);
    detailsContainer.appendChild(flavoringsTitle);
    detailsContainer.appendChild(ul);
    detailsContainer.appendChild(otherInfo);

    window.scrollTo({ top: detailsSection.offsetTop - 20, behavior: "smooth" });
}

searchBtn.addEventListener("click", searchBeverage);
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchBeverage();
});

loadBeverageData();
