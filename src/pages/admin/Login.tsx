import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import StarBackground from '../../components/StarBackground'

/**
 * 后台登录页：账号密码登录。
 * 登录态存储在 localStorage（模拟 token），密码不明文存储。
 */

const loginSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码')
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login(): JSX.Element {
  const { isAuthed, login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  })

  // 已登录则直接进入后台
  if (isAuthed) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = (data: LoginForm) => {
    const result = login(data.username, data.password)
    if (result.ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('root', { message: result.message ?? '登录失败' })
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <StarBackground />
      <Card className="relative z-10 w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-panel border border-gold/50 text-gold shadow-metal-glow">
            <Icon name="skull" size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-bold uppercase tracking-[0.2em] text-ink">控制中枢</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gold/70">Admin Console</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="账号"
            placeholder="admin"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="密码"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root && (
            <p className="flex items-center gap-1.5 text-sm text-danger-bright">
              <Icon name="alert" size={14} /> {errors.root.message}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? '验证中…' : '登录'}
          </Button>
        </form>

        <p className="mt-5 border-t border-steel pt-4 text-center font-mono text-xs text-ink-dim/70">
          演示账号：admin / admin123
        </p>
      </Card>
    </div>
  )
}
