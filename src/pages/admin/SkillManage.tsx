import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api/skills'
import type { Skill } from '../../types/Skill'
import { noXss } from '../../utils/sanitize'
import Icon, { type IconName } from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { useToast } from '../../components/ui/Toast'

/**
 * 技能管理：新增 / 编辑 / 删除（删除二次确认）。
 */

const skillSchema = z.object({
  name: z.string().min(1, '请输入技能名称').refine(noXss, { message: '输入包含不允许的内容' }),
  category: z.string().min(1, '请输入分类').refine(noXss, { message: '输入包含不允许的内容' }),
  icon: z.string().min(1, '请选择图标'),
  level: z.coerce.number().min(0, '最低 0').max(100, '最高 100')
})

type SkillForm = z.infer<typeof skillSchema>

const ICON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'code', label: '代码' },
  { value: 'terminal', label: '终端' },
  { value: 'palette', label: '调色板' },
  { value: 'database', label: '数据库' },
  { value: 'bolt', label: '闪电' },
  { value: 'shield', label: '护盾' },
  { value: 'layers', label: '图层' },
  { value: 'folder', label: '文件夹' },
  { value: 'globe', label: '地球' },
  { value: 'settings', label: '齿轮' },
  { value: 'user', label: '用户' },
  { value: 'eye', label: '眼睛' }
]

interface SkillEditorProps {
  skill: Skill | null
  onClose: () => void
  onSaved: () => void
}

function SkillEditor({ skill, onClose, onSaved }: SkillEditorProps): JSX.Element {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill
      ? { name: skill.name, category: skill.category, icon: skill.icon, level: skill.level }
      : { name: '', category: '', icon: 'code', level: 80 }
  })

  const level = watch('level')

  const onSubmit = (data: SkillForm) => {
    const payload = {
      name: data.name,
      category: data.category,
      icon: data.icon,
      level: Math.round(data.level)
    }
    if (skill) {
      updateSkill(skill.id, payload)
      toast('技能已更新', 'success')
    } else {
      createSkill(payload)
      toast('技能已创建', 'success')
    }
    onSaved()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={skill ? '编辑技能' : '新增技能'}
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
          <Input label="技能名称" error={errors.name?.message} {...register('name')} />
          <Input label="分类" placeholder="如：前端核心" error={errors.category?.message} {...register('category')} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="图标" options={ICON_OPTIONS} error={errors.icon?.message} {...register('icon')} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
              熟练度（{level}%）
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full border border-steel bg-panel-2 accent-[#b8963e]"
              {...register('level', { valueAsNumber: true })}
            />
            {errors.level && <p className="text-xs text-danger-bright">{errors.level.message}</p>}
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default function SkillManage(): JSX.Element {
  const { toast } = useToast()
  const [skills, setSkills] = useState<Skill[]>(() => getSkills())
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)

  const refresh = () => setSkills(getSkills())

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (skill: Skill) => {
    setEditing(skill)
    setEditorOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteSkill(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
    toast('技能已删除', 'success')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-dim">共 {skills.length} 项技能</p>
        <Button variant="primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> 新增技能
        </Button>
      </div>

      <Card className="divide-y divide-steel">
        {skills.map((skill) => (
          <div key={skill.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-panel border border-gold/40 text-gold">
              <Icon name={skill.icon as IconName} size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-ink">{skill.name}</h3>
                <span className="rounded border border-steel px-1.5 py-0.5 text-[11px] text-ink-dim">{skill.category}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full border border-steel bg-panel-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-dim to-gold-bright"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gold-bright">{skill.level}%</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(skill)}>
                <Icon name="edit" size={14} /> 编辑
              </Button>
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(skill)}>
                <Icon name="trash" size={14} /> 删除
              </Button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="p-6 text-center text-sm text-ink-dim">暂无技能</p>}
      </Card>

      {editorOpen && (
        <SkillEditor
          skill={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false)
            refresh()
          }}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="删除技能"
        message={`确定要删除「${deleteTarget?.name ?? ''}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
