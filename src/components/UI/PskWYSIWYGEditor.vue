<script setup lang="ts">
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { Indent } from '@weiruo/tiptap-extension-indent'
import { type ComputedRef, computed, onUnmounted } from 'vue'

import BlockquoteIcon from '@/components/Icons/TextEditorIcons/BlockquoteIcon.vue'
import BoldIcon from '@/components/Icons/TextEditorIcons/BoldIcon.vue'
import BulletListIcon from '@/components/Icons/TextEditorIcons/BulletListIcon.vue'
import HorizontalLineIcon from '@/components/Icons/TextEditorIcons/HorizontalLineIcon.vue'
import ImageIcon from '@/components/Icons/TextEditorIcons/ImageIcon.vue'
import IndentIcon from '@/components/Icons/TextEditorIcons/IndentIcon.vue'
import ItalicIcon from '@/components/Icons/TextEditorIcons/ItalicIcon.vue'
import LinkIcon from '@/components/Icons/TextEditorIcons/LinkIcon.vue'
import OrderedListIcon from '@/components/Icons/TextEditorIcons/OrderedListIcon.vue'
import OutdentIcon from '@/components/Icons/TextEditorIcons/OutdentIcon.vue'
import RedoIcon from '@/components/Icons/TextEditorIcons/RedoIcon.vue'
import TextAlignCenterIcon from '@/components/Icons/TextEditorIcons/TextAlignCenterIcon.vue'
import TextAlignLeftIcon from '@/components/Icons/TextEditorIcons/TextAlignLeftIcon.vue'
import TextAlignRightIcon from '@/components/Icons/TextEditorIcons/TextAlignRightIcon.vue'
import TextFullIcon from '@/components/Icons/TextEditorIcons/TextFullIcon.vue'
import UnderlineIcon from '@/components/Icons/TextEditorIcons/UnderlineIcon.vue'
import UndoIcon from '@/components/Icons/TextEditorIcons/UndoIcon.vue'

interface PskWYSIWYGEditorProps {
  modelValue: string
  label?: string
  required?: boolean
}

const props = defineProps<PskWYSIWYGEditorProps>()
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    Placeholder.configure({ placeholder: 'Введите описание' }),
    Indent.configure({ types: ['listItem', 'paragraph'], minLevel: 0, maxLevel: 8 }),
    Link.configure({ autolink: true, validate: (href) => /^https?:\/\//.test(href) }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    StarterKit,
    Image.configure({ inline: true }),
    Underline
  ],
  content: props.modelValue,
  onUpdate: () => {
    const value = editor.value?.getHTML()
    let result = ''

    if (value !== '<p></p>' && value) {
      result = value
    }

    emit('update:modelValue', result)
  }
})

const isActive = (name: any) => ({ 'is-active': editor.value?.isActive(name) })

//@ts-ignore
const editorHeaderBtns: ComputedRef<
  Array<{
    id: number
    icon: any
    click: () => boolean | null | undefined
    class: { 'is-active': boolean | undefined }
    disabled: boolean
  }>
> = computed(() =>
  editor.value
    ? [
        {
          id: 1,
          click: () => editor.value?.chain().focus().toggleBold().run(),
          class: isActive('bold'),
          icon: BoldIcon
        },
        {
          id: 2,
          click: () => editor.value?.chain().focus().toggleUnderline().run(),
          class: isActive('underline'),
          icon: UnderlineIcon
        },
        {
          id: 3,
          click: () => editor.value?.chain().focus().toggleItalic().run(),
          class: isActive('italic'),
          icon: ItalicIcon
        },
        {
          id: 4,
          click: () =>
            window.getSelection() &&
            editor.value?.commands.toggleLink({ href: window.getSelection()?.toString() ?? '' }),
          icon: LinkIcon,
          class: isActive('link')
        },
        {
          id: 5,
          click: () => {
            const url = window.prompt('URL')

            if (url) {
              editor.value?.chain().focus().setImage({ src: url }).run()
            }
          },
          icon: ImageIcon,
          class: isActive('image')
        },
        {
          id: 6,
          click: () => editor.value?.chain().focus().toggleBlockquote().run(),
          icon: BlockquoteIcon,
          class: isActive('blockquote')
        },
        {
          id: 7,
          click: () => editor.value?.chain().focus().setTextAlign('left').run(),
          icon: TextAlignLeftIcon,
          class: isActive({ textAlign: 'left' })
        },
        {
          id: 8,
          click: () => editor.value?.chain().focus().setTextAlign('center').run(),
          icon: TextAlignCenterIcon,
          class: isActive({ textAlign: 'center' })
        },
        {
          id: 9,
          click: () => editor.value?.chain().focus().setTextAlign('right').run(),
          icon: TextAlignRightIcon,
          class: isActive({ textAlign: 'right' })
        },
        {
          id: 10,
          click: () => editor.value?.chain().focus().setTextAlign('justify').run(),
          icon: TextFullIcon,
          class: isActive({ textAlign: 'justify' })
        },
        {
          id: 11,
          click: () => editor.value?.chain().focus().toggleBulletList().run(),
          icon: BulletListIcon,
          class: isActive('bulletList')
        },
        {
          id: 12,
          click: () => editor.value?.chain().focus().toggleOrderedList().run(),
          icon: OrderedListIcon,
          class: isActive('orderedList')
        },
        {
          id: 13,
          click: () => editor.value?.commands.indent(),
          icon: IndentIcon,
          class: isActive({ indent: 'indent' })
        },
        {
          id: 14,
          click: () => editor.value?.commands.outdent(),
          icon: OutdentIcon,
          class: isActive('outdent')
        },
        {
          id: 15,
          click: () => editor.value?.chain().focus().setHorizontalRule().run(),
          icon: HorizontalLineIcon
        },
        {
          id: 16,
          click: () => editor.value?.chain().focus().undo().run(),
          icon: UndoIcon,
          disabled: computed(() => !editor.value?.can().chain().focus().undo().run()).value
        },
        {
          id: 17,
          click: () => editor.value?.chain().focus().redo().run(),
          icon: RedoIcon,
          disabled: computed(() => !editor.value?.can().chain().focus().redo().run()).value
        }
      ]
    : []
)

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div v-if="editor" class="PskWYSIWYGEditor">
    <header class="PskWYSIWYGEditor__header">
      <div class="PskWYSIWYGEditor__label" v-if="label" :required="!!required">{{ label }}</div>
      <div class="PskWYSIWYGEditor__headerSlot">
        <slot />
      </div>
    </header>

    <div class="PskWYSIWYGEditor__main">
      <div class="PskWYSIWYGEditor__editorHeader">
        <button
          v-for="item of editorHeaderBtns"
          :key="item.id"
          type="button"
          :class="item.class || ''"
          :disabled="item.disabled"
          @click="item.click"
        >
          <component :is="item.icon" />
        </button>
      </div>
      <EditorContent class="editor__main-editor" :editor="editor" />
    </div>
  </div>
</template>

<style lang="scss">
.PskWYSIWYGEditor {
  width: 100%;
  grid-column: span 3;
}

.PskWYSIWYGEditor__header {
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 0 10px 0;
}

.PskWYSIWYGEditor__label {
  @include setFontStyle3();

  &[required='true'] {
    &::after {
      content: ' *';
      color: $c_danger;
    }
  }
}

.PskWYSIWYGEditor__main {
  width: 100%;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 4px;
  background-color: #fff;
  min-height: 134px;

  &__placeholder {
    color: #a8abb2;
    font-size: 13px;
  }

  .PskWYSIWYGEditor__editorHeader {
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(220, 223, 230, 0.32);
    margin-bottom: 8px;

    button {
      flex-shrink: 0;
      background-color: #fff;
      width: 28px;
      height: 28px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      position: relative;
      border-radius: 50%;

      &.is-active {
        background-color: #d9ecff;
      }
    }
  }

  padding: 10px;

  .ProseMirror {
    line-height: 20px;
    font-size: 13px;
    @for $i from 1 through 8 {
      [class='tt-indent-#{$i}'] {
        $val: $i * 3rem;
        padding-left: $val;
      }
    }

    img {
      max-width: 100%;
      height: auto;

      &.ProseMirror-selectednode {
        outline: 3px solid #68cef8;
      }
    }

    &:focus-visible {
      outline: none;
    }

    .ProseMirror-focused {
      border: none;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }

    p {
      &.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #a8abb2;
        pointer-events: none;
        font-size: 14px;
        height: 0;
      }
      width: 100%;
      height: 100%;
    }

    a {
      color: blue;
      cursor: pointer;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }
  }
}
</style>
