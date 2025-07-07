/**
 * 音楽生成デバッグスクリプト
 * 単音問題の調査用
 */

window.debugMusicGeneration = async function() {
  console.log('🔍 音楽生成デバッグ開始...');
  
  if (!window.musicGenerator) {
    console.error('❌ MusicGenerator が見つかりません');
    return;
  }
  
  // 初期化待機
  await window.musicGenerator.waitForInitialization();
  
  const testSettings = {
    genre: 'classical',
    mood: 'dramatic',
    tempo: 'medium',
    duration: 'short',
    instruments: ['piano', 'strings'],
    complexity: 'moderate',
    volume: 0.8,
    loop: false
  };
  
  console.log('🎵 テスト設定:', testSettings);
  
  try {
    const result = await window.musicGenerator.generateMusic(testSettings);
    
    if (!result) {
      console.error('❌ 音楽生成が失敗しました');
      return;
    }
    
    console.log('🎼 生成結果詳細:');
    console.log('- オーディオデータ長:', result.audioData.length);
    console.log('- メロディ音符数:', result.melody.notes.length);
    console.log('- ハーモニーコード数:', result.harmony.chords.length);
    console.log('- メロディ楽器:', result.melody.instrument);
    console.log('- ハーモニー楽器:', result.harmony.instrument);
    
    // スケジュールされた音符の詳細確認
    if (window.musicGenerator.scheduledNotes) {
      const melodyNotes = window.musicGenerator.scheduledNotes.filter(n => n.type === 'melody');
      const harmonyNotes = window.musicGenerator.scheduledNotes.filter(n => n.type === 'harmony');
      
      console.log('📅 スケジュール済み音符:');
      console.log(`- メロディ: ${melodyNotes.length} 音符`);
      console.log(`- ハーモニー: ${harmonyNotes.length} 音符`);
      
      // 最初の5つのハーモニー音符をログ出力
      console.log('🎺 ハーモニー音符詳細 (最初の5つ):');
      harmonyNotes.slice(0, 5).forEach((note, i) => {
        console.log(`  ${i+1}. ${note.chordInfo} - ${note.frequency.toFixed(2)}Hz, vel: ${note.velocity.toFixed(3)}, start: ${note.startTime.toFixed(2)}s`);
      });
      
      // ボリューム分析
      console.log('🔊 ボリューム分析:');
      if (melodyNotes.length > 0) {
        console.log(`- メロディ平均ベロシティ: ${(melodyNotes.reduce((sum, n) => sum + n.velocity, 0) / melodyNotes.length).toFixed(3)}`);
      }
      if (harmonyNotes.length > 0) {
        console.log(`- ハーモニー平均ベロシティ: ${(harmonyNotes.reduce((sum, n) => sum + n.velocity, 0) / harmonyNotes.length).toFixed(3)}`);
      }
    }
    
    // オーディオデータ分析
    console.log('🔍 オーディオデータ分析:');
    let maxAmplitude = 0;
    let rmsSum = 0;
    
    for (let i = 0; i < result.audioData.length; i++) {
      const abs = Math.abs(result.audioData[i]);
      if (abs > maxAmplitude) {
        maxAmplitude = abs;
      }
      rmsSum += result.audioData[i] * result.audioData[i];
    }
    
    const rmsAmplitude = Math.sqrt(rmsSum / result.audioData.length);
    console.log(`- 最大振幅: ${maxAmplitude.toFixed(4)}`);
    console.log(`- RMS振幅: ${rmsAmplitude.toFixed(4)}`);
    
    // 時間分布分析
    const sampleRate = window.musicGenerator.audioContext.sampleRate;
    const firstSecondSamples = result.audioData.slice(0, sampleRate);
    let firstSecondMax = 0;
    for (let i = 0; i < firstSecondSamples.length; i++) {
      const abs = Math.abs(firstSecondSamples[i]);
      if (abs > firstSecondMax) {
        firstSecondMax = abs;
      }
    }
    console.log(`- 最初の1秒の最大振幅: ${firstSecondMax.toFixed(4)}`);
    
    // 無音チェック
    const nonZeroSamples = result.audioData.filter(sample => Math.abs(sample) > 0.001).length;
    console.log(`- 無音でないサンプル数: ${nonZeroSamples} / ${result.audioData.length} (${(nonZeroSamples/result.audioData.length*100).toFixed(1)}%)`);
    
    console.log('✅ デバッグ完了');
    return result;
    
  } catch (error) {
    console.error('❌ デバッグ中にエラー:', error);
  }
};

// 簡単なテスト関数
window.quickMusicTest = function() {
  console.log('🎵 簡単な音楽テスト開始...');
  
  if (window.musicGeneratorUI && window.musicGeneratorUI.generateMusic) {
    window.musicGeneratorUI.generateMusic();
  } else {
    console.error('❌ UI が見つかりません');
  }
};

// 音質分析関数
window.analyzeCurrentMusic = function() {
  console.log('🔍 現在の音楽を分析中...');
  
  if (!window.musicGenerator || !window.musicGenerator.currentMusic) {
    console.error('❌ 生成された音楽が見つかりません');
    return;
  }
  
  const music = window.musicGenerator.currentMusic;
  const audioData = music.audioData;
  
  console.log('📊 音楽分析結果:');
  console.log('- サンプル数:', audioData.length);
  console.log('- 再生時間:', (audioData.length / 48000).toFixed(2) + '秒');
  
  // 振幅分析
  let maxAmp = 0;
  let minAmp = 0;
  let rmsSum = 0;
  let nonZeroCount = 0;
  
  for (let i = 0; i < audioData.length; i++) {
    const sample = audioData[i];
    if (Math.abs(sample) > 0.001) nonZeroCount++;
    if (sample > maxAmp) maxAmp = sample;
    if (sample < minAmp) minAmp = sample;
    rmsSum += sample * sample;
  }
  
  const rms = Math.sqrt(rmsSum / audioData.length);
  const dynamicRange = maxAmp - minAmp;
  
  console.log('🔊 音量分析:');
  console.log('- 最大振幅:', maxAmp.toFixed(4));
  console.log('- 最小振幅:', minAmp.toFixed(4));
  console.log('- RMS:', rms.toFixed(4));
  console.log('- ダイナミックレンジ:', dynamicRange.toFixed(4));
  console.log('- 非無音サンプル率:', (nonZeroCount/audioData.length*100).toFixed(1) + '%');
  
  // 周波数成分の簡易分析（最初の1秒分）
  const sampleRate = 48000;
  const analysisLength = Math.min(sampleRate, audioData.length);
  
  console.log('🎼 構成要素:');
  console.log('- メロディ音符数:', music.melody?.notes?.length || 0);
  console.log('- ハーモニーコード数:', music.harmony?.chords?.length || 0);
  console.log('- スケジュール音符数:', window.musicGenerator.scheduledNotes?.length || 0);
  
  if (window.musicGenerator.scheduledNotes) {
    const melodyNotes = window.musicGenerator.scheduledNotes.filter(n => n.type === 'melody');
    const harmonyNotes = window.musicGenerator.scheduledNotes.filter(n => n.type === 'harmony');
    
    console.log('- メロディ音符:', melodyNotes.length);
    console.log('- ハーモニー音符:', harmonyNotes.length);
    
    if (harmonyNotes.length > 0) {
      const avgHarmonyVel = harmonyNotes.reduce((sum, n) => sum + n.velocity, 0) / harmonyNotes.length;
      console.log('- ハーモニー平均ベロシティ:', avgHarmonyVel.toFixed(3));
    }
  }
  
  // 音質の問題を診断
  console.log('🩺 音質診断:');
  if (rms < 0.01) {
    console.warn('⚠️ 音量が非常に小さいです');
  }
  if (nonZeroCount / audioData.length < 0.1) {
    console.warn('⚠️ 無音部分が多すぎます');
  }
  if (dynamicRange < 0.1) {
    console.warn('⚠️ ダイナミックレンジが狭すぎます');
  }
};

console.log('🔧 デバッグスクリプト読み込み完了');
console.log('- window.debugMusicGeneration() : 詳細デバッグ');
console.log('- window.quickMusicTest() : 簡単テスト');
console.log('- window.analyzeCurrentMusic() : 現在の音楽分析');
console.log('- window.testMusicDiversity() : 音楽多様性テスト');

// 音楽多様性テスト関数
window.testMusicDiversity = async function() {
  console.log('🎯 音楽多様性テスト開始...');
  
  if (!window.musicGenerator) {
    console.error('❌ MusicGenerator が見つかりません');
    return;
  }
  
  await window.musicGenerator.waitForInitialization();
  
  const testSettings = {
    genre: 'ambient',
    mood: 'calm',
    tempo: 'slow',
    duration: 'short',
    instruments: ['piano', 'strings'],
    complexity: 'moderate',
    volume: 0.8,
    loop: false
  };
  
  console.log('🔄 同じ設定で5回生成してバリエーションをチェック...');
  
  const results = [];
  
  for (let i = 0; i < 5; i++) {
    console.log(`\n🎵 テスト ${i + 1}/5:`);
    
    const result = await window.musicGenerator.generateMusic(testSettings);
    
    if (result) {
      const analysis = {
        test: i + 1,
        melodyInstrument: result.melody.instrument,
        harmonyInstrument: result.harmony.instrument,
        progression: result.harmony.progression,
        key: result.params.key,
        tempo: result.params.adjustedTempo || result.params.tempo,
        firstNote: result.melody.notes[0]?.note + result.melody.notes[0]?.octave,
        noteCount: result.melody.notes.length,
        chordCount: result.harmony.chords.length,
        settingsHash: result.metadata.settingsHash
      };
      
      results.push(analysis);
      
      console.log(`- 楽器: ${analysis.melodyInstrument}/${analysis.harmonyInstrument}`);
      console.log(`- 進行: ${analysis.progression.join('-')}`);
      console.log(`- キー: ${analysis.key}, テンポ: ${analysis.tempo}`);
      console.log(`- 最初の音符: ${analysis.firstNote}`);
      console.log(`- ハッシュ: ${analysis.settingsHash}`);
    }
  }
  
  // 多様性分析
  console.log('\n📊 多様性分析結果:');
  
  const uniqueInstruments = new Set(results.map(r => r.melodyInstrument + '/' + r.harmonyInstrument));
  const uniqueProgressions = new Set(results.map(r => r.progression.join('-')));
  const uniqueKeys = new Set(results.map(r => r.key));
  const uniqueTempos = new Set(results.map(r => r.tempo));
  const uniqueFirstNotes = new Set(results.map(r => r.firstNote));
  const uniqueHashes = new Set(results.map(r => r.settingsHash));
  
  console.log(`- 楽器組み合わせ: ${uniqueInstruments.size}/5 種類`);
  console.log(`- コード進行: ${uniqueProgressions.size}/5 種類`);
  console.log(`- キー: ${uniqueKeys.size}/5 種類`);
  console.log(`- テンポ: ${uniqueTempos.size}/5 種類`);
  console.log(`- 最初の音符: ${uniqueFirstNotes.size}/5 種類`);
  console.log(`- ハッシュ: ${uniqueHashes.size}/5 種類`);
  
  // 改善提案
  const totalVariety = uniqueInstruments.size + uniqueProgressions.size + uniqueKeys.size + uniqueTempos.size + uniqueFirstNotes.size;
  const maxVariety = 25; // 5項目 × 5テスト
  const varietyScore = (totalVariety / maxVariety * 100).toFixed(1);
  
  console.log(`\n🎯 多様性スコア: ${varietyScore}%`);
  
  if (varietyScore < 60) {
    console.warn('⚠️ 多様性が低いです。アルゴリズムの改善が必要です。');
  } else if (varietyScore < 80) {
    console.log('✅ 適度な多様性があります。');
  } else {
    console.log('🎉 高い多様性を実現しています！');
  }
  
  return results;
};
