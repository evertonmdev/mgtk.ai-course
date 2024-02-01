-- CreateTable
CREATE TABLE `Etapas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `texto` LONGTEXT NULL,
    `curso_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Etapas` ADD CONSTRAINT `Etapas_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `Cursos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
