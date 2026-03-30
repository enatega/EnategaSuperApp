export type SupportFaqArticleId =
  | 'place_order'
  | 'schedule_delivery'
  | 'change_delivery'
  | 'order_history'
  | 'ordering_for_others'
  | 'still_need_help';

export type SupportFaqArticle = {
  id: SupportFaqArticleId;
  titleKey: string;
  bodyKeys: string[];
};

export const supportFaqArticles: SupportFaqArticle[] = [
  {
    id: 'place_order',
    titleKey: 'support_faq_place_order',
    bodyKeys: [
      'support_faq_place_order_body_1',
      'support_faq_place_order_body_2',
      'support_faq_place_order_body_3',
      'support_faq_place_order_body_4',
    ],
  },
  {
    id: 'schedule_delivery',
    titleKey: 'support_faq_schedule_delivery',
    bodyKeys: [
      'support_faq_schedule_delivery_body_1',
      'support_faq_schedule_delivery_body_2',
      'support_faq_schedule_delivery_body_3',
      'support_faq_schedule_delivery_body_4',
    ],
  },
  {
    id: 'change_delivery',
    titleKey: 'support_faq_change_delivery',
    bodyKeys: [
      'support_faq_change_delivery_body_1',
      'support_faq_change_delivery_body_2',
      'support_faq_change_delivery_body_3',
      'support_faq_change_delivery_body_4',
    ],
  },
  {
    id: 'order_history',
    titleKey: 'support_faq_order_history',
    bodyKeys: [
      'support_faq_order_history_body_1',
      'support_faq_order_history_body_2',
      'support_faq_order_history_body_3',
    ],
  },
  {
    id: 'ordering_for_others',
    titleKey: 'support_faq_ordering_for_others',
    bodyKeys: [
      'support_faq_ordering_for_others_body_1',
      'support_faq_ordering_for_others_body_2',
      'support_faq_ordering_for_others_body_3',
      'support_faq_ordering_for_others_body_4',
    ],
  },
  {
    id: 'still_need_help',
    titleKey: 'support_faq_still_need_help',
    bodyKeys: [
      'support_faq_still_need_help_body_1',
      'support_faq_still_need_help_body_2',
      'support_faq_still_need_help_body_3',
    ],
  },
];

export function getSupportFaqArticleById(id: SupportFaqArticleId) {
  return supportFaqArticles.find((article) => article.id === id) ?? supportFaqArticles[0];
}
