require("dotenv").config();
var chistes = require("./api/chistes.json");
const paradas = require("./api/paradas.json");
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.TOKEN_API);

const lineasColectivo = [
  [
    {
      text: "227",
      callback_data: "501",
    },
    {
      text: "230",
      callback_data: "501",
    },
    {
      text: "342",
      callback_data: "501",
    },
  ],
  [
    {
      text: "374",
      callback_data: "501",
    },
    {
      text: "375",
      callback_data: "501",
    },
    {
      text: "500",
      callback_data: "501",
    },
  ],
  [
    {
      text: "501",
      callback_data: "501",
    },
    {
      text: "502",
      callback_data: "501",
    },
    {
      text: "503",
      callback_data: "501",
    },
  ],
  [
    {
      text: "504",
      callback_data: "501",
    },
    {
      text: "505",
      callback_data: "501",
    },
    {
      text: "506",
      callback_data: "501",
    },
  ],
  [
    {
      text: "507",
      callback_data: "501",
    },
    {
      text: "510",
      callback_data: "501",
    },
    {
      text: "512",
      callback_data: "501",
    },
  ],

  [
    {
      text: "342 A",
      callback_data: "501",
    },
    {
      text: "342 B",
      callback_data: "501",
    },
    {
      text: "342 C",
      callback_data: "501",
    },
  ],
];

bot.start((ctx) => {
  ctx.reply(
    `¡Hola ${ctx.from.first_name}! 👋 Soy Nico, el chatbot no oficial de San Nicolas de los Arroyos.`
  );
  ctx.replyWithSticker(
    "https://res.cloudinary.com/dgq6qxh4k/image/upload/v1638586589/TelegramBot/a4f89a0e-a2b3-4713-be45-9924cfdca0ee_k3phqv.webp"
  );
  setTimeout(() => {
    ctx.reply(
      `¿Por dónde empezamos? 👇 \n A. Farmacias de turno \n B. Numeros de emergencia 📞 \n C. Horarios de colectivos 🚌 \n D. Contame un chiste 🎉`
    );
  }, 1000);
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
  [
    "C",
    "c",
    "horarios",
    "Horarios",
    "Horarios de colectivo",
    "Horarios cole",
  ],
  (ctx) => {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Estas son las lineas de colectivos disponibles",
      {
        reply_markup: {
          inline_keyboard: lineasColectivo,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  }
);

bot.hears(
  ["D", "d", "chiste", "Chiste", "contame un chiste"],
  (ctx) => {
    const chisteAleatorio =
      chistes.data[
        Math.floor(Math.random() * chistes.data.length)
      ];
    ctx.reply(chisteAleatorio.msj);
    setTimeout(() => {
      ctx.reply(chisteAleatorio.response);
    }, 1000);
    ctx.replyWithSticker(
      "https://res.cloudinary.com/dgq6qxh4k/image/upload/v1638586844/TelegramBot/fe4d2934-e495-435b-a7c1-517a3bbd469b_tkivvh.webp"
    );
  }
);

bot.action(["501"], (ctx) => {
  ctx.reply("Estos son los horarios de la linea 501");
  ctx.telegram
    .sendDocument(ctx.from.id, {
      source: "./assets/501.pdf",
      filename: "Horarios501.pdf",
    })
    .catch(function (error) {
      console.log(error);
      ctx.reply("Lo siento no encontre los horarios");
    });
});

bot.launch();
