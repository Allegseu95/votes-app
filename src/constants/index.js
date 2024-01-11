export const LS = {
  token: 'token',
  user: 'user',
};

export const GENDERS = ['', 'Masculino', 'Femenino'];

export const GENDERS_IMAGES = {
  female: 'https://i.postimg.cc/fLzKyGVb/asdasd.png',
  male: 'https://i.postimg.cc/xdRDNS1J/das.png',
};

export const BIRTHDATE_DEFAULT = '1900-01-01T00:00:00.000Z';

export const PROVINCES = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora-Chinchipe',
];

export const ZONES = [
  '',
  'Zona 1 - Esmeraldas, Carchi, Imbabura',
  'Zona 2 - Pichincha, Napo, Orellana, Sucumbíos',
  'Zona 3 - Chimborazo, Tungurahua, Cotopaxi',
  'Zona 4 - Bolívar, Azuay, Cañar, Morona Santiago',
  'Zona 5 - Guayas, Santa Elena',
  'Zona 6 - Manabí, Santo Domingo de los Tsáchilas',
  'Zona 7 - El Oro, Loja, Zamora-Chinchipe, Galápagos',
];

export const TYPE_PARISH = ['', 'Urbano', 'Rural'];

export const DISTRICTS = [
  '',
  'Circunscripción Nacional',
  'Circunscripción 1 - Pichincha',
  'Circunscripción 2 - Guayas',
  'Circunscripción 3 - Azuay',
  'Circunscripción 4 - Manabí',
  'Circunscripción 5 - El Oro',
  'Circunscripción 6 - Tungurahua',
  'Circunscripción 7 - Esmeraldas',
  'Circunscripción 8 - Imbabura',
  'Circunscripción 9 - Loja',
  'Circunscripción 10 - Los Ríos',
  'Circunscripción 11 - Santo Domingo de los Tsáchilas',
  'Circunscripción 12 - Sucumbíos',
  'Circunscripción 13 - Napo',
  'Circunscripción 14 - Carchi',
  'Circunscripción 15 - Cotopaxi',
  'Circunscripción 16 - Chimborazo',
  'Circunscripción 17 - Bolívar',
  'Circunscripción 18 - Cañar',
  'Circunscripción 19 - Morona Santiago',
  'Circunscripción 20 - Galápagos',
  'Circunscripción 21 - Zamora-Chinchipe',
];

export const COLORS = [
  'rgba(255, 99, 132)',
  'rgba(54, 162, 235)',
  'rgba(225, 250, 0)',
  'rgba(75, 192, 192)',
  'rgba(255, 159, 64)',
  'rgba(153, 102, 255)',
  'rgba(0, 255, 0)',
  'rgba(250, 0, 229)',
  'rgba(0, 221, 250)',
  'rgba(255, 0, 89)',
];

export const DOUGHNUT_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: 'black',
        size: 24,
      },
    },
    title: {
      display: false,
    },
  },
};

export const LINE_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'black',
        size: 24,
      },
    },
    title: {
      display: false,
    },
  },
};

// const transactions = [
//   {
//     dignity: 'Presidente',
//     candidates: [
//       {
//         name: 'Juan',
//         votes: PROVINCES.map(() => Math.random()),
//       },
//       {
//         name: 'Pablo',
//         votes: PROVINCES.map(() => Math.random()),
//       },
//       {
//         name: 'Maria ',
//         votes: PROVINCES.map(() => Math.random()),
//       },
//     ],
//   },
//   {
//     dignity: 'Alcalde',
//     candidates: [
//       {
//         name: 'Juan',
//         votes: PROVINCES.map(() => Math.random()),
//       },
//       {
//         name: 'Pablo',
//         votes: PROVINCES.map(() => Math.random()),
//       },
//     ],
//   },
// ];

// const transactions_total = [
//   {
//     dignity: 'Presidente',
//     candidates: ['pedro', 'juan', 'camila', 'jorge', 'hugo', 'josefa'],
//     votes: [12, 19, 3, 5, 2, 3],
//   },
//   {
//     dignity: 'Alcalde',
//     candidates: ['alexander', 'juan', 'camila'],
//     votes: [12, 2, 3],
//   },
//   {
//     dignity: 'Gobernador',
//     candidates: ['jorge', 'juan', 'karla'],
//     votes: [12, 2, 3],
//   },
// ];
