// --- 1. 데이터 설정 ---

// 포스트잇 메시지
const messages = [
    '주연아 대학 입학 100일 축하해',
    '생일 못챙겨줘서 미안해 사랑해',
    '주연아 나랑 사귀자~',
    '주연아 너는 너무 예쁘고 멋지고 사랑스럽고 ...',
    '우리 데이트 하자'
];

// 파스텔톤 포스트잇 색상
const postItColors = ['#ffeb3b', '#ffb6c1', '#87cefa', '#98fb98', '#dda0dd'];

// 포카 리스트 (총 20종, ID는 이미지 파일명 1~20과 매칭됨)
const cards = [
    { id: 1, title: '안녕 주연', rarity: 'normal' },
    { id: 2, title: '철푸덕 주연', rarity: 'normal' },
    { id: 3, title: '윙크 주연', rarity: 'normal' },
    { id: 4, title: '세계사 쉬는시간에 먹방', rarity: 'normal' },
    { id: 5, title: '벚꽃 주연', rarity: 'normal' },
    { id: 6, title: '뭔가 자랑하는 주연', rarity: 'normal' },
    { id: 7, title: '누가 꽃이게?', rarity: 'normal' },
    { id: 8, title: '미대생 주연', rarity: 'normal' },
    { id: 9, title: '한국사 천재 주연', rarity: 'normal' },
    { id: 10, title: '과탐실 홀로그램 주연', rarity: 'normal' },
    { id: 11, title: '고양이 하트가 어려운 주연', rarity: 'normal' },
    { id: 12, title: '에그타르트 냠', rarity: 'normal' },
    { id: 13, title: '브-이', rarity: 'normal' },
    { id: 14, title: '오타쿠 하트 주연', rarity: 'normal' },
    { id: 15, title: '그냥 귀여운 주연', rarity: 'rare' },
    { id: 16, title: '볼콕', rarity: 'rare' },
    { id: 17, title: '어떻게 화재 대피 훈련에서도 예쁘지?', rarity: 'rare' },
    { id: 18, title: '하복 주연', rarity: 'rare' },
    { id: 19, title: '말랑이 주연', rarity: 'special' },
    { id: 20, title: '프로포즈', rarity: 'special' }
];

const rarityLabels = {
    'normal': '⭐ 일반 포카',
    'rare': '🌟 희귀 포카',
    'special': '💎 특수 포카'
};

// --- 2. DOM 요소 선택 ---
const btnMessages = document.getElementById('btn-messages');
const btnGacha = document.getElementById('btn-gacha');
const btnCollection = document.getElementById('btn-collection');
const btnBackMain = document.getElementById('btn-back-main');
const btnGachaAgain = document.getElementById('btn-gacha-again');

const modalMessages = document.getElementById('modal-messages');
const modalGachaAnim = document.getElementById('modal-gacha-anim');
const modalGachaResult = document.getElementById('modal-gacha-result');
const screenCollection = document.getElementById('screen-collection');

const closeBtns = document.querySelectorAll('.close-btn');
const postItContainer = document.querySelector('.post-it-container');
const collectionGrid = document.getElementById('collection-grid');
const collectionProgress = document.getElementById('collection-progress');
const progressBarFill = document.getElementById('progress-bar-fill');

// --- 3. 로컬 스토리지 데이터 로드 ---
// 유저가 뽑은 포카 ID 배열
let collectedCards = JSON.parse(localStorage.getItem('jooyeonCards')) || [];

// --- 4. 이벤트 리스너 ---
btnMessages.addEventListener('click', () => {
    renderMessages();
    modalMessages.classList.remove('hidden');
});

btnGacha.addEventListener('click', () => {
    startGacha();
});

btnGachaAgain.addEventListener('click', () => {
    modalGachaResult.classList.add('hidden');
    startGacha();
});

btnCollection.addEventListener('click', () => {
    renderCollection();
    screenCollection.classList.remove('hidden');
});

btnBackMain.addEventListener('click', () => {
    screenCollection.classList.add('hidden');
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.add('hidden');
    });
});

// 모달 바깥 영역 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// --- 5. 주요 기능 함수 ---

// 축하 메시지 렌더링
function renderMessages() {
    postItContainer.innerHTML = '';
    messages.forEach((msg, index) => {
        const postIt = document.createElement('div');
        postIt.className = 'post-it';
        postIt.innerText = msg;
        
        // 약간씩 삐뚤어지게 랜덤 회전 각도 부여 (-12도 ~ 12도)
        const rotation = Math.random() * 24 - 12;
        const color = postItColors[index % postItColors.length];
        
        postIt.style.transform = `rotate(${rotation}deg)`;
        postIt.style.backgroundColor = color;
        
        postItContainer.appendChild(postIt);
    });
}

// 가챠 뽑기 시작
function startGacha() {
    modalGachaAnim.classList.remove('hidden');
    
    // 1.5초 후 결과 표시
    setTimeout(() => {
        modalGachaAnim.classList.add('hidden');
        showGachaResult();
    }, 1500);
}

// 가챠 결과 표시
function showGachaResult() {
    const card = drawCard();
    
    // 도감에 저장 (중복이 아닐 경우)
    if (!collectedCards.includes(card.id)) {
        collectedCards.push(card.id);
        // 로컬스토리지에 저장하여 새로고침해도 유지되게 함
        localStorage.setItem('jooyeonCards', JSON.stringify(collectedCards));
    }
    
    const imgEl = document.getElementById('gacha-img');
    const rarityEl = document.getElementById('gacha-rarity');
    const titleEl = document.getElementById('gacha-title');
    
    // 이미지 경로 설정 (로컬의 images 폴더 안에 1.jpg~20.jpg 가 있다고 가정)
    // 실제 이미지가 없을 때를 대비한 에러 핸들링 (플레이스홀더 표시)
    imgEl.src = `images/${card.id}.jpg`;
    imgEl.onerror = () => {
        const svgColor = card.rarity === 'special' ? '%23ff1493' : (card.rarity === 'rare' ? '%234169e1' : '%23ffb6c1');
        imgEl.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22220%22%20height%3D%22330%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22220%22%20height%3D%22330%22%20fill%3D%22${svgColor}%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-size%3D%2224%22%20font-family%3D%22sans-serif%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3EImage%20%23${card.id}%3C%2Ftext%3E%3C%2Fsvg%3E`;
    };
    
    rarityEl.innerText = rarityLabels[card.rarity];
    rarityEl.className = `rarity-${card.rarity}`;
    titleEl.innerText = card.title;
    
    modalGachaResult.classList.remove('hidden');
}

// 등급 확률에 따른 카드 뽑기 로직
function drawCard() {
    const rand = Math.random() * 100;
    let targetRarity = 'normal';
    
    // 5% 특수, 25% 희귀, 70% 일반
    if (rand < 5) {
        targetRarity = 'special';
    } else if (rand < 30) {
        targetRarity = 'rare';
    } else {
        targetRarity = 'normal';
    }
    
    // 해당 등급의 카드들만 필터링
    const pool = cards.filter(c => c.rarity === targetRarity);
    // 필터링된 카드 중 랜덤으로 1개 선택
    const result = pool[Math.floor(Math.random() * pool.length)];
    
    return result;
}

// 도감 렌더링
function renderCollection() {
    collectionGrid.innerHTML = '';
    
    // 진행률 업데이트
    collectionProgress.innerText = `${collectedCards.length}/${cards.length}`;
    const percent = (collectedCards.length / cards.length) * 100;
    progressBarFill.style.width = `${percent}%`;
    
    // 모든 카드(20종)를 그리드에 표시
    cards.forEach(card => {
        const isCollected = collectedCards.includes(card.id);
        const item = document.createElement('div');
        item.className = `grid-item ${isCollected ? 'collected' : 'locked'}`;
        
        // 획득한 카드는 실제 이미지, 미획득 카드는 회색 플레이스홀더로 표시
        let imgTag;
        if (isCollected) {
            imgTag = `<img src="images/${card.id}.jpg" alt="${card.title}" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%22%20height%3D%22150%22%20fill%3D%22%23ffb6c1%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3E%23${card.id}%3C%2Ftext%3E%3C%2Fsvg%3E'">`;
        } else {
            imgTag = `<img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%22%20height%3D%22150%22%20fill%3D%22%23e0e0e0%22%2F%3E%3C%2Fsvg%3E" alt="잠김">`;
        }
        
        item.innerHTML = `
            ${imgTag}
            <div class="item-title">${card.title}</div>
        `;
        
        collectionGrid.appendChild(item);
    });
}
