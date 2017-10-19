export const MAIN_PAGE = 'http://localhost:3000'

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
    usernameInput: 'form[action="/signup"] input[name="name"]',
    submitButton: 'form[action="/signup"] input[type="submit"]'
  }
}
