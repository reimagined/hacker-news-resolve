// @flow
import { Selector } from 'testcafe'
import { loginPage, submitPage, storyDetailsPage } from './page-model'

fixture`Story`.beforeEach(async (t /*: TestController */) => {
  await t.setNativeDialogHandler(() => true)
  await t.navigateTo(loginPage.path)
  await loginPage.login(t)
})

test('create', async (t /*: TestController */) => {
  await t.navigateTo(submitPage.path)

  const form = submitPage.form
  await t.typeText(form.titleInput, 'my ask')
  await t.typeText(form.textInput, 'my text')
  await t.click(form.submitButton)

  await t
    .expect(await Selector(storyDetailsPage.title).textContent)
    .contains('my ask')
  await t
    .expect(await Selector(storyDetailsPage.text).textContent)
    .contains('my text')
  await t
    .expect(await Selector(storyDetailsPage.by).textContent)
    .contains('123')
  await t
    .expect(await Selector(storyDetailsPage.points).textContent)
    .contains('0 points')
})
