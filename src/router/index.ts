import { createRouter, createWebHistory } from 'vue-router'

import { useAppStateStore } from '@/stores'

import ApartmentsEditorView from '@/views/ApartmentsEditorView.vue'
import ApartmentsListView from '@/views/ApartmentsListView.vue'
import CommercialEditorView from '@/views/CommercialEditorView.vue'
import CommercialListView from '@/views/CommercialListView.vue'
import CompilationEditorView from '@/views/CompilationEditorView.vue'
import CompilationListView from '@/views/CompilationListView.vue'
import ComplexEditorView from '@/views/ComplexEditorView.vue'
import ComplexListView from '@/views/ComplexListView.vue'
import DynamicsEditorView from '@/views/DynamicsEditorView.vue'
import DynamicsView from '@/views/DynamicsView.vue'
import EntranceEditorView from '@/views/EntranceEditorView.vue'
import EntranceListView from '@/views/EntranceListView.vue'
import FeedEditorView from '@/views/FeedEditorView.vue'
import FeedView from '@/views/FeedView.vue'
import FlatEditorView from '@/views/FlatEditorView.vue'
import FlatListView from '@/views/FlatListView.vue'
import GroupCompanyEditorView from '@/views/GroupCompanyEditorView.vue'
import GroupCompanyListView from '@/views/GroupCompanyListView.vue'
import HouseEditorView from '@/views/HouseEditorView.vue'
import HouseListView from '@/views/HouseListView.vue'
import InfrastructureCategoryEditorView from '@/views/InfrastructureCategoryEditorView.vue'
import InfrastructureCategoryView from '@/views/InfrastructureCategoryView.vue'
import InfrastructureElementEditorView from '@/views/InfrastructureElementEditorView.vue'
import InfrastructureElementView from '@/views/InfrastructureElementView.vue'
import LegalEntityEditorView from '@/views/LegalEntityEditorView.vue'
import LegalEntityListView from '@/views/LegalEntityListView.vue'
import LoginView from '@/views/LoginView.vue'
import MortgageEditorView from '@/views/MortgageEditorView.vue'
import MortgageView from '@/views/MortgageView.vue'
import PantryEditorView from '@/views/PantryEditorView.vue'
import PantryListView from '@/views/PantryListView.vue'
import ParkingEditorView from '@/views/ParkingEditorView.vue'
import ParkingListView from '@/views/ParkingListView.vue'
import PlanMainEditorView from '@/views/PlanMainEditorView.vue'
import PlanMainListView from '@/views/PlanMainListView.vue'
import PlanRelativesEditorView from '@/views/PlanRelativesEditorView.vue'
import PlanRelativesListView from '@/views/PlanRelativesListView.vue'
import PresetsView from '@/views/PresetsView.vue'
import PromotionCategoryEditorView from '@/views/PromotionCategoryEditorView.vue'
import PromotionCategoryView from '@/views/PromotionCategoryView.vue'
import PromotionElementEditorView from '@/views/PromotionElementEditorView.vue'
import PromotionElementListView from '@/views/PromotionElementListView.vue'
import TagsEditorView from '@/views/TagsEditorView.vue'
import TagsView from '@/views/TagsView.vue'

//prettier-ignore
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/complexes' },

    { path: '/:catchAll(.*)', redirect: '/complexes'},

    { path: '/login', component: LoginView },

    { path: '/real_estate_developers_group_companies', component: GroupCompanyListView, meta: { layout: 'default' }, name: 'group_company_list' },
    { path: '/real_estate_developers_group_companies/:uid', component: GroupCompanyEditorView, meta: { layout: 'default' }, name: 'group_company' },
    { path: '/real_estate_developers_legal_entities', component: LegalEntityListView, meta: { layout: 'default' }, name: 'legal_entity_list' },
    { path: '/real_estate_developers_legal_entities/:uid', component: LegalEntityEditorView, meta: { layout: 'default' }, name: 'legal_entity' },

    { path: '/complexes', component: ComplexListView, meta: { layout: 'default' }, name: 'complex_list' },
    { path: '/complexes/:uid/:aggregator_uid?', component: ComplexEditorView, meta: { layout: 'default' }, name: 'complex' },

    { path: '/houses', component: HouseListView, meta: { layout: 'default' }, name: 'house_list' },
    { path: '/houses/:uid/:aggregator_uid?', component: HouseEditorView, meta: { layout: 'default' }, name: 'house' },

    { path: '/entrances', component: EntranceListView, meta: { layout: 'default' }, name: 'entrance_list' },
    { path: '/entrances/:uid', component: EntranceEditorView, meta: { layout: 'default' }, name: 'entrance' },

    { path: '/plans_main', component: PlanMainListView, meta: { layout: 'default' }, name: 'plan_main_list' },
    { path: '/plans_main/:uid', component: PlanMainEditorView, meta: { layout: 'default' }, name: 'plan_main' },

    { path: '/plans_relatives', component: PlanRelativesListView, meta: { layout: 'default' }, name: 'plan_relatives_list' },
    { path: '/plans_relatives/:uid', component: PlanRelativesEditorView, meta: { layout: 'default' }, name: 'plan_relatives' },

    { path: '/real_properties_parking', component: ParkingListView, meta: { layout: 'default' }, name: 'parking_list' },
    { path: '/real_properties_parking/:uid/:aggregator_uid?', component: ParkingEditorView, meta: { layout: 'default' }, name: 'parking' },
    { path: '/real_properties_pantries', component: PantryListView, meta: { layout: 'default' }, name: 'pantry_list' },
    { path: '/real_properties_pantries/:uid/:aggregator_uid?', component: PantryEditorView, meta: { layout: 'default' }, name: 'pantry' },
    { path: '/real_properties_flats', component: FlatListView, meta: { layout: 'default' }, name: 'flat_list' },
    { path: '/real_properties_flats/:uid/:aggregator_uid?', component: FlatEditorView, meta: { layout: 'default' }, name: 'flat' },
    { path: '/real_properties_commercials', component: CommercialListView, meta: { layout: 'default' }, name: 'commercial_list' },
    { path: '/real_properties_commercials/:uid/:aggregator_uid?', component: CommercialEditorView, meta: { layout: 'default' }, name: 'commercial' },
    { path: '/real_properties_apartments', component: ApartmentsListView, meta: { layout: 'default' }, name: 'apartment_list' },
    { path: '/real_properties_apartments/:uid/:aggregator_uid?', component: ApartmentsEditorView, meta: { layout: 'default' }, name: 'apartment' },

    { path: '/compilations', component: CompilationListView, meta: { layout: 'default' }, name: 'compilation_list' },
    { path: '/compilations/:uid', component: CompilationEditorView, meta: { layout: 'default' }, name: 'compilation' },

    { path: '/mortgage', component: MortgageView, meta: { layout: 'default' }, name: 'mortgage_list' },
    { path: '/mortgage/:uid', component: MortgageEditorView, meta: { layout: 'default' }, name: 'mortgage' },

    { path: '/infrastructure_category', component: InfrastructureCategoryView, meta: { layout: 'default' }, name: 'infrastructure_category_list' },
    { path: '/infrastructure_category/:uid', component: InfrastructureCategoryEditorView, meta: { layout: 'default' }, name: 'infrastructure_category' },
    { path: '/infrastructure_element', component: InfrastructureElementView, meta: { layout: 'default' }, name: 'infrastructure_element_list' },
    { path: '/infrastructure_element/:uid', component: InfrastructureElementEditorView, meta: { layout: 'default' }, name: 'infrastructure_element' },

    { path: '/promotion_category', component: PromotionCategoryView, meta: { layout: 'default' }, name: 'promotion_category_list' },
    { path: '/promotion_category/:uid', component: PromotionCategoryEditorView, meta: { layout: 'default' }, name: 'promotion_category' },
    { path: '/promotion_element', component: PromotionElementListView, meta: { layout: 'default' }, name: 'promotion_element_list' },
    { path: '/promotion_element/:uid', component: PromotionElementEditorView, meta: { layout: 'default' }, name: 'promotion_element' },

    { path: '/dynamics', component: DynamicsView, meta: { layout: 'default' }, name: 'dynamics_list' },
    { path: '/dynamics/:uid', component: DynamicsEditorView, meta: { layout: 'default' }, name: 'dynamics' },

    { path: '/presets', component: PresetsView, meta: { layout: 'default' }, name: 'presets_list' },
    { path: '/presets/:uid', component: PresetsView, meta: { layout: 'default' }, name: 'presets' },

    { path: '/feed', component: FeedView, meta: { layout: 'default' }, name: 'feed_list' },
    { path: '/feed/:uid', component: FeedEditorView, meta: { layout: 'default' }, name: 'feed' },

    { path: '/tags', component: TagsView, meta: { layout: 'default' }, name: 'tag_list' },
    { path: '/tags/:uid', component: TagsEditorView, meta: { layout: 'default' }, name: 'tag' },
  ]
})

export default router

router.beforeEach(async () => {
  const app_state_store = useAppStateStore()

  if (app_state_store.getIsStateBeforeEqualAfter && !app_state_store.getIsStateBeforeEqualAfter()) {
    //@ts-ignore
    return await ElMessageBox.confirm('Все несохраненные изменения будут потеряны. Продолжить?', 'Внимание', {
      confirmButtonText: 'Ok',
      cancelButtonText: 'Отмена',
      type: 'warning'
    })
      .then(() => {
        app_state_store.getIsStateBeforeEqualAfter = null
        return true
      })
      .catch(() => false)
  }

  return true
})
