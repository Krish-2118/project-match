CREATE TABLE "ProjectComment" (
  "id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectComment_projectId_createdAt_idx" ON "ProjectComment"("projectId", "createdAt");
CREATE INDEX "ProjectComment_authorId_idx" ON "ProjectComment"("authorId");

ALTER TABLE "ProjectComment"
ADD CONSTRAINT "ProjectComment_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectComment"
ADD CONSTRAINT "ProjectComment_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
