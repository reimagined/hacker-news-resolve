// @flow
import { Selector } from 'testcafe'
import {
  MAIN_PAGE,
  menuItems,
  loginPage as page,
  errorPage
} from './page-model'
import { dropStore } from '../import/eventStore'

fixture`User`
  .before(async () => {
    dropStore()
  })
  .beforeEach(async (t /*: TestController */) => {
    await t.setNativeDialogHandler(() => true)
    await t.navigateTo(MAIN_PAGE)
  })

test('create account', async (t /*: TestController */) => {
  await t.navigateTo(page.path)

  await t.expect(await Selector(menuItems.login).textContent).eql('login')

  const form = page.createAccountForm
  await t.typeText(form.usernameInput, '123')
  await t.click(form.submitButton)

  await t.expect(await Selector(menuItems.username).textContent).eql('123')
  await t.expect(await Selector(menuItems.logout).textContent).eql('logout')

  // User already exists
  await t.click(menuItems.logout)
  await t.expect(await Selector(menuItems.login).textContent).eql('login')

  await t.navigateTo(page.path)

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
