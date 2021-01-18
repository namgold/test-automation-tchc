const {Builder, By, Key, until, Actions} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require("../package.json")
var driver;
jest.setTimeout(300000);

beforeEach(() => {
    var chromeOption = new chrome.Options()
                        // .headless()
                        // .addArguments('--auto-open-devtools-for-tabs')
    driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOption).build();
    expect.anything(driver)
    driver.get('http://localhost:8002/user');
})

afterEach(async () => {
    driver.quit();
    driver = null
})

test('Test Ngach Page', async () => {
    const UserPage = require('../page/User')(driver)
    await UserPage.clickMenu("Danh mục");
    await UserPage.clickSubMenu("Ngạch lương");

    var NgachLuongSection = UserPage.section.NgachLuong;

    // get last row before add
    const tableDataBeforeAdd = await NgachLuongSection.getTableData();
    console.log('tableDataBeforeAdd:', ...tableDataBeforeAdd);
    lastRowBeforeAdd = tableDataBeforeAdd[tableDataBeforeAdd.length-1]
    // console.log("lastRowBeforeAdd", lastRowBeforeAdd)

    // click on add button
    NgachLuongSection.clickButton('.btn-primary.btn-circle')

    // fill all fields
    data = tableDataBeforeAdd[0].slice(1, tableDataBeforeAdd[0].length);
    fields = ["inputMA_NGACH", "inputMASO_CDNN", "inputHESO_LUONG", "inputBAC_LG"]
    NgachLuongSection.fillAllFields(data, fields)

    // click luu
    NgachLuongSection.clickButton('.btn-primary[type=submit]')

    // check alert type after add
    await driver.wait(until.elementLocated(By.css('.alert')), config.maxWaitTime);
    alert = await driver.findElement(By.css('.alert'))
    await driver.wait(until.elementIsVisible(alert), config.maxWaitTime);

    // get last row after add
    NgachLuongSection.clickSubMenu("1")
    const tableDataAfterAdd = await NgachLuongSection.getTableData();
    // console.log("tableDataAfterAdd", tableDataAfterAdd)
    lastRowAfterAdd = tableDataAfterAdd[tableDataAfterAdd.length-1]
    // console.log("lastRowAfterAdd", lastRowAfterAdd)

    // valid data after add
    if (JSON.stringify(lastRowBeforeAdd)==JSON.stringify(lastRowAfterAdd))
        console.error("Dữ liệu chưa được add!")
    if (parseInt(lastRowBeforeAdd[0])!=(parseInt(lastRowAfterAdd[0])-1))
        console.error("ID tự sinh cho dữ liệu chưa đúng!")
    if (JSON.stringify(data)!=JSON.stringify(lastRowAfterAdd.slice(1,lastRowAfterAdd.length)))
        console.error("Dữ liệu add vào chưa đúng!")
    // click update
    // await driver.executeScript('document.querySelector("tr:last-child .btn-primary").scrollIntoView()')
    // await (await driver.findElement(By.css('tr:last-child .btn-primary'))).click();
    // check all input of fields
    // x = lastRowAfterAdd[1] == await (await driver.findElement(By.id('inputMA_NGACH'))).getText();
    // y = lastRowAfterAdd[2] == await (await driver.findElement(By.id('inputMASO_CDNN'))).getText();
    // z = lastRowAfterAdd[3] == await (await driver.findElement(By.id('inputTEN_NGACH_CDNN'))).getText();
    // t = lastRowAfterAdd[4] == await (await driver.findElement(By.id('inputNHOM_NGACH'))).getText();
    // if (!(x&&y&&z&&t))
    //     console.error("input hiển thị tại form update khác với dữ liệu bảng")

    // click delete
    NgachLuongSection.clickButton('tr:last-child .btn-danger')
    // click OK
    NgachLuongSection.clickButton('.swal-button--danger')
    // check alert type after delete
    await driver.wait(until.elementLocated(By.css('.alert')), config.maxWaitTime);
    alert = await driver.findElement(By.css('.alert'))
    await driver.wait(until.elementIsVisible(alert), config.maxWaitTime);

    // get last row after delete
    NgachLuongSection.clickSubMenu("1")
    const tableDataAfterDelete = await NgachLuongSection.getTableData();
    // console.log("tableDataAfterDelete", tableDataAfterDelete)
    lastRowAfterDelete = tableDataAfterDelete[tableDataAfterDelete.length-1]
    // console.log("lastRowAfterDelete", lastRowAfterDelete)

    // valid data after delete
    if (JSON.stringify(lastRowAfterDelete)==JSON.stringify(lastRowAfterAdd))
        console.error("Dữ liệu chưa được delete!")
    if (JSON.stringify(lastRowBeforeAdd)!=JSON.stringify(lastRowAfterDelete))
        console.error("Các dữ liệu delete chưa đúng!")
});