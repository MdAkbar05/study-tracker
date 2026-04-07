// lib/constants.js — enum values must match prisma/schema.prisma exactly

export const TASK_TYPES = {
  CLASS_TOPIC: "class_topic",
  ASSIGNMENT:  "assignment",
  LAB_REPORT:  "lab_report",
  EXAM:        "exam",
  CLASS_TEST:  "class_test",
};

export const TASK_TYPE_LABELS = {
  class_topic: "Class Topic",
  assignment:  "Assignment",
  lab_report:  "Lab Report",
  exam:        "Exam",
  class_test:  "Class Test",
};

export const TASK_TYPE_PRIORITY = {
  exam:        5,
  class_test:  4,
  assignment:  3,
  lab_report:  2,
  class_topic: 1,
};

export const TASK_TYPE_COLORS = {
  class_topic: { accent: "#0ea5e9" },
  assignment:  { accent: "#8b5cf6" },
  lab_report:  { accent: "#10b981" },
  exam:        { accent: "#f43f5e" },
  class_test:  { accent: "#f59e0b" },
};

export const STATUS = {
  PENDING:     "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED:   "completed",
  OVERDUE:     "overdue",
};
