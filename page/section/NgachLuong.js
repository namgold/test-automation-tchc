'use strict'
const {By, Key, until, Actions} = require('selenium-webdriver');
const config = require("../../package.json")

let tableHead;
var tableData;
var getTableDataRecursive = async (driver, pageNumber) => {
    await driver.wait(until.elementLocated(By.css('td')), config.maxWaitTime);
    let table = await driver.findElement(By.css('td'));
    await driver.wait(until.elementIsVisible(table), config.maxWaitTime);
    if (pageNumber == 1) {
        tableHead = (await driver.findElements(By.css('th'))).map(async x => (await x).getAttribute("textContent"));
        tableHead = await Promise.all(tableHead)
        tableData = [tableHead]
    }
    let currenttableData = await driver.findElements(By.css('td'))
    currenttableData = currenttableData.map(async x => await x.getAttribute("textContent"));
    currenttableData = await Promise.all(currenttableData)
    for (let i = 0; i < currenttableData.length; i = i + tableHead.length)
        tableData.push(currenttableData.slice(i, i + tableHead.length))
    pageNumber++;
    let totalpageNumber = (await driver.findElements(By.css('.page-item'))).length - 2
    if (pageNumber<=totalpageNumber){
        await q(driver).clickSubMenu(pageNumber.toString());
        await getTableDataRecursive(driver, pageNumber);
    }
    else{
        tableData = tableData.map(x => x.slice(0, -1))
    }
}

var q = driver => {
    return {
        getTableData: async () => {
            tableData = [[]]
            await getTableDataRecursive(driver, 1);
            return tableData;
        },
        clickSubMenu: async function (subMenuName) {
            await driver.wait(until.elementLocated(By.linkText(subMenuName)), config.maxWaitTime);
            let linkText = await driver.findElement(By.linkText(subMenuName))
            await driver.wait(until.elementIsVisible(linkText), config.maxWaitTime);
            await linkText.click();
        },
        clickButton: async function (cssSelector){
            await driver.wait(until.elementLocated(By.css(cssSelector)), config.maxWaitTime);
            let button = await driver.findElement(By.css(cssSelector))
            await driver.wait(until.elementIsVisible(button), config.maxWaitTime);
            await driver.executeScript("document.querySelector('".concat(cssSelector.concat("').scrollIntoView()")))
            await (await driver.findElement(By.css(cssSelector))).click();
        },
        fillAllFields: async function (data,fields){
            await driver.wait(until.elementLocated(By.id(fields[0])), config.maxWaitTime);
            let input = await driver.findElement(By.id(fields[0]));
            await driver.wait(until.elementIsVisible(input), config.maxWaitTime);
            Promise.all(data.map(async (item, index) => {
                await (await driver.findElement(By.id(fields[index]))).sendKeys(item);
            }))
        }
    }
}
module.exports = q;