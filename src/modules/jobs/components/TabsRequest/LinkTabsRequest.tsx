export const navLinks = (openLink: string) => {
   switch (openLink) {
      case "skills":
         return [
            {
               path: "/jobs/skills/active",
               display: "Active",
               key: "/jobs/skills/active",
            },
            {
               path: "/jobs/skills/inactive",
               display: "Inactive",
               key: "/jobs/skills/inactive",
            },
         ];

      default:
         return [];
   }
};
