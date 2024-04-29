import type {
  WorkingDaysValueForRequestReturnType as ReturnValueType,
  WorkingDaysValueType as ValueType
} from '@/helpers/conversionWorkDayForRequest'

export default (v: ReturnValueType[]): ValueType[] =>
  [...new Set(v.map((i) => i.open_at))].map((i) =>
    v.reduce<ValueType>(
      (a, itm) => (itm.open_at === i ? { ...a, ...itm, day: itm.day ? [...(a['day'] || []), itm.day] : [] } : a),
      Object.create(null)
    )
  )
