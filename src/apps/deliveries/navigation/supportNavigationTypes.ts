import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { SupportFaqArticleId } from '../utils/supportFaqArticles';
import type { SupportTicketListItemModel } from '../utils/supportTicketMappers';

export type SupportNavigationParamList = {
  SupportChat:
    | {
        agentName?: string;
        chatBoxId?: string;
        receiverId?: string;
      }
    | undefined;
  SupportConversations: undefined;
  SupportContactForm: {
    issueLabel: string;
    issueValue: string;
  };
  SupportFaq: undefined;
  SupportFaqArticle: {
    articleId: SupportFaqArticleId;
  };
  SupportTickets: undefined;
  SupportTicketDetail: {
    ticket: SupportTicketListItemModel;
  };
};

export type SupportFaqNavigationProp = NavigationProp<SupportNavigationParamList, 'SupportFaqArticle'>;

export type SupportFaqArticleRouteProp = RouteProp<SupportNavigationParamList, 'SupportFaqArticle'>;
export type SupportHomeNavigationProp = NavigationProp<SupportNavigationParamList>;
