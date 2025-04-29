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
        <video v-show="isCameraActive" ref="videoPlayer" autoplay playsinline :muted="!isCameraActive" class="video-player"></video>
        <img v-show="!isCameraActive" src="public/mokou.jpg" >
        <button class="camera-button" @click="toggleCamera">
          {{ isCameraActive ? 'カメラをオフ' : 'カメラをオン' }}
        </button>
      </div>
      <div class="comment-area">
        <comment />
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
const broadcastTitle = ref('とる！');
const broadcaster = ref('もこう');
const username = ref('旅人A');
const userIcon = ref('https://i.pravatar.cc/30');
const videoPlayer = ref(null);
const isCameraActive = ref(false); // 初期状態はオフ
let mediaStream = null;

const toggleCamera = async () => {
  isCameraActive.value = !isCameraActive.value;
  if (isCameraActive.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoPlayer.value) {
        videoPlayer.value.srcObject = stream;
        mediaStream = stream; // ストリームを保持
      }
    } catch (error) {
      console.error('カメラへのアクセスに失敗しました:', error);
      alert('カメラへのアクセスが許可されていません。設定を確認してください。');
      isCameraActive.value = false; // エラー時は状態を戻す
    }
  } else {
    // カメラをオフにする処理
    if (videoPlayer.value && videoPlayer.value.srcObject) {
      const tracks = videoPlayer.value.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoPlayer.value.srcObject = null;
    }
    mediaStream = null;
  }
};

onUnmounted(() => {
  // コンポーネントがアンマウントされた際にカメラを停止
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop());
    mediaStream = null;
  }
});
</script>

<style scoped>
.nicolive-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #ffffff;
  color: #000000;
  padding: 10px;
}

.broadcast-info h1 {
  margin-bottom: 5px;
  font-size: 1.5em;
}

.main-content {
  border: #000000 1px solid;
  display: flex;
  flex-grow: 1;
  background-color: #0004ff;
}

.video-area {
  flex: 2;
  background-color: #000;
  display: flex;
  flex-direction: column; /* 縦方向に要素を並べる */
  justify-content: center; /* 縦方向の中央に配置 */
  align-items: center; /* 横方向の中央に配置 */
  padding: 0;
  position: relative;
  overflow: hidden;
}

.video-player {
  width: auto; /* 幅を auto に設定 */
  height: 100%; /* 高さを video-area いっぱいに設定 */
  object-fit: contain; /* アスペクト比を維持し、要素内に収まるように表示 */
}

img {
  width: auto; /* 幅を auto に設定 */
  height: 100%; /* 高さを video-area いっぱいに設定 */
  object-fit: contain; /* アスペクト比を維持し、要素内に収まるように表示 */
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
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user {
  font-weight: bold;
  color: #ffeb3b;
  margin-right: 8px;
}

.footer {
  color: #000000;
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