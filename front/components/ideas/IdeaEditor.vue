<template>
  <div
    class="idea-tiptap flex-grow-1 fill-height"
    :class="{
      'fade-bottom': !atScrollEnd,
      'fade-top': !atScrollStart
    }"
  >
    <editor-content
      ref="editorContent"
      :editor="editor"
      class="editor-content"
      style="height: calc(100% - 50px)"
      @keydown.native.left.stop
      @keydown.native.right.stop
    />

    <editor-menu-bar
      v-slot="{ commands, isActive, getMarkAttrs }"
      :editor="editor"
    >
      <div class="d-flex align-center justify-space-between">
        <button
          title="Bold"
          class="menu-btn"
          :class="{ active: isActive.bold() }"
          @click="commands.bold"
        >
          <img src="~assets/images/editor/B.svg" alt="Bold" />
        </button>
        <button
          title="Italic"
          class="menu-btn"
          :class="{ active: isActive.italic() }"
          @click="commands.italic"
        >
          <img src="~assets/images/editor/I.svg" alt="Italic" />
        </button>
        <button
          title="Underline"
          class="menu-btn"
          :class="{ active: isActive.underline() }"
          @click="commands.underline"
        >
          <img src="~assets/images/editor/U.svg" alt="Underline" />
        </button>
        <div class="vr"></div>
        <button
          title="Heading 1"
          class="menu-btn"
          :class="{ active: isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          <img src="~assets/images/editor/H1.svg" alt="H1" />
        </button>
        <button
          title="Heading 2"
          class="menu-btn"
          :class="{ active: isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          <img src="~assets/images/editor/H2.svg" alt="H2" />
        </button>
        <div class="vr"></div>
        <button
          :title="isActive.link() ? 'Update Link' : 'Add Link'"
          class="menu-btn"
          :class="{ active: isActive.link() }"
          @click="showLinkMenu(getMarkAttrs('link'))"
        >
          <img
            src="~assets/images/editor/link.svg"
            alt="Link"
            style="margin-bottom: -2px;"
          />
        </button>
        <div class="vr"></div>
        <button
          title="Ordered List"
          :class="{ active: isActive.ordered_list() }"
          class="menu-btn"
          @click="commands.ordered_list"
        >
          <img src="~assets/images/editor/ol.svg" alt="Ordered List" />
        </button>
        <button
          title="Bullet List"
          :class="{ active: isActive.bullet_list() }"
          class="menu-btn"
          @click="commands.bullet_list"
        >
          <img src="~assets/images/editor/ul.svg" alt="Bullet List" />
        </button>
        <div class="vr"></div>
        <button title="Attachment" @click="showImagePrompt(commands.image)">
          <img
            src="~assets/images/editor/attach.svg"
            alt="Attachment"
            style="margin-bottom: -2px;"
          />
        </button>

        <slot name="menu-bar-after"></slot>

        <v-dialog v-model="linkMenuIsActive" max-width="400">
          <v-card>
            <v-card-title>Link URL</v-card-title>
            <v-card-text>
              <v-text-field v-model="linkUrl" label="Link URL"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="setLinkUrl(commands.link, linkUrl)"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </editor-menu-bar>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History
  // Placeholder
} from 'tiptap-extensions'
import { Credentials } from '@aws-amplify/core'
import Image from '~/helpers/tiptap/image'

const MAX_ATTACHMENT_SIZE_BYTES = 1024 * 1024 * 5
const BUCKET_URL = `https://${process.env.USER_UPLOADS_S3_DOMAIN}.s3.amazonaws.com/`

function createStorageKey(file) {
  const date = new Date()
  return date.getTime() + '-' + file.name
}

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    value: { type: String, required: true },
    placeholder: { type: String, default: '' },
    disabled: Boolean
  },

  data: () => ({
    content: '',
    editor: null,
    linkUrl: null,
    linkMenuIsActive: false,
    atScrollEnd: true,
    atScrollStart: true,

    attachments: [],
    imageAttachments: [],
    fileAttachments: []
  }),

  watch: {
    value(val) {
      if (val === this.text) {
        return
      }
      this.content = val
      this.editor.setContent(this.content)
    },

    content() {
      this.checkScroll()
    }
  },

  mounted() {
    this.content = this.value

    this.editor = new Editor({
      content: this.content,
      extensions: [
        new BulletList(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new Link(),
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        // new Placeholder({ emptyNodeText: this.placeholder }),
        new Image(null, null, this.uploadFile)
      ],
      onUpdate: ({ getHTML }) => {
        this.content = getHTML()
      },
      onBlur: () => this.updateValue()
    })

    this.$refs.editorContent.$el.addEventListener('scroll', this.checkScroll)
  },

  beforeDestroy() {
    this.editor.destroy()
    this.$refs.editorContent.$el.removeEventListener('scroll', this.checkScroll)
  },

  methods: {
    updateValue() {
      this.$emit('input', this.content)
    },

    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
    },

    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },

    setLinkUrl(command, href) {
      command({ href })
      this.hideLinkMenu()
    },

    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },

    checkScroll() {
      const $el = this.$refs.editorContent.$el
      const currentScrollLocation = $el.scrollTop
      const scrollMax = $el.scrollHeight - $el.clientHeight
      this.atScrollEnd = currentScrollLocation >= scrollMax - 5
      this.atScrollStart = currentScrollLocation === 0
    },

    validateFile(file) {
      if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
        this.$dialog.show({
          header: 'File too large',
          message: 'Max acceptable file size is 5Mb'
        })
        return false
      }
      return true
    },

    async uploadFile(file) {
      if (!this.validateFile(file)) {
        return
      }
      const attachment = {
        key: createStorageKey(file),
        file,
        progress: 0,
        uploading: false,
        source: null
      }
      this.attachments.push(attachment)

      // this.form.imageAttachments.push(attachment)

      attachment.uploading = true
      await new Promise(resolve => {
        this.$amplifyS3Storage
          .put(attachment.key, file, {
            contentType: file.type,
            level: 'protected',
            progressCallback: progressEvent => {
              attachment.progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
            }
          })
          .then(resolve)
      })

      // await new Promise(resolve => setTimeout(resolve, 1000000))
      attachment.uploading = false // eslint-disable-line

      const cr = await Credentials.get()

      const BUCKET_FOLDER = `protected/${cr.data.IdentityId}/`
      const prefix = `${BUCKET_URL}${BUCKET_FOLDER}`
      attachment.source = prefix + encodeURIComponent(attachment.key) // eslint-disable-line

      if (attachment.file.type.substr(0, 5) === 'image') {
        this.imageAttachments.push(`${BUCKET_FOLDER}${attachment.key}`)
      } else {
        this.fileAttachments.push(`${BUCKET_FOLDER}${attachment.key}`)
      }

      console.log({ attachment })

      return attachment.source
    },

    onFileRemoved({ type, key }) {
      if (type.substr(0, 5) === 'image') {
        this.form.imageAttachments.splice(
          this.form.imageAttachments.indexOf(key),
          1
        )
      }
      this.form.fileAttachments.splice(
        this.form.fileAttachments.indexOf(key),
        1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ProseMirror {
    min-height: 100%;
    outline: none;
  }

  .is-editor-empty {
    margin-bottom: 0;
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
  }

  figure {
    display: inline-block;
    img {
      display: block;
    }
    &.ProseMirror-selectednode {
      outline: 2px solid #ccc;
    }
  }

  .image-upload-placeholder {
    position: relative;
    &:after {
      display: flex;
      content: 'Uploading...';
      background-color: rgba(255, 255, 255, 0.5);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
    }
  }
}

.editor-content {
  overflow-y: auto;
}

.fade-top .editor-content {
  mask-image: linear-gradient(to top, black 90%, transparent 100%);
}
.fade-bottom .editor-content {
  mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
}
.fade-top.fade-bottom .editor-content {
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.menu-btn {
  padding: 2px 7px 0 7px;
  border-radius: 3px;

  &.active {
    background: #ccc;
  }
}

.vr {
  height: 12px;
  width: 1px;
  margin-top: -2px;
  background-color: #e2e1e5;
}
</style>
