import { useSelector } from 'react-redux';
import { selectHomePageData } from '@/store/slices/homePageSlice';

export const usePreserveHomePageFields = () => {
  const homePageData = useSelector(selectHomePageData);

  const getPreserveFields = (section) => {
    const allFields = {
      welcome_description: homePageData?.welcome_description || '',
      introduction_content: homePageData?.introduction_content || '',
      introduction_image_url: homePageData?.introduction_image_url || '',
      about_company_title: homePageData?.about_company_title || '',
      about_company_content_1: homePageData?.about_company_content_1 || '',
      about_company_content_2: homePageData?.about_company_content_2 || '',
      about_company_image_url: homePageData?.about_company_image_url || '',
      why_network_marketing_title: homePageData?.why_network_marketing_title || '',
      why_network_marketing_content: homePageData?.why_network_marketing_content || '',
      opportunity_video_header_title: homePageData?.opportunity_video_header_title || '',
      opportunity_video_url: homePageData?.opportunity_video_url || '',
      support_content: homePageData?.support_content || '',
    };

    // Remove current section fields to avoid conflicts
    const sectionFields = {
      about_company: ['about_company_title', 'about_company_content_1', 'about_company_content_2', 'about_company_image_url'],
      why_network_marketing: ['why_network_marketing_title', 'why_network_marketing_content'],
      opportunity_video: ['opportunity_video_header_title', 'opportunity_video_url'],
      support: ['support_content'],
    };

    const fieldsToRemove = sectionFields[section] || [];
    const preservedFields = { ...allFields };

    fieldsToRemove.forEach(field => {
      delete preservedFields[field];
    });

    return preservedFields;
  };

  const getDefaultFields = () => {
    return {
      welcome_description: 'Welcome to our platform',
      introduction_content: 'Default introduction content',
      about_company_title: 'About Our Company',
      about_company_content_1: 'Default about content',
      about_company_content_2: '',
      why_network_marketing_title: 'Why Network Marketing',
      why_network_marketing_content: 'Default why content',
      opportunity_video_header_title: 'Opportunity Video',
      opportunity_video_url: '',
      support_content: 'Default support content',
    };
  };

  return {
    getPreserveFields,
    getDefaultFields,
    homePageData,
  };
};