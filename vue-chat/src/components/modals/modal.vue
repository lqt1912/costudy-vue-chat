<template>
     <transition name="modal" @click="$emit('closeModal')">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
                 <div class="modal-footer">
                <slot name="footer">
                  <div class="modal-default-button" >
                    <font-awesome-icon style="font-size: 2rem" icon="times"/>
                  </div>
                </slot>
              </div>
              <div class="modal-body row d-flex justify-content-center align-middle">
                  <div class="pt-4">
                      <img :src="imageUrl" style="width:100%; max-width: 300px" alt="">
                  </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
</template>

<script>
export default {
    props:['imageUrl']
}
</script>