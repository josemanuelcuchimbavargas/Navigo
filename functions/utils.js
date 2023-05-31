function getDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let day = ("0" + now.getDate()).slice(-2);
    const date = [year, month, day].join("-");
    return date;
};

module.exports = {
    getDate: getDate
}