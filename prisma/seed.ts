import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

export const prisma: PrismaClient = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
});

async function main() {
  console.log("Iniciando o Seed do Prisma ORM");

  const address = await prisma.address.upsert({
    where: { abbreviation: "SEDE" },
    update: {},
    create: {
      abbreviation: "SEDE",
      zone: "ZONA NORTE",
      short_address: "Av. Paris, Nº84",
      full_address: "Avenida Paris, Nº84 - Bonsucesso - RJ",
    },
  });

  const businessUnit = await prisma.businessUnit.upsert({
    where: { title: "UNISUAM" },
    update: {},
    create: {
      title: "UNISUAM",
      photos: {},
      address_id: 1,
      cnpj: "01.002.004/0001-02",
    },
  });

  const department = await prisma.department.upsert({
    where: { title: "Gerenciamento" },
    update: {},
    create: {
      title: "Gerenciamento",
      url: "/management",
      icon: null,
    },
  });

  const sector = await prisma.sector.upsert({
    where: { title: "Localização" },
    update: {},
    create: {
      title: "Localização",
      icon: null,
      department_id: 1,
    },
  });

  const processItemCostCenter = await prisma.processItem.upsert({
    where: { title: "Centro de custo" },
    update: {},
    create: {
      title: "Centro de custo",
      url: "/manager/cost-center",
      department_id: 1,
    },
  });

  const processItemLocalization = await prisma.processItem.upsert({
    where: { title: "Painel de localização" },
    update: {},
    create: {
      title: "Painel de localização",
      url: "/manager/localizations",
      department_id: 1,
      sector_id: 1,
    },
  });

  console.log({
    address,
    businessUnit,
    department,
    sector,
    processItemCostCenter,
    processItemLocalization,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
