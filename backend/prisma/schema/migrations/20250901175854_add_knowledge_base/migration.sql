/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_tags" DROP CONSTRAINT "file_tags_file_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_tags" DROP CONSTRAINT "file_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sources" DROP CONSTRAINT "sources_group_id_fkey";

-- DropTable
DROP TABLE "public"."Group";

-- DropTable
DROP TABLE "public"."file_tags";

-- DropTable
DROP TABLE "public"."sources";

-- DropTable
DROP TABLE "public"."tags";

-- DropEnum
DROP TYPE "public"."IndexStatus";

-- DropEnum
DROP TYPE "public"."SourceType";
