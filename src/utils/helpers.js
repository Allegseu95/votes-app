import { rankItem } from '@tanstack/match-sorter-utils';

import { COLORS } from '@/constants';

export const cleanText = (text = '') => {
  if (typeof text !== 'string') {
    return text;
  }

  return text.trim();
};

export const filterData = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({ itemRank });

  return itemRank.passed;
};

export const getColors = (number = 1, opacity = 1) => {
  const data = COLORS.map((item) => `${item.slice(0, -1)}, ${opacity})`);

  return data.slice(0, number);
};

export const getColor = (position = 0, opacity = 1) => {
  const data = COLORS.map((item) => `${item.slice(0, -1)}, ${opacity})`);

  return data[position];
};

export const getDoughnutDatasets = (data = []) => [
  {
    label: 'Cantidad de Votos',
    data: data,
    backgroundColor: getColors(data.length, 0.3),
    borderColor: getColors(data.length),
    borderWidth: 0.8,
  },
];

export const getLineDatasets = (candidates = []) =>
  candidates.map((item, index) => ({
    label: item.name,
    data: item.votes,
    tension: 0.4,
    borderColor: getColor(index, 0.8),
    backgroundColor: getColor(index),
  }));
