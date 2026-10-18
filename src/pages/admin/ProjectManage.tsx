import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getProjects, createProject, updateProject, deleteProject } from '../../api/projects'
import type { Project } from '../../types/Project'
import { formatDate } from '../../utils/format'
import { noXss } from '../../utils/sanitize'
import Icon from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Modal } from '../../components/ui/Modal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { useToast } from '../../components/ui/Toast'

/**
 * 项目管理：新增 / 编辑 / 删除（删除二次确认）。
 */

const projectSchema = z.object({
  title: z.string().min(1, '请输入标题').refine(noXss, { message: '输入包含不允许的内容' }),
  description: z.string().min(1, '请输入描述').refine(noXss, { message: '输入包含不允许的内容' }),
  tags: z.string(),
  cover: z.string().min(1, '请输入封面图路径'),
  githubUrl: z.string(),
  demoUrl: z.string(),
  featured: z.boolean(),
  createdAt: z.string().min(1, '请输入创建日期'),
  content: z.string()
})

type ProjectForm = z.infer<typeof projectSchema>

interface ProjectEditorProps {
  project: Project | null
  onClose: () => void
  onSaved: () => void
}

function ProjectEditor({ project, onClose, onSaved }: ProjectEditorProps): JSX.Element {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title: project.title,
          description: project.description,
          tags: project.tags.join(', '),
          cover: project.cover,
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl,
          featured: project.featured,
          createdAt: project.createdAt,
          content: project.content
        }
      : {
          title: '',
          description: '',
          tags: '',
          cover: '/images/project-1.svg',
          githubUrl: '',
          demoUrl: '',
          featured: false,
          createdAt: new Date().toISOString().slice(0, 10),
          content: ''
        }
  })

  const onSubmit = (data: ProjectForm) => {
    const payload = {
      title: data.title,
      description: data.description,
      tags: data.tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      cover: data.cover,
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      featured: data.featured,
      createdAt: data.createdAt,
      content: data.content
    }
    if (project) {
      updateProject(project.id, payload)
      toast('项目已更新', 'success')
    } else {
      createProject(payload)
      toast('项目已创建', 'success')
    }
    onSaved()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={project ? '编辑项目' : '新增项目'}
      maxWidth="max-w-2xl"
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
          <Input label="创建日期" type="date" error={errors.createdAt?.message} {...register('createdAt')} />
        </div>
        <Textarea label="描述" rows={2} error={errors.description?.message} {...register('description')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="标签（逗号分隔）" error={errors.tags?.message} {...register('tags')} />
          <Input label="封面图路径" error={errors.cover?.message} {...register('cover')} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="GitHub 链接" placeholder="https://github.com/..." error={errors.githubUrl?.message} {...register('githubUrl')} />
          <Input label="预览链接" placeholder="https://..." error={errors.demoUrl?.message} {...register('demoUrl')} />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-steel bg-panel-2 accent-[#b8963e]" {...register('featured')} />
          设为精选项目
        </label>
        <Textarea label="详情（Markdown，可选）" rows={6} className="font-mono text-xs" error={errors.content?.message} {...register('content')} />
      </form>
    </Modal>
  )
}

export default function ProjectManage(): JSX.Element {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>(() => getProjects())
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const refresh = () => setProjects(getProjects())

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setEditorOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteProject(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
    toast('项目已删除', 'success')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-dim">共 {projects.length} 个项目</p>
        <Button variant="primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> 新增项目
        </Button>
      </div>

      <Card className="divide-y divide-steel">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="h-14 w-24 shrink-0 overflow-hidden rounded-panel border border-steel bg-panel-2">
              <img src={project.cover} alt={`${project.title} 封面`} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-ink">{project.title}</h3>
                {project.featured && (
                  <span className="rounded border border-gold/50 px-1.5 py-0.5 text-[10px] text-gold-bright">精选</span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-ink-dim">{project.description}</p>
              <p className="mt-1 font-mono text-xs text-ink-dim/70">
                {formatDate(project.createdAt)} · {project.tags.join(' / ')}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(project)}>
                <Icon name="edit" size={14} /> 编辑
              </Button>
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(project)}>
                <Icon name="trash" size={14} /> 删除
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="p-6 text-center text-sm text-ink-dim">暂无项目</p>}
      </Card>

      {editorOpen && (
        <ProjectEditor
          project={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false)
            refresh()
          }}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="删除项目"
        message={`确定要删除「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
