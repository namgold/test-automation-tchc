const {By, Key, until, Actions} = require('selenium-webdriver');
const config = require("../package.json")

module.exports = driver => {
    return {
        clickMenu: async function (menuName) {
            await driver.wait(until.elementLocated(By.linkText(menuName)), config.maxWaitTime);
            linkText = await driver.findElement(By.linkText(menuName))
            await driver.wait(until.elementIsVisible(linkText), config.maxWaitTime);
            await linkText.click();
        },
        clickSubMenu: async function (subMenuName) {
            await driver.wait(until.elementLocated(By.linkText(subMenuName)), config.maxWaitTime);
            linkText = await driver.findElement(By.linkText(subMenuName))
            await driver.wait(until.elementIsVisible(linkText), config.maxWaitTime);
            await linkText.click();
            await linkText.click();
        },
        section: {
            NgachLuong: require('./section/NgachLuong')(driver)
        }
    }
}