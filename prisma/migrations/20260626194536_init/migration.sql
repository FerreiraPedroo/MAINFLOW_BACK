-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "abbreviation" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "short_address" TEXT,
    "full_address" TEXT NOT NULL,
    "map_google" TEXT,
    "coordinate" JSONB NOT NULL,
    "photo" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Localization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "space_type" TEXT NOT NULL,
    "space_name" TEXT NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "Localization_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EspaceType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessUnit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photos" JSONB NOT NULL,
    "address_id" INTEGER NOT NULL,
    "cnpj" TEXT NOT NULL,
    CONSTRAINT "BusinessUnit_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "CostCenter_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DepartmentSector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "DepartmentSector_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DepartmentSector_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DepartmentSector_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "default_department_id" INTEGER NOT NULL,
    CONSTRAINT "Sector_default_department_id_fkey" FOREIGN KEY ("default_department_id") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "people_id" INTEGER NOT NULL,
    "departament_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    CONSTRAINT "Allocation_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "People" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "People" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "hire_date" TEXT NOT NULL,
    "termination_date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "UserData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserData_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "UserSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSession_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    CONSTRAINT "User_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessInstance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "process_model_id" INTEGER NOT NULL,
    "history" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    CONSTRAINT "ProcessInstance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessInstance_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessInstance_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessInstance_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "process_call" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    CONSTRAINT "ProcessModel_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessModel_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessModel_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessStepInstance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sequence" INTEGER NOT NULL,
    "parallel" BOOLEAN NOT NULL,
    "process_instance_id" INTEGER NOT NULL,
    CONSTRAINT "ProcessStepInstance_process_instance_id_fkey" FOREIGN KEY ("process_instance_id") REFERENCES "ProcessInstance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessStepModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "parallel" BOOLEAN NOT NULL,
    "process_model_id" INTEGER NOT NULL,
    CONSTRAINT "ProcessStepModel_process_model_id_fkey" FOREIGN KEY ("process_model_id") REFERENCES "ProcessModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "process_id" INTEGER NOT NULL,
    "business_unit_id" INTEGER NOT NULL,
    "cost_center_id" INTEGER NOT NULL,
    CONSTRAINT "Project_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "ProcessInstance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "BusinessUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_cost_center_id_fkey" FOREIGN KEY ("cost_center_id") REFERENCES "CostCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BusinessUnitToDepartment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BusinessUnitToDepartment_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BusinessUnitToDepartment_B_fkey" FOREIGN KEY ("B") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProcessStepModelToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProcessStepModelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ProcessStepModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProcessStepModelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_abbreviation_key" ON "Address"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "Address_short_address_key" ON "Address"("short_address");

-- CreateIndex
CREATE UNIQUE INDEX "Address_full_address_key" ON "Address"("full_address");

-- CreateIndex
CREATE UNIQUE INDEX "Localization_space_name_key" ON "Localization"("space_name");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUnit_title_key" ON "BusinessUnit"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_people_id_key" ON "Allocation"("people_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_user_id_key" ON "UserData"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_user_id_key" ON "UserSession"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessUnitToDepartment_AB_unique" ON "_BusinessUnitToDepartment"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessUnitToDepartment_B_index" ON "_BusinessUnitToDepartment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProcessStepModelToUser_AB_unique" ON "_ProcessStepModelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcessStepModelToUser_B_index" ON "_ProcessStepModelToUser"("B");
