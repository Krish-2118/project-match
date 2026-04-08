DROP INDEX IF EXISTS "User_email_idx";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
