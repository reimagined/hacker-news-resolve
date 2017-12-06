import React from 'react'
import { gqlConnector } from 'resolve-redux'

export const UserNameLoader = gqlConnector(
  `
    query($id: ID!) {
      user(id: $id) {
        name
      }
    }
  `,
  {
    options: ({ id }) => ({
      variables: {
        id
      }
    })
  }
)(({ data: { user } }) => {
  return <span>{(user && user.name) || null}</span>
})

export class UserNameById extends React.PureComponent {
  state = {}

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onScroll)
    this.onScroll()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
    clearTimeout(this.timer)
  }

  onScroll = () => {
    clearTimeout(this.timer)
    this.timer = setTimeout(this.checkVisibleAndOptionalLoadUserName, 100)
  }

  checkVisibleAndOptionalLoadUserName = () => {
    if (this.isVisible()) {
      this.setState({ showUserName: true })
    }
  }

  isVisible = () => {
    let element = this.username

    let top = element.offsetTop
    let height = element.offsetHeight

    while (element.offsetParent) {
      element = element.offsetParent
      top += element.offsetTop
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    return top < scrollTop + window.innerHeight && top + height > scrollTop
  }

  render() {
    return (
      <span ref={element => (this.username = element)}>
        {this.state.showUserName ? <UserNameLoader id={this.props.id} /> : null}
      </span>
    )
  }
}

export default UserNameById
