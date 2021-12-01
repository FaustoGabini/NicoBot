require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.TOKEN_API);

bot.start((ctx) => {
  ctx.reply(
    `¡Hola ${ctx.from.first_name}! 👋 Soy Nico, el chatbot no oficial de San Nicolas de los Arroyos.`
  );
  ctx.reply(
    `¿Por dónde empezamos? 👇 \n A. Farmacias de turno \n B. Numeros de emergencia 📞 \n C. Paradas de colectivos 🚌 \n D. Contame un chiste 🎉`
  );
});

bot.hears(
  [
    "B",
    "b",
    "emergencias",
    "emergencia",
    "numeros",
    "numeros de emergencia",
    "numero de emergencia",
  ],
  (ctx) => {
    ctx.reply(
      "Números de Emergencias 👇 \n 🔹 Bomberos: 100 \n 🔹 Prefectura: 106 \n 🔹 Same: 107 \n 🔹 Violencia de genero: 144 \n 🔹 Atencion ciudada: 147 \n 🔹 Seguridad: 911"
    );
  }
);

async function fetchPharmacies() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  let day = today.getDate();
  const hour = today.getHours();
  let res = "";
  if (hour <= 8) {
    day -= 1;
    res = await axios.get(
      `https://www.laguiasn.com.ar/api/pharmacies/${year}/${month}/${day}`
    );
  } else {
    res = await axios.get(
      `https://www.laguiasn.com.ar/api/pharmacies/${year}/${month}/${day}`
    );
  }

  return res.data;
}

bot.hears(
  [
    "a",
    "A",
    "Farmacias",
    "farmacias",
    "Farmacias de turno",
    "farmacias de turno",
    "turnos",
    "turnos de farmacias",
  ],
  async (ctx) => {
    const data = await fetchPharmacies();
    const activeText = "Ver en Google Maps";
    let cadena = "";
    data.pharmacies.forEach((farmacia) => {
      cadena += `▪️ ${farmacia.name}(${farmacia.address})\n [Ver en Google Maps](https://www.google.com.ar/maps/place/${farmacia.address},+San+Nicol%C3%A1s+de+Los+Arroyos,+Provincia+de+Buenos+Aires)\n\n`;
    });
    ctx.reply(
      `Farmacias de turno ${data.query}: ${data.dateShift} \n\n ${cadena}\n  `,
      { parse_mode: "Markdown" }
    );
  }
);

bot.hears(
  ["C", "c", "paradas", "Paradas", "Paradas de colectivo"],
  (ctx) => {
    ctx.reply("🚧 El comando está en desarrollo 🏗️");
  }
);

bot.hears(
  ["D", "d", "chiste", "Chiste", "contame un chiste"],
  (ctx) => {
    ctx.reply("🚧 El comando está en desarrollo 🏗️");
  }
);

bot.launch();
