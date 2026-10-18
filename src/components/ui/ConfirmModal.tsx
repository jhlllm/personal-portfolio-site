import { Modal } from './Modal'
import { Button } from './Button'
import Icon from './Icon'

/**
 * 二次确认弹窗：所有删除操作统一使用。
 */
interface ConfirmModalProps {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title = '确认操作',
  message,
  confirmText = '确认删除',
  onConfirm,
  onCancel
}: ConfirmModalProps): JSX.Element {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            取消
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <span className="text-danger-bright mt-0.5">
          <Icon name="alert" size={20} />
        </span>
        <p className="text-ink text-sm leading-relaxed">{message}</p>
      </div>
    </Modal>
  )
}
