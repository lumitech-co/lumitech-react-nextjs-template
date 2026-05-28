export enum Sector {
  Technology = 'Technology',
  FinancialServices = 'Financial Services',
  Healthcare = 'Healthcare',
  ConsumerCyclical = 'Consumer Cyclical',
  ConsumerDefensive = 'Consumer Defensive',
  Industrials = 'Industrials',
  Energy = 'Energy',
  BasicMaterials = 'Basic Materials',
  RealEstate = 'Real Estate',
  Utilities = 'Utilities',
  CommunicationServices = 'Communication Services',
}

export const SECTOR_DESCRIPTIONS: Record<Sector, string> = {
  [Sector.Technology]: 'IT companies, chipmakers, software',
  [Sector.FinancialServices]: 'Banks, insurance, investment funds',
  [Sector.Healthcare]: 'Pharma, medical devices, hospitals',
  [Sector.ConsumerCyclical]: 'Auto, retail, hotels',
  [Sector.ConsumerDefensive]: 'Food, household & personal products',
  [Sector.Industrials]: 'Aviation, railways, construction',
  [Sector.Energy]: 'Oil, gas, coal',
  [Sector.BasicMaterials]: 'Metals, chemicals, forestry',
  [Sector.RealEstate]: 'REITs, property',
  [Sector.Utilities]: 'Electric, gas & water supply',
  [Sector.CommunicationServices]: 'Telecom, media, social networks',
};
