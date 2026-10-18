import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getPosts, createPost, updatePost, deletePost } from '../../api/posts'
import type { Post } from '../../types/Post'
import { formatDate } from '../../utils/format'
import { noXss } from '../../utils/sanitize'
import Icon from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Modal } from '../../components/ui/Modal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { MarkdownRenderer } from '../../components/MarkdownRenderer'
import { useToast } from '../../components/ui/Toast'

/**
 * 博客管理：新增 / 编辑 / 删除（删除二次确认），Markdown 编辑器实时预览。
 */

const postSchema = z.object({
  title: z.string().min(1, '请输入标题').refine(noXss, { message: '输入包含不允许的内容' }),
  summary: z.string().min(1, '请输入摘要').refine(noXss, { message: '输入包含不允许的内容' }),
  tags: z.string(),
  cover: z.string().min(1, '请输入封面图路径'),
  date: z.string().min(1, '请输入发布日期'),
  published: z.boolean(),
  content: z.string().min(1, '请输入正文内容')
})

type PostForm = z.infer<typeof postSchema>

interface PostEditorProps {
  post: Post | null
  onClose: () => void
  onSaved: () => void
}

function PostEditor({ post, onClose, onSaved }: PostEditorProps): JSX.Element {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          summary: post.summary,
          tags: post.tags.join(', '),
          cover: post.cover,
          date: post.date,
          published: post.published,
          content: post.content
        }
      : {
          title: '',
          summary: '',
          tags: '',
          cover: '/images/blog-1.svg',
          date: new Date().toISOString().slice(0, 10),
          published: true,
          content: ''
        }
  })

  const content = watch('content')

  const onSubmit = (data: PostForm) => {
    const payload = {
      title: data.title,
      summary: data.summary,
      tags: data.tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      cover: data.cover,
      date: data.date,
      published: data.published,
      content: data.content
    }
    if (post) {
      updatePost(post.id, payload)
      toast('博客已更新', 'success')
    } else {
      createPost(payload)
      toast('博客已创建', 'success')
    }
    onSaved()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={post ? '编辑博客' : '新增博客'}
      maxWidth="max-w-5xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            <Icon name="check" size={16} /> 保存
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="标题" error={errors.title?.message} {...register('title')} />
          <Input label="发布日期" type="date" error={errors.date?.message} {...register('date')} />
        </div>
        <Textarea label="摘要" rows={2} error={errors.summary?.message} {...register('summary')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="标签（逗号分隔）" placeholder="Vite, React, 设计系统" error={errors.tags?.message} {...register('tags')} />
          <Input label="封面图路径" error={errors.cover?.message} {...register('cover')} />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-steel bg-panel-2 accent-[#b8963e]" {...register('published')} />
          发布
        </label>

        {/* Markdown 编辑器 + 实时预览 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Textarea
            label="正文（Markdown）"
            rows={16}
            className="font-mono text-xs"
            error={errors.content?.message}
            {...register('content')}
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-dim">实时预览</span>
            <div className="max-h-[420px] overflow-y-auto rounded-panel border border-steel bg-panel-2/40 p-4">
              {content ? <MarkdownRenderer content={content} /> : <p className="text-sm text-ink-dim">输入内容后实时预览…</p>}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default function BlogManage(): JSX.Element {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>(() => getPosts())
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  const refresh = () => setPosts(getPosts())

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (post: Post) => {
    setEditing(post)
    setEditorOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deletePost(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
    toast('博客已删除', 'success')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-dim">共 {posts.length} 篇博客</p>
        <Button variant="primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> 新增博客
        </Button>
      </div>

      <Card className="divide-y divide-steel">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-ink">{post.title}</h3>
                {!post.published && (
                  <span className="rounded border border-danger/50 px-1.5 py-0.5 text-[10px] text-danger-bright">草稿</span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-ink-dim">{post.summary}</p>
              <p className="mt-1 font-mono text-xs text-ink-dim/70">
                {formatDate(post.date)} · {post.tags.join(' / ')}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(post)}>
                <Icon name="edit" size={14} /> 编辑
              </Button>
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(post)}>
                <Icon name="trash" size={14} /> 删除
              </Button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="p-6 text-center text-sm text-ink-dim">暂无博客</p>}
      </Card>

      {editorOpen && (
        <PostEditor
          post={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false)
            refresh()
          }}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="删除博客"
        message={`确定要删除「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
