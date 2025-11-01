// D:\NHT GLOBAL\front\src\constants\backofficeConfig.js
import {
  Home,
  Package,
  Award,
  UserPlus,
  MessageSquare,
  FileText,
  Users,
  Globe,
  AtSign,
  Share2,
  FileCode,
  Mail,
  HelpCircle,
  BookCopy,
  Settings,
} from 'lucide-react';

export const theme = {
  primary: { main: '#101010', dark: '#000000', light: '#303030', hover: '#202020' },
  secondary: { main: '#FFFFFF', dark: '#E0E0E0', light: '#F8F8F8', hover: '#F0F0F0' },
  accent: { main: '#505050', light: '#D0D0D0', ultraLight: '#F5F5F5' },
  text: { primary: '#101010', secondary: '#505050', light: '#909090', onDark: '#E0E0E0' },
};

export const menuConfig = [
  { to: '/backoffice/dashboard', label: 'Dashboard', icon: Home },
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    subItems: [
      // { to: '/backoffice/slider-banners', label: 'Sliders Banner' },
            { to: '/backoffice/homepage-hero', label: 'Hero Section' },
      // { to: '/backoffice/welcome-message', label: 'Welcome Message' },

      { to: '/backoffice/homepage-welcome', label: 'Welcome Section' },
      { to: '/backoffice/homepage-about', label: 'About Section' },
      { to: '/backoffice/homepage-history', label: 'History Section' },
      { to: '/backoffice/homepage-video', label: 'Video Section' },
      { to: '/backoffice/homepage-help', label: 'Help Section' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    subItems: [
      { to: '/backoffice/about-page', label: 'About Page' },
      { to: '/backoffice/categories', label: 'Categories' },
      { to: '/backoffice/products-list', label: 'Products' },
    ],
  },
  {
    id: 'opportunity',
    label: 'Opportunity',
    icon: Award,
    subItems: [
    { to: "/backoffice/opportunity/hero", label: "Hero Section" },
    { to: "/backoffice/opportunity/description", label: "Description" },
    { to: "/backoffice/opportunity/door", label: "Door of Opportunity" },
    { to: "/backoffice/opportunity/marketing", label: "Why Network Marketing" },
    { to: "/backoffice/opportunity/business-model", label: "Business Model" },
    { to: "/backoffice/opportunity/video", label: "Overview Video" },
    { to: "/backoffice/opportunity/compensation-plan", label: "Compensation Plan" },
  ],
  },
  
  { to: '/backoffice/contact-us', label: 'Contact Us', icon: MessageSquare },
  { to: '/backoffice/blogs', label: 'Blogs', icon: FileText },
  { to: '/backoffice/social-media', label: 'Social Media', icon: Share2 },
  { to: '/backoffice/footer-disclaimer', label: 'Footer Disclaimer', icon: FileCode },
  { to: '/backoffice/subscriber-message', label: 'Subscriber Message', icon: Mail },
  { to: '/backoffice/notifications', label: 'Notifications', icon: HelpCircle },
  { to: '/backoffice/settings', label: 'Settings', icon: Settings },
  { to: '/backoffice/training', label: 'Training', icon: Settings },
];