<template>
  <div class="col-3">
    <h4 class="text-center">Ảnh đã chia sẻ</h4>
    <div class="row">
      <div class="col-3" v-for="url in imageUrls" :key="url">
        <Image :image="url.image_url"> </Image>
      </div>
    </div>
  </div>
</template>

<script>
import Image from '../users/Image.vue';
export default {
  components: {
    Image,
  },
  props: ['imageUrls'],
};
</script>