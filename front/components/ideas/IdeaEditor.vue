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
        <button
          :title="isActive.link() ? 'Update Link' : 'Add Link'"
          class="menu-btn"
          :class="{ active: isActive.link() }"
          @click="showLinkMenu(getMarkAttrs('link'))"
        >
          <img src="~assets/images/editor/link.svg" alt="Link" />
        </button>
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
        <button title="Attachment" @click="showImagePrompt(commands.image)">
          <img src="~assets/images/editor/attach.svg" alt="Attachment" />
        </button>

        <slot name="menu-bar-after"></slot>
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
  History,
  Placeholder
} from 'tiptap-extensions'

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
    uploadingAttachment: false
  }),

  watch: {
    value(val) {
      if (val === this.text) {
        return
      }
      this.content = val
      this.editor.setContent(this.content)
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
        new Placeholder({ emptyNodeText: this.placeholder })
      ],
      onUpdate: ({ getHTML }) => {
        this.content = getHTML()
      },
      onBlur: () => this.updateValue()
    })
  },

  beforeDestroy() {
    this.editor.destroy()
    this.$refs.editorContent.removeEventListener('scroll')
  },

  methods: {
    updateValue() {
      this.$emit('input', this.content)
    },

    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },

    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },

    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },

    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },

    checkScroll() {
      const $el = this.$refs.editorContent
      const currentScrollLocation = $el.scrollTop
      const scrollMax = $el.scrollHeight - $el.clientHeight

      this.atScrollEnd = currentScrollLocation >= scrollMax - 5
      this.atScrollStart = currentScrollLocation === 0
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

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
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
</style>
