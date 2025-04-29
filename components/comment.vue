<template>
  <div class="comment_area">
    <div class="comment_view">
      <table>
        <tbody>
          <tr v-for="(comment) in commentArray">
            <td v-show="comment">{{ comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="comment_input">
      <form @submit.prevent="postComment">
        <input id='comment_input_area' type="text" autocomplete="off" maxlength="100">
        <button type="submit">コメントする</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface reaction {
  word: string,
  response: string
}

const props = defineProps({
  liveComment: { type: String, required: false },
})

const emit = defineEmits(['updateItems'])

import reactionArrayObject from '@/assets/json/reactions.json'
const reactionArray = reactionArrayObject.reactions
const randomReactionArray = reactionArrayObject.randomReactions

const newComment = ref('')
const commentArray = ref<string[]>(Array.from({ length: 30 }, () => ''))

// コメントを投稿する
const postComment = async() => {
  const element: HTMLInputElement = <HTMLInputElement> document.getElementById('comment_input_area')
  if (element.value) {
    newComment.value = element.value
    element.value = ''
    await updateComment(newComment.value)
  }
}

// コメントビューを更新する
const updateComment = (newComment: string) => {
  let updateArray = []
  for(let i = 0; i < commentArray.value.length; i++){
    updateArray[i] = commentArray.value[i + 1]
  }
  updateArray[updateArray.length - 1] = newComment
  commentArray.value = updateArray
}

// 音声に対応するレスポンスを投稿する
const reactionNewComment = async(liveComment: string) => {
  // 1~6回投稿
  const num = Math.floor(Math.random() * 6) + 1
  for (let i = 0; i < num; i++) {
    for(const reaction of reactionArray){
      if (liveComment.includes(reaction.word)) {
        newComment.value = reaction.response
        await updateComment(newComment.value)
        continue
      }
    }
  }
}

// ランダムにコメントを投稿する
const randomNewComment = (commentArray: Array<reaction>) => {
  const array = commentArray
  setInterval(() => {
      const num = Math.floor(Math.random() * array.length) + 1

      newComment.value = array[num].response
      
      if(newComment.value){
        updateComment(newComment.value)
        newComment.value = ''
      }
    },
    // 1.5秒
    1500
  )
}

// 放送主コメントが更新されたときレスポンス
watch(props, (newValue) =>{
  if(newValue.liveComment){
    reactionNewComment(useKatakanaToHiragana(newValue.liveComment))
  }
})

onMounted(() => {
  randomNewComment(randomReactionArray)
})

</script>

<style scoped>
.comment_area {
  padding: 5px 0px 5px 0px;
  display: flex;
  flex-direction: column; /* 要素を縦に並べる */
  height: 100%; /* 親要素の高さいっぱいにする */
}

.comment_view {
  flex-grow: 1;
}

.comment_input {
  position: sticky;
}

table {
  border-collapse: collapse;
  font-size: 0.8rem;
  letter-spacing: 1px;
  width: 100%;
}

th,
td {
  border: 1px solid rgb(160 160 160);
}
</style>