// Date calculator UI controller. All dynamic text is written with textContent.
(() => {
  'use strict';

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const MAX_ABS_DAYS = 36500;
  const HISTORY_KEY = 'date-calculator-history';
  const HISTORY_LIMIT = 8;

  const messages = {
    ja: {
      requiredDates: '開始日と終了日を入力してください。',
      requiredBase: '基準日と日数を入力してください。',
      invalidDate: '正しい日付を入力してください。',
      invalidDays: '日数は -36500 から 36500 までの整数で入力してください。',
      diffComplete: '日付差を計算しました。',
      addComplete: '日付を計算しました。',
      copyReady: '結果をコピーしました。',
      copyFailed: 'コピーできませんでした。結果を選択してコピーしてください。',
      noResult: 'コピーできる結果がまだありません。',
      day: '日',
      businessSuffix: '（営業日）',
      calendarSuffix: '（暦日）',
      historyEmpty: '履歴はまだありません。',
      deleteLabel: '削除',
      reuseLabel: '再利用',
      rangeNote: '営業日は土日と内蔵の日本の祝日を除いて数えます。祝日データは2025-2030年の範囲です。',
      noTrivia: 'この日付のトリビアは登録されていません。'
    },
    en: {
      requiredDates: 'Enter both a start date and an end date.',
      requiredBase: 'Enter a base date and number of days.',
      invalidDate: 'Enter a valid date.',
      invalidDays: 'Enter an integer from -36500 to 36500.',
      diffComplete: 'Date difference calculated.',
      addComplete: 'Date calculated.',
      copyReady: 'Result copied.',
      copyFailed: 'Copy failed. Select the result and copy it manually.',
      noResult: 'There is no result to copy yet.',
      day: 'days',
      businessSuffix: '(business days)',
      calendarSuffix: '(calendar days)',
      historyEmpty: 'No history yet.',
      deleteLabel: 'Delete',
      reuseLabel: 'Reuse',
      rangeNote: 'Business days exclude weekends and bundled Japanese national holidays. Holiday data covers 2025-2030.',
      noTrivia: 'No trivia is registered for this date.'
    }
  };

  let holidays = [
    '2025-01-01', '2025-01-13', '2025-02-11', '2025-02-23', '2025-03-20',
    '2025-04-29', '2025-05-03', '2025-05-04', '2025-05-05', '2025-07-21',
    '2025-08-11', '2025-09-15', '2025-09-23', '2025-10-13', '2025-11-03', '2025-11-23',
    '2026-01-01', '2026-01-12', '2026-02-11', '2026-02-23', '2026-03-20',
    '2026-04-29', '2026-05-03', '2026-05-04', '2026-05-05', '2026-07-20',
    '2026-08-11', '2026-09-21', '2026-09-22', '2026-09-23', '2026-10-12',
    '2026-11-03', '2026-11-23',
    '2027-01-01', '2027-01-11', '2027-02-11', '2027-02-23', '2027-03-21',
    '2027-04-29', '2027-05-03', '2027-05-04', '2027-05-05', '2027-07-19',
    '2027-08-11', '2027-09-20', '2027-09-23', '2027-10-11', '2027-11-03', '2027-11-23',
    '2028-01-01', '2028-01-10', '2028-02-11', '2028-02-23', '2028-03-20',
    '2028-04-29', '2028-05-03', '2028-05-04', '2028-05-05', '2028-07-17',
    '2028-08-11', '2028-09-18', '2028-09-20', '2028-10-09', '2028-11-03', '2028-11-23',
    '2029-01-01', '2029-01-08', '2029-02-11', '2029-02-23', '2029-03-20',
    '2029-04-29', '2029-05-03', '2029-05-04', '2029-05-05', '2029-07-16',
    '2029-08-11', '2029-09-17', '2029-09-23', '2029-10-08', '2029-11-03', '2029-11-23',
    '2030-01-01', '2030-01-14', '2030-02-11', '2030-02-23', '2030-03-20',
    '2030-04-29', '2030-05-03', '2030-05-04', '2030-05-05', '2030-07-15',
    '2030-08-11', '2030-09-16', '2030-09-23', '2030-10-14', '2030-11-03', '2030-11-23'
  ];

  let triviaData = {
    '01-01': { ja: '元日。新しい年の始まりを祝う日です。', en: 'New Year\'s Day.' },
    '02-11': { ja: '建国記念の日。日本の建国をしのぶ祝日です。', en: 'National Foundation Day in Japan.' },
    '02-14': { ja: 'バレンタインデーとして知られています。', en: 'Known as Valentine\'s Day.' },
    '02-23': { ja: '天皇誕生日。令和の天皇誕生日です。', en: 'The Emperor\'s Birthday in Japan.' },
    '03-03': { ja: 'ひな祭り。子どもの健やかな成長を願う行事です。', en: 'Hinamatsuri, the Doll Festival in Japan.' },
    '03-20': { ja: '春分の日の頃。年によって日付が変わります。', en: 'Around the vernal equinox in Japan.' },
    '04-01': { ja: '年度初めやエイプリルフールとして使われる日です。', en: 'Often the start of a fiscal or school year in Japan.' },
    '04-29': { ja: '昭和の日。ゴールデンウィーク前半の祝日です。', en: 'Showa Day in Japan.' },
    '05-03': { ja: '憲法記念日。日本国憲法の施行を記念する祝日です。', en: 'Constitution Memorial Day in Japan.' },
    '05-04': { ja: 'みどりの日。自然に親しむ祝日です。', en: 'Greenery Day in Japan.' },
    '05-05': { ja: 'こどもの日。子どもの成長を祝う祝日です。', en: 'Children\'s Day in Japan.' },
    '07-07': { ja: '七夕。願いごとを書いた短冊を飾る行事です。', en: 'Tanabata, the Star Festival in Japan.' },
    '08-11': { ja: '山の日。山に親しむ機会を得る祝日です。', en: 'Mountain Day in Japan.' },
    '09-23': { ja: '秋分の日の頃。年によって日付が変わります。', en: 'Around the autumnal equinox in Japan.' },
    '10-31': { ja: 'ハロウィンとして知られています。', en: 'Known as Halloween.' },
    '11-03': { ja: '文化の日。自由と平和を愛し文化をすすめる祝日です。', en: 'Culture Day in Japan.' },
    '11-23': { ja: '勤労感謝の日。勤労を尊び感謝する祝日です。', en: 'Labor Thanksgiving Day in Japan.' },
    '12-24': { ja: 'クリスマスイブとして知られています。', en: 'Known as Christmas Eve.' },
    '12-25': { ja: 'クリスマスとして知られています。', en: 'Known as Christmas Day.' },
    '12-31': { ja: '大晦日。一年の締めくくりの日です。', en: 'New Year\'s Eve.' }
  };

  const $ = (id) => document.getElementById(id);

  function getLang() {
    const lang = document.documentElement.lang || localStorage.getItem('selectedLanguage') || 'ja';
    return lang.startsWith('en') ? 'en' : 'ja';
  }

  function t(key) {
    return messages[getLang()][key] || messages.ja[key] || key;
  }

  function notify(type, text, error) {
    const utils = window.SecurityUtils || {};
    if (type === 'error' && typeof utils.showUserError === 'function') {
      utils.showUserError(text, error);
      return;
    }
    if (type === 'success' && typeof utils.showSuccessMessage === 'function') {
      utils.showSuccessMessage(text);
    }
  }

  function parseDateInput(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function isBusinessDay(date) {
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    return !holidays.includes(formatDate(date));
  }

  function addDays(date, count) {
    const result = new Date(date);
    result.setDate(result.getDate() + count);
    return result;
  }

  function countDays(startDate, endDate, useBusinessDays, includeStart, includeEnd) {
    let from = new Date(startDate);
    let to = new Date(endDate);
    if (from > to) [from, to] = [to, from];

    if (!includeStart) from = addDays(from, 1);
    if (!includeEnd) to = addDays(to, -1);
    if (from > to) return 0;

    if (!useBusinessDays) {
      return Math.floor((to - from) / MS_PER_DAY) + 1;
    }

    let count = 0;
    for (let cursor = new Date(from); cursor <= to; cursor = addDays(cursor, 1)) {
      if (isBusinessDay(cursor)) count += 1;
    }
    return count;
  }

  function addBusinessDays(baseDate, count) {
    if (count === 0) return new Date(baseDate);
    const step = count > 0 ? 1 : -1;
    let remaining = Math.abs(count);
    let cursor = new Date(baseDate);
    while (remaining > 0) {
      cursor = addDays(cursor, step);
      if (isBusinessDay(cursor)) remaining -= 1;
    }
    return cursor;
  }

  function getOptions() {
    return {
      includeStart: $('optionIncludeStart')?.checked ?? true,
      includeEnd: $('optionIncludeEnd')?.checked ?? true,
      useBusinessDays: $('optionBiz')?.checked ?? false
    };
  }

  function setResult(element, text) {
    if (!element) return;
    element.textContent = text;
    element.dataset.resultText = text;
    element.classList.remove('hidden');
  }

  function getHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveHistoryItem(item) {
    const history = getHistory().filter((entry) => entry.id !== item.id);
    history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
    renderHistory();
  }

  function renderHistory() {
    const list = $('dateHistoryList');
    if (!list) return;
    const history = getHistory();
    list.replaceChildren();

    if (!history.length) {
      const empty = document.createElement('p');
      empty.className = 'text-sm text-gray-500';
      empty.textContent = t('historyEmpty');
      list.appendChild(empty);
      return;
    }

    history.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'flex flex-col gap-2 rounded border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between';

      const text = document.createElement('span');
      text.className = 'text-sm text-gray-700';
      text.textContent = entry.label;

      const actions = document.createElement('div');
      actions.className = 'flex gap-2';

      const reuse = document.createElement('button');
      reuse.type = 'button';
      reuse.className = 'rounded border border-accent px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/10';
      reuse.textContent = t('reuseLabel');
      reuse.addEventListener('click', () => reuseHistory(entry));

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50';
      remove.textContent = t('deleteLabel');
      remove.addEventListener('click', () => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter((candidate) => candidate.id !== entry.id)));
        renderHistory();
      });

      actions.append(reuse, remove);
      item.append(text, actions);
      list.appendChild(item);
    });
  }

  function reuseHistory(entry) {
    if (entry.type === 'diff') {
      $('startDate').value = entry.startDate;
      $('endDate').value = entry.endDate;
      switchTab('diff');
    } else {
      $('baseDate').value = entry.baseDate;
      $('days').value = entry.days;
      switchTab('addsub');
    }
  }

  function switchTab(mode) {
    const tabDiff = $('tabDiff');
    const tabAddSub = $('tabAddSub');
    const diffSection = $('diffSection');
    const addsubSection = $('addsubSection');
    if (!tabDiff || !tabAddSub || !diffSection || !addsubSection) return;

    const isDiff = mode === 'diff';
    tabDiff.classList.toggle('bg-accent', isDiff);
    tabDiff.classList.toggle('text-white', isDiff);
    tabDiff.classList.toggle('bg-gray-200', !isDiff);
    tabDiff.classList.toggle('text-gray-700', !isDiff);
    tabAddSub.classList.toggle('bg-accent', !isDiff);
    tabAddSub.classList.toggle('text-white', !isDiff);
    tabAddSub.classList.toggle('bg-gray-200', isDiff);
    tabAddSub.classList.toggle('text-gray-700', isDiff);
    diffSection.hidden = !isDiff;
    addsubSection.hidden = isDiff;
  }

  function showDateTrivia(dateValue) {
    const triviaBox = $('dateTrivia');
    if (!triviaBox) return;
    const key = dateValue && dateValue.length >= 10 ? dateValue.slice(5, 10) : '';
    const entry = triviaData[key];
    const localized = typeof entry === 'string' ? entry : entry?.[getLang()] || entry?.ja;
    triviaBox.textContent = localized || t('noTrivia');
  }

  function renderGuide(lang) {
    const guideContent = $('guide-modal-content');
    if (!guideContent) return;
    const guides = {
      ja: {
        title: '日付計算ツールの使い方',
        steps: [
          '日付差分では、開始日と終了日を入力して日数を確認します。',
          '加算・減算では、基準日と正負の日数を入力して結果の日付を確認します。',
          '営業日計算は土日と内蔵の日本の祝日を除外します。重要な締切は公式カレンダーも確認してください。'
        ],
        faqTitle: 'FAQ',
        faq: [
          { q: '入力した日付は保存されますか？', a: '計算はブラウザ内で処理します。履歴はこの端末のlocalStorageにのみ保存され、履歴クリアで削除できます。' },
          { q: '営業日計算は何に対応していますか？', a: '土日と2025-2030年の日本の祝日データを除外します。会社独自の休業日は含みません。' }
        ]
      },
      en: {
        title: 'How to Use the Date Calculator',
        steps: [
          'For date difference, enter a start date and end date to calculate the day count.',
          'For add/subtract, enter a base date and a positive or negative day count.',
          'Business-day mode excludes weekends and bundled Japanese national holidays. Check official calendars for critical deadlines.'
        ],
        faqTitle: 'FAQ',
        faq: [
          { q: 'Is my input saved?', a: 'Calculations run in your browser. History is stored only in this device\'s localStorage and can be cleared.' },
          { q: 'What does business-day mode support?', a: 'It excludes weekends and Japanese national holidays from 2025 through 2030. Company-specific holidays are not included.' }
        ]
      }
    };
    const guide = guides[lang] || guides.ja;

    const fragment = document.createDocumentFragment();
    const title = document.createElement('h2');
    title.id = 'guide-modal-title';
    title.className = 'text-xl font-bold mb-3';
    title.textContent = guide.title;
    fragment.appendChild(title);

    const steps = document.createElement('ul');
    steps.className = 'list-disc ml-5 mb-4 text-gray-700';
    guide.steps.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      steps.appendChild(li);
    });
    fragment.appendChild(steps);

    const faqTitle = document.createElement('h3');
    faqTitle.className = 'font-bold text-base mt-6 mb-2';
    faqTitle.textContent = guide.faqTitle;
    fragment.appendChild(faqTitle);

    const faqList = document.createElement('dl');
    faqList.className = 'mb-4 text-gray-700';
    guide.faq.forEach((item) => {
      const dt = document.createElement('dt');
      dt.className = 'font-semibold';
      dt.textContent = item.q;
      const dd = document.createElement('dd');
      dd.className = 'mb-2';
      dd.textContent = item.a;
      faqList.append(dt, dd);
    });
    fragment.appendChild(faqList);
    guideContent.replaceChildren(fragment);
  }

  function initExternalData() {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    fetch('./holidays-ja.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('holiday fetch failed'))))
      .then((data) => {
        if (Array.isArray(data) && data.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item))) holidays = data;
      })
      .catch(() => {});
    fetch('./date-trivia-ja.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('trivia fetch failed'))))
      .then((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) triviaData = data;
      })
      .catch(() => {});
  }

  function bindEvents() {
    $('tabDiff')?.addEventListener('click', () => switchTab('diff'));
    $('tabAddSub')?.addEventListener('click', () => switchTab('addsub'));

    $('diffForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const startDate = parseDateInput($('startDate')?.value);
      const endDate = parseDateInput($('endDate')?.value);
      if (!startDate || !endDate) {
        notify('error', !startDate && !endDate ? t('requiredDates') : t('invalidDate'));
        return;
      }

      const options = getOptions();
      const days = countDays(startDate, endDate, options.useBusinessDays, options.includeStart, options.includeEnd);
      const suffix = options.useBusinessDays ? t('businessSuffix') : t('calendarSuffix');
      const result = `${days} ${t('day')} ${suffix}`;
      setResult($('diffResult'), result);
      saveHistoryItem({
        id: `diff:${formatDate(startDate)}:${formatDate(endDate)}:${JSON.stringify(options)}`,
        type: 'diff',
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        label: `${formatDate(startDate)} - ${formatDate(endDate)} = ${result}`
      });
      notify('success', t('diffComplete'));
    });

    $('addsubForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const baseDate = parseDateInput($('baseDate')?.value);
      const daysText = $('days')?.value || '';
      const days = Number(daysText);
      if (!baseDate) {
        notify('error', t('requiredBase'));
        return;
      }
      if (!Number.isInteger(days) || Math.abs(days) > MAX_ABS_DAYS) {
        notify('error', t('invalidDays'));
        return;
      }

      const options = getOptions();
      const normalizedDays = days;
      const resultDate = options.useBusinessDays ? addBusinessDays(baseDate, normalizedDays) : addDays(baseDate, normalizedDays);
      const suffix = options.useBusinessDays ? t('businessSuffix') : t('calendarSuffix');
      const result = `${formatDate(resultDate)} ${suffix}`;
      setResult($('addsubResult'), result);
      saveHistoryItem({
        id: `addsub:${formatDate(baseDate)}:${days}:${options.useBusinessDays}`,
        type: 'addsub',
        baseDate: formatDate(baseDate),
        days,
        label: `${formatDate(baseDate)} ${days >= 0 ? '+' : ''}${days} = ${result}`
      });
      notify('success', t('addComplete'));
    });

    $('copyResult')?.addEventListener('click', async () => {
      const activeResult = $('diffSection')?.hidden ? $('addsubResult') : $('diffResult');
      const result = activeResult?.dataset.resultText || '';
      if (!result) {
        notify('error', t('noResult'));
        return;
      }
      try {
        await navigator.clipboard.writeText(result);
        notify('success', t('copyReady'));
      } catch (error) {
        notify('error', t('copyFailed'), error);
      }
    });

    $('clearHistory')?.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    });

    $('guide-btn')?.addEventListener('click', () => {
      renderGuide(getLang());
      $('guide-modal')?.classList.remove('hidden');
    });
    $('guide-close')?.addEventListener('click', () => $('guide-modal')?.classList.add('hidden'));
    $('guide-modal')?.addEventListener('click', (event) => {
      if (event.target === $('guide-modal')) $('guide-modal').classList.add('hidden');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !$('guide-modal')?.classList.contains('hidden')) {
        $('guide-modal').classList.add('hidden');
        $('guide-btn')?.focus();
      }
    });

    document.querySelectorAll('[data-date-focus]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = $(link.getAttribute('data-date-focus'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      });
    });

    ['startDate', 'endDate', 'baseDate'].forEach((id) => {
      $(id)?.addEventListener('change', (event) => showDateTrivia(event.target.value));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initExternalData();
    bindEvents();
    switchTab('diff');
    showDateTrivia(formatDate(new Date()));
    renderHistory();
    const note = $('businessDayNote');
    if (note) note.textContent = t('rangeNote');
  });
})();
