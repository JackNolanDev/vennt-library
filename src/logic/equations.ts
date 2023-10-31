import {
  ComputedAttributes,
  validAttributes,
  EntityAttribute,
  UseAttrMap,
  PartialEntityAttributes,
} from "..";
import { DEFAULT_ATTRS_MAP } from "../config";
import mexp from "math-expression-evaluator";

export const attrsRegexStr = (attrs: ComputedAttributes): string => {
  const attributes = Array.from(
    new Set([...validAttributes, ...Object.keys(attrs)])
  );
  return attributes.map((attr) => `\\b${attr}\\b`).join("|");
};

const attrsRegex = (attrs: ComputedAttributes): RegExp =>
  new RegExp(attrsRegexStr(attrs), "g");

const numToStr = (num: number): string => {
  const numStr = num.toString();
  if (num < 0) {
    return `(${numStr})`;
  }
  return numStr;
};

export const replaceVariablesInEquation = (
  equation: string,
  attrs: ComputedAttributes
): { cleanedEquation: string; details: { ceilResult: boolean } } => {
  let ceilResult = false;
  const cleanedEquation = equation.replaceAll(attrsRegex(attrs), (match) => {
    const attr = match as EntityAttribute;
    // L always rounds up, everything else always floors
    if (attr === "L") {
      ceilResult = true;
    }
    const entityAttr = attrs[attr];
    if (entityAttr) {
      return numToStr(entityAttr.val);
    }
    const defaultAttr = DEFAULT_ATTRS_MAP[attr];
    if (defaultAttr) {
      return numToStr(defaultAttr);
    }
    return "0";
  });
  return { cleanedEquation, details: { ceilResult } };
};

export const solveEquation = (
  equation: string,
  attrs: ComputedAttributes
): number | undefined => {
  const {
    cleanedEquation,
    details: { ceilResult },
  } = replaceVariablesInEquation(equation, attrs);
  // ensure all variables have been removed from the equation before attempting to solve it
  if (/^(?:[\d+\-*/()^ ]|Mod)+$/.test(cleanedEquation)) {
    try {
      const evaluated = mexp.eval(cleanedEquation);
      const floatVal = parseFloat(evaluated);
      if (isNaN(floatVal)) {
        console.warn(
          `equation did not successfully solve: ${equation} -> ${cleanedEquation} -> ${evaluated}`
        );
        return undefined;
      }
      if (ceilResult) {
        return Math.ceil(floatVal);
      }
      return Math.floor(floatVal);
    } catch {
      console.warn(
        `solving equation failed: ${equation} -> ${cleanedEquation}`
      );
    }
  }
  return undefined;
};

export const solvePendingEquations = (
  usesMap: UseAttrMap,
  attrs: ComputedAttributes
): PartialEntityAttributes => {
  const cleaned: PartialEntityAttributes = {};
  Object.entries(usesMap).forEach(([attr, val]) => {
    if (typeof val === "string") {
      const solved = solveEquation(val, attrs);
      if (solved) {
        cleaned[attr] = solved;
      }
    } else {
      cleaned[attr] = val;
    }
  });
  return cleaned;
};
