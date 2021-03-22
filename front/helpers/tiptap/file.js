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
        widget.setAttribute('class', 'file file-upload-placeholder')
        const figcaption = document.createElement('figcaption')
        figcaption.textContent = action.add.name
        widget.appendChild(figcaption)

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

export const uploadFiles = (view, pos, files, uploadFunc) => {
  const { schema } = view.state

  files.forEach(async file => {
    // A fresh object to act as the ID for this upload
    const id = {}
    // Replace the selection with a placeholder
    const tr = view.state.tr
    if (!tr.selection.empty) {
      tr.deleteSelection()
    }
    tr.setMeta(placeholderPlugin, {
      add: {
        id,
        pos,
        name: file.name
      }
    })
    view.dispatch(tr)

    const path = await uploadFunc(file)
    if (path) {
      const pos = findPlaceholder(view.state, id)
      if (pos == null) {
        return
      }

      view.dispatch(
        view.state.tr
          .replaceWith(
            pos,
            pos,
            schema.nodes.file.create({
              href: path,
              name: file.name
            })
          )
          .setMeta(placeholderPlugin, { remove: { id } })
      )
    }
  })
}

const fileUpoadPlugin = uploadFunc => {
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

          const files = Array.from(event.dataTransfer.files).filter(
            file => !/image/i.test(file.type)
          )

          if (files.length === 0) {
            return
          }

          event.preventDefault()

          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })

          uploadFiles(view, coordinates.pos, files, uploadFunc)
        }
      }
    }
  })
}

export default class Image extends Node {
  constructor(name, parent, uploadFunc = null) {
    super(name, parent)
    this.uploadFunc = uploadFunc
  }

  get name() {
    return 'file'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        href: {},
        name: {
          default: null
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'figure.file',
          getAttrs(dom) {
            const link = dom.querySelector('figcaption a')
            return {
              name: link.textContent,
              href: link.getAttribute('href')
            }
          }
        }
      ],
      toDOM(node) {
        return [
          'figure',
          { class: 'file' },
          ['figcaption', ['a', { href: node.attrs.href }, node.attrs.name]]
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
    return [placeholderPlugin, fileUpoadPlugin(this.uploadFunc)]
  }
}
