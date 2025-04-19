<template>
  <div>
    <h1>特定ワードの出現回数カウンター (無音検出で停止、終了後にカウント)</h1>
    <p>
      <button @click="startRecognition" :disabled="isListening">
        {{ isListening ? '認識中...' : '認識開始' }}
      </button>
      <button @click="forceStopRecognition" :disabled="!isListening">
        強制停止
      </button>
    </p>
    <div>
      <h2>認識されたテキスト:</h2>
      <textarea v-model="transcriptDisplay" rows="5" cols="50" readonly></textarea>
    </div>
    <div>
      <h2>カウント結果:</h2>
      <ul>
        <li v-for="(count, word) in wordCounts" :key="word">
          <b>{{ word }}:</b> {{ count }} 回
        </li>
      </ul>
    </div>
    <p v-if="error" style="color: red;">エラー: {{ error }}</p>
  </div>
  <div><coment/></div>
  
</template>

<script setup lang="ts">

const targetWords = ref<string[]>(['ころす', '殺す', 'オリックス', 'さようなら']);
const wordCounts = ref<{ [key: string]: number }>({});
const transcript = ref('');
const transcriptDisplay = ref('');
const isListening = ref(false);
const error = ref<string | null>(null);
let recognition: SpeechRecognition | null = null;
let silenceTimeoutId: NodeJS.Timeout | null = null;
const silenceTimeoutDuration = 2000; // 無音と判定する時間 (ミリ秒)

onMounted(() => {
  targetWords.value.forEach(word => {
    wordCounts.value[word] = 0;
  });

  if ('webkitSpeechRecognition' in window) {
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';

    recognition.onstart = () => {
      isListening.value = true;
      error.value = null;
      transcriptDisplay.value = '';
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      transcript.value = currentTranscript;
      transcriptDisplay.value = currentTranscript;
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      isListening.value = false;
      error.value = `音声認識エラー: ${event.error}`;
      console.error('Speech recognition error:', event);
      clearSilenceTimer();
      processTranscript(); // エラー発生時もカウント処理を行う（必要に応じて）
    };

    recognition.onend = () => {
      isListening.value = false;
      console.log('Speech recognition ended.');
      clearSilenceTimer();
      processTranscript(); // 録音終了後にカウント処理を実行
    };
  } else {
    error.value = 'このブラウザは Web Speech API をサポートしていません。';
  }
});

const processTranscript = () => {
  if (transcript.value) {
    const lowerCaseTranscript = transcript.value.toLowerCase();
    targetWords.value.forEach(word => {
      const lowerCaseWord = word.toLowerCase();
      const regex = new RegExp(lowerCaseWord, 'gi');
      const matches = lowerCaseTranscript.match(regex);
      if (matches) {
        wordCounts.value[word] = (wordCounts.value[word] || 0) + matches.length;
      }
    });
  }
};

const resetSilenceTimer = () => {
  clearSilenceTimer();
  silenceTimeoutId = setTimeout(() => {
    if (isListening.value && recognition) {
      recognition.stop();
    }
  }, silenceTimeoutDuration);
};

const clearSilenceTimer = () => {
  if (silenceTimeoutId) {
    clearTimeout(silenceTimeoutId);
    silenceTimeoutId = null;
  }
};

const startRecognition = () => {
  if (recognition && !isListening.value) {
    transcript.value = '';
    transcriptDisplay.value = '';
    // カウントをリセットする場合
    Object.keys(wordCounts.value).forEach(key => {
      wordCounts.value[key] = 0;
    });
    recognition.start();
  }
};

const forceStopRecognition = () => {
  if (recognition && isListening.value) {
    recognition.stop();
  }
};
</script>

<style scoped>
div {
  font-family: sans-serif;
  padding: 20px;
  height: 1000%;
}

h1 {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
}

textarea {
  margin-top: 10px;
  font-size: 16px;
}

p {
  margin-top: 10px;
}
</style>