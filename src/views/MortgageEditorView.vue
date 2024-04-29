<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormLayout from '@/layouts/FormLayout.vue'

import DefaultFormFields from '@/components/DefaultFormFields.vue'

import useEditorView from '@/composables/app/useEditorView'
import useRefs from '@/composables/app/useRefs'

import { fetchCreateMortgage, fetchGetMortgage, fetchUpdateMortgage } from '@/services/REST/dom_admin/mortgage'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getNumString from '@/helpers/getNumString'

const router = useRouter()
const refs = useRefs('banks', 'bank-programs')

const { apply, is_data_loaded, default_fields } = useEditorView({
  router,
  back_route_name: 'mortgage_list',
  default_fields: true,
  fetchGetEntity: fetchGetMortgage,
  apply: {
    create: {
      fetchCreateEntity: fetchCreateMortgage,
      success_message: 'Программа успешно создана'
    },
    update: {
      fetchUpdateEntity: fetchUpdateMortgage
    }
  },
  setFormData: (form_data) => {
    name.value = form_data.name || ''
    bank.value = form_data.bank || ''
    program.value = form_data.program || ''
    base_rate.value = getNumString(form_data.base_rate)
    min_annual_fee.value = getNumString(form_data.min_annual_fee)
    min_mortgage_term.value = getNumString(form_data.min_mortgage_term)
    max_mortgage_term.value = getNumString(form_data.max_mortgage_term)
    max_amount.value = getNumString(form_data.max_amount)
    min_amount.value = getNumString(form_data.min_amount)
    subsidized_rate.value = getNumString(form_data.subsidized_rate)
    subsidy_period.value = getNumString(form_data.subsidy_period)
    description.value = form_data.description || ''
    calc_program_id.value = getNumString(form_data.calc_program_id)
    program_type.value = form_data.program_type || ''
    is_public.value = !!form_data.is_public
  },
  getRequestData: () => ({
    name: name.value,
    bank: bank.value,
    program: program.value,
    base_rate: +base_rate.value,
    min_annual_fee: +min_annual_fee.value,
    min_mortgage_term: +min_mortgage_term.value,
    max_mortgage_term: +max_mortgage_term.value,
    max_amount: +max_amount.value,
    min_amount: +min_amount.value,
    subsidized_rate: subsidized_rate.value && +subsidized_rate.value,
    ...(subsidy_period.value && { subsidy_period: +subsidy_period.value }),
    description: description.value,
    calc_program_id: calc_program_id.value,
    program_type: program_type.value,
    is_public: is_public.value
  }),
  mount: {
    create: {
      app_header_props: {
        title: `Добавить программу`,
        breadcrumbs: [
          {
            label: 'Способы покупки',
            route: getHandleBackArgs('mortgage_list')
          },
          { label: `Добавить программу` }
        ]
      }
    },
    common: {
      app_header_props: ([response_mortgage]) => ({
        title: response_mortgage.name,
        breadcrumbs: [
          {
            label: 'Способы покупки',
            route: getHandleBackArgs('mortgage_list')
          },
          { label: response_mortgage.name }
        ]
      })
    }
  }
})

const name = ref('')
const bank = ref('')
const program = ref('')
const min_annual_fee = ref('')
const base_rate = ref('')
const min_mortgage_term = ref('')
const max_mortgage_term = ref('')
const max_amount = ref('')
const min_amount = ref('')
const subsidized_rate = ref('')
const subsidy_period = ref('')
const description = ref('')
const calc_program_id = ref('')
const program_type = ref('От банка')
const is_public = ref(false)
</script>

<template>
  <FormLayout v-if="is_data_loaded" :apply="apply">
    <div class="MortgageEditorView">
      <DefaultFormFields v-model="default_fields" is_show_dates />

      <div class="MortgageEditorView__boxFields1 gridForm">
        <PskInput style="grid-column: span 2" v-model="name" label="Название" required placeholder="Введите название" />
        <div style="grid-column: span 2" class="MortgageEditorView__wrap">
          <h1 style="grid-column: span 2" class="MortgageEditorView__h1">Условия ипотеки</h1>
          <div class="flex">
            <PskTabSelect v-model="program_type" :options="['От банка', 'Субсидия']" />
            <PskSwitch v-model="is_public" label="Публичная" />
          </div>
          <PskSelect
            v-model="program"
            label="Программа"
            required
            :options="refs.bank_programs"
            options_value="value"
            options_label="label"
          />
          <PskSelect v-model="bank" label="Банк" required :options="refs.banks" />
          <PskInput
            v-model="min_annual_fee"
            label="Минимальный перв. взнос, %"
            required
            type="percent"
            placeholder="Введите ПВ"
          />
          <PskInput v-model="base_rate" label="Базовая ставка, %" required type="number" placeholder="Введите ставку" />
          <PskInput
            v-if="program_type === 'Субсидия'"
            v-model="subsidy_period"
            label="Льготный период, мес."
            type="number"
            placeholder="Введите срок"
          />
          <PskInput
            v-if="program_type === 'Субсидия'"
            v-model="subsidized_rate"
            label="Ставка льготного периода, %"
            type="percent"
            placeholder="Введите ставку"
          />

          <PskInputRange
            v-model:max="max_mortgage_term"
            v-model:min="min_mortgage_term"
            type="number"
            label="Срок ипотеки, мес."
            required
            placeholder_min="от 36"
            placeholder_max="до 600"
          />
          <PskInputRange
            v-model:max="max_amount"
            v-model:min="min_amount"
            type="cash"
            label="Сумма кредита, ₽"
            required
            placeholder_min="от 100 000"
            placeholder_max="до 100 000 000"
          />

          <PskInput
            v-model="calc_program_id"
            label="ID программы в калькуляторе"
            type="number"
            placeholder="Введите ID"
          />
        </div>
        <PskWYSIWYGEditor style="grid-column: span 3" v-model="description" label="Описание" />
      </div>
    </div>
  </FormLayout>
</template>

<style lang="scss">
.MortgageEditorView {
  height: 100%;
}

.MortgageEditorView__boxFields1 {
  margin: 20px 0 0 0;
}

.MortgageEditorView__FormSite {
  margin: 20px 0 0 0;
}

.MortgageEditorView__h1 {
  grid-column: span 3;
  @include setFontStyle6();
  margin: 50px 0 10px 0;
}

.flex {
  grid-column: span 2;
  display: flex;
  column-gap: 30px;
  align-items: flex-end;
}

.MortgageEditorView__wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 30px;
}
</style>
