// Shared conversion logic for the static unit converter.
(function () {
  "use strict";

  function getCategory(category) {
    return window.unitConverterData && window.unitConverterData[category];
  }

  window.unitConverterCore = {
    convert(category, value, fromUnit, toUnit) {
      const data = getCategory(category);
      const numericValue = Number(value);
      if (!data || !Number.isFinite(numericValue)) return null;
      if (!data.definitions?.[fromUnit] || !data.definitions?.[toUnit]) return null;

      if (typeof data.convert === "function") {
        const converted = data.convert(numericValue, fromUnit, toUnit);
        return Number.isFinite(converted) ? converted : null;
      }

      const fromDef = data.definitions[fromUnit];
      const toDef = data.definitions[toUnit];
      if (!Number.isFinite(fromDef.factor) || !Number.isFinite(toDef.factor) || toDef.factor === 0) {
        return null;
      }

      return (numericValue * fromDef.factor) / toDef.factor;
    },

    getCategories() {
      return Object.keys(window.unitConverterData || {});
    },

    getUnits(category) {
      const data = getCategory(category);
      return data ? Object.keys(data.definitions || {}) : [];
    },

    getUnitSymbol(category, unit) {
      const data = getCategory(category);
      return data?.definitions?.[unit]?.symbol || "";
    },

    getUnitName(category, unit, lang = "ja") {
      const data = getCategory(category);
      const unitDef = data?.definitions?.[unit];
      return unitDef?.[lang] || unitDef?.ja || unitDef?.en || unit;
    },

    isValidCategory(category) {
      return Boolean(getCategory(category));
    },

    isValidUnit(category, unit) {
      return Boolean(getCategory(category)?.definitions?.[unit]);
    }
  };
})();
