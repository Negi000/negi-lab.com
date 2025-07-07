/**
 * 音楽生成ツール テストスクリプト
 */

// テスト用の設定（音質確認用）
const testSettings = {
  genre: 'piano',
  mood: 'calm',
  tempo: 'medium',
  duration: 'short',
  complexity: 'moderate',
  instruments: ['piano'],
  volume: 0.7,
  loop: false
};

// 高品質テスト用設定
const qualityTestSettings = [
  {
    name: 'ピアノソロ',
    settings: {
      genre: 'classical',
      mood: 'peaceful',
      tempo: 'slow',
      duration: 'short',
      instruments: ['piano'],
      volume: 0.8
    }
  },
  {
    name: 'ギター＋ストリングス',
    settings: {
      genre: 'cinematic',
      mood: 'dramatic',
      tempo: 'medium',
      duration: 'short',
      instruments: ['guitar', 'strings'],
      volume: 0.7
    }
  },
  {
    name: 'エレクトロニック',
    settings: {
      genre: 'electronic',
      mood: 'energetic',
      tempo: 'fast',
      duration: 'short',
      instruments: ['synthesizer', 'electronic'],
      volume: 0.6
    }
  }
];

// 音響品質分析関数
function analyzeAudioQuality(audioData) {
  let maxAmplitude = 0;
  let rmsSum = 0;
  let dcSum = 0;
  let clippingCount = 0;
  
  for (let i = 0; i < audioData.length; i++) {
    const sample = audioData[i];
    const absSample = Math.abs(sample);
    
    maxAmplitude = Math.max(maxAmplitude, absSample);
    rmsSum += sample * sample;
    dcSum += sample;
    
    if (absSample > 0.98) {
      clippingCount++;
    }
  }
  
  const rms = Math.sqrt(rmsSum / audioData.length);
  const dcOffset = Math.abs(dcSum / audioData.length);
  const dynamicRange = 20 * Math.log10(maxAmplitude / (rms + 0.0001));
  const clippingPercentage = (clippingCount / audioData.length) * 100;
  
  // 品質評価
  let qualityRating = 'Excellent';
  if (clippingPercentage > 0.1) qualityRating = 'Poor';
  else if (dcOffset > 0.01) qualityRating = 'Fair';
  else if (dynamicRange < 6) qualityRating = 'Good';
  
  return {
    peakLevel: maxAmplitude.toFixed(3),
    rmsLevel: rms.toFixed(3),
    dcOffset: dcOffset.toFixed(6),
    dynamicRange: dynamicRange.toFixed(1) + 'dB',
    clipping: clippingPercentage.toFixed(3) + '%',
    quality: qualityRating,
    isClean: clippingPercentage < 0.01 && dcOffset < 0.001
  };
}

// 高品質音楽生成テスト
async function testHighQualityGeneration() {
  console.log('=== 高品質音楽生成テスト開始 ===');
  
  for (const test of qualityTestSettings) {
    console.log(`\n--- ${test.name} テスト ---`);
    
    try {
      const musicData = await window.musicGenerator.generateMusic(test.settings);
      
      if (!musicData || !musicData.audioData || musicData.audioData.length === 0) {
        console.error(`${test.name}: 音楽データが生成されませんでした`);
        continue;
      }
      
      console.log(`${test.name}: 生成成功 (${musicData.audioData.length} samples)`);
      
      // 音質チェック
      const maxAmplitude = Math.max(...musicData.audioData.map(Math.abs));
      const rms = Math.sqrt(musicData.audioData.reduce((sum, x) => sum + x*x, 0) / musicData.audioData.length);
      
      console.log(`${test.name}: Max振幅=${maxAmplitude.toFixed(3)}, RMS=${rms.toFixed(3)}`);
      
      // 自動再生
      console.log(`${test.name}: 再生開始...`);
      await window.musicGenerator.playMusic();
      
      // 5秒待ってから次のテスト
      await new Promise(resolve => setTimeout(resolve, 5000));
      window.musicGenerator.stopMusic();
      
      console.log(`${test.name}: 完了`);
      
    } catch (error) {
      console.error(`${test.name}: エラー`, error);
    }
  }
  
  console.log('\n=== 高品質音楽生成テスト完了 ===');
}
async function testMusicGeneration() {
  console.log('=== 音楽生成テスト開始 ===');
  
  try {
    // 音楽ジェネレーターの確認
    if (!window.musicGenerator) {
      console.error('音楽ジェネレーターが見つかりません');
      return false;
    }
    
    console.log('音楽ジェネレーター確認: OK');
    console.log('Audio Context状態:', window.musicGenerator.audioContext ? 'OK' : 'NG');
    
    // 音楽生成実行
    console.log('音楽生成開始...');
    const musicData = await window.musicGenerator.generateMusic(testSettings);
    
    if (!musicData) {
      console.error('音楽データが生成されませんでした');
      return false;
    }
    
    console.log('音楽データ生成: OK');
    console.log('音声データ長:', musicData.audioData ? musicData.audioData.length : 0);
    console.log('メタデータ:', musicData.metadata);
    
    // 再生テスト
    if (musicData.audioData && musicData.audioData.length > 0) {
      console.log('再生テスト開始...');
      const playResult = await window.musicGenerator.playMusic();
      console.log('再生結果:', playResult ? 'OK' : 'NG');
      
      // 3秒後に停止
      setTimeout(() => {
        window.musicGenerator.stopMusic();
        console.log('再生停止');
      }, 3000);
    }
    
    console.log('=== 音楽生成テスト完了 ===');
    return true;
    
  } catch (error) {
    console.error('音楽生成テストでエラー:', error);
    return false;
  }
}

// ページ読み込み完了後の自動テストは無効化
// 手動でテストしたい場合は window.testMusicGeneration() を実行
document.addEventListener('DOMContentLoaded', () => {
  console.log('音楽生成テストスクリプト読み込み完了 - 手動テスト用: window.testMusicGeneration()');
  // 自動テストは無効化
  // setTimeout(() => {
  //   testMusicGeneration();
  // }, 2000);
});

// グローバルからもテスト実行可能
window.testMusicGeneration = testMusicGeneration;

// 楽器別高品質テスト
async function testInstrumentQuality(instrument = 'piano') {
  console.log(`=== ${instrument.toUpperCase()} 高品質テスト開始 ===`);
  
  const instrumentSettings = {
    piano: { genre: 'classical', mood: 'calm', instruments: ['piano'] },
    guitar: { genre: 'pop', mood: 'uplifting', instruments: ['guitar'] },
    strings: { genre: 'cinematic', mood: 'dramatic', instruments: ['strings'] },
    synthesizer: { genre: 'electronic', mood: 'energetic', instruments: ['synthesizer'] },
    bass: { genre: 'jazz', mood: 'smooth', instruments: ['bass'] }
  };
  
  const settings = {
    ...instrumentSettings[instrument] || instrumentSettings.piano,
    tempo: 'medium',
    duration: 'short',
    complexity: 'moderate',
    volume: 0.8,
    loop: false
  };
  
  try {
    console.log(`${instrument} 音楽生成開始...`, settings);
    const musicData = await window.musicGenerator.generateMusic(settings);
    
    if (!musicData || !musicData.audioData || musicData.audioData.length === 0) {
      console.error(`${instrument}: 音楽データが生成されませんでした`);
      return false;
    }
    
    console.log(`${instrument}: 生成成功 (${musicData.audioData.length} samples)`);
    
    // 音響品質分析
    const qualityAnalysis = analyzeAudioQuality(musicData.audioData);
    console.log(`${instrument} 音響品質:`, qualityAnalysis);
    
    // 品質の評価結果を表示
    if (qualityAnalysis.isClean) {
      console.log(`✅ ${instrument}: 高品質音響 - ノイズフリー、クリッピングなし`);
    } else {
      console.warn(`⚠️ ${instrument}: 音響品質に問題あり`);
    }
    
    // 再生テスト
    console.log(`${instrument} 再生テスト開始...`);
    const playResult = await window.musicGenerator.playMusic();
    console.log(`${instrument} 再生結果:`, playResult ? 'OK' : 'NG');
    
    // 3秒後に停止
    setTimeout(() => {
      window.musicGenerator.stopMusic();
      console.log(`${instrument} 再生停止`);
    }, 3000);
    
    console.log(`=== ${instrument} テスト完了 ===\n`);
    return true;
    
  } catch (error) {
    console.error(`${instrument} テストでエラー:`, error);
    return false;
  }
}

// 全楽器品質テスト
async function testAllInstrumentQuality() {
  console.log('=== 全楽器高品質テスト開始 ===');
  
  const instruments = ['piano', 'guitar', 'strings', 'synthesizer', 'bass'];
  const results = {};
  
  for (const instrument of instruments) {
    results[instrument] = await testInstrumentQuality(instrument);
    
    // 次のテストまで少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== 全楽器テスト結果 ===');
  for (const [instrument, success] of Object.entries(results)) {
    console.log(`${instrument}: ${success ? '✅ 成功' : '❌ 失敗'}`);
  }
  
  console.log('=== 全楽器テスト完了 ===');
  return results;
}

// グローバル関数として追加
window.testInstrumentQuality = testInstrumentQuality;
window.testAllInstrumentQuality = testAllInstrumentQuality;
window.analyzeAudioQuality = analyzeAudioQuality;
