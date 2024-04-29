import type { IMaterialType, IMedia } from './common_types'

import api from '@/services/REST/utils/dom_admin'

export const fetchGetMaterialsByType = async (material_type: string, meta: IMeta) => {
  return await api.get<IUseMeta<IMedia[]>>(`admin/media/materials/by-type/${material_type}`, {
    page: meta.page_current,
    per_page: meta.page_per
  })
}

export const fetchUploadMediaFile = async (request_data: any) => {
  return await api.post<IUploadedMediaFile>('admin/media/files', request_data, null, {
    headers: {
      Accept: 'application/json'
    }
  })
}

export const fetchGetMaterialTypes = async (type: string) => {
  return await api.get<IMaterialType[]>(`admin/media/materiables/${type}/material-types`)
}

export const fetchCreateMaterial = async (request_data: any) => {
  return await api.post<IMedia>('admin/media/materials/', request_data)
}

export const fetchAttachMaterial = async (object: string, object_uid: string, material_uid: string) => {
  return await api.post(`admin/media/materiables/${object}/${object_uid}/material/${material_uid}`)
}

export const fetchDetachMaterial = async (object: string, object_uid: string, material_uid: string) => {
  return await api.delete(`admin/media/materiables/${object}/${object_uid}/material/${material_uid}`)
}

export interface IUploadedMediaFile {
  uid: string
  type: string
  file: string
}
