import { Selector } from 'testcafe'

const HOST = process.env.HOST || 'localhost'
export const MAIN_PAGE = `http://${HOST}:3000`

export const menuItems = {
  username: '#root div div div div div a:nth-child(1)',
  login: '#root div div div div a:nth-child(1)',
  logout: '#root div div div div div a:nth-child(3)'
}

export const errorPage = {
  path: `${MAIN_PAGE}/error`,
  content: '#root div div div:nth-child(2) div'
}

export const loginPage = {
  path: `${MAIN_PAGE}/login`,
  selector: 'form[action="/login"]',
  loginForm: {
    usernameInput: 'form[action="/login"] input[name="name"]',
    submitButton: 'form[action="/login"] input[type="submit"]'
  },
  createAccountForm: {
    usernameInput: 'form[action="/register"] input[name="name"]',
    submitButton: 'form[action="/register"] input[type="submit"]'
  },
  login: async (t /*: TestController */) => {
    await t.expect(await Selector(menuItems.login).textContent).eql('login')

    const form = loginPage.loginForm
    await t.typeText(form.usernameInput, '123')
    await t.click(form.submitButton)

    await t.expect(await Selector(menuItems.username).textContent).eql('123')
    await t.expect(await Selector(menuItems.logout).textContent).eql('logout')
  }
}

export const newestPage = {
  path: `${MAIN_PAGE}/newest`,
  getStoryDetailsLink: (index /*: number = 0*/) =>
    `#root div div div:nth-child(2) div ol li:nth-child(${index +
      1}) div div:nth-child(1) div:nth-child(2) a`,
  getStoryDetailsDiscussLink: (index /*: number = 0*/) =>
    `#root div div div:nth-child(2) div ol li:nth-child(${index +
      1}) div div:nth-child(2) span:nth-child(4) a`
}

export const submitPage = {
  path: `${MAIN_PAGE}/submit`,
  form: {
    titleInput:
      '#root div div div:nth-child(2) div div:nth-child(2) input[type="text"]',
    urlInput:
      '#root div div div:nth-child(2) div div:nth-child(5) input[type="text"]',
    textInput: '#root div div div:nth-child(2) div div:nth-child(11) textarea',
    submitButton: '#root div div div:nth-child(2) div button'
  }
}

export const storyDetailsPage = {
  title:
    '#root div div div:nth-child(2) div div:nth-child(1) div:nth-child(1) div:nth-child(2) a',
  points:
    '#root div div div:nth-child(2) div div:nth-child(1) div:nth-child(2) span:nth-child(1)',
  by:
    '#root div div div:nth-child(2) div div:nth-child(1) div:nth-child(2) span:nth-child(2) a',
  text: '#root div div div:nth-child(2) div div:nth-child(1) div:nth-child(3)',
  form: {
    textarea: '#root div div div:nth-child(2) div div:nth-child(2) textarea',
    submitButton:
      '#root div div div:nth-child(2) div div:nth-child(2) div button'
  },
  getCommentContent: (rootLevelIndex /*: number*/) =>
    `#root div div div:nth-child(2) div div:nth-child(3) div:nth-child(${rootLevelIndex +
      1}) div:nth-child(2)`,
  getReplyLink: (rootLevelIndex /*: number*/) =>
    `#root div div div:nth-child(2) div div:nth-child(3) div:nth-child(${rootLevelIndex +
      1}) div a:nth-child(5)`
}

export const commentPage = {
  text: '#root div div div:nth-child(2) div div:nth-child(2)',
  form: {
    textarea: '#root div div div:nth-child(2) div div:nth-child(3) textarea',
    submitButton:
      '#root div div div:nth-child(2) div div:nth-child(3) div button'
  },
  getReplyContent: (rootLevelIndex /*: number*/) =>
    `#root div div div:nth-child(2) div div:nth-child(4) div:nth-child(${rootLevelIndex +
      1}) div:nth-child(2)`
}
