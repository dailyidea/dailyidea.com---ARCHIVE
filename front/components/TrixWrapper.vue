<template>
  <div class="trix-wrapper">
    <VueTrix
      v-model="value"
      class="editor"
      :placeholder="placeholder"
      @input="input"
    />
  </div>
</template>

<script>
const VueTrix = () => import('vue-trix')

function customizeTrixPanel(event) {
  const BUTTON_ACTIVE_CLASS = 'trix-active'
  const BUTTON_CLASS = 'trix-button'
  const BUTTON_ID = 'toggle-trix-panel'

  const trixToggleEl = document.querySelector('#' + BUTTON_ID)
  if (trixToggleEl) {
    trixToggleEl.remove()
  }
  const buttonToAppend = document.createElement('button')
  buttonToAppend.innerHTML = '<i class="fas fa-bars"></i>'
  buttonToAppend.setAttribute('type', 'button')
  buttonToAppend.setAttribute('id', BUTTON_ID)
  buttonToAppend.setAttribute('class', BUTTON_CLASS)
  const toggleButtonsVisibility = visible => {
    const buttonGroups = document.querySelectorAll('.trix-button')
    for (let i = 0; i < buttonGroups.length - 1; i++) {
      const button = buttonGroups[i]
      if (button.id === BUTTON_ID) {
        continue
      }
      button.style.visibility = visible ? 'visible' : 'hidden'
      button.style.opacity = visible ? 1 : 0
    }
  }
  toggleButtonsVisibility(false)

  buttonToAppend.addEventListener('click', function(e) {
    let panelVisible = false
    const trixToggleBtn = e.target.classList.contains(BUTTON_CLASS)
      ? e.target
      : e.target.parentElement

    if (trixToggleBtn.classList.contains(BUTTON_ACTIVE_CLASS)) {
      trixToggleBtn.classList.remove(BUTTON_ACTIVE_CLASS)
      panelVisible = false
    } else {
      trixToggleBtn.classList.add(BUTTON_ACTIVE_CLASS)
      panelVisible = true
    }
    toggleButtonsVisibility(panelVisible)
  })

  event.target.toolbarElement
    .querySelector('.trix-button-group.trix-button-group--history-tools')
    .appendChild(buttonToAppend)
  // .insertAdjacentHTML('beforeend', buttonHTML)
}

export default {
  name: 'TrixWrapper',
  components: { VueTrix },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter content'
    }
  },
  created() {
    addEventListener('trix-initialize', customizeTrixPanel)
  },
  beforeDestroy() {
    removeEventListener('trix-initialize', customizeTrixPanel)
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped lang="scss">
.trix-wrapper ::v-deep {
  .trix-button,
  .trix-button-group {
    border: none !important;
  }
  trix-toolbar {
    .trix-button--icon {
      width: 1.8em;
      height: 1.8em;
      margin: 0 3px;
      &:first-child {
        margin-left: 0;
      }

      border-radius: 3px;
    }
  }
  .trix-button {
    border-radius: 3px;
    line-height: 27px;
    transition: visibility 0.2s ease, background-color 0.2s ease,
      opacity 0.2s ease;
    &:not(#toggle-trix-panel) {
      visibility: hidden;
    }
  }
  .trix-button.trix-active {
    background-color: #ffbd27;
  }
  #toggle-trix-panel {
    font-size: 16px;
  }
  .trix-button--icon-heading-1 {
    display: none;
  }
  .trix-button--icon-undo {
    display: none;
  }
  .trix-button--icon-redo {
    display: none;
  }
  .trix-button--icon-decrease-nesting-level {
    display: none;
  }
  .trix-button--icon-increase-nesting-level {
    display: none;
  }
  /*.trix-button-group--history-tools {*/
  /*  display: none;*/
  /*}*/
}
</style>
