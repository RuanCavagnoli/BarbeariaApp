import { MaskitoElementPredicate } from "@maskito/core";
import {
  maskitoDateOptionsGenerator, maskitoNumberOptionsGenerator,
  maskitoParseDate, maskitoStringifyDate,
  maskitoParseNumber, maskitoStringifyNumber,
  MaskitoDateMode,
} from "@maskito/kit";

const dateMask = maskitoDateOptionsGenerator({ mode: 'dd/mm/yyyy', separator: '/' });
const priceMask = maskitoNumberOptionsGenerator({
  decimalSeparator: ',',
  min: 0,
  max: 1000,
  precision: 2,
  thousandSeparator: '.'
})
const maskitoElement: MaskitoElementPredicate = async (el) =>
  (el as HTMLIonInputElement).getInputElement();

const parseDateMask = (date: string, mode: MaskitoDateMode = 'dd/mm/yyyy') => {
  return maskitoParseDate(date, { mode })
}

const parseNumberMask = (number: string) => {
  return maskitoParseNumber(number, ',');
}

const formatDateMask = (date: Date) => {
  return maskitoStringifyDate(date, { mode: 'dd/mm/yyyy', separator: '/' });
}

const formatNumberMask = (number: number, precision = 2) => {
  return maskitoStringifyNumber(number, { decimalSeparator: ',', precision })
}

export {
  dateMask,
  priceMask,
  maskitoElement,
  parseDateMask,
  formatDateMask,
  formatNumberMask,
  parseNumberMask,
}
