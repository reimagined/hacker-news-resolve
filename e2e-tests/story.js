// @flow
import { Selector } from 'testcafe'
import {
  loginPage,
  submitPage,
  newestPage,
  storyDetailsPage,
  commentPage
} from './page-model'

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

test('add comment', async (t /*: TestController */) => {
  await t.navigateTo(newestPage.path)
  await t
    .expect(await Selector(newestPage.getStoryDetailsLink(0)).textContent)
    .contains('my ask')
  await t.click(newestPage.getStoryDetailsDiscussLink(0))

  await t.typeText(storyDetailsPage.form.textarea, 'first comment')
  await t.click(storyDetailsPage.form.submitButton)

  await t
    .expect(await Selector(storyDetailsPage.getCommentContent(0)).textContent)
    .contains('first comment')
  // TODO: check comments page and parent link
})

test('add reply', async (t /*: TestController */) => {
  await t.navigateTo(newestPage.path)
  await t
    .expect(await Selector(newestPage.getStoryDetailsLink(0)).textContent)
    .contains('my ask')
  await t.click(newestPage.getStoryDetailsDiscussLink(0))

  await t
    .expect(await Selector(storyDetailsPage.getCommentContent(0)).textContent)
    .contains('first comment')
  await t.click(storyDetailsPage.getReplyLink(0))

  await t
    .expect(await Selector(commentPage.text).textContent)
    .contains('first comment')

  await t.typeText(commentPage.form.textarea, 'first reply')
  await t.click(commentPage.form.submitButton)

  await t
    .expect(await Selector(commentPage.getReplyContent(0)).textContent)
    .contains('first reply')

  // TODO: check comments page and parent link
  await t.wait(10000)
})
