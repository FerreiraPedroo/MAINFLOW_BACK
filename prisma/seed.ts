import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const prisma: PrismaClient = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
});
// export const prisma: PrismaClient = new PrismaClient({
//   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
// });

async function main() {
  console.log("Iniciando o Seed do Prisma ORM");

  const seeds = {
    businessUnit: {
      data: [
        {
          title: "UNISUAM",
          photos: "",
          cnpj: "01.002.004/0001-02",
        },
        {
          title: "MAUA",
          photos: "",
          cnpj: "09.009.009/0009-09",
        },
      ],
    },
    address: {
      data: [
        {
          zone: "ZONA NORTE",
          short_address: "Av. Paris, nº84",
          full_address: "Avenida Paris, nº84 - Bonsucesso - RJ",
          business_unit_id: 1,
          status: "ATIVO",
        },
        {
          zone: "ZONA NORTE",
          short_address: "Av. Paris, nº121 - Fundos",
          full_address: "Avenida Paris, nº121 - Fundos - Bonsucesso - RJ",
          map_google: null,
          coordinate: null,
          status: "ACTIVE",
          business_unit_id: 1,
        },
        {
          zone: "ZONA OESTE",
          short_address: "Av. Cesário de Melo, nº2551",
          full_address:
            "Av. Cesário de Melo, nº2551 - Campo Grande, Rio de Janeiro - RJ, 23052-102",
          map_google: null,
          coordinate: null,
          status: "ACTIVE",
          business_unit_id: 1,
        },
        {
          zone: "ZONA OESTE",
          short_address: "R. da Feira, nº256",
          full_address:
            "Rua da Feira, nº256 - Bangu, Rio de Janeiro - RJ, 21820-030",
          map_google: null,
          coordinate: null,
          status: "ACTIVE",
          business_unit_id: 1,
        },
      ],
    },
    user: {
      data: [
        {
          email: "email@email.com",
          password:
            "$2b$10$Y7JL8xYn5y.dkdSm7UKbXeBfz9F.N9NmBSOvswOKvZInFwA0RchRW",
          name: "Usuário Admin",
          birth_date: null,
          photo: null,
          business_unit_id: 1,
        },
      ],
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
        {
          title: "0100400903 - Facilities (CG)",
          status: "APROVADO",
          description:
            "Todos os custos relacionados ao setor de facilities de Campo Grande.",
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
    project: {
      data: [
        {
          code: "PRO-019-261_CG4",
          title: "Nova Clesam CG4",
          period: "2026-1",
          budget: 120000,
          status: "APROVADO",
          business_unit_id: 1,
          cost_center_id: null,
          created_by: 1,
        },
        {
          code: "PRO-020-261_BGF",
          title: "Nova Clesam Bangu Feira [Etapa 1 - Recepção + Biomedicina]",
          period: "2026-1",
          budget: 215000,
          status: "APROVADO",
          business_unit_id: 1,
          cost_center_id: null,
          created_by: 1,
        },
        {
          code: "PRO-018-262_INST",
          title: "Adequações Fazenda Escola",
          period: "2026-2",
          budget: 680000,
          status: "APROVADO",
          business_unit_id: 1,
          cost_center_id: null,
          created_by: 1,
        },
      ],
    },
    localizationBlocks: {
      data: [
        {
          title: "Bloco A",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Bloco B",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Bloco C",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Bloco D",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Bloco E",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
    localizationFloors: {
      data: [
        {
          title: "Térreo",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "1º Andar",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "2º Andar",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "3º Andar",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "4º Andar",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "5º Andar",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
    localizationSpaceTypes: {
      data: [
        {
          title: "Pátio",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Sala",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Corredor",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Banheiro",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Rampa",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Mesanino",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Elevador",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Escada",
          status: "APROVADO",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
    localization: {
      data: [
        {
          title: "Gestão de Facilities",
          block_id: 1,
          floor_id: 1,
          space_type_id: 1,
          address_id: 1,
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Contabilidade",
          block_id: 1,
          floor_id: 1,
          space_type_id: 1,
          address_id: 1,
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "Financeiro",
          block_id: 1,
          floor_id: 1,
          space_type_id: 1,
          address_id: 1,
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
    people: {
      data: [
        {
          name: "Primeiro nome",
          birth_date: "1983-05-30",
          registration_number: "11-111111",
          sex: "Masculino",
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          name: "Segundo nome",
          birth_date: "2010-05-30",
          registration_number: "22-222222",
          sex: "Masculino",
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          name: "Terceiro nome",
          birth_date: "2000-05-30",
          registration_number: "33-333333",
          sex: "Masculino",
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          name: "Quarto nome",
          birth_date: "1990-05-30",
          registration_number: "44-444444",
          sex: "Masculino",
          status: "ATIVO",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
    supplier: {
      data: [
        {
          legal_name: "3M BRASIL",
          tax_number: "123123100001",
          supplier_type: "FABRICANTE",
          billing_address: "Escócia",
        },
        {
          legal_name: "OBRA MAX",
          tax_number: "321321100044",
          supplier_type: "FORNECEDOR",
          billing_address: "Guadalupe/Brasil",
        },
      ],
    },
    item: {
      data: [
        {
          title: "LÂMPADA FLUORESCENTE TUBULAR 40W",
          code: "1010000",
          category: "ELÉTRICO",
          sub_category: "LÂMPADAS",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "LÂMPADA FLUORESCENTE TUBULAR 20W",
          code: "1010001",
          category: "ELÉTRICO",
          sub_category: "LÂMPADAS",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "REATOR 2x40W BIVOLT",
          code: "1010002",
          category: "ELÉTRICO",
          sub_category: "REATORES",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "REATOR 2x20W BIVOLT",
          code: "1010003",
          category: "ELÉTRICO",
          sub_category: "REATORES",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "SOQUETE ENGATE RÁPIDO G13 P/LAMPADA TUBULAR",
          code: "1010004",
          category: "ELÉTRICO",
          sub_category: "SOQUETES",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "SOQUETE RABICHO G13 P/LAMPADA TUBULAR",
          code: "1010004",
          category: "ELÉTRICO",
          sub_category: "SOQUETES",
          type: "MATERIAL",
          business_unit_id: 1,
          created_by: 1,
        },
        {
          title: "FITA ISOLANTE PRETA 5MTS 750V IMPERIAL",
          code: "1010005",
          unit_measure: "UNIDADE",
          category: "ELÉTRICO",
          sub_category: "ISOLANTES",
          type: "MATERIAL",
          description:
            "Fita isolante de PVC para uso geral e instalações elétricas residenciais de baixa tensão. Possui propriedade antichama, excelente flexibilidade e ótima adesão. Indicada para isolamento de fios e cabos elétricos, emendas e reparos em circuitos de iluminação.",
          hs_code: "3919.10.20",
          manufacturer_id: 1,
          manufacturer_part_number: "7891040004386",
          manufacturer_catalog: "JANEIRO 2020",
          manufacturer_data_sheet_url:
            "https://multimedia.3m.com/mws/media/1022141O/data-sheet-vinyl-tape-imperial.pdf?&fn=imperial2019.pdf",
          manufacturer_image_path:
            "https://gmidistribuidora.agilecdn.com.br/203-1_1.jpg",
          business_unit_id: 1,
          created_by: 1,
        },
      ],
    },
  };
  try {
    const businessUnit = await prisma.businessUnit.createMany(
      seeds.businessUnit,
    );
    const address = await prisma.address.createMany(seeds.address);
    const user = await prisma.user.createMany(seeds.user);
    const department = await prisma.department.createMany(seeds.department);
    const sector = await prisma.sector.createMany(seeds.sector);
    const costCenter = await prisma.costCenter.createMany(seeds.centerCost);
    const activity = await prisma.activity.createMany(seeds.activity);
    const businessUnitActivity = await prisma.businessUnitActivity.createMany(
      seeds.businessUnitActivity,
    );
    const processModel = await prisma.processModel.createMany(
      seeds.processModel,
    );
    const processStepModel = await prisma.processStepModel.createMany(
      seeds.processStepModel,
    );
    const project = await prisma.project.createMany(seeds.project);
    await prisma.block.createMany(seeds.localizationBlocks);
    await prisma.floor.createMany(seeds.localizationFloors);
    await prisma.spaceType.createMany(seeds.localizationSpaceTypes);
    await prisma.localization.createMany(seeds.localization);
    await prisma.people.createMany(seeds.people);

    console.log({
      address,
      businessUnit,
      department,
      sector,
      costCenter,
      user,
      activity,
      businessUnitActivity,
      processStepModel,
      processModel,
      project,
    });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O bloco a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um block com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          console.log(error);
          throw new UnprocessableEntityException(error.message);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }
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
