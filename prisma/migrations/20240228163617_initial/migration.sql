-- CreateTable
CREATE TABLE "Cursos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tema" TEXT NOT NULL,
    "title" TEXT,
    "descricao" TEXT,
    "observacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Fazendo...',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Etapas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "texto" TEXT,
    "curso_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Etapas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
