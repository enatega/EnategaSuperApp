import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { SupportFaqArticleId } from '../utils/supportFaqArticles';

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
};

export type SupportFaqNavigationProp = NavigationProp<SupportNavigationParamList, 'SupportFaqArticle'>;

export type SupportFaqArticleRouteProp = RouteProp<SupportNavigationParamList, 'SupportFaqArticle'>;
export type SupportHomeNavigationProp = NavigationProp<SupportNavigationParamList>;
