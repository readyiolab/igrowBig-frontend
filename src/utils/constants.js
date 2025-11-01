export const MAX_FILE_SIZE = {
  IMAGE: 4 * 1024 * 1024, // 4MB
  VIDEO: 50 * 1024 * 1024, // 50MB
};

export const MAX_RETRIES = 3;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4"];

export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ direction: "rtl" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "blockquote", "code-block"],
    ["clean"],
  ],
};

export const DEFAULT_HOME_PAGE_FIELDS = {
  welcome_description: "Welcome to our platform",
  introduction_content: "Default introduction content",
  about_company_title: "About Our Company",
  about_company_content_1: "Default about content",
  about_company_content_2: "",
  why_network_marketing_title: "Why Network Marketing",
  why_network_marketing_content: "Default why content",
  opportunity_video_header_title: "Opportunity Video",
  opportunity_video_url: "",
  support_content: "Default support content",
};