export default (v: WDVT[]) => v.flatMap((it) => it.day.reduce<RType[]>((a, i) => [...a, { ...it, day: i }], []))

export type WorkingDaysValueType = {
  day: string[]
  open_at: string
  close_at: string
}

export type WorkingDaysValueForRequestReturnType = {
  day: string
  open_at: string
  close_at: string
}

type RType = WorkingDaysValueForRequestReturnType
type WDVT = WorkingDaysValueType
