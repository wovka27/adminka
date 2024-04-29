import api from '@/services/REST/utils/dom_admin'

export const fetchGetPresetList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<IPresetListItem[]>>('admin/integrations/presets', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetPreset = async (uid: string) => {
  return await api.get<IPreset>(`admin/integrations/presets/${uid}`)
}
export const fetchDeletePreset = async (uid: string) => {
  return await api.delete<IPreset>(`admin/integrations/presets/${uid}`)
}

export const fetchUpdatePreset = async (uid: string, request_data: any) => {
  return await api.put<IPreset>(`admin/integrations/presets/${uid}`, request_data)
}

export const fetchCreatePreset = async (request_data: any) => {
  return await api.post<IPreset>(`admin/integrations/presets`, request_data)
}
export const fetchGetPresetTypes = async () => {
  return await api.get<IPresetType[]>(`admin/integrations/types`)
}

export const fetchStartWorkPreset = async (uid: string) => {
  return await api.put<{ message: string }>(`admin/integrations/${uid}/work`)
}

export interface IPresetListItem {
  uid: string
  title: string
  type: string
}

export interface IPreset {
  uid: string
  type: string
  type_code: string
  title: string
  settings: IPresetSettingsItem[]
  value: any
}

export interface IPresetSettingsItem {
  type: string
  rules: string
  value: string
  is_multiple?: boolean
  title: string
  is_data_field: boolean
  code: string
  name: string
}

export interface IPresetType {
  label: string
  settings_template: IPresetTypeSettingTemplate[]
  value: string
}

export interface IPresetTypeSettingTemplate {
  type: string
  rules: string
  title: string
  is_multiple?: boolean
  is_data_field: boolean
  code: string
  name: string
  value: any
}

export interface IPresetTypeSettingTemplateLongString extends IPresetTypeSettingTemplate {
  type: 'long-string'
  value: string
}

export interface IPresetTypeSettingTemplateInt extends IPresetTypeSettingTemplate {
  type: 'int'
  value: string
}

export interface IPresetTypeSettingTemplateShortString extends IPresetTypeSettingTemplate {
  type: 'short-string'
  value: string
}

export interface IPresetTypeSettingTemplateBool extends IPresetTypeSettingTemplate {
  type: 'bool'
  value: boolean
}
export interface IPresetTypeSettingTemplateGroup {
  'long-string': IPresetTypeSettingTemplateLongString[]
  'short-string': IPresetTypeSettingTemplateShortString[]
  bool: IPresetTypeSettingTemplateBool[]
  int: IPresetTypeSettingTemplateInt[]
}
