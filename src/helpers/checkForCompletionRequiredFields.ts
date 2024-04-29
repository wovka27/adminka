export default (condition: boolean): { ok: boolean; reject_text?: string } =>
  condition
    ? {
        ok: false,
        reject_text: '"*" - Обязательные поля не заполнены'
      }
    : { ok: true }
