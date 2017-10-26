import { Selector } from 'testcafe'
import { menuItems, loginPage, errorPage } from './page-model'

fixture`User`
  .before(async () => {
    // wait start reSolve server
    await new Promise(resolve => setTimeout(resolve, 10000))
  })
  .beforeEach(async (t /*: TestController */) => {
    await t.setNativeDialogHandler(() => true)
    await t.navigateTo(loginPage.path)
  })

test('create', async (t /*: TestController */) => {
  await t.expect(await Selector(menuItems.login).textContent).eql('login')

  const form = loginPage.createAccountForm
  await t.typeText(form.usernameInput, '123')
  await t.click(form.submitButton)

  await t.expect(await Selector(menuItems.username).textContent).eql('123')
  await t.expect(await Selector(menuItems.logout).textContent).eql('logout')
})

test('login', async (t /*: TestController */) => {
  await loginPage.login(t)
})

test('create: is already exists', async (t /*: TestController */) => {
  await t.expect(await Selector(menuItems.login).textContent).eql('login')

  const form = loginPage.createAccountForm
  await t.typeText(form.usernameInput, '123')
  await t.click(form.submitButton)

  await t.expect(await Selector(menuItems.login).textContent).eql('login')

  await t
    .expect(await Selector(errorPage.content).textContent)
    .contains('Error')
  await t
    .expect(await Selector(errorPage.content).textContent)
    .contains('User already exists')
})
