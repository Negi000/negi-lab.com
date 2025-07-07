/**
 * 音楽生成ツールのデバッグテスト
 */

console.log('=== デバッグテスト開始 ===');

// 1. 必要なクラスが読み込まれているか確認
console.log('AdvancedAudioEngine class:', typeof AdvancedAudioEngine);
console.log('MusicGenerator class:', typeof MusicGenerator);

// 2. 基本的なAudioContextが動作するか確認
try {
  const testAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  console.log('AudioContext created successfully');
  console.log('Sample rate:', testAudioContext.sampleRate);
  console.log('State:', testAudioContext.state);
} catch (error) {
  console.error('AudioContext creation failed:', error);
}

// 3. AdvancedAudioEngineが初期化できるか確認
try {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const engine = new AdvancedAudioEngine(audioCtx);
  console.log('AdvancedAudioEngine created successfully');
} catch (error) {
  console.error('AdvancedAudioEngine creation failed:', error);
}

// 4. MusicGeneratorが初期化できるか確認
try {
  const generator = new MusicGenerator();
  console.log('MusicGenerator created successfully');
  
  // 初期化が完了するまで少し待つ
  setTimeout(async () => {
    try {
      // ヘルパー関数のテスト
      console.log('getTempoValue(medium):', generator.getTempoValue('medium'));
      console.log('getDurationValue(short):', generator.getDurationValue('short'));
      
      // 簡単な音楽生成テスト
      console.log('Testing music generation...');
      const testSettings = {
        genre: 'piano',
        mood: 'calm',
        tempo: 'medium',
        duration: 'short',
        instruments: ['piano'],
        volume: 0.5
      };
      
      const result = await generator.generateMusic(testSettings);
      console.log('Music generation test result:', !!result);
      
    } catch (error) {
      console.error('Function test failed:', error);
    }
  }, 2000);
  
} catch (error) {
  console.error('MusicGenerator creation failed:', error);
  console.error('Error details:', error.message);
  console.error('Stack trace:', error.stack);
}

console.log('=== デバッグテスト完了 ===');
