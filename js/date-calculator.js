// Date calculator UI controller. Kept separate from the page for easier maintenance.
document.addEventListener('DOMContentLoaded', () => {
  // タブ切り替えUI
  const tabDiff = document.getElementById('tabDiff');
  const tabAddSub = document.getElementById('tabAddSub');
  const diffSection = document.getElementById('diffSection');
  const addsubSection = document.getElementById('addsubSection');
  function switchTab(mode) {
    if (mode === 'diff') {
      tabDiff.classList.add('bg-accent','text-white');
      tabDiff.classList.remove('bg-gray-200','text-gray-700');
      tabAddSub.classList.remove('bg-accent','text-white');
      tabAddSub.classList.add('bg-gray-200','text-gray-700');
      diffSection.style.display = '';
      addsubSection.style.display = 'none';
    } else {
      tabAddSub.classList.add('bg-accent','text-white');
      tabAddSub.classList.remove('bg-gray-200','text-gray-700');
      tabDiff.classList.remove('bg-accent','text-white');
      tabDiff.classList.add('bg-gray-200','text-gray-700');
      diffSection.style.display = 'none';
      addsubSection.style.display = '';
    }
  }
  tabDiff.addEventListener('click',()=>switchTab('diff'));
  tabAddSub.addEventListener('click',()=>switchTab('addsub'));
  // 初期化
  switchTab('diff');
  // 日付差分計算
  function calcDateDiff(s, e_, useBiz, incStart, incEnd) {
    let d1 = new Date(s);
    let d2 = new Date(e_);
    if (d1 > d2) [d1, d2] = [d2, d1];
    let count = 0;
    let cur = new Date(d1);
    if (useBiz) {
      while (cur <= d2) {
        const ymd = cur.toISOString().slice(0,10);
        if (isBusinessDay(ymd)) count++;
        cur.setDate(cur.getDate() + 1);
      }
    } else {
      count = Math.floor((d2 - d1) / (1000*60*60*24)) + 1;
    }
    // 最初/最後の日を含めるか
    if (!incStart && count > 0) count--;
    if (!incEnd && count > 0) count--;
    if (!incStart && !incEnd && count < 0) count = 0;
    return count;
  }      document.getElementById('diffForm').addEventListener('submit', function(e) {
    e.preventDefault();

    try {
      const s = SecurityUtils.sanitizeInput(document.getElementById('startDate').value);
      const e_ = SecurityUtils.sanitizeInput(document.getElementById('endDate').value);
      const useBiz = document.getElementById('optionBiz').checked;
      const incStart = document.getElementById('optionIncludeStart').checked;
      const incEnd = document.getElementById('optionIncludeEnd').checked;

      if(!s || !e_) {
        SecurityUtils.showUserError('開始日と終了日を入力してください');
        return;
      }

      // 日付形式の検証
      const startDate = new Date(s);
      const endDate = new Date(e_);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        SecurityUtils.showUserError('正しい日付形式で入力してください');
        return;
      }

      const days = calcDateDiff(s, e_, useBiz, incStart, incEnd);
      const res = `${days}日` + (useBiz ? '（営業日）' : '');
      const resultBox = document.getElementById('diffResult');
      resultBox.textContent = res;
      resultBox.classList.remove('hidden');

      SecurityUtils.showSuccessMessage('日付差の計算が完了しました');
    } catch (error) {
      SecurityUtils.showUserError('計算中にエラーが発生しました', error);
    }
  });
  // 日付加減算
  function addBusinessDays(base, days) {
    let d = new Date(base);
    let step = days >= 0 ? 1 : -1;
    let absDays = Math.abs(days);
    let count = 0;
    while (count < absDays) {
      d.setDate(d.getDate() + step);
      const ymd = d.toISOString().slice(0,10);
      if (isBusinessDay(ymd)) count++;
    }
    return d;
  }      document.getElementById('addsubForm').addEventListener('submit', function(e) {
    e.preventDefault();

    try {
      const base = SecurityUtils.sanitizeInput(document.getElementById('baseDate').value);
      const daysInput = SecurityUtils.sanitizeInput(document.getElementById('days').value);
      const days = parseInt(daysInput, 10);
      const useBiz = document.getElementById('optionBiz').checked;
      const incStart = document.getElementById('optionIncludeStart').checked;
      const incEnd = document.getElementById('optionIncludeEnd').checked;

      if(!base || isNaN(days)) {
        SecurityUtils.showUserError('基準日と日数を正しく入力してください');
        return;
      }

      // 日付形式の検証
      const baseDate = new Date(base);
      if (isNaN(baseDate.getTime())) {
        SecurityUtils.showUserError('正しい日付形式で入力してください');
        return;
      }

      // 日数の範囲制限（セキュリティ対策）
      if (Math.abs(days) > 36500) { // 100年以内
        SecurityUtils.showUserError('日数は100年以内（±36500日）で入力してください');
        return;
      }
        let resultDate;
      let n = days;
      // 最初/最後の日を含める調整
      if (!incStart && n > 0) n--;
      if (!incEnd && n > 0) n--;
      if (useBiz) {
        resultDate = addBusinessDays(base, n);
      } else {
        let d = new Date(base);
        d.setDate(d.getDate() + n);
        resultDate = d;
      }
      const y = resultDate.getFullYear();
      const m = ('0'+(resultDate.getMonth()+1)).slice(-2);
      const dd = ('0'+resultDate.getDate()).slice(-2);
      const res = `${y}-${m}-${dd}` + (useBiz ? '（営業日計算）' : '');
      const resultBox = document.getElementById('addsubResult');
      resultBox.textContent = res;
      resultBox.classList.remove('hidden');

      SecurityUtils.showSuccessMessage('日付計算が完了しました');
    } catch (error) {
      SecurityUtils.showUserError('計算中にエラーが発生しました', error);
    }
  });
  // ガイドモーダル
  const guideBtn = document.getElementById('guide-btn');
  const guideModal = document.getElementById('guide-modal');
  const guideClose = document.getElementById('guide-close');
  const guideContent = document.getElementById('guide-modal-content');
  function renderGuide(lang) {
    const guides = {
      ja: {
        title: '日付計算ツールの使い方',
        list: [
          '2つの日付を入力して「日数を計算」ボタンで日数差がわかります。',
          '基準日と日数（正負）を指定して「日付を計算」ボタンで加減算結果が表示されます。',
          '祝日・営業日計算には対応していません。'
        ],
        faqTitle: 'よくある質問',
        faq: [
          {q: 'Q. 英語でも使えますか？', a: 'A. 右上の言語切替で英語UIにできます。'},
          {q: 'Q. 入力データは保存されますか？', a: 'A. 保存されません。プライバシー重視です。'}
        ],
        tipsTitle: '活用例・ヒント',
        tips: [
          '旅行や出張の日数計算',
          '締切日や納期の逆算',
          '日付の加減算で未来・過去の日付を調べる'
        ]
      },
      en: {
        title: 'How to Use the Date Calculator',
        list: [
          'Enter two dates and click "Calculate Days" to get the difference.',
          'Specify a base date and days (±) to add/subtract and get the result.',
          'No support for holidays/business days.'
        ],
        faqTitle: 'FAQ',
        faq: [
          {q: 'Q. Can I use it in English?', a: 'A. Yes, switch language from the top right.'},
          {q: 'Q. Is my input data saved?', a: 'A. No, your data is never saved.'}
        ],
        tipsTitle: 'Tips & Examples',
        tips: [
          'Calculate trip or business days',
          'Back-calculate deadlines',
          'Find a future/past date by adding/subtracting days'
        ]
      }
    };
    const g = guides[lang] || guides.ja;
    let html = `<h2 class='text-xl font-bold mb-3'>${g.title}</h2>`;
    html += '<ul class="list-disc ml-5 mb-4 text-gray-700">' + g.list.map(x=>`<li>${x}</li>`).join('') + '</ul>';
    html += `<h3 class='font-bold text-base mt-6 mb-2'>${g.faqTitle}</h3><dl class='mb-4 text-gray-700'>` + g.faq.map(f=>`<dt class='font-semibold'>${f.q}</dt><dd class='mb-2'>${f.a}</dd>`).join('') + '</dl>';
    html += `<h3 class='font-bold text-base mt-6 mb-2'>${g.tipsTitle}</h3><ul class='list-disc ml-5 text-gray-700'>` + g.tips.map(x=>`<li>${x}</li>`).join('') + '</ul>';
    guideContent.innerHTML = html;
  }
  if(guideBtn && guideModal && guideClose && guideContent) {
    guideBtn.addEventListener('click', function() {
      const lang = document.documentElement.lang || localStorage.getItem('selectedLanguage') || 'ja';
      renderGuide(lang);
      guideModal.classList.remove('hidden');
    });
    guideClose.addEventListener('click', function() {
      guideModal.classList.add('hidden');
    });
    guideModal.addEventListener('click', function(e) {
      if(e.target === guideModal) guideModal.classList.add('hidden');
    });
  }
});
// --- 祝日・トリビアデータの外部JSON fetch＆フォールバック ---
let holidays = [
  '2025-01-01','2025-01-13','2025-02-11','2025-02-23','2025-03-20',
  '2025-04-29','2025-05-03','2025-05-04','2025-05-05','2025-07-21',
  '2025-08-11','2025-09-15','2025-09-23','2025-10-13','2025-11-03','2025-11-23',
  '2026-01-01','2026-01-12','2026-02-11','2026-02-23','2026-03-20','2026-04-29','2026-05-03','2026-05-04','2026-05-05','2026-07-20','2026-08-11','2026-09-21','2026-09-22','2026-09-23','2026-10-12','2026-11-03','2026-11-23',
  '2027-01-01','2027-01-11','2027-02-11','2027-02-23','2027-03-21','2027-04-29','2027-05-03','2027-05-04','2027-05-05','2027-07-19','2027-08-11','2027-09-20','2027-09-23','2027-10-11','2027-11-03','2027-11-23',
  '2028-01-01','2028-01-10','2028-02-11','2028-02-23','2028-03-20','2028-04-29','2028-05-03','2028-05-04','2028-05-05','2028-07-17','2028-08-11','2028-09-18','2028-09-20','2028-10-09','2028-11-03','2028-11-23',
  '2029-01-01','2029-01-08','2029-02-11','2029-02-23','2029-03-20','2029-04-29','2029-05-03','2029-05-04','2029-05-05','2029-07-16','2029-08-11','2029-09-17','2029-09-23','2029-10-08','2029-11-03','2029-11-23',
  '2030-01-01','2030-01-14','2030-02-11','2030-02-23','2030-03-20','2030-04-29','2030-05-03','2030-05-04','2030-05-05','2030-07-15','2030-08-11','2030-09-16','2030-09-23','2030-10-14','2030-11-03','2030-11-23'
];
let triviaData = {
  '01-01': '元日。新年の始まりを祝う日です。',
  '02-03': '節分。豆まきで鬼を追い払います。',
  '02-11': '建国記念の日。日本の建国を祝う日。',
  '02-14': 'バレンタインデー。チョコレートを贈る日。',
  '03-03': 'ひな祭り。女の子の健やかな成長を願う日。',
  '03-14': 'ホワイトデー。バレンタインのお返しを贈る日。',
  '04-01': 'エイプリルフール。嘘をついても許される日。',
  '04-29': '昭和の日。昭和天皇の誕生日。',
  '05-03': '憲法記念日。日本国憲法の施行を記念。',
  '05-04': 'みどりの日。自然に親しむ日。',
  '05-05': 'こどもの日。子どもの成長を祝う日。',
  '07-07': '七夕。織姫と彦星が出会う日。',
  '08-11': '山の日。山に親しむ機会を得る日。',
  '09-15': '敬老の日。お年寄りを敬う日。',
  '09-23': '秋分の日。昼と夜の長さがほぼ等しい日。',
  '10-10': '体育の日（旧）。スポーツに親しむ日。',
  '10-31': 'ハロウィン。仮装やお菓子を楽しむ日。',
  '11-03': '文化の日。自由と平和を愛する日。',
  '11-23': '勤労感謝の日。働くことに感謝する日。',
  '12-24': 'クリスマス・イブ。クリスマス前夜。',
  '12-25': 'クリスマス。イエス・キリストの誕生日。',
  '12-31': '大晦日。一年の締めくくりの日。',
  '06-11': '今日は「傘の日」。梅雨入りの時期にちなみ制定されました。',
  '03-20': '春分の日。昼と夜の長さがほぼ等しい日。',
  '02-23': '天皇誕生日。令和天皇の誕生日。'
};
// 外部JSONをfetchして上書き
// Skip fetch on file:// to avoid CORS; use inline fallback. Fetch only on http(s).
if (location.protocol === 'http:' || location.protocol === 'https:') {
  fetch('./holidays-ja.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    if(Array.isArray(data)) holidays = data;
  }).catch(()=>{/* フォールバック */});
  fetch('./date-trivia-ja.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    if(typeof data === 'object') triviaData = data;
  }).catch(()=>{/* フォールバック */});
}
// --- 祝日・トリビア参照ロジックを修正 ---
function isBusinessDay(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  if (day === 0 || day === 6) return false; // 日曜・土曜
  if (holidays.includes(dateStr)) return false;
  return true;
}
function showDateTrivia(dateStr) {
  const triviaBox = document.getElementById('dateTrivia');
  // YYYY-MM-DD→MM-DD変換
  let key = dateStr && dateStr.length >= 10 ? dateStr.slice(5,10) : dateStr;
  if (triviaData[key]) {
    triviaBox.textContent = triviaData[key];
  } else {
    triviaBox.textContent = 'この日付に関する特別なトリビアはありません。';
  }
}
// 日付入力欄のいずれかが変更されたらトリビア表示
['startDate','endDate','baseDate','bizStartDate','bizEndDate'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', function() {
      if (el.value) showDateTrivia(el.value);
    });
  }
});
// 機能切り替えUI
function updateSections() {
  const diffSection = document.getElementById('diffSection');
  const addsubSection = document.getElementById('addsubSection');
  const bizSection = document.getElementById('bizSection');
  const toggleDiff = document.getElementById('toggleDiff');
  const toggleAddSub = document.getElementById('toggleAddSub');
  const toggleBiz = document.getElementById('toggleBiz');

  if (diffSection && toggleDiff) {
    diffSection.style.display = toggleDiff.checked ? '' : 'none';
  }
  if (addsubSection && toggleAddSub) {
    addsubSection.style.display = toggleAddSub.checked ? '' : 'none';
  }
  if (bizSection && toggleBiz) {
    bizSection.style.display = toggleBiz.checked ? '' : 'none';
  }
}

const toggleDiff = document.getElementById('toggleDiff');
const toggleAddSub = document.getElementById('toggleAddSub');
const toggleBiz = document.getElementById('toggleBiz');

if (toggleDiff) {
  toggleDiff.addEventListener('change', updateSections);
}
if (toggleAddSub) {
  toggleAddSub.addEventListener('change', updateSections);
}
if (toggleBiz) {
  toggleBiz.addEventListener('change', updateSections);
}
// 初期化
updateSections();
