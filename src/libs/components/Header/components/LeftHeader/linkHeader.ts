export const navLinks = (openLink: string) => {
   switch (openLink) {
      case "company": {
         return [
            {
               path: "/company/companies",
               display: "Danh sách công ty",
               key: "/company/companies",
            },
            {
               path: "/company/registration",
               display: "Danh sách công ty đăng ký",
               key: "/company/registration",
            },
         ];
      }
      case "settings": {
         return [
            {
               path: "/settings/email-templates",
               display: "Email Templates",
               key: "/settings/email-templates",
            },
         ];
      }
      case "jobs/skills": {
         return [
            {
               path: "/jobs/skills/skills",
               display: "Quản lý kỹ năng",
               key: "/jobs/skills/skills",
            },
            {
               path: "/jobs/skills/skills-invalidate",
               display: "Phê duyệt kỹ năng",
               key: "/jobs/skills/skills-invalidate",
            },
         ];
      }

      default:
         return [];
   }
};
