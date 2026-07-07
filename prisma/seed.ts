import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export const prisma: PrismaClient = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
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

  const user = await prisma.user.upsert({
    where: { email: "email@email.com" },
    update: {},
    create: {
      email: "email@email.com",
      password: "$2b$10$Y7JL8xYn5y.dkdSm7UKbXeBfz9F.N9NmBSOvswOKvZInFwA0RchRW",
      name: "Usuário Admin",
      birth_date: null,
      photo: null,
      business_unit_id: 1,
    },
  });

  const userData = await prisma.userData.upsert({
    where: { user_id: 1 },
    update: {},
    create: {
      user_id: 1,
      role: "ADMIN",
      business_unit_id: 1,
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
      icon: null,
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
  const processItemBuildings = await prisma.processItem.upsert({
    where: { title: "Prédio" },
    update: {},
    create: {
      title: "Prédio",
      url: "/manager/buildings",
      department_id: 1,
      sector_id: 1,
    },
  });
  const processItemFloor = await prisma.processItem.upsert({
    where: { title: "Andar" },
    update: {},
    create: {
      title: "Andar",
      url: "/manager/floor",
      department_id: 1,
      sector_id: 1,
    },
  });

  //
  //
  //
  //

  console.log({
    address,
    businessUnit,
    department,
    sector,
    processItemCostCenter,
    processItemLocalization,
    user,
    userData,
    processItemBuildings,
    processItemFloor,
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
