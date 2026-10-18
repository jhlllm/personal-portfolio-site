import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getProfile, updateProfile } from '../../api/profile'
import { generateId } from '../../utils/format'
import { noXss } from '../../utils/sanitize'
import type { Profile } from '../../types/Profile'
import Icon, { type IconName } from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { useToast } from '../../components/ui/Toast'

/**
 * 个人信息管理表单：基本信息 + 社交链接 + 经历 + 教育背景。
 */

const socialSchema = z.object({
  label: z.string().min(1, '请输入名称'),
  url: z.string().min(1, '请输入链接'),
  icon: z.string().min(1, '请选择图标')
})

const experienceSchema = z.object({
  role: z.string().min(1, '请输入职位'),
  company: z.string().min(1, '请输入公司'),
  startDate: z.string().min(1, '请输入开始时间'),
  endDate: z.string().min(1, '请输入结束时间'),
  description: z.string().max(500, '描述过长')
})

const educationSchema = z.object({
  school: z.string().min(1, '请输入学校'),
  degree: z.string().min(1, '请输入学历'),
  startDate: z.string().min(1, '请输入开始时间'),
  endDate: z.string().min(1, '请输入结束时间'),
  description: z.string().max(500, '描述过长')
})

const profileSchema = z.object({
  name: z.string().min(1, '请输入姓名').max(40, '姓名过长').refine(noXss, { message: '输入包含不允许的内容' }),
  title: z.string().max(80, '职位过长').refine(noXss, { message: '输入包含不允许的内容' }),
  tagline: z.string().max(200, '一句话介绍过长').refine(noXss, { message: '输入包含不允许的内容' }),
  bio: z.string().max(2000, '简介过长').refine(noXss, { message: '输入包含不允许的内容' }),
  email: z.string().email('请输入有效邮箱'),
  location: z.string().max(100, '地址过长').refine(noXss, { message: '输入包含不允许的内容' }),
  resumeUrl: z.string().min(1, '请输入简历链接'),
  avatar: z.string().min(1, '请输入头像路径'),
  socials: z.array(socialSchema),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema)
})

type ProfileForm = z.infer<typeof profileSchema>

const ICON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'github', label: 'GitHub' },
  { value: 'mail', label: '邮箱' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'globe', label: '网页' },
  { value: 'terminal', label: '终端' }
]

function toFormValues(p: Profile): ProfileForm {
  return {
    name: p.name,
    title: p.title,
    tagline: p.tagline,
    bio: p.bio,
    email: p.email,
    location: p.location,
    resumeUrl: p.resumeUrl,
    avatar: p.avatar,
    socials: p.socials.map((s) => ({ label: s.label, url: s.url, icon: s.icon })),
    experiences: p.experiences.map((e) => ({
      role: e.role,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description
    })),
    education: p.education.map((ed) => ({
      school: ed.school,
      degree: ed.degree,
      startDate: ed.startDate,
      endDate: ed.endDate,
      description: ed.description
    }))
  }
}

export default function AdminSettings(): JSX.Element {
  const { toast } = useToast()
  const profile = getProfile()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile)
  })

  const socials = useFieldArray({ control, name: 'socials' })
  const experiences = useFieldArray({ control, name: 'experiences' })
  const education = useFieldArray({ control, name: 'education' })

  const onSubmit = (data: ProfileForm) => {
    const next: Profile = {
      id: profile.id,
      name: data.name,
      title: data.title,
      tagline: data.tagline,
      bio: data.bio,
      email: data.email,
      location: data.location,
      resumeUrl: data.resumeUrl,
      avatar: data.avatar,
      socials: data.socials.map((s) => ({ id: generateId('s'), label: s.label, url: s.url, icon: s.icon })),
      experiences: data.experiences.map((e) => ({
        id: generateId('e'),
        role: e.role,
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description
      })),
      education: data.education.map((ed) => ({
        id: generateId('ed'),
        school: ed.school,
        degree: ed.degree,
        startDate: ed.startDate,
        endDate: ed.endDate,
        description: ed.description
      }))
    }
    updateProfile(next)
    toast('个人信息已保存', 'success')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* 基本信息 */}
      <Card className="p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-ink">基本信息</h2>
        <div className="metal-divider my-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="姓名" error={errors.name?.message} {...register('name')} />
          <Input label="职位" error={errors.title?.message} {...register('title')} />
          <Input label="一句话介绍" error={errors.tagline?.message} {...register('tagline')} />
          <Input label="邮箱" error={errors.email?.message} {...register('email')} />
          <Input label="所在地" error={errors.location?.message} {...register('location')} />
          <Input label="头像路径" hint="根路径，如 /avatar.svg" error={errors.avatar?.message} {...register('avatar')} />
          <Input label="简历链接" hint="根路径，如 /resume.html" error={errors.resumeUrl?.message} {...register('resumeUrl')} />
        </div>
        <div className="mt-4">
          <Textarea label="个人简介" rows={5} error={errors.bio?.message} {...register('bio')} />
        </div>
      </Card>

      {/* 社交链接 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider text-ink">社交链接</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => socials.append({ label: '', url: '', icon: 'globe' })}
          >
            <Icon name="plus" size={14} /> 添加
          </Button>
        </div>
        <div className="metal-divider my-4" />
        <div className="space-y-3">
          {socials.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 items-end gap-3 rounded-panel border border-steel p-3 sm:grid-cols-[1fr_2fr_1fr_auto]">
              <Input label="名称" error={errors.socials?.[index]?.label?.message} {...register(`socials.${index}.label` as const)} />
              <Input label="链接" error={errors.socials?.[index]?.url?.message} {...register(`socials.${index}.url` as const)} />
              <Select
                label="图标"
                options={ICON_OPTIONS}
                error={errors.socials?.[index]?.icon?.message}
                {...register(`socials.${index}.icon` as const)}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => socials.remove(index)}
                aria-label="删除社交链接"
              >
                <Icon name="trash" size={14} />
              </Button>
            </div>
          ))}
          {socials.fields.length === 0 && <p className="text-sm text-ink-dim">暂无社交链接</p>}
        </div>
      </Card>

      {/* 经历 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider text-ink">经历时间线</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => experiences.append({ role: '', company: '', startDate: '', endDate: '', description: '' })}
          >
            <Icon name="plus" size={14} /> 添加
          </Button>
        </div>
        <div className="metal-divider my-4" />
        <div className="space-y-3">
          {experiences.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-panel border border-steel p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="职位" error={errors.experiences?.[index]?.role?.message} {...register(`experiences.${index}.role` as const)} />
                <Input label="公司" error={errors.experiences?.[index]?.company?.message} {...register(`experiences.${index}.company` as const)} />
                <Input label="开始时间" placeholder="2022-03" error={errors.experiences?.[index]?.startDate?.message} {...register(`experiences.${index}.startDate` as const)} />
                <Input label="结束时间" placeholder="至今" error={errors.experiences?.[index]?.endDate?.message} {...register(`experiences.${index}.endDate` as const)} />
              </div>
              <Textarea label="描述" rows={2} error={errors.experiences?.[index]?.description?.message} {...register(`experiences.${index}.description` as const)} />
              <div className="flex justify-end">
                <Button type="button" variant="danger" size="sm" onClick={() => experiences.remove(index)}>
                  <Icon name="trash" size={14} /> 删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 教育背景 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider text-ink">教育背景</h2>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => education.append({ school: '', degree: '', startDate: '', endDate: '', description: '' })}
          >
            <Icon name="plus" size={14} /> 添加
          </Button>
        </div>
        <div className="metal-divider my-4" />
        <div className="space-y-3">
          {education.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-panel border border-steel p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="学校" error={errors.education?.[index]?.school?.message} {...register(`education.${index}.school` as const)} />
                <Input label="学历" error={errors.education?.[index]?.degree?.message} {...register(`education.${index}.degree` as const)} />
                <Input label="开始时间" error={errors.education?.[index]?.startDate?.message} {...register(`education.${index}.startDate` as const)} />
                <Input label="结束时间" error={errors.education?.[index]?.endDate?.message} {...register(`education.${index}.endDate` as const)} />
              </div>
              <Textarea label="描述" rows={2} error={errors.education?.[index]?.description?.message} {...register(`education.${index}.description` as const)} />
              <div className="flex justify-end">
                <Button type="button" variant="danger" size="sm" onClick={() => education.remove(index)}>
                  <Icon name="trash" size={14} /> 删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg">
          <Icon name="check" size={16} /> 保存全部设置
        </Button>
      </div>
    </form>
  )
}
