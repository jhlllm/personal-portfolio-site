import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getProfile } from '../api/profile'
import { safeRead, safeWrite } from '../api/storage'
import { generateId } from '../utils/format'
import Icon, { type IconName } from '../components/ui/Icon'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { useToast } from '../components/ui/Toast'

/**
 * 联系模块：可复制邮箱 + 社交链接 + 联系表单（zod 校验 + 提交反馈）。
 */

const contactSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符').max(50, '姓名过长'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z.string().min(2, '主题至少 2 个字符').max(100, '主题过长'),
  message: z.string().min(10, '内容至少 10 个字符').max(2000, '内容过长')
})

type ContactForm = z.infer<typeof contactSchema>

interface StoredMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 继续走降级方案
  }
  // 降级：临时 textarea + execCommand
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function Contact(): JSX.Element {
  const profile = getProfile()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' }
  })

  const handleCopyEmail = async () => {
    const ok = await copyText(profile.email)
    if (ok) {
      setCopied(true)
      toast('邮箱地址已复制', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } else {
      toast('复制失败，请手动复制', 'error')
    }
  }

  const onSubmit = (data: ContactForm) => {
    const messages = safeRead<StoredMessage[]>('messages', [])
    const next: StoredMessage = {
      id: generateId('msg'),
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString()
    }
    const ok = safeWrite('messages', [next, ...messages])
    if (ok) {
      toast('消息已发送，感谢您的联系！', 'success')
      reset()
    } else {
      toast('发送失败，请稍后重试', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="imperial-tag">Contact</span>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-wider text-ink">联系我</h1>
        <div className="metal-divider mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 联系信息 */}
        <Card className="h-fit p-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-ink">联系方式</h2>
          <div className="metal-divider my-4" />

          {/* 邮箱复制 */}
          <div className="flex items-center justify-between rounded-panel border border-steel bg-panel-2/50 px-3 py-2.5">
            <span className="flex items-center gap-2 truncate text-sm text-ink">
              <Icon name="mail" size={16} className="text-gold" />
              <span className="truncate">{profile.email}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="ml-2 flex shrink-0 items-center gap-1 rounded border border-gold/50 px-2 py-1 text-xs font-semibold text-gold hover:border-gold hover:shadow-metal-glow transition-all"
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} />
              {copied ? '已复制' : '复制'}
            </button>
          </div>

          {/* 社交链接 */}
          <div className="mt-5 space-y-2">
            {profile.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-panel border border-steel px-3 py-2.5 text-sm text-ink-dim hover:text-ink hover:border-silver hover:shadow-metal-silver-glow transition-all"
              >
                <Icon name={s.icon as IconName} size={16} className="text-gold" />
                <span>{s.label}</span>
                <Icon name="external" size={13} className="ml-auto text-ink-dim" />
              </a>
            ))}
          </div>
        </Card>

        {/* 联系表单 */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold uppercase tracking-wider text-ink">发送消息</h2>
          <div className="metal-divider my-4" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="姓名" placeholder="您的姓名" error={errors.name?.message} {...register('name')} />
              <Input label="邮箱" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            </div>
            <Input label="主题" placeholder="消息主题" error={errors.subject?.message} {...register('subject')} />
            <Textarea
              label="内容"
              rows={6}
              placeholder="想说的话…"
              error={errors.message?.message}
              {...register('message')}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                <Icon name="send" size={16} /> 发送消息
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
