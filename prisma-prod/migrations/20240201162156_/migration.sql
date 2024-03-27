-- CreateTable
CREATE TABLE `Cursos` (
    `id` VARCHAR(191) NOT NULL,
    `tema` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Fazendo...',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
