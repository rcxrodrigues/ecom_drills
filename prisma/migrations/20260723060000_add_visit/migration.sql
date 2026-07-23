-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_sessionId_idx" ON "Visit"("sessionId");

-- CreateIndex
CREATE INDEX "Visit_createdAt_idx" ON "Visit"("createdAt");

-- Enable RLS to keep this table out of Supabase's public PostgREST API,
-- consistent with every other table (the app connects as the table-owning
-- "postgres" role via Prisma, which bypasses RLS).
ALTER TABLE "Visit" ENABLE ROW LEVEL SECURITY;
