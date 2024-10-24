type StatusType = "default" | "success" | "danger";

type ThemeConfig = {
  [key: string]: {
    question:
      | "violet"
      | "yellow"
      | "blue"
      | "cyan"
      | "green"
      | "pink"
      | "foreground"
      | undefined;
    chip:
      | "default"
      | "success"
      | "danger"
      | "primary"
      | "secondary"
      | "warning"
      | undefined;
  };
};

const themeConfig: ThemeConfig = {
  violet: {
    question: "violet",
    chip: "secondary",
  },
  yellow: {
    question: "yellow",
    chip: "warning",
  },
  blue: {
    question: "blue",
    chip: "primary",
  },
  green: {
    question: "green",
    chip: "success",
  },
  pink: {
    question: "pink",
    chip: "danger",
  },
};
