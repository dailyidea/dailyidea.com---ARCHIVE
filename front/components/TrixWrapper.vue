<template>
  <div class="trix-wrapper">
    <VueTrix
      v-model="value"
      class="editor"
      :placeholder="placeholder"
      @trix-file-accept="checkFileAcceptance"
      @trix-attachment-add="handleAttachmentAdd"
      @trix-attachment-remove="handleAttachmentRemove"
      @input="input"
    />
  </div>
</template>

<script>
import Autolinker from 'autolinker'
import { Credentials } from '@aws-amplify/core'

const VueTrix = () => import('vue-trix')

const MAX_ATTACHMENT_SIZE_BYTES = 1024 * 1024 * 5

const BUCKET_URL = `https://${process.env.USER_UPLOADS_S3_DOMAIN}.s3.amazonaws.com/`

function createStorageKey(file) {
  const date = new Date()
  return date.getTime() + '-' + file.name
}

function customizeTrixPanel(event) {
  const BUTTON_ACTIVE_CLASS = 'trix-active'
  const BUTTON_CLASS = 'trix-button'
  const BUTTON_ID = 'toggle-trix-panel'
  const BUTTON_INITIAL_VISIBILITY_STATE = true
  const SHOW_TOGGLE_BUTTON = false
  const APPEND_TOGGLE_BUTTON = false

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
  toggleButtonsVisibility(BUTTON_INITIAL_VISIBILITY_STATE)
  if (BUTTON_INITIAL_VISIBILITY_STATE === true) {
    buttonToAppend.classList.add(BUTTON_ACTIVE_CLASS)
  }

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

  if (SHOW_TOGGLE_BUTTON === true) {
    if (APPEND_TOGGLE_BUTTON === true) {
      // append toggle button
      event.target.toolbarElement
        .querySelector('.trix-button-group.trix-button-group--history-tools')
        .appendChild(buttonToAppend)
    } else {
      // prepend it instead
      const trixButtonRow = event.target.toolbarElement.querySelector(
        '.trix-button-row'
      )
      trixButtonRow.insertBefore(buttonToAppend, trixButtonRow.childNodes[0])
    }
  }
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
    },
    autoDeleteAttachments: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      attachmentsProcessing: 0
    }
  },
  computed: {
    userId() {
      return this.$store.getters['userData/userId']
    }
  },
  watch: {
    attachmentsProcessing(n, o) {
      if (n > 0 && o === 0) {
        this.$emit('attachmentsUploadStarted')
      }
      if (n === 0) {
        this.$emit('attachmentsUploadCompleted')
      }
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
      this.$emit(
        'input',
        Autolinker.link(val, { truncate: 30, stripPrefix: false })
      )
    },
    checkFileAcceptance(event) {
      if (event.file) {
        if (event.file.size > MAX_ATTACHMENT_SIZE_BYTES) {
          this.$dialog.show({
            header: 'File too large',
            message: 'Max acceptable file size is 5Mb'
          })
          event.preventDefault()
        }
      }
    },
    handleAttachmentAdd(event) {
      const progressCallback = progressEvent => {
        event.attachment.setUploadProgress(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        )
      }
      const successCallback = ({ key }) => {
        Credentials.get().then(cr => {
          const BUCKET_FOLDER = `protected/${cr.data.IdentityId}/`
          const prefix = `${BUCKET_URL}${BUCKET_FOLDER}`
          const source = prefix + encodeURIComponent(key)
          if (event.attachment.file.type.substr(0, 5) === 'image') {
            const img = new Image()
            const source = prefix + encodeURIComponent(key)
            img.onload = () => {
              this.$emit('fileAttached', {
                type: event.attachment.file.type,
                key: `${BUCKET_FOLDER}${key}`
              })
              this.attachmentsProcessing--
            }
            img.src = source
          } else {
            this.$emit('fileAttached', {
              type: event.attachment.file.type,
              key: `${BUCKET_FOLDER}${key}`
            })
            this.attachmentsProcessing--
          }

          event.attachment.setAttributes({
            src: source,
            url: source,
            href: source,
            key
          })
        })
      }
      const uploadFileAttachment = attachment => {
        this.attachmentsProcessing++
        this.$amplifyS3Storage
          .put(createStorageKey(attachment.file), attachment.file, {
            contentType: attachment.file.type,
            level: 'protected',
            progressCallback
          })
          .then(successCallback)
      }
      uploadFileAttachment(event.attachment)
    },
    async handleAttachmentRemove(event) {
      const href = event.attachment.getAttributes().href
      if (!href) {
        return // not processed yet
      }
      const CredentialsData = await Credentials.get()
      const IdentityId = CredentialsData.data.IdentityId
      const BUCKET_FOLDER = `protected/${IdentityId}/`
      const key = event.attachment.getAttributes().key
      if (!this.autoDeleteAttachments) {
        this.$emit('fileRemoved', {
          type: event.attachment.attachment.attributes.values.contentType,
          key: `${BUCKET_FOLDER}${key}`
        })
      } else {
        this.attachmentsProcessing++
        await this.$amplifyS3Storage.remove(key, { level: 'protected' })
        this.attachmentsProcessing--
      }
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
      width: 25px;
      height: 25px;
      margin: 0 3px;

      &:first-child {
        margin-left: 0;
      }

      border-radius: 3px;
    }
  }

  trix-editor {
    img {
      height: auto !important;
      width: auto !important;
      max-width: 100%;
      max-height: 400px;
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
