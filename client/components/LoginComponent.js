import React from 'react';

const LoginComponent = () => (
    <div>
        <h1>Login</h1>
        <form method="GET" action="/auth">
            <table>
                <tbody>
                    <tr>
                        <td>
                            username:
                        </td>
                        <td>
                            <input type="text" name="name"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            password:
                        </td>
                        <td>
                            <input type="password" name="password"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <input type="submit" value=" login"/>
        </form>
    </div>
);

export default LoginComponent;