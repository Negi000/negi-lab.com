/**
 * 共通ユーティリティ関数
 * 複数のツール間で共有される機能を提供
 */

window.CommonUtils = {
  // ローディング表示制御
  showLoading: function(targetElementId, message = '処理中...') {
    const element = document.getElementById(targetElementId);
    if (!element) return;
    
    element.innerHTML = `
      <div class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-3"></div>
        <span class="text-gray-600">${SecurityUtils.escapeHtml(message)}</span>
      </div>
    `;
  },

  hideLoading: function(targetElementId) {
    const element = document.getElementById(targetElementId);
    if (!element) return;
    element.innerHTML = '';
  },

  // ファイルダウンロード
  downloadFile: function(blob, filename) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = SecurityUtils.sanitizeInput(filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      SecurityUtils.showSuccessMessage(`ファイル "${filename}" のダウンロードを開始しました`);
    } catch (error) {
      SecurityUtils.showUserError('ファイルのダウンロードに失敗しました', error);
    }
  },

  // 画像のプレビュー表示
  previewImage: function(file, previewElementId) {
    if (!SecurityUtils.validateFileType(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
      return false;
    }

    if (!SecurityUtils.validateFileSize(file, 10)) {
      return false;
    }

    const previewElement = document.getElementById(previewElementId);
    if (!previewElement) {
      console.error(`プレビュー要素が見つかりません: ${previewElementId}`);
      return false;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      previewElement.innerHTML = `
        <div class="text-center">
          <img src="${e.target.result}" alt="プレビュー" class="max-w-full h-auto max-h-64 mx-auto rounded border shadow">
          <p class="text-sm text-gray-600 mt-2">
            ファイル名: ${SecurityUtils.escapeHtml(file.name)}<br>
            サイズ: ${(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      `;
    };
    
    reader.onerror = function() {
      SecurityUtils.showUserError('画像の読み込みに失敗しました');
      return false;
    };
    
    reader.readAsDataURL(file);
    return true;
  },

  // クリップボードコピー
  copyToClipboard: function(text, successMessage = 'クリップボードにコピーしました') {
    if (!navigator.clipboard) {
      // フォールバック：古いブラウザ対応
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        SecurityUtils.showSuccessMessage(successMessage);
        return true;
      } catch (err) {
        SecurityUtils.showUserError('クリップボードへのコピーに失敗しました', err);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }

    navigator.clipboard.writeText(text).then(function() {
      SecurityUtils.showSuccessMessage(successMessage);
    }).catch(function(err) {
      SecurityUtils.showUserError('クリップボードへのコピーに失敗しました', err);
    });
  },

  // フォーム値の検証と取得
  getFormValue: function(elementId, required = false, maxLength = null) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`要素が見つかりません: ${elementId}`);
      return null;
    }

    let value = element.value;
    
    if (required && (!value || value.trim() === '')) {
      SecurityUtils.showUserError(`${element.name || elementId} は必須項目です`);
      element.focus();
      return null;
    }

    if (maxLength && value.length > maxLength) {
      SecurityUtils.showUserError(`${element.name || elementId} は${maxLength}文字以内で入力してください`);
      element.focus();
      return null;
    }

    return SecurityUtils.sanitizeInput(value);
  },

  // デバウンス関数
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // ローカルストレージの安全な操作
  localStorage: {
    set: function(key, value) {
      try {
        const sanitizedKey = SecurityUtils.sanitizeInput(key);
        localStorage.setItem(sanitizedKey, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('localStorage保存エラー:', error);
        return false;
      }
    },

    get: function(key, defaultValue = null) {
      try {
        const sanitizedKey = SecurityUtils.sanitizeInput(key);
        const item = localStorage.getItem(sanitizedKey);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('localStorage読み込みエラー:', error);
        return defaultValue;
      }
    },

    remove: function(key) {
      try {
        const sanitizedKey = SecurityUtils.sanitizeInput(key);
        localStorage.removeItem(sanitizedKey);
        return true;
      } catch (error) {
        console.error('localStorage削除エラー:', error);
        return false;
      }
    }
  },

  // 多言語対応関数
  translate: function(key, fallback = key) {
    if (window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key]) {
      return window.translations[window.currentLanguage][key];
    }
    return fallback;
  },

  // パフォーマンス測定
  measurePerformance: function(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`Performance [${name}]: ${(end - start).toFixed(2)}ms`);
    return result;
  }
};
