import { Node, Plugin } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'

function findPlaceholder(state, id) {
  const decos = placeholderPlugin.getState(state)
  const found = decos.find(null, null, spec => spec.id === id)
  return found.length ? found[0].from : null
}

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
        const widget = document.createElement('figure')
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

const imageUpoadPlugin = upload => {
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

          const { schema } = view.state
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })

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
                  pos: coordinates.pos,
                  src: readerEvent.target.result
                }
              })
              view.dispatch(tr)
            }
            reader.readAsDataURL(image)

            const src = await upload(image)
            if (src) {
              const pos = findPlaceholder(view.state, id)
              if (pos == null) {
                return
              }

              view.dispatch(
                view.state.tr
                  .replaceWith(pos, pos, schema.nodes.image.create({ src }))
                  .setMeta(placeholderPlugin, { remove: { id } })
              )

              // const node = schema.nodes.image.create({ src })
              // const transaction = view.state.tr.insert(
              //   coordinates.pos,
              //   node
              // )
              // view.dispatch(transaction)
            }
          })
        }
      }
    },

    filterTransaction: (transaction, state) => {
      transaction.mapping.maps.forEach(map => {
        map.forEach((oldStart, oldEnd, newStart, newEnd) => {
          state.doc.nodesBetween(
            oldStart,
            oldEnd,
            (node, number, pos, parent, index) => {
              if (node.type.name === 'image') {
                console.log(node)
                // result = false
              }
            }
          )
        })
      })

      return true
    }
  })
}

export default class Image extends Node {
  constructor(name, parent, uploadFunc = null) {
    super(name, parent)
    this.uploadFunc = uploadFunc
  }

  get name() {
    return 'image'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null
        },
        title: {
          default: null
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'figure.image',
          // contentElement: 'figcaption', // Helps the parser figure out where the child nodes are
          getAttrs(dom) {
            const img = dom.querySelector('img')
            return {
              src: img.getAttribute('src')
            }
          }
        }
      ],
      toDOM(node) {
        return [
          'figure',
          { class: 'image' },
          ['img', { src: node.attrs.src }] /* ['figcaption', 0] */
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
    return [placeholderPlugin, imageUpoadPlugin(this.uploadFunc)]
  }
}
