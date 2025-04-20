<template>
  <div>
    <h1>シンプルな音声認識</h1>
    <p>
      <button @click="startRecognition" :disabled="isListening">{{ isListening ? '認識中...' : '認識開始' }}</button>
      <button @click="stopRecognition" :disabled="!isListening">停止</button>
    </p>
    <div>
      <h2>認識されたテキスト:</h2>
      <textarea v-model="transcript" rows="5" cols="50" readonly></textarea>
    </div>
    <p v-if="error" style="color: red;">エラー: {{ error }}</p>
  </div>
  <comment :liveComment="transcript"/>
</template>

<script setup lang="ts">
const silenceTimeoutDuration = ref(2000)
const { transcript, isListening, error, startRecognition, stopRecognition } = useSpeechRecognition(silenceTimeoutDuration.value)
</script>