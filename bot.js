require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN_API);

bot.start((ctx) => {
  ctx.reply(
    `¡Hola ${ctx.from.first_name}! 👋 Soy Nico, el chatbot de San Nicolas de los Arroyos.`
  );
  ctx.reply(
    `¿Por dónde empezamos? 👇 \n A. Farmacias de turno \n B. Numeros importantes 📞`
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

bot.launch();
