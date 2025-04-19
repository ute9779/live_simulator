<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(coment) in comentArray">
          <td v-show="coment">{{ coment }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script setup lang="ts">

const newComent = ref('')
const comentArray = ref<string[]>([])

const updateComent = (newComent: string) => {
  let updateArray = []
  for(let i = 0; i < comentArray.value.length; i++){
    updateArray[i] = comentArray.value[i + 1]
  }
  updateArray[updateArray.length - 1] = newComent
  comentArray.value = updateArray
}

const randomNewComent = () => {
  setInterval(() => {
      const num = Math.floor(Math.random() * 6) + 1
      if (num == 1) {
        newComent.value = 'うおｗ'
      } else if (num == 2) {
        newComent.value = '４ね'
      } else if (num == 3) {
        newComent.value = 'www'
      } else if (num == 4) {
        newComent.value = 'しにたい'
      } else if (num == 5) {
        newComent.value = 'は？'
      } else if (num == 6) {
        newComent.value = 'あ'
      }
    },
    1000
  )
}

watch(newComent, (newValue) =>{
  if(newValue){
    updateComent(newValue)
    newComent.value = ''
  }
})

onMounted(() => {
  comentArray.value[9] = 'こんにちは'
  // randomNewComent()
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
}


</style>