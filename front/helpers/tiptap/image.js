import { Node, Plugin } from 'tiptap'
import { nodeInputRule } from 'tiptap-commands'
import { Decoration, DecorationSet } from 'prosemirror-view'

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

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
        widget.setAttribute('class', 'image-upload-placeholder')
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
          tag: 'figure',
          // contentElement: 'figcaption', // Helps the parser figure out where the child nodes are
          getAttrs(dom) {
            const img = dom.querySelector('img')
            return {
              src: img.src
            }
          }
        }
      ],
      toDOM(node) {
        return [
          'figure',
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

  inputRules({ type }) {
    return [
      nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
        const [, alt, src, title] = match
        return {
          src,
          alt,
          title
        }
      })
    ]
  }

  get plugins() {
    const upload = this.uploadFunc

    return [
      placeholderPlugin,

      new Plugin({
        props: {
          decorations(state) {
            return this.getState(state)
          },

          /*
           * Handle paste
           */
          handlePaste(view, event, slice) {
            const items = (
              event.clipboardData || event.originalEvent.clipboardData
            ).items

            for (const item of items) {
              if (item.type.indexOf('image') === 0) {
                event.preventDefault()
                const { schema } = view.state

                const image = item.getAsFile()

                if (upload) {
                  upload(image).then(src => {
                    const node = schema.nodes.image.create({ src })
                    const transaction = view.state.tr.replaceSelectionWith(node)
                    view.dispatch(transaction)
                  })
                } else {
                  const reader = new FileReader()
                  reader.onload = readerEvent => {
                    const node = schema.nodes.image.create({
                      src: readerEvent.target.result
                    })
                    const transaction = view.state.tr.replaceSelectionWith(node)
                    view.dispatch(transaction)
                  }
                  reader.readAsDataURL(image)
                }
              }
            }
            return false
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
              // const coordinates = view.posAtCoords({
              //   left: event.clientX,
              //   top: event.clientY
              // })

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
                      pos: tr.selection.from,
                      src: readerEvent.target.result
                    }
                  })
                  view.dispatch(tr)
                }
                reader.readAsDataURL(image)

                if (upload) {
                  const src = await upload(image)
                  if (src) {
                    const pos = findPlaceholder(view.state, id)
                    if (pos == null) {
                      return
                    }

                    view.dispatch(
                      view.state.tr
                        .replaceWith(
                          pos,
                          pos,
                          schema.nodes.image.create({ src })
                        )
                        .setMeta(placeholderPlugin, { remove: { id } })
                    )

                    // const node = schema.nodes.image.create({ src })
                    // const transaction = view.state.tr.insert(
                    //   coordinates.pos,
                    //   node
                    // )
                    // view.dispatch(transaction)
                  }
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
    ]
  }
}
