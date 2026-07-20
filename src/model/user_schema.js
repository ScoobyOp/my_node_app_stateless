import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({length: 65}).notNull(),
    email: varchar({length: 90}).notNull().unique(),
    salt: text().notNull(),
    password: text().notNull()
})
// Since we use jwt token for storing user detail's , we no need session table for storing it in the db
// table not required so commenting
// export const userSessionTable = pgTable("user_session", {
//     id: uuid().primaryKey().defaultRandom(),
//     userId:  uuid().references(() => userTable.id).notNull(),
//     createdAt: timestamp()
// })