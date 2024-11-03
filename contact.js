const { mysqlTable, text, int } = require("drizzle-orm/mysql-core");
const usersTable = mysqlTable("contacts", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

module.exports = usersTable;
