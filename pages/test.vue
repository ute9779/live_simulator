<template>
  <div class="nicolive-layout">
    <header class="header">
      <div class="broadcast-info">
        <h1>{{ broadcastTitle }}</h1>
        <p>放送者: {{ broadcaster }}</p>
      </div>
    </header>

    <main class="main-content">
      <div class="video-area">
        <video v-if="isCameraActive" ref="videoPlayer" class="video-player" autoplay playsinline muted></video>
        <img v-else :src="videoPlaceholder" alt="放送映像" class="video-player">
        <button @click="toggleCamera" class="camera-button">{{ isCameraActive ? '画像に戻す' : 'カメラ映像に切り替え' }}</button>
      </div>
      <div class="comment-area">
        <div class="comment-list" ref="commentList">
          <div v-for="(comment, index) in comments" :key="index" class="comment-item">
            <span class="user">{{ comment.user }}:</span>
            <span class="text">{{ comment.text }}</span>
          </div>
        </div>
        <div class="comment-input-area">
          <input type="text" v-model="commentText" placeholder="コメントを入力">
          <button @click="submitComment">送信</button>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="user-info">
        <img :src="userIcon" alt="ユーザーアイコン" class="user-icon">
        <span>{{ username }}</span>
      </div>
      <div class="control-panel">
        <button>いいね！</button>
        <button>クリップ</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const broadcastTitle = ref('【テスト放送】癒やしの秘湯巡り');
const broadcaster = ref('秘湯探検隊');
const videoPlaceholder = ref('https://source.unsplash.com/640x360/?onsen');
const comments = ref([
  { user: '温泉太郎', text: '今日の秘湯はどこですか？' },
  { user: '湯の花子', text: 'わー、楽しみ！' },
  { user: '熱湯小町', text: 'ぬる湯が好きです...' },
]);
const username = ref('旅人A');
const userIcon = ref('https://i.pravatar.cc/30');
const commentText = ref('');
const commentList = ref(null);
const videoPlayer = ref(null);
const isCameraActive = ref(false);
let mediaStream = null;

const addComment = (newCommentText) => {
  if (newCommentText.trim() !== '') {
    comments.value.push({ user: username.value, text: newCommentText });
    commentText.value = '';
    scrollToBottom();
  }
};

const submitComment = () => {
  addComment(commentText.value);
};

const scrollToBottom = () => {
  if (commentList.value) {
    commentList.value.scrollTop = commentList.value.scrollHeight;
  }
};

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (videoPlayer.value) {
      videoPlayer.value.srcObject = stream;
    }
    mediaStream = stream; // ストリームをグローバル変数に保存
    isCameraActive.value = true;
  } catch (error) {
    console.error('カメラへのアクセスに失敗しました:', error);
    alert('カメラへのアクセスが許可されていません。設定を確認してください。');
  }
};

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  isCameraActive.value = false;
};

const toggleCamera = () => {
  if (isCameraActive.value) {
    stopCamera();
  } else {
    startCamera();
  }
};

onMounted(() => {
  scrollToBottom();
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.nicolive-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
}

.header {
  background-color: #4a148c;
  color: #fff;
  padding: 10px;
}

.broadcast-info h1 {
  margin-bottom: 5px;
  font-size: 1.5em;
}

.main-content {
  display: flex;
  flex-grow: 1;
  background-color: #222;
}

.video-area {
  flex: 2;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: relative;
}

.video-player {
  max-width: 100%;
  max-height: 80%;
  object-fit: contain;
}

.camera-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
}

.camera-button:hover {
  background-color: #1976d2;
}

.comment-area {
  flex: 1;
  background-color: #333;
  color: #eee;
  display: flex;
  flex-direction: column;
}

.comment-list {
  overflow-y: auto;
  padding: 10px;
  flex-grow: 1;
}

.comment-item {
  margin-bottom: 8px;
  padding: 5px;
  border-bottom: 1px solid #555;
  font-size: 0.9em;
  word-break: break-word;
}

.comment-item:last-child {
  border-bottom: none;
}

.user {
  font-weight: bold;
  color: #ffeb3b;
  margin-right: 8px;
}

.comment-input-area {
  padding: 10px;
  display: flex;
  border-top: 1px solid #555;
}

.comment-input-area input[type="text"] {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #777;
  border-radius: 5px 0 0 5px;
  background-color: #444;
  color: #eee;
}

.comment-input-area button {
  padding: 8px 15px;
  background-color: #673ab7;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.footer {
  background-color: #5e35b1;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}

.control-panel button {
  margin-left: 8px;
  padding: 8px 12px;
  background-color: #7e57c2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>