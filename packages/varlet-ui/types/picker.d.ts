import type { App } from 'vue'
import { VarComponent, BasicAttributes, ListenerProp } from './varComponent'
import { VNode } from 'vue'

export declare const pickerProps: Record<string, any>

export interface NormalColumn extends BasicAttributes {
  texts: Texts
  initialIndex?: number
}

export interface CascadeColumn {
  [textKey: string]: any
  children: CascadeColumn[]
}

export type Texts = any[]

export interface PickerProps {
  columns?: NormalColumn[] | CascadeColumn[] | Texts
  title?: string
  textKey?: string
  toolbar?: boolean
  cascade?: boolean
  cascadeInitialIndexes?: number[]
  textFormatter?: (text: any, columnIndex: number) => any
  optionHeight?: string | number
  optionCount?: string | number
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonTextColor?: string
  cancelButtonTextColor?: string
  onChange?: ListenerProp<(texts: Texts, indexes: number[]) => void>
  onConfirm?: ListenerProp<(texts: Texts, indexes: number[]) => void>
  onCancel?: ListenerProp<(texts: Texts, indexes: number[]) => void>
}

export class PickerComponent extends VarComponent {
  $props: PickerProps

  $slots: {
    cancel(): VNode[]
    title(): VNode[]
    confirm(): VNode[]
  }

  confirm(): void

  cancel(): void
}

export type PickerActions = 'confirm' | 'cancel' | 'close'

export interface PickerResolvedData {
  state: PickerActions
  texts?: Texts
  indexes?: number[]
}

export interface PickerOptions {
  columns: NormalColumn | CascadeColumn | Texts
  title?: string
  textKey?: string
  toolbar?: boolean
  cascade?: boolean
  cascadeInitialIndexes?: number[]
  optionHeight?: number | string
  optionCount?: number | string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonTextColor?: string
  cancelButtonTextColor?: string
  textFormatter?: (text: any, columnIndex: number) => any
  safeArea?: boolean
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onChange?: (texts: Texts, indexes: number[]) => void
  onConfirm?: (texts: Texts, indexes: number[]) => void
  onCancel?: (texts: Texts, indexes: number[]) => void
}

export interface IPicker {
  (options: PickerOptions | Texts): Promise<PickerResolvedData>
  Component: typeof PickerComponent

  install(app: App): void

  close(): void
}

export const Picker: IPicker

export class _PickerComponent extends PickerComponent {}
