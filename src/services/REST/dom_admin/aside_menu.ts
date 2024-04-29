import api from '@/services/REST/utils/dom_admin'

export const fetchGetAsideMenu = async () => {
  return await api.get<MenuType[]>('admin/menu')
}

export type MenuType = IMenuParent | IMenuItem

export interface IMenuParent {
  title: string
  children: IMenuItem[]
  has_underline: string
  slug: string
}

export interface IMenuItem {
  title: string
  slug: string
  docs_link: string
  has_underline: string
}
