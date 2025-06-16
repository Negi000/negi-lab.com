const fs = require('fs');
const path = require('path');

/**
 * サイト一貫性管理クラス
 * テンプレートと設定ファイルを使用してサイト全体の一貫性を保つ
 */
class SiteConsistencyManager {
    constructor(configPath = './config/site-config.json') {
        this.configPath = configPath;
        this.config = this.loadConfig();
        this.templatePath = './templates/tool-template.html';
        this.template = this.loadTemplate();
    }

    loadConfig() {
        try {
            return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        } catch (error) {
            console.error('設定ファイルの読み込みに失敗しました:', error.message);
            process.exit(1);
        }
    }

    loadTemplate() {
        try {
            return fs.readFileSync(this.templatePath, 'utf8');
        } catch (error) {
            console.error('テンプレートファイルの読み込みに失敗しました:', error.message);
            process.exit(1);
        }
    }

    /**
     * 新しいツールHTMLファイルを生成
     */
    generateTool(toolConfig) {
        console.log(`🔧 ${toolConfig.name}を生成中...`);
        
        let html = this.template;
        
        // 基本的なプレースホルダーを置換
        html = this.replacePlaceholders(html, {
            '{{TOOL_NAME}}': toolConfig.name,
            '{{TOOL_KEY}}': toolConfig.key,
            '{{TOOL_DESCRIPTION}}': toolConfig.description,
            '{{TOOL_CONTENT}}': toolConfig.content || '<div class="text-center text-gray-500">ツール内容をここに追加してください</div>',
            '{{TOOL_EXTERNAL_SCRIPTS}}': toolConfig.externalScripts || '',
            '{{TOOL_CUSTOM_STYLES}}': toolConfig.customStyles || '',
            '{{TOOL_SCRIPTS}}': toolConfig.scripts || '',
            '{{GUIDE_DATA}}': JSON.stringify(toolConfig.guideData || this.getDefaultGuideData(toolConfig.name))
        });
        
        // 設定ファイルからの値を適用
        html = this.applyConfig(html);
        
        // ファイルに書き出し
        const outputPath = `./tools/${toolConfig.key}.html`;
        fs.writeFileSync(outputPath, html, 'utf8');
        
        console.log(`✅ ${toolConfig.name}が生成されました: ${outputPath}`);
        return outputPath;
    }

    /**
     * 既存のツールファイルを設定に基づいて更新
     */
    updateAllTools() {
        console.log('🔄 全ツールファイルを更新中...');
        
        const toolsDir = './tools';
        const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
        
        files.forEach(file => {
            console.log(`📝 ${file}を更新中...`);
            this.updateToolFile(path.join(toolsDir, file));
        });
        
        console.log('✅ 全ツールファイルの更新が完了しました');
    }

    /**
     * 単一ツールファイルの更新
     */
    updateToolFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 各セクションを更新
            content = this.updateSecurityHeaders(content);
            content = this.updateFooter(content);
            content = this.updatePolicySection(content);
            content = this.updateStyles(content);
            content = this.updateColors(content);
            
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            console.error(`ファイル更新エラー ${filePath}:`, error.message);
        }
    }

    /**
     * プレースホルダーを置換
     */
    replacePlaceholders(content, replacements) {
        let result = content;
        Object.entries(replacements).forEach(([placeholder, value]) => {
            result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
        });
        return result;
    }

    /**
     * 設定ファイルの値を適用
     */
    applyConfig(html) {
        // セキュリティ設定
        html = html.replace('{{CSP_CONTENT}}', this.config.security.csp);
        
        // サイト情報
        html = html.replace(/{{SITE_NAME}}/g, this.config.site.name);
        html = html.replace(/{{SITE_YEAR}}/g, this.config.site.year);
        
        // カラーテーマ
        html = html.replace('{{NEGI_COLOR}}', this.config.theme.colors.negi);
        html = html.replace('{{ACCENT_COLOR}}', this.config.theme.colors.accent);
        
        // スタイル
        html = html.replace('{{FORM_INPUT_STYLE}}', this.config.styles.form_input);
        html = html.replace('{{FORM_INPUT_FOCUS_STYLE}}', this.config.styles.form_input_focus);
        html = html.replace('{{FORM_BUTTON_STYLE}}', this.config.styles.form_button);
        html = html.replace('{{FORM_BUTTON_HOVER_STYLE}}', this.config.styles.form_button_hover);
        html = html.replace('{{FORM_BUTTON_DISABLED_STYLE}}', this.config.styles.form_button_disabled);
        html = html.replace('{{DROP_AREA_STYLE}}', this.config.styles.drop_area);
        html = html.replace('{{DROP_AREA_DRAGOVER_STYLE}}', this.config.styles.drop_area_dragover);
        html = html.replace('{{PREVIEW_IMAGE_STYLE}}', this.config.styles.preview_image);
        
        // 共通セクション
        html = html.replace('{{UNIQUENESS_TEXT}}', this.config.common_sections.uniqueness);
        html = html.replace('{{POLICY_TEXT}}', this.config.common_sections.policy);
        html = html.replace('{{DISCLAIMER_TEXT}}', this.config.common_sections.disclaimer);
        
        // フッターリンク
        const footerLinks = this.config.footer_links
            .map(link => `<a href="${link.url}" class="underline hover:text-accent mx-2">${link.text}</a>`)
            .join('\n      ');
        html = html.replace('{{FOOTER_LINKS}}', footerLinks);
        
        // Analytics
        const analyticsScript = `
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.site.adsense_client}" crossorigin="anonymous"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.site.analytics_id}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${this.config.site.analytics_id}');
  </script>`;
        html = html.replace('{{ANALYTICS_SCRIPT}}', analyticsScript);
        
        return html;
    }

    /**
     * デフォルトガイドデータを生成
     */
    getDefaultGuideData(toolName) {
        return {
            ja: {
                title: `${toolName}の使い方`,
                list: [
                    'ファイルまたはテキストを入力',
                    '必要に応じて設定を調整',
                    '実行ボタンをクリック',
                    '結果をダウンロードまたはコピー',
                    '右上メニューで日本語・英語切替可能'
                ],
                tipsTitle: '活用例・ヒント',
                tips: [
                    '効率的な作業のために',
                    'ブックマークして頻繁に使用'
                ]
            },
            en: {
                title: `How to Use ${toolName}`,
                list: [
                    'Input file or text',
                    'Adjust settings as needed',
                    'Click the execute button',
                    'Download or copy the result',
                    'Switch language from the top menu'
                ],
                tipsTitle: 'Tips & Examples',
                tips: [
                    'For efficient work',
                    'Bookmark for frequent use'
                ]
            }
        };
    }

    /**
     * セキュリティヘッダーを更新
     */
    updateSecurityHeaders(content) {
        const cspRegex = /<meta http-equiv="Content-Security-Policy" content="[^"]*" \/>/;
        const newCSP = `<meta http-equiv="Content-Security-Policy" content="${this.config.security.csp}" />`;
        
        if (cspRegex.test(content)) {
            content = content.replace(cspRegex, newCSP);
        }
        
        return content;
    }

    /**
     * フッターを更新
     */
    updateFooter(content) {
        const footerRegex = /<footer class="bg-gray-800[^>]*">[\s\S]*?<\/footer>/;
        const footerLinks = this.config.footer_links
            .map(link => `<a href="${link.url}" class="underline hover:text-accent mx-2">${link.text}</a>`)
            .join('\n      ');
        
        const newFooter = `<footer class="bg-gray-800 text-gray-300 py-8 text-center text-sm">
    <nav class="mb-2">
      ${footerLinks}
    </nav>
    <div>&copy; ${this.config.site.year} ${this.config.site.name}</div>
  </footer>`;
        
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, newFooter);
        }
        
        return content;
    }

    /**
     * 独自性・運営方針・免責事項セクションを更新
     */
    updatePolicySection(content) {
        const sectionRegex = /<section[^>]*aria-label="このツールについて"[^>]*>[\s\S]*?<\/section>/;
        
        const newSection = `<section class="mt-12 mb-8 text-sm text-gray-700 bg-white rounded-lg p-4 border border-gray-200 max-w-xl mx-auto" aria-label="このツールについて">
    <h2 class="font-bold text-base mb-2">negi-lab.comの独自性・運営方針・免責事項</h2>
    <ul class="list-disc ml-5 mb-2">
      <li>${this.config.common_sections.uniqueness}</li>
      <li>${this.config.common_sections.policy}</li>
      <li>${this.config.common_sections.disclaimer}</li>
    </ul>
    <p class="text-xs text-gray-500">&copy; ${this.config.site.year} ${this.config.site.name}</p>
  </section>`;
        
        if (sectionRegex.test(content)) {
            content = content.replace(sectionRegex, newSection);
        }
        
        return content;
    }

    /**
     * スタイルを更新
     */
    updateStyles(content) {
        // Tailwind設定内の色を更新
        const colorRegex = /negi:\s*"[^"]*"/g;
        content = content.replace(colorRegex, `negi: "${this.config.theme.colors.negi}"`);
        
        const accentRegex = /accent:\s*"[^"]*"/g;
        content = content.replace(accentRegex, `accent: "${this.config.theme.colors.accent}"`);
        
        return content;
    }

    /**
     * カラーテーマを更新
     */
    updateColors(content) {
        // サイト名のクラスを更新
        content = content.replace(/text-accent/g, 'text-accent');
        content = content.replace(/hover:text-accent/g, 'hover:text-accent');
        content = content.replace(/bg-accent/g, 'bg-accent');
        content = content.replace(/hover:bg-accent/g, 'hover:bg-accent');
        
        return content;
    }

    /**
     * 一貫性チェックを実行
     */
    checkConsistency() {
        console.log('🔍 サイト一貫性チェック中...');
        
        const issues = [];
        const toolsDir = './tools';
        const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));
        
        files.forEach(file => {
            const filePath = path.join(toolsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // セキュリティヘッダーのチェック
            if (!content.includes('Content-Security-Policy')) {
                issues.push(`${file}: CSPヘッダーが見つかりません`);
            }
            
            // フッターのチェック
            if (!content.includes('&copy; ' + this.config.site.year)) {
                issues.push(`${file}: フッターのコピーライト年が一致しません`);
            }
            
            // 共通セクションのチェック
            if (!content.includes('negi-lab.comの独自性・運営方針・免責事項')) {
                issues.push(`${file}: 独自性・運営方針・免責事項セクションが見つかりません`);
            }
            
            // Tailwind設定のチェック
            if (!content.includes('tailwind.config')) {
                issues.push(`${file}: Tailwind設定が見つかりません`);
            }
        });
        
        if (issues.length === 0) {
            console.log('✅ 一貫性チェック完了: 問題は見つかりませんでした');
        } else {
            console.log('⚠️  一貫性の問題が見つかりました:');
            issues.forEach(issue => console.log(`  - ${issue}`));
        }
        
        return issues;
    }

    /**
     * 設定ファイルを更新
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
        console.log('✅ 設定ファイルが更新されました');
    }
}

module.exports = SiteConsistencyManager;

// CLIとして実行された場合
if (require.main === module) {
    const manager = new SiteConsistencyManager();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'update':
            manager.updateAllTools();
            break;
        case 'check':
            manager.checkConsistency();
            break;
        case 'generate':
            const toolConfig = {
                name: process.argv[3] || 'New Tool',
                key: process.argv[4] || 'new-tool',
                description: process.argv[5] || 'New tool description'
            };
            manager.generateTool(toolConfig);
            break;
        default:
            console.log('使用方法:');
            console.log('  node scripts/site-manager.js update   - 全ツールを更新');
            console.log('  node scripts/site-manager.js check    - 一貫性チェック');
            console.log('  node scripts/site-manager.js generate <name> <key> <description> - 新ツール生成');
    }
}
