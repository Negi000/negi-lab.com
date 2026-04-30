// Translations for the browser music drafting tool.
(function () {
  "use strict";

  const musicGeneratorTranslations = {
    en: {
      pageTitle: "Free Browser Music Drafting Tool - BGM and Melody Generator | negi-lab.com",
      metaDescription: "Choose genre, mood, tempo and key to generate BGM and melody drafts directly in your browser.",
      header: { nav: { tools: "Tools", wikis: "Game Wikis" } },
      option: { ja: "Japanese", en: "English" },
      breadcrumbs: { currentPage: "Music Generator" },
      main: {
        title: "Music Generator",
        subtitle: "Create a quick BGM or melody draft from genre, mood, tempo and a few keywords."
      },
      mode: { simple: "Simple", advanced: "Advanced" },
      simple: { genre: "Genre", mood: "Mood", keywords: "Keywords" },
      advanced: { key: "Key", tempo: "Tempo (BPM)", instruments: "Instruments", structure: "Song Structure" },
      button: { generate: "Generate Music", downloadWav: "WAV", downloadMidi: "MIDI" },
      status: { generating: "Generating draft..." },
      player: { title: "Player", placeholder: "Generated music will appear here" },
      history: { title: "Generation History", placeholder: "No history yet" },
      howTo: {
        title: "How It Works",
        item1: { title: "1. Genre and Mood Rules", desc: "Each genre and mood switches between tempo, scale, chord and rhythm candidates." },
        item2: { title: "2. Chord Progressions", desc: "The tool builds a chord flow from the selected key and scale." },
        item3: { title: "3. Melody Drafting", desc: "Melody notes are chosen from chord tones and nearby scale notes." },
        item4: { title: "4. Structure and Dynamics", desc: "Sections vary density and dynamics so short drafts feel less repetitive." },
        item5: { title: "5. Keyword Hints", desc: "Keywords can loosely influence tempo, mood and instrument choices." },
        item6: { title: "6. Browser Synth Playback", desc: "Local Tone.js synthesizers play the result without external sample libraries." }
      },
      useCase: {
        title: "Useful For",
        item1: { title: "Video BGM Drafts", desc: "Sketch BGM directions for videos before producing a final track." },
        item2: { title: "Game and App Prototypes", desc: "Create quick loops for prototypes and early mood checks." },
        item3: { title: "Presentations", desc: "Try a simple theme that matches the tone of a talk or demo." },
        item4: { title: "Podcasts and Streams", desc: "Draft intro, outro or transition ideas for a show." },
        item5: { title: "Songwriting Ideas", desc: "Use generated melodies and chords as a starting point for arrangement." },
        item6: { title: "Focus or Relaxation Loops", desc: "Create a short personal loop for concentration or relaxation." }
      },
      siteInfo: {
        title: "About negi-lab.com",
        point1: "This site and its tools are independently developed and operated by negi-lab.com.",
        point2: "Ads and affiliate links may be included, but usability is prioritized.",
        point3: "We pay attention to accuracy and safety, but please use the results at your own responsibility.",
        copyright: "© 2026 negi-lab.com"
      },
      footer: {
        privacyPolicy: "Privacy Policy",
        terms: "Terms",
        about: "About",
        contact: "Contact",
        sitemap: "Sitemap",
        copyright: "© 2026 negi-lab.com"
      },
      history_empty: "No generated drafts yet.",
      tempo_label: "Tempo:",
      tempo_bpm_label: "Tempo (BPM)",
      tempo_value_medium: "Medium",
      tempo_slow: "Slow",
      tempo_medium: "Medium",
      tempo_fast: "Fast",
      length_label: "Length",
      complexity_label: "Complexity",
      loop_toggle_label: "Loop playback",
      key_label: "Key",
      melody_instrument_label: "Melody instrument",
      chord_instrument_label: "Chord instrument",
      bass_instrument_label: "Bass instrument",
      structure_label: "Structure",
      reverb_label: "Reverb"
    },
    ja: {
      pageTitle: "無料ブラウザ作曲支援ツール - BGM・メロディ生成 | negi-lab.com",
      metaDescription: "ジャンル、ムード、テンポ、キーを選んで、ブラウザ内でBGMやメロディの下書きを生成できる作曲支援ツールです。",
      header: { nav: { tools: "ツール", wikis: "ゲームWiki" } },
      option: { ja: "日本語", en: "English" },
      breadcrumbs: { currentPage: "音楽生成ツール" },
      main: {
        title: "音楽生成ツール",
        subtitle: "ジャンル、ムード、テンポ、キーワードから、BGMやメロディの下書きをすばやく作れます。"
      },
      mode: { simple: "シンプル", advanced: "詳細設定" },
      simple: { genre: "ジャンル", mood: "ムード", keywords: "キーワード" },
      advanced: { key: "キー", tempo: "テンポ (BPM)", instruments: "楽器", structure: "曲の構成" },
      button: { generate: "音楽を生成", downloadWav: "WAV", downloadMidi: "MIDI" },
      status: { generating: "生成中..." },
      player: { title: "プレイヤー", placeholder: "生成した音楽がここに表示されます" },
      history: { title: "生成履歴", placeholder: "まだ履歴がありません" },
      howTo: {
        title: "生成の仕組み",
        item1: { title: "1. ジャンルとムードのルール", desc: "ジャンルとムードごとに、テンポ、スケール、コード進行、リズムの候補を切り替えます。" },
        item2: { title: "2. コード進行", desc: "選んだキーとスケールをもとに、曲の土台になるコード進行を組み立てます。" },
        item3: { title: "3. メロディの下書き", desc: "コードトーンと近いスケール音を使い、違和感の少ないメロディを作ります。" },
        item4: { title: "4. 構成と強弱", desc: "セクションごとに音の密度や強弱を変え、短い下書きでも単調になりにくい展開を目指します。" },
        item5: { title: "5. キーワードの反映", desc: "入力されたキーワードをヒントとして、テンポや雰囲気、楽器選びにゆるく反映します。" },
        item6: { title: "6. ブラウザ内シンセ再生", desc: "ローカルのTone.jsシンセサイザーを使うため、外部サンプル音源の読み込みを待たずに再生できます。" }
      },
      useCase: {
        title: "活用例",
        item1: { title: "動画BGMの下書き", desc: "YouTube動画、Vlog、プロモーション動画などのBGM案を、制作前のラフとして試せます。" },
        item2: { title: "ゲーム・アプリの試作", desc: "プロトタイプ用のループや雰囲気確認に使えます。" },
        item3: { title: "プレゼン", desc: "発表やデモの雰囲気に合う簡単なテーマを試せます。" },
        item4: { title: "配信・ポッドキャスト", desc: "オープニング、エンディング、切り替え用の短いアイデア作りに向いています。" },
        item5: { title: "作曲アイデア", desc: "生成されたメロディやコードを、編曲や作曲の出発点として使えます。" },
        item6: { title: "作業用・リラックス用ループ", desc: "集中や休憩に合う短いループを個人用に作れます。" }
      },
      siteInfo: {
        title: "negi-lab.comの運営方針",
        point1: "本サイト・各ツールはnegi-lab.comが独自開発・運営しています。",
        point2: "広告・アフィリエイトを含みますが、ユーザー体験を優先しています。",
        point3: "正確性・安全性には注意していますが、利用は自己責任でお願いします。",
        copyright: "© 2026 negi-lab.com"
      },
      footer: {
        privacyPolicy: "プライバシーポリシー",
        terms: "利用規約",
        about: "運営者情報",
        contact: "お問い合わせ",
        sitemap: "サイトマップ",
        copyright: "© 2026 negi-lab.com"
      },
      history_empty: "まだ生成された音楽はありません。",
      tempo_label: "テンポ:",
      tempo_bpm_label: "テンポ (BPM)",
      tempo_value_medium: "普通",
      tempo_slow: "遅い",
      tempo_medium: "普通",
      tempo_fast: "速い",
      length_label: "曲の長さ",
      complexity_label: "複雑さ",
      loop_toggle_label: "ループ再生",
      key_label: "キー",
      melody_instrument_label: "メロディ楽器",
      chord_instrument_label: "コード楽器",
      bass_instrument_label: "ベース楽器",
      structure_label: "構成",
      reverb_label: "リバーブ"
    }
  };

  function normalizeLanguage(lang) {
    return String(lang || "").toLowerCase().slice(0, 2) === "en" ? "en" : "ja";
  }

  function getSavedLanguage() {
    try {
      const urlLang = new URLSearchParams(location.search).get("lang");
      if (urlLang) return normalizeLanguage(urlLang);
      return normalizeLanguage(
        localStorage.getItem("selectedLanguage") ||
        localStorage.getItem("negi-lab-language") ||
        localStorage.getItem("preferredLanguage") ||
        localStorage.getItem("language") ||
        document.documentElement.lang ||
        "ja"
      );
    } catch (_) {
      return normalizeLanguage(document.documentElement.lang || "ja");
    }
  }

  function persistLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    ["selectedLanguage", "negi-lab-language", "preferredLanguage", "language"].forEach((key) => {
      try { localStorage.setItem(key, normalized); } catch (_) {}
    });
    document.documentElement.lang = normalized;
    return normalized;
  }

  function resolveKey(table, key) {
    return key.split(".").reduce((value, part) => value && value[part], table);
  }

  function applyMusicTranslations(lang) {
    const table = musicGeneratorTranslations[normalizeLanguage(lang)] || musicGeneratorTranslations.ja;
    document.querySelectorAll("[data-translate-key]").forEach((element) => {
      const value = resolveKey(table, element.dataset.translateKey);
      if (typeof value !== "string") return;
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = value;
      } else if (element.tagName === "META") {
        element.setAttribute("content", value);
      } else if (element.tagName === "TITLE") {
        element.textContent = value;
        document.title = value;
      } else {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      const value = table[key];
      if (typeof value !== "string") return;

      if (key === "tempo_label" && element.getAttribute("for") === "tempo-simple-slider") {
        element.replaceChildren(document.createTextNode(`${value} `));
        const valueSpan = document.createElement("span");
        valueSpan.id = "tempo-simple-value";
        valueSpan.textContent = table.tempo_value_medium || table.tempo_medium || "";
        element.appendChild(valueSpan);
        return;
      }

      element.textContent = value;
    });

    if (table.pageTitle) document.title = table.pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description && table.metaDescription) description.setAttribute("content", table.metaDescription);
  }

  window.musicGeneratorTranslations = musicGeneratorTranslations;
  window.translations = musicGeneratorTranslations;

  document.addEventListener("DOMContentLoaded", () => {
    const lang = persistLanguage(getSavedLanguage());
    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
      langSwitch.value = lang;
      langSwitch.addEventListener("change", (event) => {
        const nextLang = persistLanguage(event.target.value);
        applyMusicTranslations(nextLang);
        window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: nextLang } }));
      });
    }
    applyMusicTranslations(lang);
  });
})();
