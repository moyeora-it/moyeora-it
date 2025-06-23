'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { WriteForm } from '@/types';
import { EmojiReplacer } from '@tiptap-extend/emoji-replacer';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Typography from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { emojiRules } from './emojiRules';

const tiptapStyleExtensions = [
  Heading.configure({
    HTMLAttributes: {
      class: 'text-xl font-bold capitalize',
      levels: [2],
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: 'border-l-6 pl-2 border-gray-400',
    },
  }),
  // Bold,
  // Italic,
  ListItem,
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc ml-2',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal ml-2',
    },
  }),
  Code.configure({
    HTMLAttributes: {
      class: 'bg-gray-100 py-[1px] px-1 rounded-sm text-[inherit]',
    },
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: 'my-[10px]',
    },
  }),
  CodeBlock.configure({
    HTMLAttributes: {
      class: 'bg-gray-100 p-3 rounded-sm',
    },
  }),
  TaskItem.configure({
    nested: true,
  }),
  TaskList.configure({
    itemTypeName: 'taskItem',
    HTMLAttributes: {
      class: 'bg-red',
    },
  }),
  EmojiReplacer.configure({
    ruleConfigs: emojiRules,
    shouldUseExtraReplacementSpace: false,
  }),
];

type DescriptionProps = {
  form: UseFormReturn<WriteForm>;
};

export const Description = ({ form }: DescriptionProps) => {
  const hasError = !!form.formState.errors.description;

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      EmojiReplacer,
      ...tiptapStyleExtensions,
    ],
    editorProps: {
      attributes: {
        class: clsx(
          'h-[500px] overflow-y-auto w-full mt-0 py-2 px-3 text-sm rounded-md border border-input bg-background ring-offset-background shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
          hasError
            ? 'text-red-500 border-red-500 focus-visible:ring-red-500/20'
            : 'focus-visible:border-ring focus-visible:ring-ring/50',
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    /** useForm으로 만든 form의 상태 업데이트. 렌더링과는 무관한 로직으로 useEffect에서 관리 */
    const descriptionStateUpdate = () =>
      editor.on('update', () => form.setValue('description', editor.getHTML()));

    descriptionStateUpdate();

    return () => {
      editor.off('update', descriptionStateUpdate);
    };
  }, [editor, form]);

  return (
    <FormField
      control={form.control}
      name="description"
      render={() => (
        <FormItem className="block h-[500px]  bg-gray-100 rounded">
          <FormControl>
            <EditorContent editor={editor} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
