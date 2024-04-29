export default (date: Date, use_time?: boolean) => {
  const _date = date.toLocaleDateString('ru').split('.').reverse().join('-')
  const _time = date.toLocaleTimeString('ru')

  return use_time ? _date + ' ' + _time : _date
}
