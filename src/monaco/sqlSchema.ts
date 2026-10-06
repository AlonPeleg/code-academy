/** Table -> columns of the sample database (keep in sync with DEFAULT_SQL_SEED in runners/sql.ts). */
export const SQL_SCHEMA: Record<string, string[]> = {
  students: ['id', 'name', 'age', 'city'],
  courses: ['id', 'title', 'language', 'credits'],
  enrollments: ['student_id', 'course_id', 'grade'],
};
