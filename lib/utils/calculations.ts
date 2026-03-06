import { BRICK_DATABASE } from '@/data/brickDatabase';
import { parseNum } from '@/lib/utils/numbers';

export interface Aditivo {
  id: string;
  nome: string;
  rendimento: string; // L/SACA
}

export interface WallRow {
  id: string;
  selected: boolean;
  idParede: string;
  comprimento: string;
  altura: string;
  selectedBrickType: string;
  assentamentoType: '1/2 VEZ' | '1 VEZ';
  rebocoGessoType: 'NÃO HÁ' | '1 LADO' | '2 LADOS';
  isDiscountRow?: boolean;
  manualArea?: string;
}

export interface CalculationParams {
  aditivoAssentamento: 'SIM' | 'NÃO' | '';
  nomeAditivoAssentamento: string;
  tracoAssentamentoCimento: string;
  tracoAssentamentoCal: string;
  tracoAssentamentoAreia: string;
  rendimentoCimentoChapisco: string;
  tracoChapiscoCimento: string;
  tracoChapiscoAreia: string;
  aditivoReboco: 'SIM' | 'NÃO' | '';
  nomeAditivoReboco: string;
  rendimentoCimentoReboco: string;
  tracoRebocoCimento: string;
  tracoRebocoCal: string;
  tracoRebocoAreia: string;
  rendimentoGesso: string;
  aditivos: Aditivo[];
}

export const calculateRowData = (row: WallRow, params: CalculationParams) => {
  const isDiscount = row.isDiscountRow;
  const compVal = parseNum(row.comprimento);
  const altVal = parseNum(row.altura);
  const areaVal = isDiscount ? parseNum(row.manualArea || '0') : compVal * altVal;
  
  const selectedBrick = BRICK_DATABASE.find(b => b.type === row.selectedBrickType) || BRICK_DATABASE[0];
  const brickQtyPerM2 = row.assentamentoType === '1/2 VEZ' ? selectedBrick.qtyHalf : selectedBrick.qtyFull;
  const cementYield = row.assentamentoType === '1/2 VEZ' ? selectedBrick.yieldHalf : selectedBrick.yieldFull;

  const totalBricksExact = areaVal * brickQtyPerM2;
  const totalBricksCommercial = Math.ceil(totalBricksExact);

  // Assentamento
  const cimentoKg = cementYield > 0 ? (50 / cementYield) * areaVal : 0;
  const propCimAssent = parseNum(params.tracoAssentamentoCimento) || 1;
  const propCalVal = parseNum(params.tracoAssentamentoCal);
  const propAreiaVal = parseNum(params.tracoAssentamentoAreia);
  const calM3 = params.aditivoAssentamento === 'SIM' ? 0 : (0.036 / 50) * cimentoKg * (propCalVal / propCimAssent);
  const areiaM3 = (0.036 / 50) * cimentoKg * (propAreiaVal / propCimAssent);
  
  const aditivoAssentObj = params.aditivos.find(a => a.nome === params.nomeAditivoAssentamento);
  const yieldAssent = aditivoAssentObj ? parseNum(aditivoAssentObj.rendimento) : 0;
  const aditivoAssentamentoLitros = params.aditivoAssentamento === 'SIM' ? (cimentoKg / 50) * yieldAssent : 0;

  // Gesso
  let areaGessoVal = 0;
  if (row.rebocoGessoType === '1 LADO') areaGessoVal = areaVal;
  else if (row.rebocoGessoType === '2 LADOS') areaGessoVal = areaVal * 2;
  
  const rendGessoVal = parseNum(params.rendimentoGesso) || 2.5;
  const gessoKgVal = rendGessoVal > 0 ? (40 / rendGessoVal) * areaGessoVal : 0;

  // Chapisco
  const rendCimChapVal = parseNum(params.rendimentoCimentoChapisco);
  const propCimChap = parseNum(params.tracoChapiscoCimento) || 1;
  const tracoAreiaChapVal = parseNum(params.tracoChapiscoAreia);
  const areaChapiscoVal = (areaVal * 2) - areaGessoVal;
  const cimentoChapiscoKg = rendCimChapVal > 0 ? (50 / rendCimChapVal) * areaChapiscoVal : 0;
  const areiaChapiscoM3 = (0.036 / 50) * cimentoChapiscoKg * (tracoAreiaChapVal / propCimChap);

  // Reboco
  const rendCimRebocoVal = parseNum(params.rendimentoCimentoReboco);
  const propCimReboco = parseNum(params.tracoRebocoCimento) || 1;
  const propCalReboco = parseNum(params.tracoRebocoCal);
  const propAreiaReboco = parseNum(params.tracoRebocoAreia);
  
  // Reboco is zero for discount row
  const areaRebocoVal = isDiscount ? 0 : areaChapiscoVal; 
  const cimentoRebocoKg = !isDiscount && rendCimRebocoVal > 0 ? (50 / rendCimRebocoVal) * areaRebocoVal : 0;
  const calRebocoM3 = !isDiscount && params.aditivoReboco === 'SIM' ? 0 : (0.036 / 50) * cimentoRebocoKg * (propCalReboco / propCimReboco);
  const areiaRebocoM3 = !isDiscount ? (0.036 / 50) * cimentoRebocoKg * (propAreiaReboco / propCimReboco) : 0;

  const aditivoRebocoObj = params.aditivos.find(a => a.nome === params.nomeAditivoReboco);
  const yieldReboco = aditivoRebocoObj ? parseNum(aditivoRebocoObj.rendimento) : 0;
  const aditivoRebocoLitros = !isDiscount && params.aditivoReboco === 'SIM' ? (cimentoRebocoKg / 50) * yieldReboco : 0;

  return {
    ...row,
    areaVal,
    totalBricksExact,
    totalBricksCommercial,
    cimentoKg,
    calM3,
    areiaM3,
    aditivoAssentamentoLitros,
    areaGessoVal,
    gessoKgVal,
    areaChapiscoVal,
    cimentoChapiscoKg,
    areiaChapiscoM3,
    areaRebocoVal,
    cimentoRebocoKg,
    calRebocoM3,
    areiaRebocoM3,
    aditivoRebocoLitros
  };
};
