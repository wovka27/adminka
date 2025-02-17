export interface IAggregatorItem {
  type: ResponseAggregatorKey
  label: string
  uid: string
}

export interface IMedia {
  uid: string
  type: string
  name: string
  action?: 'attach' | 'detach'
  attached_at: string
  files: {
    uid: string
    type: string
    file: string
    is_preview: boolean
  }[]
}

export interface IMaterialType {
  code: string
  type: string
  name: string
  plural_name: string
  plural_type: string
  is_multiple: boolean
}

export interface IImage {
  uid: string
  name: string
  path: string
  previews: {
    extra_small: string
    small: string
    medium: string
    large: string
  }
}
