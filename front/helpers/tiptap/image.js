import { Node, Plugin } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import ImageView from '@/components/tiptap/ImageView'

function findPlaceholder(state, id) {
  const decos = placeholderPlugin.getState(state)
  const found = decos.find(null, null, spec => spec.id === id)
  return found.length ? found[0].from : null
}

function imageNodes(node) {
  const requiredNodes = []
  node.descendants(child => {
    if (child.type.name === 'image') {
      requiredNodes.push(child.attrs.src)
    }
  })
  return requiredNodes
}

/**
 * Placeholder plugin
 */
const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },

    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this)
      if (action && action.add) {
        const widget = document.createElement('span')
        widget.setAttribute('class', 'image image-upload-placeholder')
        const img = document.createElement('img')
        img.setAttribute('src', action.add.src)
        widget.appendChild(img)

        const deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id
        })
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, spec => spec.id === action.remove.id)
        )
      }
      return set
    }
  },

  props: {
    decorations(state) {
      return this.getState(state)
    }
  }
})

/**
 * Upload images function
 */
export const uploadImages = (view, pos, images, uploadFunc) => {
  const { schema } = view.state

  images.forEach(async image => {
    // A fresh object to act as the ID for this upload
    const id = {}
    const reader = new FileReader()
    reader.onload = readerEvent => {
      // Replace the selection with a placeholder
      const tr = view.state.tr
      if (!tr.selection.empty) {
        tr.deleteSelection()
      }
      tr.setMeta(placeholderPlugin, {
        add: {
          id,
          pos,
          src: readerEvent.target.result
        }
      })
      view.dispatch(tr)
    }
    reader.readAsDataURL(image)

    const src = await uploadFunc(image)
    if (src) {
      const plpos = findPlaceholder(view.state, id)
      if (plpos == null) {
        return
      }

      view.dispatch(
        view.state.tr
          .replaceWith(plpos, plpos, schema.nodes.image.create({ src }))
          .setMeta(placeholderPlugin, { remove: { id } })
      )
    }
  })
}

/**
 * Upload images plugin
 */
const imageUpoadPlugin = node => {
  return new Plugin({
    props: {
      decorations(state) {
        return this.getState(state)
      },

      handleDOMEvents: {
        /*
         * Handle drop
         */
        drop(view, event) {
          const hasFiles =
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files.length

          if (!hasFiles) {
            return
          }

          const images = Array.from(event.dataTransfer.files).filter(file =>
            /image/i.test(file.type)
          )

          if (images.length === 0) {
            return
          }

          event.preventDefault()
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })

          uploadImages(view, coordinates.pos, images, node.uploadFunc)
        }
      }
    },

    filterTransaction: (transaction, state) => {
      // Avoid endless recursion when simulating the effects of the transaction
      if (transaction.getMeta('filteringRequiredNodeDeletion') === true) {
        return true
      }
      transaction.setMeta('filteringRequiredNodeDeletion', true)
      // Simulate the transaction
      const newState = state.apply(transaction)
      // Diff nodes
      const oldNodes = imageNodes(state.doc.content)
      const newNodes = imageNodes(newState.doc.content)
      const removed = differenceWith(oldNodes, newNodes, isEqual)
      const added = differenceWith(newNodes, oldNodes, isEqual)
      node.imagesRemoved(removed)
      node.imagesAdded(added)

      return true
    }
  })
}

/**
 * Image Node
 */
export default class Image extends Node {
  constructor(name, parent, uploadFunc, imagesRemoved, imagesAdded) {
    super(name, parent)
    this.uploadFunc = uploadFunc
    this.imagesRemoved = imagesRemoved
    this.imagesAdded = imagesAdded
  }

  get name() {
    return 'image'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
        width: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'span.image',
          // contentElement: 'figcaption', // Helps the parser figure out where the child nodes are
          getAttrs(dom) {
            const img = dom.querySelector('img')
            return {
              src: img.getAttribute('src'),
              width: img.getAttribute('width')
            }
          }
        }
      ],
      toDOM(node) {
        let style = ''
        if (node.attrs.width) {
          style = `width: ${node.attrs.width}`
        }

        return [
          'span',
          { class: 'image' },
          ['img', { src: node.attrs.src, style }]
        ]
      }
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  get plugins() {
    return [placeholderPlugin, imageUpoadPlugin(this)]
  }

  get view() {
    return ImageView
  }
}
