-- CreateTable
CREATE TABLE "GlobalState" (
    "id" SERIAL NOT NULL,
    "count" INTEGER,
    "showModel" BOOLEAN DEFAULT true,

    CONSTRAINT "GlobalState_pkey" PRIMARY KEY ("id")
);
