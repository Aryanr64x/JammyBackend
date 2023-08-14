-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jam" (
    "id" SERIAL NOT NULL,
    "passkey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortBody" VARCHAR(100) NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "Jam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_contribution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_contribution_AB_unique" ON "_contribution"("A", "B");

-- CreateIndex
CREATE INDEX "_contribution_B_index" ON "_contribution"("B");

-- AddForeignKey
ALTER TABLE "Jam" ADD CONSTRAINT "Jam_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contribution" ADD CONSTRAINT "_contribution_A_fkey" FOREIGN KEY ("A") REFERENCES "Jam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contribution" ADD CONSTRAINT "_contribution_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
