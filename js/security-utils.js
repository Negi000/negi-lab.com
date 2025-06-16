/**
 * セキュリティユーティリティ関数
 * XSS対策、入力検証、サニタイズ機能を提供
 */

// CSP Nonce生成
window.SecurityUtils = {
  // XSS対策 - HTMLエスケープ
  escapeHtml: function(unsafe) {
    if (typeof unsafe !== 'string') return String(unsafe);
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // 入力値のサニタイズ
  sanitizeInput: function(input, maxLength = 1000) {
    if (!input || typeof input !== 'string') return '';
    
    // 長さ制限
    if (input.length > maxLength) {
      console.warn(`入力が最大長 ${maxLength} を超過しました`);
      input = input.substring(0, maxLength);
    }
    
    // 危険なスクリプトタグ、イベントハンドラを除去
    input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    input = input.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
    input = input.replace(/on\w+\s*=\s*'[^']*'/gi, '');
    input = input.replace(/javascript:/gi, '');
    
    return input.trim();
  },

  // ファイルタイプ検証
  validateFileType: function(file, allowedTypes = []) {
    if (!file || !file.type) {
      console.error('無効なファイルです');
      return false;
    }

    // MIMEタイプチェック
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      console.error(`許可されていないファイルタイプ: ${file.type}`);
      return false;
    }

    // ファイル拡張子もチェック
    const validExtensions = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf']
    };

    if (validExtensions[file.type]) {
      const fileName = file.name.toLowerCase();
      const isValidExt = validExtensions[file.type].some(ext => fileName.endsWith(ext));
      if (!isValidExt) {
        console.error(`ファイル拡張子がMIMEタイプと一致しません: ${file.name}`);
        return false;
      }
    }

    return true;
  },

  // ファイルサイズ検証
  validateFileSize: function(file, maxSizeMB = 10) {
    if (!file) {
      console.error('ファイルが選択されていません');
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      console.error(`ファイルサイズが制限を超過: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${maxSizeMB}MB`);
      return false;
    }

    return true;
  },

  // URL検証
  validateUrl: function(url) {
    try {
      const urlObj = new URL(url);
      // HTTPSまたはHTTPのみ許可
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.error(`許可されていないプロトコル: ${urlObj.protocol}`);
        return false;
      }
      return true;
    } catch (e) {
      console.error(`無効なURL: ${url}`);
      return false;
    }
  },

  // エラーハンドリング改善
  showUserError: function(message, details = null) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 max-w-md';
    errorDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <strong class="font-bold">エラー: </strong>
          <span class="block sm:inline">${this.escapeHtml(message)}</span>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-500 hover:text-red-700">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 開発者向けログ
    if (details) {
      console.error('Error details:', details);
    }
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  },

  // 成功メッセージ表示
  showSuccessMessage: function(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 max-w-md';
    successDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <strong class="font-bold">成功: </strong>
          <span class="block sm:inline">${this.escapeHtml(message)}</span>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-green-500 hover:text-green-700">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // 3秒後に自動削除
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 3000);
  }
};

// CSP Nonce管理
window.SecurityUtils.CSP = {
  generateNonce: function() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
  },

  // インラインスクリプト実行（CSP対応）
  executeInlineScript: function(scriptContent, nonce = null) {
    const script = document.createElement('script');
    if (nonce) {
      script.nonce = nonce;
    }
    script.textContent = scriptContent;
    document.head.appendChild(script);
    document.head.removeChild(script);
  }
};
