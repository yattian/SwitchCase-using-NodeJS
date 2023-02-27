const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

//const stripePublicKey = process.env.STRIPE_PUBLIC_KEY_TEST;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);

const express = require("express");
//const morgan = require("morgan");
//const connectDB = require("./config/db");

//connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

const fs = require("fs");
/*if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}*/

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/index", function (req, res) {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("index.ejs", {
        //stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

const storeItems = new Map();

for (i = 1; i < 33; i++) {
  storeItems.set(i, { price: 1000, name: "Custom Cover " + i });
}

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["NZ"] },
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "nzd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.price,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/paymentSuccess.html`,
      cancel_url: `${process.env.SERVER_URL}/index`,
      consent_collection: {
        terms_of_service: "required",
      },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/index", (req, res) => {
  console.log("Posted");
  let token = req.body.token;
  console.log(token);
  const { OAuth2Client } = require("google-auth-library");
  const client = new OAuth2Client(
    "767876851068-v7aj2bm5pgucp1a2sjca10tevv59uco9.apps.googleusercontent.com"
  );
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.load(payload);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify().catch(console.error);
});

app.listen(PORT, () => {
  console.log(
    `Server app running on ${process.env.NODE_ENV} mode listening on port ${PORT}`
  );
});
