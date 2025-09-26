type products = "OI" | "OG" | "OA" | "OJ"; 
export interface Organization {
  name: string;
  product: products;
  subDomainName: string;

  [key: string]: any;
}

export interface CreateOrganizationData {
  name: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  subDomainName?: string;
  companyUrl?: string;
  companyName?: string;
  packageName?: string;
  formPackage?: string;
  plan?: string;
  remarks?: string;
  isSendCredentialsEmail?: boolean;
  dataCenterId?: string;
  status?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  address?: string;
  [key: string]: any;
}