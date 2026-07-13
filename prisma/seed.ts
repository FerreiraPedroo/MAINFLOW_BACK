import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// export const prisma: PrismaClient = new PrismaClient({
//   adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
// });
export const prisma: PrismaClient = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log("Iniciando o Seed do Prisma ORM");

  const seeds = {
    address: {
      data: [
        {
          abbreviation: "SEDE",
          zone: "ZONA NORTE",
          short_address: "Av. Paris, Nº84",
          full_address: "Avenida Paris, Nº84 - Bonsucesso - RJ",
        },
      ],
    },
    businessUnit: {
      where: { title: "UNISUAM" },
      update: {},
      create: {
        title: "UNISUAM",
        photos: "",
        address_id: 1,
        cnpj: "01.002.004/0001-02",
      },
    },
    user: {
      where: { email: "email@email.com" },
      update: {},
      create: {
        email: "email@email.com",
        password:
          "$2b$10$Y7JL8xYn5y.dkdSm7UKbXeBfz9F.N9NmBSOvswOKvZInFwA0RchRW",
        name: "Usuário Admin",
        birth_date: null,
        photo: null,
        business_unit_id: 1,
      },
    },
    userData: {
      where: { user_id: 1 },
      update: {},
      create: {
        user_id: 1,
        role: "ADMIN",
        business_unit_id: 1,
      },
    },
    department: {
      data: [
        {
          title: "Gerenciamento",
          url: "/management",
          icon: null,
        },
        {
          title: "Facilities",
          url: "/facilities",
          icon: null,
        },
      ],
    },
    sector: {
      data: [
        {
          title: "Localização",
          icon: null,
          department_id: 1,
        },
      ],
    },
    centerCost: {
      data: [
        {
          title: "0100400902 - Facilities (BS)",
          status: "APROVADO",
          description:
            "Todos os custos relacionados ao setor de facilities de Bonsucesso.",
          business_unit_id: 1,
        },
      ],
    },
    activity: {
      data: [
        {
          title: "Centro de custo",
          url: "/manager/cost-center",
          icon: null,
          department_id: 1,
        },
        {
          title: "Painel de localização",
          url: "/manager/localizations",
          department_id: 1,
          sector_id: 1,
        },
        {
          title: "Prédio",
          url: "/manager/buildings",
          department_id: 1,
          sector_id: 1,
        },
        {
          title: "Andar",
          url: "/manager/floor",
          department_id: 1,
          sector_id: 1,
        },
        {
          title: "Projeto",
          url: "/facilities/projects",
          department_id: 2,
          sector_id: null,
        },
      ],
    },
    businessUnitActivity: {
      data: [
        {
          department_id: 1,
          sector_id: null,
          activity_id: 1,
          business_unit_id: 1,
        },
        {
          department_id: 1,
          sector_id: 1,
          activity_id: 2,
          business_unit_id: 1,
        },
        {
          department_id: 1,
          sector_id: 1,
          activity_id: 3,
          business_unit_id: 1,
        },
        {
          department_id: 1,
          sector_id: 1,
          activity_id: 4,
          business_unit_id: 1,
        },
      ],
    },
    processStepModel: {
      data: [
        {
          title: "Aprovação do projeto",
          page: "/facilities/project/approval",
          sequence: 1,
          parallel: false,
          finish_process: false,
          process_model_id: 1,
        },
        {
          title: "Adicionar serviço",
          page: "/facilities/project/service",
          sequence: 2,
          parallel: false,
          finish_process: false,
          process_model_id: 1,
        },
        {
          title: "Aprovação final do projeto",
          page: "/facilities/project/approval-final",
          sequence: 3,
          parallel: false,
          finish_process: false,
          process_model_id: 1,
        },
      ],
    },
    processModel: {
      data: [
        {
          title: "Criar projeto",
          process_call: "CREATE:PROJECT",
          status: "PENDENTE",
        },
        {
          title: "Editar projeto",
          process_call: "UPDATE:PROJECT",
          status: "APROVADO",
        },
      ],
    },
  };

  const address = await prisma.address.createMany(seeds.address);
  const businessUnit = await prisma.businessUnit.upsert(seeds.businessUnit);
  const user = await prisma.user.upsert(seeds.user);
  const userData = await prisma.userData.upsert(seeds.userData);
  const department = await prisma.department.createMany(seeds.department);
  const sector = await prisma.sector.createMany(seeds.sector);
  const costCenter = await prisma.costCenter.createMany(seeds.centerCost);
  const activity = await prisma.activity.createMany(seeds.activity);
  const businessUnitProcess = await prisma.businessUnitActivity.createMany(
    seeds.businessUnitActivity,
  );
  const processModel = await prisma.processModel.createMany(seeds.processModel);
  const processStepModel = await prisma.processStepModel.createMany(
    seeds.processStepModel,
  );

  console.log({
    address,
    businessUnit,
    department,
    sector,
    costCenter,
    user,
    userData,
    activity,
    businessUnitProcess,
    processStepModel,
    processModel,
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
