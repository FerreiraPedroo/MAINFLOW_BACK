export interface UserLoginResponseDto {
  tokenInfo: string;
  userInfo: {
    id: number;
    name: string;
    photo: string | null;
    email: string;
  };
  departmentsInfo: {
    role: string;
    departments: DepartmentType[];
  };
}

type DepartmentType = {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  itemsList: SectorType[] | ItemsType[];
};

type SectorType = {
  id: number;
  title: string;
  icon: string | null;
  sectorItems: ItemsType[];
};

type ItemsType = {
  id: number;
  title: string;
  icon: string | null;
  url: string;
};
