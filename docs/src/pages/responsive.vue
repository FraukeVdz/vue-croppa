<template>
  <div id="demos">
    <croppa v-model="croppa"
          :width="+width"
          :height="+height"
          :placeholder="placeholder"
          :placeholder-color="placeholderColor"
          :placeholder-font-size="+placeholderFontSize"
          :canvas-color="canvasColor"
          :show-remove-button="showRemoveButton"
          :remove-button-color="removeButtonColor"
          :remove-button-size="+removeButtonSize"
          :show-loading="showLoading"
          :loading-size="+loadingSize"
          :loading-color="loadingColor"
          :prevent-white-space="true"
          canvas-color="black"
          class="ml-1">
        </croppa>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        croppa: {},
        width: 350,
        height: 630,
        placeholder: 'Yes, you can modify the text here',
        placeholderColor: '#000',
        placeholderFontSize: 16,
        canvasColor: 'transparent',
        showRemoveButton: true,
        removeButtonColor: 'black',
        removeButtonSize: '',
        showLoading: true,
        loadingColor: '#606060',
        loadingSize: '50'
      }
    },
    mounted () {
      window.addEventListener('resize', (e) => {
        e.preventDefault()
        this.update()
      })

      this.update()
    },
    methods: {
      update () {
        this.width = document.getElementById('demos').offsetWidth
        this.height = this.width / 16 * 9


        if(this.height < 300) {
          this.height = 300
        }

        if(this.height > 500) {
          this.height = 500
        }
      },
    }
  }
</script>

<style>
  canvas {
    border: 5px solid red;
  }
</style>