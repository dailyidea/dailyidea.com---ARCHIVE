<template>
  <span
    class="image"
    :class="{ 'ProseMirror-selectednode': selected }"
    :style="{ position: 'relative' }"
    @click="selectNode"
  >
    <span
      v-if="selected"
      :style="{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '10px',
        height: '10px',
        border: '3px solid black',
        borderTop: 'none',
        borderLeft: 'none',
        cursor: 'nwse-resize'
      }"
      @mousedown="onMouseDown"
    ></span>
    <img ref="image" :src="node.attrs.src" :style="{ width: width }" />
  </span>
</template>

<script>
import { NodeSelection } from 'prosemirror-state'

export default {
  props: {
    editor: { type: Object, required: true },
    node: { type: Object, required: true },
    updateAttrs: { type: Function, required: true },
    getPos: { type: Function, required: true },
    view: { type: Object, required: true },
    selected: Boolean
  },

  data: () => ({
    width: null,
    active: false
  }),

  beforeMount() {
    this.width = this.node.attrs.width
  },

  methods: {
    onChange() {
      this.updateAttrs({
        done: !this.node.attrs.done
      })
    },

    onMouseDown(e) {
      e.preventDefault()

      const startX = e.pageX
      const startWidth = this.node.attrs.width
        ? parseFloat(this.node.attrs.width.match(/(.+)px/)[1])
        : this.$refs.image.clientWidth

      const onMouseMove = e => {
        const currentX = e.pageX
        const diffInPx = currentX - startX
        const newWidth = Math.max(20, startWidth + diffInPx)

        this.width = `${newWidth}px`
      }

      const onMouseUp = e => {
        e.preventDefault()

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        this.updateAttrs({
          width: this.width
        })
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },

    selectNode() {
      const pos = this.getPos()
      const { doc, tr } = this.view.state

      const selection = NodeSelection.create(doc, pos, pos + 1)
      const transaction = tr.setSelection(selection)
      this.view.dispatch(transaction)
    }
  }
}
</script>
