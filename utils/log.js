const infor = (...T) => {
    console.log("\x1b[32m", new Date().toISOString() + ":", ...T);
};

const error = (...T) => {
    console.log("\x1b[31m", new Date().toISOString() + ":", ...T);
};

const warning = (...T) => {
    console.log("\x1b[33m", new Date().toISOString() + ":", ...T);
};
module.exports = { infor, error, warning };