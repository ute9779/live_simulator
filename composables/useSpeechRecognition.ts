export function useCountSpeechRecognition(targetWords: string[], silenceTimeoutDuration: number = 2000) {
  const wordCounts = ref<{ [key: string]: number }>({});
  const transcript = ref('');
  const isListening = ref(false);
  const error = ref<string | null>(null);
  let recognition: any | null = null;
  let silenceTimeoutId: any | null = null;

  const processTranscript = () => {
    if (transcript.value) {
      const lowerCaseTranscript = transcript.value.toLowerCase();
      targetWords.forEach(word => {
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
      // カウントをリセットする場合
      Object.keys(wordCounts.value).forEach(key => {
        wordCounts.value[key] = 0;
      });
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition && isListening.value) {
      recognition.stop();
    }
  };

  onMounted(() => {
    targetWords.forEach(word => {
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
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        transcript.value = currentTranscript;
        resetSilenceTimer();
      };

      recognition.onerror = (event: any) => {
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

  onUnmounted(() => {
    if (recognition) {
      recognition.stop();
      clearSilenceTimer();
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition = null;
    }
  });

  return {
    wordCounts,
    transcript,
    isListening,
    error,
    startRecognition,
    stopRecognition,
  };
}

export function useSpeechRecognition(silenceTimeoutDuration: number = 2000) {
  const transcript = ref('');
  const isListening = ref(false);
  const isFinished = ref(false); // 認識が完全に終了したかどうかのフラグ
  const finalTranscript = ref(''); // 最終的な認識結果
  const error = ref<string | null>(null);
  let recognition: any | null = null;
  let silenceTimeoutId: any | null = null;

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
      finalTranscript.value = '';
      isFinished.value = false;
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition && isListening.value) {
      recognition.stop();
    }
  };

  onMounted(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false; // 中間結果は取得しない
      recognition.lang = 'ja-JP';

      recognition.onstart = () => {
        isListening.value = true;
        isFinished.value = false;
        error.value = null;
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        transcript.value = currentTranscript; // 必要に応じて、認識中のテキストを保持
        resetSilenceTimer();
      };

      recognition.onerror = (event: any) => {
        isListening.value = false;
        isFinished.value = true;
        error.value = `音声認識エラー: ${event.error}`;
        console.error('Speech recognition error:', event);
        clearSilenceTimer();
      };

      recognition.onend = () => {
        isListening.value = false;
        isFinished.value = true;
        finalTranscript.value = transcript.value; // 認識完了時に最終的な transcript を finalTranscript に格納
        console.log('Speech recognition ended.');
        clearSilenceTimer();
      };
    } else {
      error.value = 'このブラウザは Web Speech API をサポートしていません。';
    }
  });

  onUnmounted(() => {
    if (recognition) {
      recognition.stop();
      clearSilenceTimer();
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition = null;
    }
  });

  return {
    transcript, // 認識中のテキスト（必要に応じて使用）
    finalTranscript, // 認識完了後の最終的なテキスト
    isListening,
    isFinished, // 認識が完了したかどうか
    error,
    startRecognition,
    stopRecognition,
  };
}