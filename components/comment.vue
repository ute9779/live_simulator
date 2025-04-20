<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(comment) in commentArray">
          <td v-show="comment">{{ comment }}</td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent="postComment">
      <input id="comment_input" type="text" autocomplete="off" maxlength="100">
      <button type="submit">コメントする</button>
    </form>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  liveComment: { type: String, required: false },
  // initialItems: { type: Array as () => { label: string, value: string }[], default: () => [] }
})

const emit = defineEmits(['updateItems'])

const newComment = ref('')
const commentArray = ref<string[]>([])

const postComment = () => {
  const element: HTMLInputElement = <HTMLInputElement> document.getElementById('comment_input')
  if (element) {
    newComment.value = element.value
    element.value = ''
  }
}

const updatecomment = (newComment: string) => {
  let updateArray = []
  for(let i = 0; i < commentArray.value.length; i++){
    updateArray[i] = commentArray.value[i + 1]
  }
  updateArray[updateArray.length - 1] = newComment
  commentArray.value = updateArray
}

const reactionArray = [{
  word: '殺す',
  response: 'あ',
}]

const reactionNewComment = async(liveComment: string) => {
  const num = Math.floor(Math.random() * 6) + 1
  for (let i = 0; i < num; i++) {
    for(const reaction of reactionArray){
      if (reaction.word == liveComment) {
        newComment.value = reaction.response
        await updatecomment(newComment.value)
        continue
      }
    }
  }
}

watch(props, (newValue) =>{
  if(newValue.liveComment){
    reactionNewComment(newValue.liveComment)
  }
})

const randomNewComment = () => {
  setInterval(() => {
      const num = Math.floor(Math.random() * 6) + 1
      if (num == 1) {
        newComment.value = 'とあるvが'
      } else if (num == 2) {
        newComment.value = '４ね'
      } else if (num == 3) {
        newComment.value = 'www'
      } else if (num == 4) {
        newComment.value = 'しにたい'
      } else if (num == 5) {
        newComment.value = 'は？'
      } else if (num == 6) {
        newComment.value = 'あ'
      }
      if(newComment.value){
        updatecomment(newComment.value)
        newComment.value = ''
      }
    },
    1000
  )
}

// watch(newComment, (newValue) =>{
//   if(newValue){
//     updatecomment(newValue)
//     newComment.value = ''
//   }
// })

onMounted(() => {
  commentArray.value[9] = 'こんにちは'
  randomNewComment()
})

</script>
<style scoped>
table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

th,
td {
  border: 1px solid rgb(160 160 160);
  width: 1000px;
  max-width: 1000px;
}


</style>