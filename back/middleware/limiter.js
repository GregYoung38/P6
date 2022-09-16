const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Quota de requêtes dépassé pour votre IP !"
});

module.exports = { limiter }

